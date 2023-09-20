import { rm, mkdir, copyFile } from "fs/promises";
import { resolve as resolvePath } from "path";

import { compileAllComponents } from "../src/ui";

// Clear and create output directory.
await rm("dist", { recursive: true, force: true });
await mkdir("dist/ui/icons", { recursive: true });

// Compile all Replit Svelte components.
await compileAllComponents({
  outDir: "dist/ui",
  icons: true,
  copyOthers: [".css"],
});

// Build the JS bundle.
const bundle = await Bun.build({
  entrypoints: ["src/index.js"],
  minify: true,
  loader: {
    ".svelte": "js",
    ".js": "js",
  },
  target: "browser",
  outdir: "dist",
  plugins: [
    {
      name: "replit-svelte-to-dist",
      setup(build) {
        build.onResolve({ filter: /^@replit-svelte\/ui\// }, (args) => ({
          path: resolvePath(
            args.path.replace(/^@replit-svelte\/ui\//, `./dist/ui/`)
          ),
        }));
      },
    },
  ],
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

// Remove compiled components.
await rm("dist/ui", { recursive: true, force: true });

// Copy the type definitions.
await copyFile("src/types.d.ts", "dist/types.d.ts");
