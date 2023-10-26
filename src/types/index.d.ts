import type { ReplitExtHelper } from "..";

import type { NextRouter } from "next/router";

export declare global {
  interface Window {
    replitExtHelper: ReplitExtHelper | undefined;
    next?: {
      router: NextRouter;
    };
  }
}
