import { rm, mkdir, copyFile } from "fs/promises";
import { resolve as resolvePath } from "path";

import { compileAllComponents } from "../src/ui";

// Clear and create output directory.
await rm("dist", { recursive: true, force: true });
await mkdir("dist/ui", { recursive: true });

// Compile all Replit Svelte components.
await compileAllComponents({ outDir: "dist/ui", icons: true });

// Build the JS bundle.
const bundle = await Bun.build({
  entrypoints: ["src/index.js"],
  minify: true,
  loader: {
    ".svelte": "js",
  },
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
if (bundle.success) {
  await Bun.write("dist/index.js", bundle.outputs[0]);
} else {
  throw new Error(bundle.logs.join("\n"));
}

// Copy the type definitions.
await copyFile("src/types.d.ts", "dist/types.d.ts");
