import { compile } from "svelte/compiler";

/**
 * Compiles a component from Replit Svelte to a JS module.
 * @param {string} component
 */
export async function compileComponent(component) {
  const componentFilePath = `../node_modules/@replit-svelte/ui/${component}.svelte`;
  const componentFile = Bun.file(componentFilePath);
  const componentSource = await componentFile.text();

  return compile(componentSource, {
    name: component,
    filename: componentFilePath,
    varsReport: false,
    enableSourcemap: false,
    sveltePath: "../node_modules/svelte",
  });
}
