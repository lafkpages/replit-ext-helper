import { rm, mkdir, copyFile } from "fs/promises";

// Clear and create output directory.
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });

// Build the JS bundle.
await Bun.build({
  entrypoints: ["src/index.js"],
  outdir: "dist",
  minify: true,
});

// Copy the type definitions.
await copyFile("src/types.d.ts", "dist/types.d.ts");
