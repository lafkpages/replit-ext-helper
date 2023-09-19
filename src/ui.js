import { join as joinPaths } from "path";
import { readdir } from "fs/promises";

import { compile } from "svelte/compiler";

function getProjectDir() {
  return joinPaths(Bun.fileURLToPath(new URL(import.meta.url)), "../../");
}

export async function getComponentNames() {
  const projectDir = getProjectDir();

  const files = await readdir(
    joinPaths(projectDir, "node_modules/@replit-svelte/ui")
  );

  return (
    files

      // Filter out non-Svelte files.
      .filter((file) => file.endsWith(".svelte"))

      // Remove the ".svelte" extension.
      .map((file) => file.slice(0, -7))
  );
}

/**
 * Compiles a component from Replit Svelte to a JS module.
 * @param {string} component
 * //@param {string | null} targetNodeModules
 */
export async function compileComponent(
  component /* targetNodeModules = null */
) {
  const projectDir = getProjectDir();

  const componentFilePath = joinPaths(
    projectDir,
    `node_modules/@replit-svelte/ui/${component}.svelte`
  );
  const componentFile = Bun.file(componentFilePath);
  const componentSource = await componentFile.text();

  // const targetNodeModulesDir =
  //   targetNodeModules ?? joinPaths(projectDir, "node_modules");

  return compile(componentSource, {
    name: component,
    filename: componentFilePath,
    varsReport: false,
    enableSourcemap: false,
    css: "injected",
    // sveltePath: joinPaths(targetNodeModulesDir, "svelte"),
  });
}
