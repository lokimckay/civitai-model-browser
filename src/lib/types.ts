// Opinionated subset of https://github.com/civitai/civitai/wiki/REST-API-Reference#response-fields-4

export type Model = {
  id: string;
  name: string;
  localFile: File;
  path: string;
  size: number;
  hash?: string;
  hashing?: boolean;
  hashedBytes?: number;
  info?: ModelVersion;
  fetching?: boolean;
  image?: string;
  error?: Error;
};

export type Progress = {
  remaining: number;
  current: string | null;
};

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
  model: RemoteModel;
  files: ModelArtifact[];
  images: Image[];
};

type Stats = {
  downloadCount: number;
  ratingCount: number;
  rating: number;
  thumbsUpCount: number;
};

type RemoteModel = {
  name: string;
  type:
    | "Checkpoint"
    | "TextualInversion"
    | "Hypernetwork"
    | "AestheticGradient"
    | "LORA"
    | "Controlnet"
    | "Poses";
  nsfw: boolean; // not safe for work
  poi: boolean; // person of interest
  mode: string;
};

type ModelArtifact = {
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
