export interface ReplitExtHelper {
  main: () => void;
  debug: boolean;

  /**
   * Wether to run `main` on page load.
   */
  runOnLoad: boolean;

  get isDesktop(): boolean;
  set isDesktop(value: true | null): void;
}

export declare global {
  var replitExtHelper: ReplitExtHelper | undefined;
}
