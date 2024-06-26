import { civitaiEndpoint } from "./config";
import { pruneModelVersion, type Model, type ModelVersion } from "./types";
import { createHash } from "sha256-uint8array";
import { err } from "./util";

export function getHash(
  model: Model,
  onProgress?: (bytes: number) => void
): Promise<string> {
  if (model.hash) return Promise.resolve(model.hash); // cached hash
  const twoGigabytes = 2 * 1024 * 1024 * 1024;
  if (model.size > twoGigabytes) return getStreamedHash(model, onProgress);
  else return getSmallHash(model);
}

// Only works for files under 2GB (https://issues.chromium.org/issues/40055619)
function getSmallHash(model: Model): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      if (!model.localFile) return reject(err("model.localFile is undefined"));
      const buffer = await model.localFile.arrayBuffer();
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
    if (!model.localFile) return reject(err("model.localFile is undefined"));
    let stream: ReadableStream | null = model.localFile.stream();
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
