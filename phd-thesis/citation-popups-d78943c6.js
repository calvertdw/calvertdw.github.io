(function () {
  "use strict";

  const data = window.THESIS_CITATIONS || {};
  if (!Object.keys(data).length) {
    return;
  }

  let tooltip = null;
  let activeLink = null;

  function refKeyFromHref(href) {
    const match = href.match(/#ref-([^?#]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  function ensureTooltip() {
    if (tooltip) {
      return tooltip;
    }
    tooltip = document.createElement("div");
    tooltip.className = "citation-popup";
    tooltip.setAttribute("role", "tooltip");
    tooltip.hidden = true;
    document.body.appendChild(tooltip);
    return tooltip;
  }

  function hideTooltip() {
    if (!tooltip) {
      return;
    }
    tooltip.hidden = true;
    tooltip.innerHTML = "";
    activeLink = null;
  }

  function positionTooltip(link) {
    const tip = ensureTooltip();
    tip.hidden = false;

    const margin = 8;
    const linkRect = link.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();

    let left = linkRect.left;
    let top = linkRect.bottom + margin;

    if (left + tipRect.width > window.innerWidth - margin) {
      left = window.innerWidth - tipRect.width - margin;
    }
    if (left < margin) {
      left = margin;
    }
    if (top + tipRect.height > window.innerHeight - margin) {
      top = linkRect.top - tipRect.height - margin;
    }

    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
  }

  function showTooltip(link) {
    const key = refKeyFromHref(link.getAttribute("href") || "");
    const html = key && data[key];
    if (!html) {
      return;
    }

    activeLink = link;
    ensureTooltip().innerHTML = html;
    positionTooltip(link);
  }

  document.addEventListener(
    "mouseover",
    (event) => {
      const link = event.target.closest("a.citation-ref");
      if (link) {
        if (link !== activeLink) {
          showTooltip(link);
        }
        return;
      }
      if (activeLink && !event.target.closest(".citation-popup")) {
        hideTooltip();
      }
    },
    true
  );

  document.addEventListener(
    "scroll",
    () => {
      if (activeLink) {
        positionTooltip(activeLink);
      }
    },
    true
  );

  window.addEventListener("resize", () => {
    if (activeLink) {
      positionTooltip(activeLink);
    }
  });
})();
