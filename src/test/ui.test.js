import { expect, test } from "bun:test";

import { mkdir, rm } from "fs/promises";

import { compileAllComponents } from "../ui";

test("[ui] compileAllComponents", async () => {
  await rm("test-results/ui", { recursive: true, force: true });
  await mkdir("test-results/ui", { recursive: true });

  const components = await compileAllComponents("test-results/ui");

  expect(components).toBeTruthy();
  expect(components.Button).toBeTruthy();
  expect(components.Button.js.code).toBeString();
});
