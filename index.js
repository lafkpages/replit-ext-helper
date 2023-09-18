// ==UserScript==
// @name         Replit classifier
// @namespace    https://lafkpages.tech
// @version      0.1
// @description  Assigns classes to elements on the Replit page. Useful for extensions.
// @author       LuisAFK
// @match        https://replit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=replit.com
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  //const realFetch = fetch;
  //fetch = function () {
  //  console.debug('Fetch', arguments);
  //  return realFetch.call(this, ...arguments);
  //};

  function assignToQuery(query, data) {
    data = Array.isArray(data) ? data : [data];

    const className = data[0];
    const multiple = !!data[1];
    const textContentRegex = data[2] instanceof RegExp ? data[2] : null;

    const elms = multiple
      ? document.querySelectorAll(query)
      : [document.querySelector(query)];

    for (const elm of elms) {
      if (!elm) {
        continue;
      }

      if (textContentRegex) {
        if (!textContentRegex.test(elm.textContent)) {
          continue;
        }
      }

      elm.classList.add(className, "replit-classifier");
    }
  }

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
      header: "header",
      ".header .right > div": "header-right-btns",
      ".header .header-right-btns :nth-child(2) button": "notifications-btn",
      '[data-cy="sidebar-toggle-btn"]': "sidebar-toggle-btn",
      '[data-cy="sidebar-new-repl-btn"]': "new-repl-btn",
      '[data-cy="preferences-theme-dropdown"]': "theme-select",
      '[data-cy="follow-button"]': "follow-btn",
      '[data-cy="feed-item-card"]': "feed-item",
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
