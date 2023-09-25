import type { ReplitSvelteComponents } from "./ui";

import type { NextRouter } from "next/router";

export interface ReplitExtHelper {
  main: () => void;
  debug: boolean;

  /**
   * Wether to run `main` on page load.
   */
  runOnLoad: boolean;

  /**
   * Wether to run `main` on the Next.js Router's
   * `routeChangeComplete` event.
   */
  runOnRouteChange: true;

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

  injectReplitSvelteStyles(): void;
}

export declare global {
  var replitExtHelper: ReplitExtHelper | undefined;
  var next:
    | {
        router: NextRouter;
      }
    | undefined;
}
