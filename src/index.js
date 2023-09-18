(function () {
  /**
   * @satisfies {AssignToQueryData}
   */
  const defaultAssignToQueryData = {
    classes: [],
    multiple: false,
    textContent: null,
    callback: null,
    desktopOnly: false,
  };

  /**
   * Finds elements in the document and assigns them a class.
   *
   * @typedef {{
   *    classes: string | string[],
   *    multiple: boolean,
   *    textContent: RegExp | null,
   *    callback: ((elm: Element) => Element | null) | null,
   *    desktopOnly: boolean,
   * }} AssignToQueryData
   *
   * @typedef {string | Partial<AssignToQueryData>} AssignToQueryDataArg
   *
   * @param {string} query
   * A CSS query, passed to `document.querySelector` or `document.querySelectorAll`
   *
   * @param {AssignToQueryDataArg} _data
   */
  function assignToQuery(query, _data) {
    if (api.debug) {
      console.groupCollapsed("[assignToQuery]", query);
    }

    /**
     * @type {AssignToQueryData}
     */
    const data =
      typeof _data == "string"
        ? {
            ...defaultAssignToQueryData,
            classes: _data,
          }
        : { ...defaultAssignToQueryData, ..._data };

    if (data.desktopOnly && !api.isDesktop) {
      if (api.debug) {
        console.debug("Skipping (desktop only)");
        console.groupEnd();
      }
      return;
    }

    const classNames = Array.isArray(data.classes)
      ? data.classes
      : [data.classes];

    const elms = data.multiple
      ? Array.from(document.querySelectorAll(query))
      : [document.querySelector(query)];

    for (let elm of elms) {
      if (!elm) {
        continue;
      }

      if (api.debug) {
        console.debug(elm);
      }

      if (data.textContent) {
        if (!elm.textContent || !data.textContent.test(elm.textContent)) {
          continue;
        }
      }

      if (data.callback) {
        elm = data.callback(elm);
      }

      if (!elm) {
        continue;
      }

      elm.classList.add(...classNames, "replit-ext-helper");
    }

    if (api.debug) {
      console.groupEnd();
    }
  }

  /**
   * Calls `assignToQuery` with multiple queries and classes.
   * @param {Record<string, AssignToQueryDataArg | AssignToQueryDataArg[]>} obj
   */
  function assignToQueries(obj) {
    for (const [query, data] of Object.entries(obj)) {
      if (Array.isArray(data)) {
        for (const d of data) {
          assignToQuery(query, d);
        }
      } else {
        assignToQuery(query, data);
      }
    }
  }

  function main() {
    assignToQueries({
      '[data-cy="avatar-dropdown-button"]': "avatar-dropdown-btn",
      '[data-cy="header-new-repl-btn"]': "new-repl-btn",
      button: [
        {
          classes: "new-repl-btn",
          multiple: true,
          textContent: /^\s*create\s+repl\s*$/i,
        },
        {
          classes: "copy-profile-link-btn",
          multiple: true,
          textContent: /^\s*copy\s+(?:profile|user)\s+(?:link|url)\s*$/i,
        },
      ],
      nav: "sidebar",
      ".sidebar ul": "sidebar-links",
      ".sidebar .sidebar-links li a": {
        classes: "sidebar-link",
        multiple: true,
      },
      ".sidebar .sidebar-bottom ul": "sidebar-bottom-links",
      ".sidebar-bottom-links li a": {
        classes: "sidebar-bottom-link",
        multiple: true,
      },
      ".sidebar button": {
        classes: "sidebar-help-btn",
        multiple: true,
        textContent: /^\s*help\s*$/i,
      },
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
      "div ~ img": {
        classes: "profile-avatar",
        callback: (elm) => elm.parentElement,
      },
      '[data-cy="filetree-add-file"]': "filetree-add-file-btn",
      '[data-cy="filetree-entity"]': {
        classes: "filetree-file",
        multiple: true,
      },
      ".invite-button": "invite-btn",
      ".invite-btn": {
        classes: "deploy-btn",
        callback: (elm) =>
          elm.parentElement?.parentElement?.parentElement?.nextElementSibling?.getElementsByTagName(
            "button"
          )[0] ?? null,
      },
      ".open-chat-button": "open-chat-btn",
      '[data-cy="ws-run-btn"] button': {
        classes: ["run-repl-btn", "ws-run-repl-btn"],
      },
      '[data-cy="sidebar-section-content-resources"], #sidebar-section-header-resources':
        "ws-repl-resources",
    });
  }

  window.addEventListener("load", () => {
    main();
  });

  const api = {
    main,
    debug: false,
    get isDesktop() {
      return (
        // @ts-expect-error - `replitDesktop` is not defined in the browser
        window.replitDesktop?.version?.length > 0
      );
    },
  };

  try {
    if (localStorage.getItem("replit-ext-helper-debug")) {
      api.debug = true;
    }
  } catch {}

  // Expose API globally
  Object.defineProperty(window, "replitExtHelper", {
    get: () => api,
  });
})();
