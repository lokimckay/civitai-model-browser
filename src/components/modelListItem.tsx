import type { Model } from "@/lib/store";
import NewTab from "@/lib/svg/newTab";
import "./modelListItem.css";

export default function ModelListItem({ model: data }: { model: Model }) {
  const {
    id,
    name: fileName,
    hashing,
    fetching,
    info: modelVersion,
    error,
  } = data || {};
  const { name, model, browseUrl, trainedWords } = modelVersion || {};
  const { name: modelName, type, nsfw } = model || {};
  const queued = !(fetching === false) || !(hashing === false);
  const loading = fetching || hashing;
  const hasTriggers =
    type === "LORA" && trainedWords && trainedWords.length > 0;

  return (
    <div
      class="model-li"
      data-is-queued={queued}
      data-is-loading={loading}
      data-has-error={!!error}
    >
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
        `⌛ ${hashing ? "hashing" : fetching ? "fetching" : "queued"}`
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
  );
}
