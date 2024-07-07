import type { Model } from "@/lib/types";
import NewTab from "@/components/newTab";
import { DEFAULT_LAYOUT } from "@/lib/store";
import "./modelListItem.css";
import "./modelGridItem.css";

export default function ModelListItem({
  layout = DEFAULT_LAYOUT,
  model: data,
}: {
  layout?: "list" | "grid";
  model: Model;
}) {
  const {
    id,
    name: fileName,
    size,
    hashing,
    fetching,
    info: modelVersion,
    previewIdx,
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
  const notFoundImg = {
    url: `${import.meta.env.BASE_URL}/not-found.png`,
    width: 0,
    height: 0,
  };
  const queuedImg = {
    url: `${import.meta.env.BASE_URL}/queued.png`,
    width: 0,
    height: 0,
  };
  const hasImg = images && images.length > 0;

  const imgIdx = previewIdx % (images?.length || 1);

  const image = success
    ? images?.[imgIdx]
    : error
    ? notFoundImg
    : queued || loading
    ? queuedImg
    : null;
  const triggers =
    hasTriggers && trainedWords.length > 1
      ? `${trainedWords?.join(", ")},`
      : trainedWords;

  return (
    <li
      class={layout === "list" ? "model-li" : "model-gi"}
      data-success={success}
      data-is-queued={queued}
      data-is-loading={loading}
      data-has-preview={hasImg}
      data-has-error={!!error}
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
            {browseUrl && <NewTab label="Civitai" href={browseUrl} />}
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
