(() => {
  const normalizeHost = (host) =>
    host.replace(/^www\./i, "").toLowerCase();

  const siteHost = normalizeHost(window.location.hostname);

  const isExternal = (a) => {
    if (!a || !a.href) return false;

    const href = a.getAttribute("href") || "";

    if (
      href.startsWith("#") ||
      href.startsWith("javascript:") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) return false;

    let url;
    try {
      url = new URL(a.href, window.location.href);
    } catch {
      return false;
    }

    if (url.protocol !== "http:" && url.protocol !== "https:") return false;

    const linkHost = normalizeHost(url.hostname);

    // Treat apex + www as internal
    return linkHost !== siteHost;
  };

  const markExternal = (a) => {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.classList.add("external-link");

    if (!a.getAttribute("aria-label")) {
      const text = (a.textContent || "").trim() || "External link";
      a.setAttribute("aria-label", `${text} (opens in a new tab)`);
    }
  };

  const apply = () => {
    document.querySelectorAll("a[href]").forEach((a) => {
      if (isExternal(a)) markExternal(a);
    });
  };

  apply();
  window.addEventListener("load", apply);
})();
