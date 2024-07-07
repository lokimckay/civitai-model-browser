import {
  $models,
  $searchResults,
  $search,
  $progress,
  $settings,
  type Settings,
} from "../lib/store";
import { useStore } from "@nanostores/preact";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import ModelListItem from "./modelListItem";
import "./models.css";

export default function Models() {
  const _models = useStore($models);
  const models = Object.values(_models);
  const search = useStore($search);
  const searchResults = useStore($searchResults);
  const progress = useStore($progress);
  const { remaining } = progress;

  const settingsSig = useSignal<Settings>({}); // Workaround - this shouldn't be needed. useStore does not trigger rerender for some reason
  useEffect(() => {
    settingsSig.value = $settings.get();
  }, [$settings]);

  const hasSearch = search !== "" && searchResults;
  const items = hasSearch ? searchResults.map((r) => r.item) : models;
  const { layout, giWidth, giHeight, hideMissing, hideMissingWhileSearching } =
    settingsSig.value;
  const filteredItems = items.filter((model) => {
    if (hasSearch && hideMissingWhileSearching && model.error) return false;
    if (!hasSearch && hideMissing && model.error) return false;
    return true;
  });

  return (
    <>
      {remaining > 0 && (
        <div class="progress">
          Processed {models.length - remaining} / {models.length} models
        </div>
      )}
      <ul
        class={`${layout} full-width`}
        style={`--gi-width: ${giWidth}em; --gi-height: ${giHeight}em;`}
      >
        {filteredItems.map((model) => (
          <ModelListItem key={model.id} layout={layout} model={model} />
        ))}
      </ul>
    </>
  );
}
