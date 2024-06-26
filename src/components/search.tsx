import { useStore } from "@nanostores/preact";
import { $search } from "@/lib/store";
import Input from "./input";
import debounce from "lodash.debounce";
import "./search.css";
import { useMemo } from "preact/hooks";

export default function Search() {
  const search = useStore($search);

  const onInput = useMemo(
    () =>
      debounce((event: Event) => {
        $search.set((event.target as HTMLInputElement).value);
      }, 300),
    []
  );

  return (
    <>
      <Input
        type="search"
        class="search"
        placeholder="Search"
        value={search}
        onInput={onInput}
      />
    </>
  );
}
