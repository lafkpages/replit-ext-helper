# Replit extensions helper

A helper utility for browser extensions and userscripts.

Note: not for [Replit extensions](https://docs.replit.com/extensions).

## API

A global `replitExtHelper` object is exposed. It's an object with the following properties.
It also extends `EventTarget` so you can listen to events on it.

```ts
export class ReplitExtHelper extends EventTarget {
  debug: boolean;

  /**
   * Wether to run `main` on page load.
   */
  runOnLoad: boolean;

  /**
   * Wether to run `main` on the Next.js Router's
   * `routeChangeComplete` event.
   */
  runOnRouteChange: boolean;

  get isDesktop(): boolean;
  set isDesktop(value: true | null);

  replitSvelteComponents: Record<
    Exclude<ReplitSvelteComponents, "DocsProp">,
    any
  >;

  main: () => void;
  injectReplitSvelteStyles(): void;

  getElement(query: string): Element | null;
  getElements(query: string): Element[];
}
```
