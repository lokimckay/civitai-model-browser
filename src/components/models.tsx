import { $models } from "../lib/store";
import { useStore } from "@nanostores/preact";
import ModelListItem from "./modelListItem";
import "./models.css";

export default function Models() {
  const models = useStore($models);

  return (
    <ul class="list">
      {models.map((model) => (
        <li key={model.id}>
          <ModelListItem model={model} />
        </li>
      ))}
    </ul>
  );
}
