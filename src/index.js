/// <reference lib="dom" />

// TODO: glob import?

// Avatar, Button, Card, Checkbox, ConditionalParent, CreateReplModal, DocsProp, FileInput, Files, IconButton, Input, Modal, ModalProvider, Pill, Profile, SearchBar, Select, Sidebar, StatusBanner, Tabs, ToastProvider
import Avatar from "@replit-svelte/ui/Avatar.svelte";
import Button from "@replit-svelte/ui/Button.svelte";
import Card from "@replit-svelte/ui/Card.svelte";
import Checkbox from "@replit-svelte/ui/Checkbox.svelte";
import ConditionalParent from "@replit-svelte/ui/ConditionalParent.svelte";
import CreateReplModal from "@replit-svelte/ui/CreateReplModal.svelte";
// import DocsProp from "@replit-svelte/ui/DocsProp.svelte";
import FileInput from "@replit-svelte/ui/FileInput.svelte";
import Files from "@replit-svelte/ui/Files.svelte";
import IconButton from "@replit-svelte/ui/IconButton.svelte";
import Input from "@replit-svelte/ui/Input.svelte";
import Modal from "@replit-svelte/ui/Modal.svelte";
import ModalProvider from "@replit-svelte/ui/ModalProvider.svelte";
import Pill from "@replit-svelte/ui/Pill.svelte";
import Profile from "@replit-svelte/ui/Profile.svelte";
import SearchBar from "@replit-svelte/ui/SearchBar.svelte";
import Select from "@replit-svelte/ui/Select.svelte";
import Sidebar from "@replit-svelte/ui/Sidebar.svelte";
import StatusBanner from "@replit-svelte/ui/StatusBanner.svelte";
import Tabs from "@replit-svelte/ui/Tabs.svelte";
import ToastProvider from "@replit-svelte/ui/ToastProvider.svelte";

// Import global Replit Svelte styles
import globalReplitSvelteStyles from "@replit-svelte/ui/index.css";

