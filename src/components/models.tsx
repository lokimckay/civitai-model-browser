import { $models, $searchResults, $progress } from "../lib/store";
import { useStore } from "@nanostores/preact";
import ModelListItem from "./modelListItem";
import "./models.css";

export default function Models() {
  const models = useStore($models);
  const searchResults = useStore($searchResults);
  const progress = useStore($progress);
  const { remaining } = progress;

  const modelList =
    searchResults.length > 0 ? searchResults.map((r) => r.item) : models;

  return (
    <>
      {remaining > 0 && <div class="progress">{remaining} remaining</div>}
      <ul class="list">
        {modelList.map((model) => (
          <li key={model.id}>
            <ModelListItem model={model} />
          </li>
        ))}
      </ul>
    </>
  );
}
