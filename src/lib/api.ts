import { civitaiEndpoint } from "./config";
import type { Model, ModelVersion } from "./types";
import { err } from "./util";
import { createHash } from "sha256-uint8array";

export function getHash(
  model: Model,
  onProgress?: (bytes: number) => void
): Promise<string> {
  const twoGigabytes = 2 * 1024 * 1024 * 1024;
  if (model.size > twoGigabytes) return getStreamedHash(model, onProgress);
  else return getSmallHash(model);
}

// Only works for files under 2GB (https://issues.chromium.org/issues/40055619)
function getSmallHash(model: Model): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
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

// Chunked slices but not streamed (just as slow as stream I think)
function getLargeHash(
  model: Model,
  onProgress?: (bytes: number) => void
): Promise<string> {
  const oneFiveGig = 1.5 * 1024 * 1024 * 1024;
  return new Promise(async (resolve, reject) => {
    let cursor = 0;
    const size = model.localFile.size;
    const hash = createHash();
    while (cursor < size) {
      const blob = model.localFile.slice(cursor, cursor + oneFiveGig);
      const buffer = await blob.arrayBuffer();
      hash.update(new Uint8Array(buffer));
      cursor += oneFiveGig;
      if (typeof onProgress === "function") onProgress(cursor);
    }

    resolve(hash.digest("hex"));
  });
}

// Slower? don't think so
function getStreamedHash(
  model: Model,
  onProgress?: (bytes: number) => void
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const stream = model.localFile.stream();
    const reader = stream.getReader();
    const hash = createHash();
    let bytes = 0;

    const process = async () => {
      const { done, value } = await reader.read();
      if (done) {
        reader.releaseLock();
        resolve(hash.digest("hex"));
        return;
      }

      hash.update(value);
      bytes += value.byteLength;
      if (typeof onProgress === "function") onProgress(bytes);
      process();
    };

    process().catch((error) => {
      reader.cancel();
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
      resolve(response.json());
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