(function () {
  /**
   * @typedef {{
   *    classes: string | string[],
   *    multiple: boolean,
   *    textContent: RegExp | null,
   *    callback: ((elm: Element) => Element | null) | null,
   *    desktopOnly: boolean,
   * }} AssignToQueryData
   *
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
   * @satisfies {import('./types').ReplitExtHelper}
   */
  const api = new (class ReplitExtHelper extends EventTarget {
    constructor() {
      super();

      this.debug = false;

      this.replitSvelteComponents = {
        Avatar,
        Button,
        Card,
        Checkbox,
        ConditionalParent,
        CreateReplModal,
        // DocsProp,
        FileInput,
        Files,
        IconButton,
        Input,
        Modal,
        ModalProvider,
        Pill,
        Profile,
        SearchBar,
        Select,
        Sidebar,
        StatusBanner,
        Tabs,
        ToastProvider,
      };

      /**
       * @private
       */
      this._forceDesktop = false;

      try {
        if (localStorage.getItem("replit-ext-helper-debug")) {
          this.debug = true;
        }
      } catch {}

      /**
       * @typedef {(string | {
       *  query?: string,
       *  init?: string,
       *  textContent?: RegExp | null,
       *  callback?: ((elm: Element) => Element | null) | null,
       *  desktopOnly?: boolean,
       * })[]} Query
       * @type {Record<string, Query>}
       * @private
       */
      this._queries = {
        "avatar-dropdown-btn": ['[data-cy="avatar-dropdown-button"]'],
        "new-repl-btn": [
          '[data-cy="header-new-repl-btn"]',
          {
            query: "button",
            textContent: /^\s*create\s+repl\s*$/i,
          },
          '[data-cy="sidebar-new-repl-btn"]',
        ],
        "copy-profile-link-btn": [
          {
            query: "button",
            textContent: /^\s*copy\s+(?:profile|user)\s+(?:link|url)\s*$/i,
          },
        ],
        sidebar: ["nav"],
        "sidebar-links": [{ init: "sidebar", query: "ul" }],
        "sidebar-link": [{ init: "sidebar", query: "ul li a" }],
        "sidebar-bottom-links": [
          { init: "sidebar", query: ".sidebar-bottom ul" },
        ],
        "sidebar-bottom-link": [
          {
            init: "sidebar-bottom-links",
            query: "li a",
          },
        ],
        "sidebar-help-btn": [
          {
            init: "sidebar",
            query: "button",
            textContent: /^\s*help\s*$/i,
          },
        ],
        header: ["header"],
        "header-right-btns": [{ init: "header", query: ".right > div" }],
        "notifications-btn": [
          {
            init: "header-right-btns",
            query: ":nth-child(2) button",
          },
        ],
        "header-search": ['.header div[role="combobox"] input'],
        "sidebar-toggle-btn": ['[data-cy="sidebar-toggle-btn"]'],
        "new-repl-more-btn": ['[data-cy="sidebar-new-repl-btn"] ~ div button'],
        "theme-select": ['[data-cy="preferences-theme-dropdown"]'],
        "follow-btn": ['[data-cy="follow-button"]'],
        "feed-item": ['[data-cy="feed-item-card"]'],
        "run-repl-btn": [
          '[data-cy="repl-viewer-run-button"], [data-cy="ws-run-btn"] button',
        ],
        "profile-avatar": [
          { query: "div ~ img", callback: (elm) => elm.parentElement },
        ],
        "filetree-add-file-btn": ['[data-cy="filetree-add-file"]'],
        "filetree-file": ['[data-cy="filetree-entity"]'],
        "invite-btn": [".invite-button"],
        "deploy-btn": [
          {
            init: "invite-btn",
            callback: (elm) =>
              elm.parentElement?.parentElement?.parentElement?.nextElementSibling?.getElementsByTagName(
                "button"
              )[0] ?? null,
          },
        ],
        "open-chat-btn": [".open-chat-button"],
        "ws-run-repl-btn": ['[data-cy="ws-run-btn"] button'],
        "ws-repl-resources": [
          '[data-cy="sidebar-section-content-resources"], #sidebar-section-header-resources',
        ],
        "ws-repl-info-container": ['[data-cy="ws-repl-info-container"]'],
        "replit-desktop": [{ query: "body", desktopOnly: true }],
        "desktop-home-ws-pane": [{ query: "header ~ div", desktopOnly: true }],
        "desktop-home-ws-pane-header": [
          {
            init: "desktop-home-ws-pane",
            callback: (elm) => elm.firstElementChild?.firstElementChild ?? null,
            desktopOnly: true,
          },
        ],
        "desktop-home-ws-pane-content": [
          {
            init: "desktop-home-ws-pane-header",
            callback: (elm) => elm.nextElementSibling,
            desktopOnly: true,
          },
        ],
        "desktop-home-content": [
          {
            init: "desktop-home-ws-pane-content",
            query: "div div div:nth-child(2)",
            desktopOnly: true,
          },
        ],
        "repl-tips-container": ["#tips"],
        modal: ['body > div > div[role="dialog"]'],
        "modal-submit-btn": ['.modal button[type="submit"]'],
      };
    }

    /**
     * @returns {boolean}
     */
    get isDesktop() {
      return (
        this._forceDesktop ||
        // @ts-expect-error - `replitDesktop` is not defined in the browser
        window.replitDesktop?.version?.length > 0
      );
    }

    /**
     * @param {true | null} value
     */
    set isDesktop(value) {
      if (value === true) {
        this._forceDesktop = true;
      } else if (value === null) {
        this._forceDesktop = false;
      } else {
        throw new TypeError("isDesktop can only be set to true or null");
      }
    }

    injectReplitSvelteStyles() {
      this.dispatchEvent(new CustomEvent("beforeinjectreplitsveltestyles"));

      // Check if the styles have already been injected
      if (
        document.body.dataset.replitExtHelperReplitSvelteStylesInjected == "1"
      ) {
        return;
      }

      // Inject the styles
      const style = document.createElement("style");
      style.textContent = globalReplitSvelteStyles;
      document.head.appendChild(style);

      // Mark the styles as injected
      document.body.dataset.replitExtHelperReplitSvelteStylesInjected = "1";

      this.dispatchEvent(new CustomEvent("injectreplitsveltestyles"));
    }

    /**
     * @param {string} query
     * @returns {Element | null}
     */
    getElement(query) {
      return this.getElements(query)[0] ?? null;
    }

    /**
     * @param {string} query
     * @returns {Element[]}
     */
    getElements(query) {
      if (!this._queries[query]) {
        return [];
      }

      /**
       * @type {Element[]}
       */
      const elms = [];

      for (const rawQuery of this._queries[query]) {
        const query =
          typeof rawQuery == "string" ? { query: rawQuery } : rawQuery;

        if (query.desktopOnly && !this.isDesktop) {
          continue;
        }

        const initElm = query.init
          ? this.getElement(query.init)
          : document.documentElement;

        if (!initElm) {
          continue;
        }

        const currentElms = query.query
          ? Array.from(initElm.querySelectorAll(query.query))
          : [initElm];

        for (let elm of currentElms) {
          if (query.textContent) {
            if (!elm.textContent || !query.textContent.test(elm.textContent)) {
              continue;
            }
          }

          if (query.callback) {
            const newElm = query.callback(elm);
            if (!newElm) {
              continue;
            }
            elm = newElm;
          }

          elms.push(elm);
        }
      }

      return elms;
    }

    /**
     * @param {string} query
     * @returns {Promise<Element>}
     */
    waitForElement(query) {
      return new Promise((resolve) => {
        const initialElm = this.getElement(query);
        if (initialElm) {
          return resolve(initialElm);
        }

        const observer = new MutationObserver(() => {
          const elm = this.getElement(query);
          if (elm) {
            observer.disconnect();
            resolve(elm);
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
      });
    }

    get routeContainerElm() {
      const elm = document.getElementById("__next")?.children[0];
      if (!(elm instanceof HTMLDivElement)) {
        throw new Error("Could not find route container element");
      }
      return elm;
    }
  })();

  // Expose API globally
  Object.defineProperty(window, "replitExtHelper", {
    get: () => api,
    set: () => {
      console.warn("replitExtHelper is read-only");
    },
  });
})();
