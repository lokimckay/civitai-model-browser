import { $sortedModels, $progress } from "../lib/store";
import { useStore } from "@nanostores/preact";
import ModelListItem from "./modelListItem";
import "./models.css";

export default function Models() {
  const models = useStore($sortedModels);
  const progress = useStore($progress);
  const { remaining } = progress;

  return (
    <>
      {remaining > 0 && <div class="progress">{remaining} remaining</div>}
      <ul class="list">
        {models.map((model) => (
          <li key={model.id}>
            <ModelListItem model={model} />
          </li>
        ))}
      </ul>
    </>
  );
}
