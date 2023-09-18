interface ReplitExtHelper {
  main: () => void;
  debug: boolean;
}

declare global {
  var replitExtHelper: ReplitExtHelper | undefined;
}
