// import { expect, test } from "bun:test";

import { mkdir, rm } from "fs/promises";

import { compileAllComponents } from "../ui";

// test("compileComponent: Button", async () => {
//   expect(
//     await compileComponent("Button"),
//   );
// });

await rm("test-results/ui", { recursive: true, force: true });
await mkdir("test-results/ui", { recursive: true });
await compileAllComponents("test-results/ui");
