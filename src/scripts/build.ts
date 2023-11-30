import { rm, copyFile } from "fs/promises";

import sveltePlugin from "../plugins/svelte";

// Clear the dist directory.
await rm("dist", { recursive: true, force: true });

// Build the JS bundle.
const bundle = await Bun.build({
  entrypoints: ["src/index.ts"],
  minify: true,
  loader: {
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

// Build the types
const tsc = Bun.spawn([
  "tsc",
  "--emitDeclarationOnly",
  "--declaration",
  "--outDir",
  "dist",
  "src/index.ts",
]);
await tsc.exited;
