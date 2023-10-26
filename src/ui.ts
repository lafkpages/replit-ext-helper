import { join as joinPaths } from "path";
import { readdir } from "fs/promises";

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
