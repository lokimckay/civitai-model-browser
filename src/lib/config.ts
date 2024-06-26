export const favicon = "🔎";
export const modelExtensions = [
  "safetensors",
  "ckpt",
  "onnx",
  "pth",
  "pt",
  "gguf",
];
export const civitaiEndpoint =
  "https://civitai.com/api/v1/model-versions/by-hash";

export const fuseConfig = {
  keys: [
    "name",
    "hash",
    "path",
    "info.air",
    "info.baseModel",
    "info.description",
    "info.id",
    "info.modelId",
    "info.name",
    "info.trainedWords",
  ],
  includeMatches: true,
  threshold: 0.4,
};
