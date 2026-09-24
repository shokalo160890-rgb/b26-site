/*
 * Production compatibility endpoint.
 *
 * The existing Nginx runtime injects this file into public HTML responses.
 * B26 site source remains authoritative; legacy CMS content mutation is
 * intentionally disabled, so this endpoint must remain side-effect free.
 */
(() => {
  "use strict";
})();
