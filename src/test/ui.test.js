// import { expect, test } from "bun:test";

import { mkdir } from "fs/promises";

import { compileComponent } from "../ui";

// test("compileComponent: Button", async () => {
//   expect(
//     await compileComponent("Button"),
//   );
// });

const Button = await compileComponent("Button");

await mkdir("test-results/ui", { recursive: true });
await Bun.write("test-results/ui/Button.js", Button.js.code);
