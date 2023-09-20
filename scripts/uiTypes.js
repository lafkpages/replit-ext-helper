import { getComponentNames } from "../src/ui";

export async function generateUiTypes() {
  const componentNames = await getComponentNames();

  return /* javascript */ `
export type ReplitSvelteComponents = ${componentNames
    .map((name) => `"${name}"`)
    .join(" | ")};
  `.trim();
}

export async function writeUiTypes() {
  const uiTypes = await generateUiTypes();
  await Bun.write("src/types/ui.d.ts", uiTypes);
}

if (import.meta.path === Bun.main) {
  await writeUiTypes();
}
