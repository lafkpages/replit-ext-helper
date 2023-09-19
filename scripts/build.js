import { rm, mkdir, copyFile } from "fs/promises";

import { compileAllComponents } from "../src/ui";

// Clear and create output directory.
await rm("dist", { recursive: true, force: true });
await mkdir("dist/ui", { recursive: true });

// Compile all Replit Svelte components.
await compileAllComponents("dist/ui");

// Build the JS bundle.
await Bun.build({
  entrypoints: ["src/index.js"],
  outdir: "dist",
  minify: true,
  loader: {
    ".svelte": "js",
  },
});

// Copy the type definitions.
await copyFile("src/types.d.ts", "dist/types.d.ts");
