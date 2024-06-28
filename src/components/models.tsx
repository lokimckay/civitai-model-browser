import { $models, $searchResults, $search, $progress } from "../lib/store";
import { useStore } from "@nanostores/preact";
import ModelListItem from "./modelListItem";
import "./models.css";

export default function Models({
  layout = "grid",
}: {
  layout?: "grid" | "list";
}) {
  const _models = useStore($models);
  const models = Object.values(_models);
  const search = useStore($search);
  const searchResults = useStore($searchResults);
  const progress = useStore($progress);
  const { remaining } = progress;

  const items =
    search !== "" && searchResults ? searchResults.map((r) => r.item) : models;

  return (
    <>
      {remaining > 0 && (
        <div class="progress">
          Processed {models.length - remaining} / {models.length} models
        </div>
      )}
      <ul
        class={`${layout} full-width`}
        data-has-items={items.length > 0}
        style={"--gi-width: 14em; --gi-height: 26em;"}
      >
        {items.map((model) => (
          <ModelListItem key={model.id} layout={layout} model={model} />
        ))}
      </ul>
    </>
  );
}
