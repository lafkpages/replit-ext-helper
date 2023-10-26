[![codecov](https://codecov.io/gh/lafkpages/replit-ext-helper/graph/badge.svg?token=W1708PX42X)](https://codecov.io/gh/lafkpages/replit-ext-helper)

# Replit extensions helper

A helper utility for browser extensions and userscripts.

Note: not for [Replit extensions](https://docs.replit.com/extensions).

## API

A global `replitExtHelper` object is exposed. It's an object with the following properties.
It also extends `EventTarget` so you can listen to events on it.

Note that it may have more properties than listed here, but those are not part of the public API.

```ts
export class ReplitExtHelper extends EventTarget {
  debug: boolean;

  get isDesktop(): boolean;
  set isDesktop(value: true | null);

  replitSvelteComponents: Record<
    Exclude<ReplitSvelteComponents, "DocsProp">,
    any
  >;

  injectReplitSvelteStyles(): void;

  getElement(query: string): Element | null;
  getElements(query: string): Element[];
  waitForElement(query: string): Promise<Element>;

  get routeContainerElm(): HTMLDivElement;
}
```
