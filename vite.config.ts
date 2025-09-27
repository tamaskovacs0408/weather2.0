import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const ReactComplierConfig = { target: "19" };

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactComplierConfig]],
      },
    }),
  ],
});
