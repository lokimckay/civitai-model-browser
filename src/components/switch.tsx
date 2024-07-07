import type { HTMLAttributes } from "preact/compat";
import "./switch.css";

interface Props extends HTMLAttributes<HTMLInputElement> {
  id: string;
}

export default function Switch(props: Props) {
  const { id, label, ...rest } = props;

  return (
    <label for={id} class="switch">
      <span>{label}</span>
      <div class="track">
        <input type="checkbox" id={id} {...rest} />
        <span class="slider" />
      </div>
    </label>
  );
}
