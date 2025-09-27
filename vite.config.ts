import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import type { UserConfig as VitestUserConfig } from "vitest/config";

const ReactComplierConfig = { target: "19" };

const config: UserConfig & { test: VitestUserConfig["test"] } = {
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactComplierConfig]],
      },
    }),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setupTests.ts",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
};

// https://vite.dev/config/
export default defineConfig(config);
