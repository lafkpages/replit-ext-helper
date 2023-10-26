import { rm, copyFile } from "fs/promises";

import sveltePlugin from "../src/plugins/svelte";

// Clear the dist directory.
await rm("dist", { recursive: true, force: true });

// Build the JS bundle.
const bundle = await Bun.build({
  entrypoints: ["src/index.ts"],
  minify: true,
  loader: {
    ".svelte": "js",
    ".js": "js",
    ".css": "text",
  },
  target: "browser",
  outdir: "dist",
  plugins: [sveltePlugin],
});
if (!bundle.success) {
  throw new Error(
    bundle.logs
      .map(
        (log) =>
          `${log.position?.file}:${log.position?.line}:${log.position?.column} ${log.message}`
      )
      .join("\n")
  );
}

// Copy the type definitions.
await copyFile("src/types/index.d.ts", "dist/types.d.ts");
await copyFile("src/types/ui.d.ts", "dist/ui.d.ts");
