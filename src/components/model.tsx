import { $models } from "@/lib/store";
import { useStore } from "@nanostores/preact";
import Input from "./input";
import "./model.css";

export default function Model() {
  const queryId = new URLSearchParams(location.search).get("id");
  const models = useStore($models);
  const data = models.find((model) => model.id === queryId);

  const {
    id,
    name: fileName,
    hashing,
    fetching,
    info: modelVersion,
  } = data || {};
  const { name, model, browseUrl, trainedWords } = modelVersion || {};
  const { name: modelName, type, nsfw } = model || {};

  return (
    <div class="model-info">
      <h1>
        {modelName} - {name}
      </h1>

      <ul class="fields">
        <Input
          label="Filename"
          readOnly={true}
          spellCheck={false}
          value={fileName}
        />
        <Input
          label="Trigger words"
          readOnly={true}
          spellCheck={false}
          value={trainedWords?.join(", ")}
        />
      </ul>
      <h2>Raw data</h2>
      <textarea readOnly={true} spellCheck={false} rows={25}>
        {JSON.stringify(data, null, 2)}
      </textarea>
    </div>
  );
}
