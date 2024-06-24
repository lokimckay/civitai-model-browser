// Opinionated subset of https://github.com/civitai/civitai/wiki/REST-API-Reference#response-fields-4

export type ModelVersion = {
  id: number;
  air: string;
  modelId: number;
  name: string;
  description: string;
  downloadUrl: string;
  browseUrl: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  status: string;
  trainedWords: string[];
  baseModel: number;
  stats: Stats;
  model: Model;
  files: File[];
  images: Image[];
};

type Stats = {
  downloadCount: number;
  ratingCount: number;
  rating: number;
  thumbsUpCount: number;
};

type Model = {
  name: string;
  type: string;
  nsfw: boolean; // not safe for work
  poi: boolean; // person of interest
  mode: string;
};

type File = {
  id: number;
  primary: boolean;
  downloadUrl: string;
  sizeKB: number;
  name: string;
  type: string;
  pickleScanResult: ScanResult;
  pickleScanMessage: string;
  virusScanResult: ScanResult;
  virusScanMessage: string;
  scannedAt: string;
  metadata: { format: "SafeTensor" | "PickleTensor" | "Other" };
  hashes: { SHA256: string };
};

type Image = {
  url: string;
  width: number;
  height: number;
  hash: string;
  nsfwLevel: number;
  meta: ImageMeta;
};

type ImageMeta = {
  size: string;
  seed: string;
  steps: number;
  prompt: string;
  negativePrompt: string;
  sampler: string;
  cfgScale: number;
  clipSkip: 2;
};

type ScanResult = "Pending" | "Success" | "Danger" | "Error";
