import { getComponentNames } from "../ui";

import { expect, test } from "bun:test";

test("[ui] getComponentNames", async () => {
  const componentNames = await getComponentNames();

  expect(componentNames).toBeArray();
  expect(componentNames).not.toBeEmpty();
  expect(componentNames).toContain("Button");
});
