import type { BunPlugin } from "bun";

const debugLogs = process.env.SVELTE_PLUGIN_BUN_DEBUG == "1";

export default {
  name: "svelte-loader",
  async setup(build) {
    const { compile } = await import("svelte/compiler");
    const { readFileSync } = await import("fs");

    // when a .svelte file is imported...
    build.onLoad({ filter: /.svelte$/ }, ({ path }) => {
      if (debugLogs) {
        console.debug("[svelte-plugin] compiling:", path);
      }

      // read and compile it with the Svelte compiler
      const file = readFileSync(path, "utf8");
      const component = compile(file, {
        filename: path,
        varsReport: false,
        css: "injected", // TODO: external when Bun supports CSS loader?
      });

      // and return the compiled source code as "js"
      return {
        contents: component.js.code,
        loader: "js",
      };
    });
  },
} satisfies BunPlugin;
