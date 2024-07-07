import type { HTMLAttributes } from "preact/compat";
import "./badge.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  label: string;
  color?: string;
}

export default function Badge(props: Props) {
  const { label, color } = props;
  return (
    <span class="badge" style={color ? `--bg-color: ${color}` : {}}>
      {label}
    </span>
  );
}
