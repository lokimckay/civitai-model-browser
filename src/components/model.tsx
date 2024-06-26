import { $models } from "@/lib/store";
import { useStore } from "@nanostores/preact";
import Input from "./input";
import "./model.css";

export default function Model() {
  const queryId = new URLSearchParams(location.search).get("id");
  const models = useStore($models);
  const data = queryId && models[queryId];

  const {
    name: fileName,
    info: modelVersion,
    error,
    fetching,
    hashing,
  } = data || {};
  const { name, model, trainedWords } = modelVersion || {};
  const { name: modelName, type } = model || {};
  const queued = !(fetching === false) || !(hashing === false);
  const loading = fetching || hashing;
  const success = !queued && !loading && !error;
  const statusEmoji = error ? "❌" : "⏳";
  const hasTriggers =
    type === "LORA" && trainedWords && trainedWords.length > 0;

  return (
    <div class="model-info">
      <h1>
        {success ? `${modelName} - ${name}` : `${statusEmoji} ${fileName}`}
      </h1>

      <ul class="fields">
        <Input
          label="Filename"
          readOnly={true}
          spellCheck={false}
          value={fileName}
        />
        {hasTriggers && (
          <Input
            label="Trigger words"
            readOnly={true}
            spellCheck={false}
            value={trainedWords?.join(", ")}
          />
        )}
      </ul>
      <h2>Raw data</h2>
      <textarea readOnly={true} spellCheck={false} rows={25}>
        {JSON.stringify(data, null, 2)}
      </textarea>
    </div>
  );
}
