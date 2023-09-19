import { join as joinPaths } from "path";

import { compile } from "svelte/compiler";

/**
 * Compiles a component from Replit Svelte to a JS module.
 * @param {string} component
 */
export async function compileComponent(component) {
  const componentFilePath = joinPaths(
    Bun.fileURLToPath(new URL(import.meta.url)),
    `../../node_modules/@replit-svelte/ui/${component}.svelte`
  );
  const componentFile = Bun.file(componentFilePath);
  const componentSource = await componentFile.text();

  return compile(componentSource, {
    name: component,
    filename: componentFilePath,
    varsReport: false,
    enableSourcemap: false,
    css: "injected",
    sveltePath: "../node_modules/svelte",
  });
}
