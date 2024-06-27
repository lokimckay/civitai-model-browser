import { civitaiEndpoint } from "./config";
import type {
  Image,
  Model,
  ModelArtifact,
  ModelVersion,
  SafeTensorMetadata,
} from "./types";
import { createHash } from "sha256-uint8array";
import { err } from "./util";

export function getHash(
  model: Model,
  onProgress?: (bytes: number) => void
): Promise<string> {
  if (!model.localFile)
    return Promise.reject(err("model.localFile is undefined"));
  if (model.hash) return Promise.resolve(model.hash); // cached hash
  const twoGB = 2 * 1024 * 1024 * 1024;
  if (model.size > twoGB) return getStreamedHash(model, onProgress);
  else return getSmallHash(model);
}

function getMetadataHeader(model: Model): Promise<SafeTensorMetadata> {
  const tenMB = 10 * 1024 * 1024;
  return new Promise(async (resolve, reject) => {
    const slice = model.localFile!.slice(0, tenMB);
    const dataView = new DataView(await slice.arrayBuffer());
    const metadataLength = dataView.getUint32(0, true);
    const metadata = new Uint8Array(
      await slice.slice(8, 8 + metadataLength).arrayBuffer()
    );
    const decoder = new TextDecoder();
    const metadataStr = decoder.decode(metadata);
    const metadataJson = JSON.parse(metadataStr);
    resolve(metadataJson);
  });
}

// Only works for files under 2GB (https://issues.chromium.org/issues/40055619)
function getSmallHash(model: Model): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const buffer = await model.localFile!.arrayBuffer();
      const hash = await crypto.subtle.digest("SHA-256", buffer);
      const asStr = Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      resolve(asStr);
    } catch (error: any) {
      reject(err("Failed to hash file", error));
    }
  });
}

function getStreamedHash(
  model: Model,
  onProgress?: (bytes: number) => void
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    let stream: ReadableStream | null = model.localFile!.stream();
    let reader: ReadableStreamDefaultReader | null = stream.getReader();
    const hash = createHash();
    let bytes = 0;

    const process = async () => {
      if (!reader) return;
      const { done, value } = await reader.read();
      if (done) {
        reader.releaseLock();
        reader = null;
        stream = null;
        resolve(hash.digest("hex"));
        return;
      }

      hash.update(value);
      bytes += value.byteLength;
      if (typeof onProgress === "function") onProgress(bytes);
      process();
    };

    process().catch((error) => {
      reader?.cancel();
      reject(err("Failed to hash file", error));
    });
  });
}

export async function tryMetadataHash(
  model: Model
): Promise<{ hash: string; info: ModelVersion } | null> {
  if (model.extension !== "safetensors") return null;
  const hash = model.hash
    ? model.hash
    : (await getMetadataHeader(model))?.__metadata__.sshs_model_hash?.slice(
        0,
        12
      );
  const info = await getInfo(hash);
  return info ? { hash, info } : null;
}

export function getInfo(hash: string): Promise<ModelVersion> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${civitaiEndpoint}/${hash}`);
      if (!response.ok)
        reject({
          message:
            response.status === 404
              ? "Not found on Civitai"
              : "Failed to retrieve info from Civitai",
          error: response.statusText,
        });
      const json = await response.json();
      const pruned = pruneModelVersion(json);
      resolve(pruned);
    } catch (error) {
      reject(err("Failed to retrieve info from Civitai", error));
    }
  });
}

export async function toArray<T>(iter: AsyncGenerator<T>): Promise<T[]> {
  const arr = [];
  for await (const i of iter) arr.push(i);
  return arr;
}

export function pruneModelVersion(rawModelVersion: any): ModelVersion {
  const rmv = rawModelVersion;
  const {
    id,
    air,
    name,
    description,
    modelId,
    downloadUrl,
    browseUrl,
    baseModel,
    trainedWords,
    files,
    images,
  } = rmv;

  return {
    id,
    air,
    name,
    description,
    modelId,
    downloadUrl,
    browseUrl,
    baseModel,
    trainedWords,
    model: {
      name: rmv.model.name,
      type: rmv.model.type,
      nsfw: rmv.model.nsfw,
    },
    files: files.map(
      ({
        id,
        primary,
        downloadUrl,
        sizeKB,
        name,
        type,
        hashes,
      }: any): ModelArtifact => ({
        id,
        primary,
        downloadUrl,
        sizeKB,
        name,
        type,
        hashes: {
          SHA256: hashes.SHA256,
          AUTOV3: hashes.AUTOV3,
        },
      })
    ),
    images: images.map(
      ({ url, width, height, nsfwLevel }: any): Image => ({
        url,
        width,
        height,
        nsfwLevel,
      })
    ),
  };
}
