import Enum from "./enum";
import {
  $settings,
  resetSettings,
  DEFAULT_LAYOUT,
  layouts,
  type Layout,
  type Settings,
} from "@/lib/store";
import { useStore } from "@nanostores/preact";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import Input from "./input";
import Switch from "./switch";
import "./settings.css";

export default function Settings() {
  const settingsSig = useSignal<Settings>({}); // Workaround - this shouldn't be needed. useStore does not trigger rerender for some reason
  const settings = useStore($settings);
  useEffect(() => {
    settingsSig.value = settings;
  }, [settings]);
  const { layout, giWidth, giHeight, hideMissing, hideMissingWhileSearching } =
    settingsSig.value;

  return (
    <>
      <div class="settings">
        <Enum
          id="layout"
          label="Layout"
          options={layouts.map((layout) => ({ value: layout, label: layout }))}
          value={layout}
          onChange={(e) => {
            const layout =
              (e.target as HTMLSelectElement)?.value || DEFAULT_LAYOUT;
            $settings.setKey("layout", layout as Layout);
          }}
        />
        {layout === "grid" && (
          <>
            <Input
              id="gi-width"
              label="Grid item width"
              type="number"
              value={giWidth}
              onChange={(e) => {
                const width = parseInt((e.target as HTMLInputElement)?.value);
                $settings.setKey("giWidth", width);
              }}
            />
            <Input
              id="gi-height"
              label="Grid item height"
              type="number"
              value={giHeight}
              onChange={(e) => {
                const height = parseInt((e.target as HTMLInputElement)?.value);
                $settings.setKey("giHeight", height);
              }}
            />
          </>
        )}
        <Switch
          id="hide-missing"
          label="Hide missing"
          checked={hideMissing}
          onChange={(e) => {
            $settings.setKey(
              "hideMissing",
              (e.target as HTMLInputElement)?.checked
            );
          }}
        />
        <Switch
          id="hide-missing-search"
          label="Hide missing while searching"
          checked={hideMissingWhileSearching}
          onChange={(e) => {
            $settings.setKey(
              "hideMissingWhileSearching",
              (e.target as HTMLInputElement)?.checked
            );
          }}
        />
        <button onClick={resetSettings}>Reset settings</button>
      </div>
    </>
  );
}
