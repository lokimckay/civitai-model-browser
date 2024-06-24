import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  site: "https://lokimckay.github.io",
  base: "civitai-model-browser",
  integrations: [preact()],
});
