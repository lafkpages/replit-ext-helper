import type { ReplitExtHelper } from "..";

import type { NextRouter } from "next/router";

 declare global {
  interface Window {
    replitExtHelper: ReplitExtHelper | undefined;
    next?: {
      router: NextRouter;
    };
  }
}
