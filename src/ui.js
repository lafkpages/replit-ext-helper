import { join as joinPaths } from "path";
import { readdir } from "fs/promises";

import { compile } from "svelte/compiler";

function getProjectDir() {
  return joinPaths(Bun.fileURLToPath(new URL(import.meta.url)), "../../");
}

/**
 * @type {string[] | null}
 */
let componentNamesCache = null;

export async function getComponentNames() {
  if (componentNamesCache) {
    return componentNamesCache;
  }

  const projectDir = getProjectDir();

  const files = await readdir(
    joinPaths(projectDir, "node_modules/@replit-svelte/ui")
  );

  const names = files

    // Filter out non-Svelte files.
    .filter((file) => file.endsWith(".svelte"))

    // Remove the ".svelte" extension.
    .map((file) => file.slice(0, -7));

  componentNamesCache = names;

  return names;
}

/**
 * @type {string[] | null}
 */
let iconNamesCache = null;

export async function getIconNames() {
  if (iconNamesCache) {
    return iconNamesCache;
  }

  const projectDir = getProjectDir();

  const files = await readdir(
    joinPaths(projectDir, "node_modules/@replit-svelte/ui/icons")
  );

  const names = files

    // Filter out non-Svelte files.
    .filter((file) => file.endsWith(".svelte"))

    // Remove the ".svelte" extension.
    .map((file) => file.slice(0, -7));

  iconNamesCache = names;

  return names;
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

/**
 * @typedef {{
 *    outDir: string | null,
 *    extension: string,
 *    icons: boolean,
 * }} CompileAllComponentsOptions
 * @param {Partial<CompileAllComponentsOptions>} opts
 */
export async function compileAllComponents(opts = {}) {
  const { outDir = null, extension = "js", icons: includeIcons = false } = opts;

  const components = await getComponentNames();

  /**
   * @type {Record<string, import('svelte/compiler').CompileResult>}
   */
  const compiledComponents = {};

  for (const component of components) {
    compiledComponents[component] = await compileComponent(component);
  }

  if (outDir) {
    for (const component of components) {
      await Bun.write(
        joinPaths(outDir, `${component}.${extension}`),
        compiledComponents[component].js.code
      );
    }
  }

  if (includeIcons) {
    const icons = await getIconNames();

    for (const icon of icons) {
      const componentName = `icons/${icon}`;
      compiledComponents[componentName] = await compileComponent(componentName);
    }

    if (outDir) {
      for (const icon of icons) {
        await Bun.write(
          joinPaths(outDir, `icons/${icon}.${extension}`),
          compiledComponents[icon].js.code
        );
      }
    }
  }

  return compiledComponents;
}
