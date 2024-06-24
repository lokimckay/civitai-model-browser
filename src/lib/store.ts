import { persistentAtom } from "@nanostores/persistent";
import type { ModelVersion } from "./types";

export type Model = {
  id: string;
  name: string;
  hash?: string;
  hashing?: boolean;
  info?: ModelVersion;
  fetching?: boolean;
  image?: string;
};

export const $models = persistentAtom<Model[]>("models", [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

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
