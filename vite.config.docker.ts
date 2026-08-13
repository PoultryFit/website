// Used only for the Docker/Node build (see Dockerfile). The Cloudflare
// deployment keeps using vite.config.ts unchanged, this file exists so both
// build targets can coexist without one interfering with the other.
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({ target: "node-server" }),
    viteReact(),
  ],
});