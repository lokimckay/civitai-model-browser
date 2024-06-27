// import { useStore } from "@nanostores/preact";
import { $search } from "@/lib/store";
import { useSignal } from "@preact/signals";
import { useEffect, useMemo } from "preact/hooks";
import debounce from "lodash.debounce";
import Input from "./input";
import "./search.css";

export default function Search() {
  // const search = useStore($search);
  const searchSig = useSignal(""); // Workaround - this shouldn't be needed. search useStore was no populating the input on page load for some reason

  const onInput = useMemo(
    () =>
      debounce((event: Event) => {
        const val = (event.target as HTMLInputElement).value;
        $search.set(val);
        searchSig.value = val;
      }, 300),
    []
  );

  useEffect(() => {
    searchSig.value = $search.get();
  }, [$search]);

  return (
    <>
      <Input
        type="search"
        class="search"
        placeholder="Search"
        value={searchSig}
        onInput={onInput}
      />
    </>
  );
}
