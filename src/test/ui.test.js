// import { expect, test } from "bun:test";

import { mkdir } from "fs/promises";

import { compileAllComponents } from "../ui";

// test("compileComponent: Button", async () => {
//   expect(
//     await compileComponent("Button"),
//   );
// });

await mkdir("test-results/ui", { recursive: true });
await compileAllComponents("test-results/ui");
