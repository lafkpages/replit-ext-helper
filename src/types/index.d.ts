import type { ReplitSvelteComponents } from "./ui";

import type { NextRouter } from "next/router";

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
  waitForElement(query: string): Promise<Element>;

  get routeContainerElm(): HTMLDivElement;
}

export declare global {
  interface Window {
    replitExtHelper: ReplitExtHelper | undefined;
    next?: {
      router: NextRouter;
    };
  }
}
