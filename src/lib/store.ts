import { persistentAtom, persistentMap } from "@nanostores/persistent";
import type { Model, ModelVersion, Progress } from "./types";
import { computed } from "nanostores";

const encDec = {
  encode: JSON.stringify,
  decode: JSON.parse,
};

export const $models = persistentAtom<Model[]>("models", [], encDec);
export const $sortedModels = computed($models, (models) =>
  models.sort((a, b) => a.name.localeCompare(b.name))
);

export const $progress = persistentMap<Progress>(
  "progress",
  { remaining: 0, current: null },
  encDec
);

export function updateModel(model: Partial<Model>) {
  const models = $models.get();
  const newModels = [...models];
  const foundModel = models.find((m) => m.id === model.id);
  const index = models.findIndex((m) => m.id === model.id);
  if (!foundModel) return console.error(`Model ${model.id} not found`);
  else {
    const merged = Object.assign({}, foundModel, model);
    const modelId = merged.info?.modelId;
    if (modelId && merged.info)
      merged.info.browseUrl = `https://civitai.com/models/${modelId}?modelVerionsId=${merged.info.id}`;

    newModels[index] = merged;
  }

  $models.set(newModels);
}
