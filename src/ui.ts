import { join as joinPaths, basename, extname } from "path";
import { copyFile, readdir } from "fs/promises";

import { compile } from "svelte/compiler";

function getProjectDir() {
  return joinPaths(Bun.fileURLToPath(new URL(import.meta.url)), "../../");
}

let componentNamesCache: string[] | null = null;

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

let iconNamesCache: string[] | null = null;

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

export async function compileComponent(
  component: string /* targetNodeModules = null */
) {
  const projectDir = getProjectDir();

  const componentFilePath = joinPaths(
    projectDir,
    `node_modules/@replit-svelte/ui/${component}.svelte`
  );
  const componentFile = Bun.file(componentFilePath);
  const componentSource = await componentFile.text();
  const componentName = basename(componentFilePath, ".svelte");

  // const targetNodeModulesDir =
  //   targetNodeModules ?? joinPaths(projectDir, "node_modules");

  return compile(componentSource, {
    name: componentName,
    filename: componentFilePath,
    varsReport: false,
    enableSourcemap: false,
    css: "injected",
    // sveltePath: joinPaths(targetNodeModulesDir, "svelte"),
  });
}

export type CompileAllComponentsOptions = {
  outDir: string | null;
  extension: string;
  icons: boolean;
  copyOthers: boolean | string[];
};
export async function compileAllComponents(
  opts: Partial<CompileAllComponentsOptions> = {}
) {
  const {
    outDir = null,
    extension = "svelte",
    icons: includeIcons = false,
    copyOthers = false,
  } = opts;

  const components = await getComponentNames();

  const compiledComponents: Record<
    string,
    import("svelte/compiler").CompileResult
  > = {};

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
        const componentName = `icons/${icon}`;
        await Bun.write(
          joinPaths(outDir, `${componentName}.${extension}`),
          compiledComponents[componentName].js.code
        );
      }
    }
  }

  if (copyOthers && outDir) {
    const projectDir = getProjectDir();

    const files = await readdir(
      joinPaths(projectDir, "node_modules/@replit-svelte/ui")
    );

    for (const file of files) {
      const fileExt = extname(file);

      if (fileExt == ".svelte") {
        continue;
      }

      if (Array.isArray(copyOthers) && !copyOthers.includes(fileExt)) {
        continue;
      }

      const filePath = joinPaths(
        projectDir,
        `node_modules/@replit-svelte/ui/${file}`
      );

      await copyFile(filePath, joinPaths(outDir, file));
    }
  }

  return compiledComponents;
}
