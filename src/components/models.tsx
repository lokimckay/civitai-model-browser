import { $models, $searchResults, $search, $progress } from "../lib/store";
import { useStore } from "@nanostores/preact";
import ModelListItem from "./modelListItem";
import "./models.css";

export default function Models() {
  const models = useStore($models);
  const search = useStore($search);
  const searchResults = useStore($searchResults);
  const progress = useStore($progress);
  const { remaining } = progress;

  const modelList =
    search !== "" && searchResults ? searchResults.map((r) => r.item) : models;

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
