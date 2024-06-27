import type { Model } from "@/lib/types";
import NewTab from "@/lib/svg/newTab";
import "./modelListItem.css";

export default function ModelListItem({ model: data }: { model: Model }) {
  const {
    id,
    name: fileName,
    size,
    hashing,
    fetching,
    info: modelVersion,
    hashedBytes,
    error,
  } = data || {};
  const { name, model, baseModel, browseUrl, trainedWords, images } =
    modelVersion || {};
  const { name: modelName, type, nsfw } = model || {};
  const queued = !(fetching === false) || !(hashing === false);
  const loading = fetching || hashing;
  const success = !queued && !loading && !error;
  const statusEmoji = error ? "❌" : fetching ? "📨" : hashing ? "⚙️" : "⏳";
  const hasTriggers =
    type !== "Checkpoint" && trainedWords && trainedWords.length > 0;

  const bytesProgess = ` (${Math.round(
    hashedBytes ? hashedBytes / 1024 / 1000 : 0
  )} MB / ${Math.round(size / 1024 / 1000)} MB)`;

  const title = modelName && name ? `${modelName} - ${name}` : fileName;
  const image = images?.[0];
  const triggers =
    hasTriggers && trainedWords.length > 1
      ? `${trainedWords?.join(", ")},`
      : trainedWords;

  return (
    <li
      class="model-li"
      data-success={success}
      data-is-queued={queued}
      data-is-loading={loading}
      data-has-error={!!error}
      data-has-preview={!!image}
    >
      {image && (
        <div class="preview">
          <img
            src={image.url}
            alt={name}
            width={image.width}
            height={image.height}
          />
        </div>
      )}
      <div class="content">
        {!queued && !error && (
          <div class="header">
            <div>
              <span class="type">{type}</span>
              {baseModel && (
                <>
                  {" "}
                  &middot; <span>{baseModel}</span>
                </>
              )}
              {nsfw && (
                <>
                  {" "}
                  &middot; <span>NSFW</span>
                </>
              )}
            </div>
            {browseUrl && (
              <a href={browseUrl}>
                Civitai <NewTab />
              </a>
            )}
          </div>
        )}
        <h3 class="truncate">
          {!success && `${statusEmoji} `}
          <a href={`./model?id=${id}`}>{error ? fileName : title}</a>
        </h3>
        {loading && (
          <span>
            {hashing ? `Calculating hash${bytesProgess}` : "Downloading info"}
          </span>
        )}

        <div class="fields">
          {error && <span>{error.message}</span>}
          {success && (
            <>
              <span>Filename:</span>
              <span>{fileName}</span>
            </>
          )}
          {hasTriggers && (
            <>
              <span>Triggers:</span>
              <span>{triggers}</span>
            </>
          )}
        </div>
      </div>
    </li>
  );
}
