import { join as joinPaths } from "path";

import { compile } from "svelte/compiler";

/**
 * Compiles a component from Replit Svelte to a JS module.
 * @param {string} component
 * @param {string | null} targetNodeModules
 */
export async function compileComponent(component, targetNodeModules = null) {
  const projectDir = joinPaths(
    Bun.fileURLToPath(new URL(import.meta.url)),
    "../../"
  );

  const componentFilePath = joinPaths(
    projectDir,
    `node_modules/@replit-svelte/ui/${component}.svelte`
  );
  const componentFile = Bun.file(componentFilePath);
  const componentSource = await componentFile.text();

  const targetNodeModulesDir =
    targetNodeModules ?? joinPaths(projectDir, "node_modules");

  return compile(componentSource, {
    name: component,
    filename: componentFilePath,
    varsReport: false,
    enableSourcemap: false,
    css: "injected",
    sveltePath: joinPaths(targetNodeModulesDir, "svelte"),
  });
}
