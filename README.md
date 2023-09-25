# Replit extensions helper

A helper utility for browser extensions and userscripts.

Note: not for [Replit extensions](https://docs.replit.com/extensions).

## API

A global `replitExtHelper` object is exposed. It's an object with the following properties:

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

  /**
   * Wether the Next.js Router's `routeChangeComplete`
   * event has been listened to.
   */
  get didHandleNextRouteChange(): boolean;

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
