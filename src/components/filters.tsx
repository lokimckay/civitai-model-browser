import { useEffect, type HTMLAttributes } from "preact/compat";
import { useSignal } from "@preact/signals";
import { useStore } from "@nanostores/preact";
import { $filters, setAllFilters } from "@/lib/store";
import Switch from "./switch";
import "./filters.css";

interface Props extends HTMLAttributes<HTMLButtonElement> {}

export default function Filters(props: Props) {
  const { ...rest } = props;
  const modalOpen = useSignal<boolean>(false);
  const filters = useStore($filters);
  const filtersSig = useSignal<Record<string, boolean>>({}); // Workaround - this shouldn't be needed. useStore does not trigger rerender for some reason

  useEffect(() => {
    filtersSig.value = filters;
  }, [filters]);

  function hideFilters(event: Event) {
    if (event.target === event.currentTarget) modalOpen.value = false;
  }

  return (
    <>
      <button {...rest} onClick={() => (modalOpen.value = true)}>
        Filters
      </button>
      {modalOpen.value && (
        <div class="filters" onClick={hideFilters}>
          <div class="modal">
            <button class="close" onClick={hideFilters}>
              &times;
            </button>
            <h2>Base Models</h2>
            <ul class="base-models">
              {Object.entries(filtersSig.value).map(([key, value]) => (
                <Switch
                  id={key}
                  label={key}
                  checked={value}
                  onChange={(e) => {
                    const checked = (e.target as HTMLInputElement)?.checked;
                    $filters.setKey(key, checked);
                  }}
                />
              ))}
            </ul>
            <button onClick={() => setAllFilters(true)}>Enable all</button>
            <button onClick={() => setAllFilters(false)}>Disable all</button>
          </div>
        </div>
      )}
    </>
  );
}
