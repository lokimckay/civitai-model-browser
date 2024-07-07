export const favicon = "🔎";
export const modelExtensions = [
  "safetensors",
  "ckpt",
  "onnx",
  "pth",
  "pt",
  "gguf",
];
export const civitaiByHashEndpoint =
  "https://civitai.com/api/v1/model-versions/by-hash";

export const civitaiByModelIdEndpoint = "https://civitai.com/api/v1/models";

export const fuseConfig = {
  keys: [
    "name",
    "hash",
    "path",
    "info.air",
    "info.model.name",
    "info.baseModel",
    "info.description",
    "info.id",
    "info.modelId",
    "info.name",
    "info.trainedWords",
    "info.model.type",
    "baseModelInfo.creator.username",
  ],
  includeMatches: true,
  threshold: 0.4,
};
