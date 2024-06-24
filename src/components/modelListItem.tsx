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
  } = data || {};
  const { name, model, browseUrl, trainedWords } = modelVersion || {};
  const { name: modelName, type, nsfw } = model || {};
  const loading = !(fetching === false) || !(hashing === false);
  const hasTriggers = trainedWords && trainedWords.length > 0;

  return (
    <div class="model-li" data-loading={loading}>
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
        <a href={browseUrl}>
          Civitai <NewTab />
        </a>
      </div>
      <h3>
        <a href={`./model?id=${id}`}>
          {loading ? "⌛" : `${modelName} - ${name}`}
        </a>
      </h3>

      <textarea readOnly={true} spellCheck={false}>
        {fileName}
      </textarea>
      {hasTriggers && (
        <textarea readOnly={true} spellCheck={false}>
          {trainedWords?.join(", ")},
        </textarea>
      )}
    </div>
  );
}
