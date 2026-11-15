(() => {
  "use strict";

  const KEY = "b26.analytics.consent.v1";
  const EVENTS = new Set([
    "page_view",
    "hero_cta_click",
    "service_view",
    "form_start",
    "form_submit",
    "form_success",
    "form_error",
    "messenger_click"
  ]);

  let enabled = false;
  let consent = null;

  function getConsent() {
    try {
      return localStorage.getItem(KEY);
    } catch {
      return null;
    }
  }

  function setConsent(value) {
    consent = value;
    try {
      localStorage.setItem(KEY, value);
    } catch {}
  }

  function track(name) {
    if (!enabled || consent !== "accepted" || !EVENTS.has(name)) {
      return;
    }

    const query = new URLSearchParams(location.search);

    const payload = {
      event: name,
      page: location.pathname.slice(0, 300),
      language: (document.documentElement.lang || "ru").slice(0, 16),
      device_class: matchMedia("(max-width:767px)").matches
        ? "mobile"
        : "desktop"
    };

    for (const key of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term"
    ]) {
      const value = query.get(key);
      if (value) payload[key] = value.slice(0, 100);
    }

    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "omit",
      cache: "no-store",
      keepalive: true
    }).catch(() => {});
  }

  window.addEventListener("b26:analytics", event => {
    if (event.detail && typeof event.detail.event === "string") {
      track(event.detail.event);
    }
  });

  function createButton(label, callback) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", callback);
    button.style.cssText =
      "padding:10px 14px;cursor:pointer;border-radius:8px;" +
      "border:1px solid #64748b;background:#fff;color:#111827";
    return button;
  }

  function showConsent() {
    if (!enabled) return;

    document.getElementById("b26-consent")?.remove();

    const panel = document.createElement("section");
    panel.id = "b26-consent";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Настройки аналитики");

    panel.style.cssText =
      "position:fixed;bottom:16px;left:16px;right:16px;" +
      "z-index:99999;max-width:540px;margin:auto;padding:18px;" +
      "background:white;color:#111827;border-radius:12px;" +
      "box-shadow:0 8px 30px #0004;font:14px system-ui";

    const text = document.createElement("p");
    text.textContent =
      "Разрешить необязательную аналитику посещений B26? " +
      "Отказ не ограничивает работу сайта.";

    function choose(value) {
      setConsent(value);
      panel.remove();
      if (value === "accepted") track("page_view");
    }

    panel.append(
      text,
      createButton("Отказаться", () => choose("declined")),
      createButton("Разрешить", () => choose("accepted"))
    );

    document.body.appendChild(panel);
  }

  async function initialize() {
    let configuration;

    try {
      const response = await fetch("/api/analytics/config", {
        credentials: "omit",
        cache: "no-store"
      });

      if (!response.ok) return;
      configuration = await response.json();
    } catch {
      return;
    }

    if (configuration?.enabled !== true) return;

    enabled = true;
    consent = getConsent();

    const settings = createButton(
      "Настройки аналитики",
      showConsent
    );

    settings.id = "b26-analytics-settings";

    (document.querySelector("footer") || document.body)
      .appendChild(settings);

    if (consent === "accepted") {
      track("page_view");
    } else if (consent === null) {
      showConsent();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialize,
      { once: true }
    );
  } else {
    initialize();
  }
})();
