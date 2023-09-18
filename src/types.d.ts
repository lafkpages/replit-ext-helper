export interface ReplitExtHelper {
  main: () => void;
  debug: boolean;
}

export declare global {
  var replitExtHelper: ReplitExtHelper | undefined;
}
