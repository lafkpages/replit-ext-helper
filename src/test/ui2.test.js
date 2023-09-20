import { getComponentNames } from "../ui";

import { expect, test } from "bun:test";

test("[ui] getComponentNames", async () => {
  const componentNames = await getComponentNames();

  expect(componentNames).toBeArray();
  expect(componentNames).not.toBeEmpty();
  expect(componentNames).toContain("Button");
});

test("[ui] getComponentNames (peek)", async () => {
  // Since getComponentNames gets cached after the first call, we can
  // test the peek functionality by calling it twice.

  const componentNamesPromise = getComponentNames();
  const componentNamesPeek = Bun.peek(componentNamesPromise);

  expect(componentNamesPeek).toBeArray();
  expect(componentNamesPeek).not.toBeEmpty();
  expect(componentNamesPeek).toContain("Button");
}, 1);
