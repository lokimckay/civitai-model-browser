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
  const { name, model, browseUrl, trainedWords, images } = modelVersion || {};
  const { name: modelName, type, nsfw } = model || {};
  const queued = !(fetching === false) || !(hashing === false);
  const loading = fetching || hashing;
  const hasTriggers =
    type === "LORA" && trainedWords && trainedWords.length > 0;

  const bytesProgess = ` (${Math.round(
    hashedBytes ? hashedBytes / 1024 / 1000 : 0
  )} MB / ${Math.round(size / 1024 / 1000)} MB)`;

  const image = images?.[0];

  return (
    <div
      class="model-li"
      data-is-queued={queued}
      data-is-loading={loading}
      data-has-error={!!error}
    >
      <div class="preview">
        {image && (
          <img
            src={image.url}
            alt={name}
            width={image.width}
            height={image.height}
          />
        )}
      </div>
      <div class="content">
        <div class="header">
          <div>
            <span class="type">{type}</span>
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
        {loading ? (
          `⌛ ${
            hashing
              ? `calculating hash${bytesProgess}`
              : fetching
              ? "downloading info"
              : "queued"
          }`
        ) : (
          <h3>
            <a href={`./model?id=${id}`}>
              {error ? `❌ ${fileName}` : `${modelName} - ${name}`}
            </a>
          </h3>
        )}

        <textarea readOnly={true} spellCheck={false}>
          {error ? error.message : fileName}
        </textarea>

        {hasTriggers && (
          <textarea readOnly={true} spellCheck={false}>
            {trainedWords?.join(", ")},
          </textarea>
        )}
      </div>
    </div>
  );
}
