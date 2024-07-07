// Opinionated subset of https://github.com/civitai/civitai/wiki/REST-API-Reference#response-fields-4

export type Model = {
  id: string;
  name: string;
  localFile?: File;
  path: string;
  extension: string;
  size: number;
  previewIdx: number;
  hash?: string;
  hashing?: boolean;
  hashedBytes?: number;
  info?: ModelVersion;
  baseModelInfo?: BaseModel;
  fetching?: boolean;
  image?: string;
  error?: Error;
};

export type Progress = {
  remaining: number;
  current: string | null;
};

// Populated by additonal API call
export type BaseModel = {
  description: string;
  nsfw: boolean; // unreliable - not sure why
  creator: {
    username: string;
    image: string;
  };
};

export type ModelVersion = {
  id: number;
  air: string;
  modelId: number;
  name: string;
  description: string;
  downloadUrl: string;
  browseUrl: string;
  trainedWords: string[];
  baseModel: number;
  model: RemoteModel;
  files: ModelArtifact[];
  images: Image[];
};

export type SafeTensorMetadata = {
  __metadata__: {
    sshs_model_hash: string;
    sshs_legacy_hash: string;
    ss_sd_model_hash: string;
    ss_new_sd_model_hash: string;
  };
};

export type RemoteModel = {
  name: string;
  type:
    | "Checkpoint"
    | "TextualInversion"
    | "Hypernetwork"
    | "AestheticGradient"
    | "LORA"
    | "Controlnet"
    | "Poses";
  nsfw: boolean; // unreliable - not sure why
};

export type ModelArtifact = {
  id: number;
  primary: boolean;
  downloadUrl: string;
  sizeKB: number;
  name: string;
  type: string;
  hashes: { SHA256: string; AUTOV3: string };
};

export type Image = {
  url: string;
  width: number;
  height: number;
  nsfwLevel: number;
};
