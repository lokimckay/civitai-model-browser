// Opinionated subset of https://github.com/civitai/civitai/wiki/REST-API-Reference#response-fields-4

export type Model = {
  id: string;
  name: string;
  localFile?: File;
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
  trainedWords: string[];
  baseModel: number;
  model: RemoteModel;
  files: ModelArtifact[];
  images: Image[];
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
  nsfw: boolean;
};

type ModelArtifact = {
  id: number;
  primary: boolean;
  downloadUrl: string;
  sizeKB: number;
  name: string;
  type: string;
  hashes: { SHA256: string };
};

type Image = {
  url: string;
  width: number;
  height: number;
  nsfwLevel: number;
};

export function pruneModelVersion(rawModelVersion: any): ModelVersion {
  const {
    id,
    air,
    name,
    description,
    modelId,
    downloadUrl,
    browseUrl,
    baseModel,
    trainedWords,
    model: _model,
    files: _files,
    images: _images,
  } = rawModelVersion;

  const { name: modelName, type, nsfw } = _model;
  const model = { name: modelName, type, nsfw };

  const files = _files.map(
    ({
      id,
      primary,
      downloadUrl,
      sizeKB,
      name,
      type,
      hashes,
    }: any): ModelArtifact => ({
      id,
      primary,
      downloadUrl,
      sizeKB,
      name,
      type,
      hashes: {
        SHA256: hashes.SHA256,
      },
    })
  );

  const images = _images.map(
    ({ url, width, height, nsfwLevel }: any): Image => ({
      url,
      width,
      height,
      nsfwLevel,
    })
  );
  return {
    id,
    air,
    name,
    description,
    modelId,
    downloadUrl,
    browseUrl,
    baseModel,
    trainedWords,
    model,
    files,
    images,
  };
}
