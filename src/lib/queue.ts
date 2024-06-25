import { setMany, clear, entries, del } from "idb-keyval";
import type { ModelVersion } from "./types";
import { civitaiEndpoint } from "./config";
import { $models, $progress, updateModel } from "./store";
import { getHash } from "./fs";
import { err } from "./util";

export async function overwrite(models: [string, FileSystemFileHandle][]) {
  await clear();
  return setMany(models);
}

export async function processQueue() {
  const ents: [IDBValidKey, FileSystemFileHandle][] = await entries();
  $progress.setKey("remaining", ents.length);
  const sorted = ents.sort(([_aId, a], [_bId, b]) => {
    if (!a?.name || !b?.name) return 0;
    return a.name.localeCompare(b.name);
  });

  for (const [_id, handle] of sorted) {
    console.log("Processing", handle.name);
    const id = _id.toString();
    $progress.setKey("current", id);

    updateModel({ id, hashing: true, fetching: false });
    const hash = await getHash(handle)
      .then((hash) => {
        updateModel({ id, hash, hashing: false });
        return hash;
      })
      .catch((error) => {
        updateModel({ id, hashing: false, error });
      });

    if (!hash) continue;

    updateModel({ id, fetching: true });
    await getInfo(hash)
      .then((info) => {
        updateModel({ id, info, fetching: false });
      })
      .catch((error) => {
        updateModel({ id, fetching: false, error });
      });

    del(_id);
    $progress.setKey("remaining", $progress.get().remaining - 1);
  }
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
