import type { ReplitSvelteComponents } from "./ui";

export interface ReplitExtHelper {
  main: () => void;
  debug: boolean;

  /**
   * Wether to run `main` on page load.
   */
  runOnLoad: boolean;

  get isDesktop(): boolean;
  set isDesktop(value: true | null);

  replitSvelteComponents: Record<
    Exclude<ReplitSvelteComponents, "DocsProp">,
    any
  >;
}

export declare global {
  var replitExtHelper: ReplitExtHelper | undefined;
}
