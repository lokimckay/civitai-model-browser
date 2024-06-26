import type { HTMLAttributes } from "preact/compat";
import "./input.css";

interface Props extends HTMLAttributes<HTMLInputElement> {}

export default function Input(props: Props) {
  const { label, id, ...rest } = props;
  return (
    <div class="input">
      {label && <label for={id}>{label}</label>}
      <input id={id} {...rest} />
    </div>
  );
}
