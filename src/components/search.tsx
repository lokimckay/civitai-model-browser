import { useStore } from "@nanostores/preact";
import { $search } from "@/lib/store";
import Input from "./input";
import "./search.css";

export default function Search() {
  const search = useStore($search);
  return (
    <>
      <Input
        type="search"
        class="search"
        placeholder="Search"
        value={search}
        onInput={(event) => {
          $search.set(event.currentTarget.value);
        }}
      />
    </>
  );
}
