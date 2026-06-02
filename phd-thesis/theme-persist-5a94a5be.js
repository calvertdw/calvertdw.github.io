/**
 * Site-wide mdBook theme preference: "auto" (system) or a named theme.
 *
 * file:// isolates localStorage per HTML file, so ?theme= on every internal
 * link is the cross-page source of truth. http(s) also uses localStorage when
 * the URL has no theme param.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "mdbook-theme";
  const URL_PARAM = "theme";
  const AUTO_VALUE = "auto";
  const THEME_CLASSES = ["light", "rust", "coal", "navy", "ayu"];

  function isFileProtocol() {
    return location.protocol === "file:";
  }

  function readSavedTheme() {
    try {
      let theme = localStorage.getItem(STORAGE_KEY);
      if (!theme) {
        return null;
      }
      if (theme.startsWith('"') && theme.endsWith('"')) {
        theme = theme.slice(1, theme.length - 1);
        localStorage.setItem(STORAGE_KEY, theme);
      }
      return THEME_CLASSES.includes(theme) ? theme : null;
    } catch {
      return null;
    }
  }

  function readUrlPreference() {
    const raw = new URLSearchParams(window.location.search).get(URL_PARAM);
    if (raw === AUTO_VALUE) {
      return AUTO_VALUE;
    }
    if (raw && THEME_CLASSES.includes(raw)) {
      return raw;
    }
    return null;
  }

  /** User's menu choice: auto or a named theme. */
  function resolvePreference() {
    const fromUrl = readUrlPreference();
    if (fromUrl) {
      return fromUrl;
    }
    if (!isFileProtocol()) {
      const saved = readSavedTheme();
      if (saved) {
        return saved;
      }
    }
    return AUTO_VALUE;
  }

  function systemDefaultTheme() {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      return typeof default_dark_theme !== "undefined" ? default_dark_theme : "navy";
    }
    return typeof default_light_theme !== "undefined" ? default_light_theme : "light";
  }

  /** Class applied to <html> for the current preference. */
  function resolveAppliedTheme() {
    const preference = resolvePreference();
    if (preference === AUTO_VALUE) {
      return systemDefaultTheme();
    }
    return preference;
  }

  function urlParamForPreference(preference) {
    if (preference === AUTO_VALUE) {
      return isFileProtocol() ? AUTO_VALUE : null;
    }
    return preference;
  }

  function applyTheme(theme) {
    const html = document.documentElement;
    for (const name of THEME_CLASSES) {
      html.classList.remove(name);
    }
    html.classList.add(theme);
    html.classList.add("js");
  }

  function relativeHrefWithPreference(href, preference) {
    try {
      const url = new URL(href, window.location.href);
      const param = urlParamForPreference(preference);
      if (param) {
        url.searchParams.set(URL_PARAM, param);
      } else {
        url.searchParams.delete(URL_PARAM);
      }
      const name = url.pathname.substring(url.pathname.lastIndexOf("/") + 1);
      return name + url.search + url.hash;
    } catch {
      return href;
    }
  }

  function isInternalPageLink(href) {
    if (!href) {
      return false;
    }
    const lower = href.toLowerCase();
    if (
      lower.startsWith("#")
      || lower.startsWith("http:")
      || lower.startsWith("https:")
      || lower.startsWith("mailto:")
      || lower.startsWith("javascript:")
    ) {
      return false;
    }
    return lower.endsWith(".html") || lower.includes(".html?");
  }

  function decorateLinks(preference) {
    const effective = preference === undefined ? resolvePreference() : preference;
    document.querySelectorAll("a[href]").forEach((anchor) => {
      const href = anchor.getAttribute("href");
      if (!isInternalPageLink(href)) {
        return;
      }
      anchor.setAttribute("href", relativeHrefWithPreference(href, effective));
    });
  }

  function syncLocationUrl(preference) {
    try {
      const url = new URL(window.location.href);
      const param = urlParamForPreference(preference);
      if (param) {
        url.searchParams.set(URL_PARAM, param);
      } else {
        url.searchParams.delete(URL_PARAM);
      }
      const leaf = url.pathname.substring(url.pathname.lastIndexOf("/") + 1);
      history.replaceState(null, "", leaf + url.search + url.hash);
    } catch {
      // replaceState can fail on some file:// viewers
    }
  }

  function syncLocalStorage(preference) {
    try {
      if (preference === AUTO_VALUE) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, preference);
      }
    } catch {
      // ignore
    }
  }

  function updateThemeMenuSelection() {
    const popup = document.getElementById("mdbook-theme-list");
    if (!popup) {
      return;
    }
    popup.querySelectorAll(".theme-selected").forEach((element) => {
      element.classList.remove("theme-selected");
    });
    const preference = resolvePreference();
    const buttonId =
      preference === AUTO_VALUE ? "mdbook-theme-default_theme" : `mdbook-theme-${preference}`;
    const button = document.getElementById(buttonId);
    if (button) {
      button.classList.add("theme-selected");
    }
  }

  function syncPage() {
    const preference = resolvePreference();
    syncLocalStorage(preference);
    applyTheme(resolveAppliedTheme());
    decorateLinks(preference);
    updateThemeMenuSelection();
  }

  function setPreference(preference) {
    syncLocalStorage(preference);
    syncLocationUrl(preference);
    applyTheme(preference === AUTO_VALUE ? systemDefaultTheme() : preference);
    decorateLinks(preference);
    updateThemeMenuSelection();
  }

  function onThemeMenuClick(event) {
    const button = event.target.closest("#mdbook-theme-list button.theme");
    if (!button) {
      return;
    }
    const choice = button.id.replace(/^mdbook-theme-/, "");
    if (choice === "default_theme") {
      setPreference(AUTO_VALUE);
      return;
    }
    if (THEME_CLASSES.includes(choice)) {
      setPreference(choice);
    }
  }

  function onLinkClick(event) {
    const anchor = event.target.closest("a[href]");
    if (!anchor) {
      return;
    }
    const href = anchor.getAttribute("href");
    if (!isInternalPageLink(href)) {
      return;
    }
    anchor.setAttribute("href", relativeHrefWithPreference(href, resolvePreference()));
  }

  let decorateScheduled = false;
  function scheduleDecorateLinks() {
    if (decorateScheduled) {
      return;
    }
    decorateScheduled = true;
    requestAnimationFrame(() => {
      decorateScheduled = false;
      decorateLinks(resolvePreference());
      updateThemeMenuSelection();
    });
  }

  function runAfterMdbook() {
    syncPage();
    requestAnimationFrame(syncPage);
  }

  runAfterMdbook();

  document.addEventListener("click", onThemeMenuClick, true);
  document.addEventListener("click", onLinkClick, true);

  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      syncPage();
    }
  });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      syncPage();
    }
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (resolvePreference() === AUTO_VALUE) {
      applyTheme(systemDefaultTheme());
    }
  });

  const observer = new MutationObserver(scheduleDecorateLinks);
  observer.observe(document.body, { childList: true, subtree: true });
})();
