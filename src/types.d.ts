export interface ReplitExtHelper {
  main: () => void;
  debug: boolean;
  get isDesktop(): boolean;
}

export declare global {
  var replitExtHelper: ReplitExtHelper | undefined;
}
