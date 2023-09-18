// ==UserScript==
// @name         Replit extension helper
// @namespace    https://lafkpages.tech
// @version      0.1
// @description  Helper functions and classes for Replit extensions and userscripts
// @author       LuisAFK
// @match        https://replit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=replit.com
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  /**
   * Finds elements in the document and assigns them a class.
   *
   * @typedef {[
   *    string | string[],
   *    boolean,
   *    RegExp | null,
   *    ((elm: Element) => Element | null) | null
   * ]} AssignToQueryData
   *
   * @typedef {string | AssignToQueryData} AssignToQueryDataArg
   *
   * @param {string} query
   * A CSS query, passed to `document.querySelector` or `document.querySelectorAll`
   *
   * @param {AssignToQueryDataArg} _data
   */
  function assignToQuery(query, _data) {
    console.groupCollapsed("[assignToQuery]", query);

    /**
     * @type {AssignToQueryData}
     */
    const data = Array.isArray(_data) ? _data : [_data, false, null, null];

    const classNames = Array.isArray(data[0]) ? data[0] : [data[0]];
    const multiple = !!data[1];
    const textContentRegex = data[2] instanceof RegExp ? data[2] : null;
    const callback = data[3] instanceof Function ? data[3] : null;

    const elms = multiple
      ? Array.from(document.querySelectorAll(query))
      : [document.querySelector(query)];

    for (let elm of elms) {
      if (!elm) {
        continue;
      }

      console.debug(elm);

      if (textContentRegex) {
        if (!elm.textContent || !textContentRegex.test(elm.textContent)) {
          continue;
        }
      }

      if (callback) {
        elm = callback(elm);
      }

      if (!elm) {
        continue;
      }

      elm.classList.add(...classNames, "replit-classifier");
    }

    console.groupEnd();
  }

  /**
   * Calls `assignToQuery` with multiple queries and classes.
   * @param {Record<string, AssignToQueryDataArg>} obj
   */
  function assignToQueries(obj) {
    for (const [query, className] of Object.entries(obj)) {
      assignToQuery(query, className);
    }
  }

  function main() {
    assignToQueries({
      '[data-cy="avatar-dropdown-button"]': "avatar-dropdown-btn",
      '[data-cy="header-new-repl-btn"]': "new-repl-btn",
      button: ["new-repl-btn", true, /^\s*create\s+repl\s*$/i],
      nav: "sidebar",
      ".sidebar ul": "sidebar-links",
      ".sidebar .sidebar-links li a": ["sidebar-link", true],
      ".sidebar .sidebar-bottom ul": "sidebar-bottom-links",
      ".sidebar-bottom-links li a": ["sidebar-bottom-link", true],
      ".sidebar button": ["sidebar-help-btn", true, /^\s*help\s*$/i],
      header: "header",
      ".header .right > div": "header-right-btns",
      ".header .header-right-btns :nth-child(2) button": "notifications-btn",
      '.header div[role="combobox"] input': "header-search",
      '[data-cy="sidebar-toggle-btn"]': "sidebar-toggle-btn",
      '[data-cy="sidebar-new-repl-btn"]': "new-repl-btn",
      '[data-cy="sidebar-new-repl-btn"] ~ div button': "new-repl-more-btn",
      '[data-cy="preferences-theme-dropdown"]': "theme-select",
      '[data-cy="follow-button"]': "follow-btn",
      '[data-cy="feed-item-card"]': "feed-item",
      '[data-cy="repl-viewer-run-button"]': "run-repl-btn",
      "div ~ img": ["profile-avatar", false, null, (elm) => elm.parentElement],
      button: [
        "copy-profile-link-btn",
        true,
        /^\s*copy\s+(?:profile|user)\s+(?:link|url)\s*$/i,
      ],
      '[data-cy="filetree-add-file"]': "filetree-add-file-btn",
      '[data-cy="filetree-entity"]': ["filetree-file", true],
      ".invite-button": "invite-btn",
      ".invite-btn": [
        "deploy-btn",
        false,
        null,
        (elm) =>
          elm.parentElement.parentElement.parentElement.nextElementSibling.getElementsByTagName(
            "button"
          )[0],
      ],
      ".open-chat-button": "open-chat-btn",
      '[data-cy="ws-run-btn"] button': [["run-repl-btn", "ws-run-repl-btn"]],
      '[data-cy="sidebar-section-content-resources"], #sidebar-section-header-resources':
        "ws-repl-resources",
    });
  }

  window.addEventListener("load", () => {
    main();
  });

  // Expose API globally
  window.replitClassifier = {
    main,
  };
})();
