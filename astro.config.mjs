// astro.config.mjs
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static", // Make sure it's static for CSS Modules
  build: {
    assets: "_assets", // This helps with asset organization
  },
  vite: {
    // Ensure CSS Modules work correctly
    css: {
      modules: {
        // Generate readable class names in production
        generateScopedName: "[name]__[local]___[hash:base64:5]",
      },
    },
  },
});
