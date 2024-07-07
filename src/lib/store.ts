import { persistentAtom, persistentMap } from "@nanostores/persistent";
import type { Model, Progress } from "./types";
import { fuseConfig } from "@/lib/config";
import { computed } from "nanostores";
import Fuse from "fuse.js";

const encDec = {
  encode: JSON.stringify,
  decode: JSON.parse,
};

export const DEFAULT_LAYOUT = "grid";
export const DEFAULT_SETTINGS: Settings = {
  layout: DEFAULT_LAYOUT,
  giWidth: 10,
  giHeight: 15,
  hideMissing: true,
  hideMissingWhileSearching: false,
};
export const layouts = ["list", "grid"] as const;
export type Layout = (typeof layouts)[number];
export type Settings = {
  layout?: Layout;
  giWidth?: number;
  giHeight?: number;
  hideMissing?: boolean;
  hideMissingWhileSearching?: boolean;
};

const FILTERS = ["SD 1.5", "SDXL 1.0", "Pony", "Other"] as const;
export function setAllFilters(newState: boolean) {
  $filters.set(
    FILTERS.reduce((acc, filter) => ({ ...acc, [filter]: newState }), {})
  );
}
export const $filters = persistentMap<Record<string, boolean>>(
  "filters: ",
  FILTERS.reduce((acc, filter) => ({ ...acc, [filter]: true }), {}),
  encDec
);

export const $settings = persistentMap<Settings>(
  "settings: ",
  DEFAULT_SETTINGS,
  encDec
);

export const $search = persistentAtom<string>("search: ", "");
export const $models = persistentMap<Record<string, Model>>(
  "models: ",
  {},
  encDec
);
export const $hashes = persistentMap<Record<string, string>>("hashes: ", {});
export const $progress = persistentMap<Progress>(
  "progress: ",
  { remaining: 0, current: null },
  encDec
);
export const $sortedModels = computed($models, (models) =>
  Object.values(models).sort((a, b) => a.name.localeCompare(b.name))
);
export const $searchResults = computed($search, (search) => {
  const models = Object.values($models.get());
  const fuse = new Fuse(models, fuseConfig);
  return fuse.search(search);
});

export function cacheHash(filename: string, hash: string) {
  const hashes = $hashes.get();
  hashes[filename] = hash;
  $hashes.set(hashes);
}

export function updateModel(model: Partial<Model>) {
  if (!model.id) return console.error("Model id is required to updateModel");
  const foundModel = $models.get()[model.id];
  if (!foundModel) return console.error(`Model ${model.id} not found`);
  const merged = Object.assign({}, foundModel, model);
  const modelId = merged.info?.modelId;
  if (modelId && merged.info)
    merged.info.browseUrl = `https://civitai.com/models/${modelId}?modelVerionsId=${merged.info.id}`;
  $models.setKey(model.id, merged);
}

export function resetSettings() {
  $settings.set(DEFAULT_SETTINGS);
}
