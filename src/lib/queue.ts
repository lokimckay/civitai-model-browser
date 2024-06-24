import { setMany, clear, entries } from "idb-keyval";
import type { ModelVersion } from "./types";
import { civitaiEndpoint } from "./config";
import { updateModel } from "./store";
import { getHash } from "./fs";

export async function overwrite(models: [string, FileSystemHandle][]) {
  await clear();
  return setMany(models);
}

export async function processQueue() {
  const ents = await entries();

  for (const [_id, handle] of ents) {
    const id = _id.toString();
    updateModel({ id, hashing: true });
    const hash = await getHash(handle);
    updateModel({ id, hash, hashing: false });

    updateModel({ id, fetching: true });
    const info = await getInfo(hash);
    updateModel({ id, info, fetching: false });
  }
}

export async function getInfo(hash: string): Promise<ModelVersion> {
  const response = await fetch(`${civitaiEndpoint}/${hash}`);
  return response.json();
}
