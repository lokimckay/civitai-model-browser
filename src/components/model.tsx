import type { Model } from "@/lib/types";
import { $models } from "@/lib/store";
import { useStore } from "@nanostores/preact";
import Input from "./input";
import Gallery from "./gallery";
import "./model.css";
import Badge from "./badge";
import NewTab from "@/components/newTab";

export default function Model() {
  const queryId = new URLSearchParams(location.search).get("id");
  const models = useStore($models);
  const data: Model | null = queryId && queryId !== "" ? models[queryId] : null;

  const {
    id,
    name: fileName,
    info: modelVersion,
    baseModelInfo,
    error,
    fetching,
    previewIdx,
    hashing,
  } = data || {};
  const { name, model, trainedWords, images, baseModel, browseUrl } =
    modelVersion || {};
  const { description, nsfw, creator } = baseModelInfo || {};
  const { name: modelName, type } = model || {};
  const queued = !(fetching === false) || !(hashing === false);
  const loading = fetching || hashing;
  const success = !queued && !loading && !error;
  const statusEmoji = error ? "❌" : "⏳";
  const hasTriggers =
    type === "LORA" && trainedWords && trainedWords.length > 0;
  const hasImages = images && images.length > 0;

  return (
    <div class="model-info">
      <div class="pre-meta">
        <div class="badges">
          {type && <Badge label={type} />}
          {baseModel && <Badge label={baseModel.toString()} />}
          {nsfw && <Badge label="NSFW" color="var(--accent-red)" />}
        </div>
        {browseUrl && <NewTab label="Civitai" width={16} href={browseUrl} />}
      </div>
      <h1>
        {success ? `${modelName} - ${name}` : `${statusEmoji} ${fileName}`}
      </h1>
      <div class="post-meta">
        {creator?.username && (
          <span class="creator">by {creator.username}</span>
        )}
      </div>
      <ul class="fields">
        <li>
          <Input
            label="Filename"
            readOnly={true}
            spellCheck={false}
            value={fileName}
          />
        </li>
        {hasTriggers && (
          <li>
            <Input
              label="Trigger words"
              readOnly={true}
              spellCheck={false}
              value={trainedWords?.join(", ")}
            />
          </li>
        )}
      </ul>
      {hasImages && id && (
        <Gallery id="images" mvId={id}>
          {images.map((img, idx) => (
            <img
              class={previewIdx === idx ? "thumbnail" : ""}
              src={img.url}
              alt={img.url}
            />
          ))}
        </Gallery>
      )}
      {description && (
        <div
          class="description"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
      <h2>Raw data</h2>
      <textarea readOnly={true} spellCheck={false} rows={25}>
        {JSON.stringify(data, null, 2)}
      </textarea>
    </div>
  );
}
