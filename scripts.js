
const SITE_CONFIG = {
  telegram: "https://t.me/shokalo160890",
  whatsapp: "https://wa.me/?text=" + encodeURIComponent("Здравствуйте, хочу заказать цифровую инфраструктуру для бизнеса"),
  email: "b26online@gmail.com"
};

const B26_ANALYTICS_EVENTS = Object.freeze([
  "page_view",
  "hero_cta_click",
  "service_view",
  "portfolio_case_click",
  "form_start",
  "form_submit",
  "form_success",
  "form_error",
  "email_click",
  "messenger_click"
]);

function trackB26Event(name, detail = {}) {
  if (!B26_ANALYTICS_EVENTS.includes(name)) return;

  const payload = {
    event: name,
    page: window.location.pathname,
    ...detail
  };

  // Privacy-safe integration hook. No third-party tracker is loaded here.
  window.dispatchEvent(new CustomEvent("b26:analytics", { detail: payload }));
  if (Array.isArray(window.dataLayer)) window.dataLayer.push(payload);
}

window.B26_ANALYTICS_EVENTS = B26_ANALYTICS_EVENTS;
window.b26Track = trackB26Event;

const NAV_DICT = {
  ru: {
    nav_home: "Главная",
    nav_examples: "Примеры",
    nav_services: "Комплект",
    nav_articles: "Статьи",
    nav_about: "Обо мне",
    nav_contact: "Обсудить проект",
    theme_dark: "Тёмная",
    theme_light: "Светлая",
    email_subject: "Заявка на цифровую инфраструктуру"
  },
  en: {
    nav_home: "Home",
    nav_examples: "Examples",
    nav_services: "Services",
    nav_articles: "Articles",
    nav_about: "About",
    nav_contact: "Contact",
    theme_dark: "Dark",
    theme_light: "Light",
    email_subject: "Digital infrastructure request"
  },
  de: {
    nav_home: "Start",
    nav_examples: "Beispiele",
    nav_services: "Leistungen",
    nav_articles: "Artikel",
    nav_about: "Über mich",
    nav_contact: "Kontakt",
    theme_dark: "Dunkel",
    theme_light: "Hell",
    email_subject: "Anfrage für digitale Infrastruktur"
  }
};

function getBrowserLang() {
  const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "ru"];
  for (const raw of langs) {
    const lang = String(raw).toLowerCase().slice(0, 2);
    if (["ru", "en", "de"].includes(lang)) return lang;
  }
  return "ru";
}

function applyNavLanguage() { return; }

function wireLinks() {
  document.querySelectorAll("[data-link-key]").forEach((a) => {
    const key = a.dataset.linkKey;

    if (key === "email") {
      const subject = NAV_DICT[getBrowserLang()]?.email_subject || NAV_DICT.ru.email_subject;
      a.href = "mailto:" + SITE_CONFIG.email + "?subject=" + encodeURIComponent(subject);
      a.style.display = "";
    }

    if (key === "telegram") {
      a.href = SITE_CONFIG.telegram;
      a.style.display = "";
    }

    if (key === "whatsapp") {
      a.href = SITE_CONFIG.whatsapp;
      a.style.display = "";
    }
  });

  document.querySelectorAll("a").forEach((a) => {
    const txt = (a.textContent || "").trim().toLowerCase();
    if (["contact", "kontakt", "обсудить проект", "заказать цифровую систему", "order digital system"].includes(txt)) {
      a.href = "contact.html";
      a.removeAttribute("data-link-key");
      a.style.pointerEvents = "auto";
    }
  });
}

function applyTheme(mode) {
  document.body.classList.toggle("light-theme", mode === "light");
  localStorage.setItem("b26_theme", mode);
  applyNavLanguage();
}

function initTheme() {
  const saved = localStorage.getItem("b26_theme");
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(saved === "light" || saved === "dark" ? saved : (prefersLight ? "light" : "dark"));

  document.querySelectorAll(".clean-theme-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyTheme(document.body.classList.contains("light-theme") ? "dark" : "light");
    });
  });
}

function initFloatingContact() {
  document.querySelectorAll(".floating-contact-widget").forEach((widget) => {
    const btn = widget.querySelector(".floating-contact-btn");
    const menu = widget.querySelector(".floating-contact-menu");
    if (!btn || !menu) return;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      widget.classList.toggle("active");
      menu.setAttribute("aria-hidden", widget.classList.contains("active") ? "false" : "true");
    });
  });

  document.addEventListener("click", (e) => {
    document.querySelectorAll(".floating-contact-widget").forEach((widget) => {
      if (!widget.contains(e.target)) widget.classList.remove("active");
    });
  });
}

async function sendMailForm(e) {
  e.preventDefault();

  const form = e.target;
  const status = form.querySelector("[data-form-status]");
  if (!form.checkValidity()) {
    form.reportValidity();
    trackB26Event("form_error", { reason: "client_validation" });
    return false;
  }

  const fd = new FormData(form);
  const lang = getBrowserLang();
  const subject = NAV_DICT[lang]?.email_subject || NAV_DICT.ru.email_subject;

  const fields = Object.fromEntries(
    Array.from(fd.entries(), ([key, value]) => [key, String(value).trim()])
  );

  trackB26Event("form_submit", { delivery: form.dataset.endpoint ? "post" : "mailto" });

  if (form.dataset.endpoint) {
    if (status) status.textContent = "Отправляем заявку…";
    try {
      const response = await fetch(form.dataset.endpoint, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(fields)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (status) status.textContent = "Заявка отправлена. Спасибо — следующий шаг придёт по указанному контакту.";
      trackB26Event("form_success");
      form.reset();
    } catch (error) {
      if (status) status.textContent = "Автоматическая отправка не выполнена. Используйте Email, Telegram или WhatsApp.";
      trackB26Event("form_error", { reason: "delivery" });
    }
    return false;
  }

  const body = [
    "Имя: " + fields.name,
    "Email: " + fields.email,
    "Ниша / деятельность: " + fields.business,
    "Ссылка: " + fields.link,
    "",
    "Что нужно собрать:",
    fields.message
  ].join("\n");

  if (status) status.textContent = "Открываем почтовое приложение. Заявка будет отправлена только после вашего подтверждения.";
  location.href = "mailto:" + SITE_CONFIG.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  return false;
}

function initAnalyticsHooks() {
  trackB26Event("page_view");
  if (window.location.pathname.endsWith("/services.html")) trackB26Event("service_view");

  let formStarted = false;
  document.querySelector(".b26-request-form-v15")?.addEventListener("focusin", () => {
    if (formStarted) return;
    formStarted = true;
    trackB26Event("form_start");
  });

  document.querySelector(".b26-request-form-v15")?.addEventListener("invalid", () => {
    trackB26Event("form_error", { reason: "client_validation" });
  }, true);

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    const href = link.getAttribute("href") || "";
    if (link.dataset.analytics === "hero_cta_click") trackB26Event("hero_cta_click");
    if (link.closest(".b26-case-v14")) trackB26Event("portfolio_case_click", { href });
    if (href.startsWith("mailto:")) trackB26Event("email_click");
    if (href.includes("t.me/") || href.includes("wa.me/")) trackB26Event("messenger_click", { channel: href.includes("t.me/") ? "telegram" : "whatsapp" });
  });
}

function initReveal() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((item) => {
      if (item.isIntersecting) {
        item.target.classList.add("visible");
        io.unobserve(item.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}

function initPremiumHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let scheduled = false;
  const update = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 28);
    scheduled = false;
  };

  update();
  window.addEventListener("scroll", () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(update);
  }, { passive: true });
}

function initCardSpotlights() {
  const finePointer = window.matchMedia?.("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  if (!finePointer?.matches || reducedMotion?.matches) return;

  const selector = [
    ".info-card",
    ".service-card",
    ".b26-case-v14",
    ".b26-pain-grid article",
    ".contact-clean-card"
  ].join(",");

  document.querySelectorAll(selector).forEach((card) => card.classList.add("premium-spotlight"));

  document.addEventListener("pointermove", (event) => {
    const card = event.target.closest?.(".premium-spotlight");
    if (!card) return;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
  }, { passive: true });
}

function initHeroCubeInteraction() {
  const scene = document.querySelector(".b26-cube-scene");
  if (!scene) return;

  const finePointer = window.matchMedia?.("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  if (!finePointer?.matches || reducedMotion?.matches) return;

  scene.addEventListener("pointermove", (event) => {
    const bounds = scene.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 6;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -6;
    scene.style.setProperty("--cube-pointer-x", `${x.toFixed(2)}deg`);
    scene.style.setProperty("--cube-pointer-y", `${y.toFixed(2)}deg`);
  }, { passive: true });

  scene.addEventListener("pointerleave", () => {
    scene.style.removeProperty("--cube-pointer-x");
    scene.style.removeProperty("--cube-pointer-y");
  });
}

function getEffectsProfile() {
  return {
    reduced: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    finePointer: window.matchMedia?.("(hover: hover) and (pointer: fine)").matches ?? false,
    desktop: window.matchMedia?.("(min-width: 1025px)").matches ?? false
  };
}

function initEffectsSurface() {
  const { reduced } = getEffectsProfile();
  document.documentElement.classList.add("b26-effects-v2");

  const ambient = document.createElement("div");
  ambient.className = "b26-ambient-v2";
  ambient.setAttribute("aria-hidden", "true");
  ambient.innerHTML = '<span class="b26-ambient-glow b26-ambient-glow-a"></span><span class="b26-ambient-glow b26-ambient-glow-b"></span><span class="b26-light-travel"></span>';

  if (!reduced && window.innerWidth > 768) {
    const particles = document.createElement("span");
    particles.className = "b26-particles";
    for (let index = 0; index < 18; index += 1) {
      const particle = document.createElement("i");
      particle.style.setProperty("--particle-x", `${(index * 37) % 100}%`);
      particle.style.setProperty("--particle-y", `${(index * 61) % 96}%`);
      particle.style.setProperty("--particle-delay", `${-(index % 9) * 1.7}s`);
      particle.style.setProperty("--particle-duration", `${18 + (index % 7) * 3}s`);
      particles.appendChild(particle);
    }
    ambient.appendChild(particles);
  }
  document.body.prepend(ambient);

  const spotlight = document.createElement("div");
  spotlight.className = "b26-global-spotlight";
  spotlight.setAttribute("aria-hidden", "true");
  document.body.appendChild(spotlight);
}

function initEffectTargets() {
  const cardSelector = [
    ".info-card", ".service-card", ".b26-case-v14", ".case-card",
    ".b26-pain-grid article", ".process-grid > article", ".premium-process .cards > article"
  ].join(",");
  const cards = Array.from(document.querySelectorAll(cardSelector));
  cards.forEach((card, index) => {
    card.classList.add("b26-tilt-card", "premium-spotlight");
    if (index < 6) card.classList.add("b26-effect-key");
  });

  document.querySelectorAll(".btn-primary-custom, .nav-cta, .nav-cta-btn, .cta:not(.secondary)").forEach((button) => {
    button.classList.add("b26-magnetic-cta");
    if (button.querySelector(":scope > .b26-cta-content")) return;
    const content = document.createElement("span");
    content.className = "b26-cta-content";
    while (button.firstChild) content.appendChild(button.firstChild);
    button.appendChild(content);
  });

  document.querySelectorAll("h1, .section-heading h2, .premium-process main > section > h2, .premium-infrastructure main h2").forEach((heading) => {
    heading.classList.add("b26-heading-reveal");
  });

  const scene = document.querySelector(".b26-cube-scene");
  if (scene && !scene.querySelector(".b26-cube-core")) {
    scene.insertAdjacentHTML("beforeend", `
      <span class="b26-cube-core"></span>
      <span class="b26-cube-link b26-cube-link-a"></span>
      <span class="b26-cube-link b26-cube-link-b"></span>
      <span class="b26-system-chip b26-system-chip-a">BUILD</span>
      <span class="b26-system-chip b26-system-chip-b">QA</span>
      <span class="b26-system-chip b26-system-chip-c">DELIVERY</span>
    `);
  }
}

function initGlobalPointer() {
  const profile = getEffectsProfile();
  if (!profile.finePointer || !profile.desktop || profile.reduced) return;

  const root = document.documentElement;
  const scene = document.querySelector(".b26-cube-scene");
  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let activeCard = null;
  let activeCta = null;
  let frame = 0;

  const resetCard = (card) => {
    if (!card) return;
    card.style.removeProperty("--tilt-x");
    card.style.removeProperty("--tilt-y");
  };
  const resetCta = (cta) => {
    if (!cta) return;
    cta.style.removeProperty("--magnetic-x");
    cta.style.removeProperty("--magnetic-y");
  };

  const render = () => {
    frame = 0;
    root.style.setProperty("--mouse-x", `${pointerX}px`);
    root.style.setProperty("--mouse-y", `${pointerY}px`);
    const normalizedX = (pointerX / window.innerWidth) - 0.5;
    const normalizedY = (pointerY / window.innerHeight) - 0.5;
    root.style.setProperty("--parallax-x", normalizedX.toFixed(3));
    root.style.setProperty("--parallax-y", normalizedY.toFixed(3));
    root.style.setProperty("--parallax-bg-x", `${(normalizedX * 5).toFixed(2)}px`);
    root.style.setProperty("--parallax-bg-x-neg", `${(normalizedX * -4).toFixed(2)}px`);

    if (activeCard) {
      const rect = activeCard.getBoundingClientRect();
      const localX = Math.max(0, Math.min(rect.width, pointerX - rect.left));
      const localY = Math.max(0, Math.min(rect.height, pointerY - rect.top));
      activeCard.style.setProperty("--pointer-x", `${localX}px`);
      activeCard.style.setProperty("--pointer-y", `${localY}px`);
      activeCard.style.setProperty("--tilt-y", `${((localX / rect.width) - 0.5) * 4}deg`);
      activeCard.style.setProperty("--tilt-x", `${((localY / rect.height) - 0.5) * -4}deg`);
    }

    if (activeCta) {
      const rect = activeCta.getBoundingClientRect();
      const dx = Math.max(-6, Math.min(6, (pointerX - rect.left - rect.width / 2) * 0.12));
      const dy = Math.max(-4, Math.min(4, (pointerY - rect.top - rect.height / 2) * 0.12));
      activeCta.style.setProperty("--magnetic-x", `${dx.toFixed(2)}px`);
      activeCta.style.setProperty("--magnetic-y", `${dy.toFixed(2)}px`);
    }

    if (scene) {
      const rect = scene.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;
      if (inView) {
        const x = Math.max(-1, Math.min(1, (pointerX - rect.left) / rect.width - 0.5));
        const y = Math.max(-1, Math.min(1, (pointerY - rect.top) / rect.height - 0.5));
        scene.style.setProperty("--hero-parallax-x", `${(x * 10).toFixed(2)}px`);
        scene.style.setProperty("--hero-parallax-y", `${(y * 8).toFixed(2)}px`);
      }
    }
  };

  document.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    const nextCard = event.target.closest?.(".b26-tilt-card");
    const nextCta = event.target.closest?.(".b26-magnetic-cta");
    if (nextCard !== activeCard) resetCard(activeCard);
    if (nextCta !== activeCta) resetCta(activeCta);
    activeCard = nextCard;
    activeCta = nextCta;
    if (!frame) frame = window.requestAnimationFrame(render);
  }, { passive: true });

  document.addEventListener("pointerleave", () => {
    resetCard(activeCard);
    resetCta(activeCta);
    activeCard = null;
    activeCta = null;
  });
}

function initHeadingReveals() {
  const headings = document.querySelectorAll(".b26-heading-reveal");
  if (!headings.length) return;
  document.documentElement.classList.add("b26-heading-reveal-ready");
  if (!("IntersectionObserver" in window) || getEffectsProfile().reduced) {
    headings.forEach((heading) => heading.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  headings.forEach((heading) => observer.observe(heading));
}

function initScrollDepth() {
  if (getEffectsProfile().reduced) return;
  let frame = 0;
  const update = () => {
    frame = 0;
    const range = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const depth = window.scrollY / range;
    document.documentElement.style.setProperty("--scroll-depth", depth.toFixed(4));
    document.documentElement.style.setProperty("--scroll-glow-y", `${(depth * 38).toFixed(2)}px`);
    document.documentElement.style.setProperty("--scroll-glow-y-neg", `${(depth * -28).toFixed(2)}px`);
  };
  update();
  window.addEventListener("scroll", () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  }, { passive: true });
}

function initProcessTimeline() {
  const section = document.querySelector('[data-upgrade="process-steps"]');
  if (!section) return;
  section.classList.add("b26-process-story");
  const cards = section.querySelectorAll(".cards > article");
  cards.forEach((card, index) => {
    card.style.setProperty("--stack-index", index);
    card.style.setProperty("--process-delay", `${Math.min(index * 90, 720)}ms`);
  });
  section.insertAdjacentHTML("afterbegin", '<span class="b26-process-rail" aria-hidden="true"><i></i></span>');

  if (!("IntersectionObserver" in window) || getEffectsProfile().reduced) {
    section.classList.add("is-active");
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      section.classList.add("is-active");
      observer.disconnect();
    }
  }, { threshold: 0.08 });
  observer.observe(section);
}

function initContactFeedback() {
  const form = document.querySelector(".b26-request-form-v15");
  if (!form) return;
  form.addEventListener("invalid", () => {
    if (getEffectsProfile().reduced) return;
    form.classList.remove("b26-invalid-once");
    window.requestAnimationFrame(() => form.classList.add("b26-invalid-once"));
  }, true);
  form.addEventListener("animationend", () => form.classList.remove("b26-invalid-once"));
}

document.addEventListener("DOMContentLoaded", () => {
  applyNavLanguage();
  wireLinks();
  initTheme();
  initFloatingContact();
  initReveal();
  initAnalyticsHooks();
  initPremiumHeader();
  initEffectsSurface();
  initEffectTargets();
  initGlobalPointer();
  initHeadingReveals();
  initScrollDepth();
  initProcessTimeline();
  initContactFeedback();

  document.getElementById("mobileMenuBtn")?.addEventListener("click", () => {
    document.getElementById("mobileNav")?.classList.toggle("active");
  });
});


/* FINAL duplicate floating cleanup + clear theme label */
document.addEventListener("DOMContentLoaded", function () {
  const widgets = Array.from(document.querySelectorAll(".floating-contact-widget"));

  widgets.forEach(function (widget, index) {
    if (index < widgets.length - 1) {
      widget.remove();
    }
  });

  const finalWidgets = Array.from(document.querySelectorAll(".floating-contact-widget"));

  finalWidgets.forEach(function (widget) {
    const btn = widget.querySelector(".floating-contact-btn");
    const menu = widget.querySelector(".floating-contact-menu");

    if (!btn || !menu) return;

    btn.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      widget.classList.toggle("active");
      menu.setAttribute("aria-hidden", widget.classList.contains("active") ? "false" : "true");
    };
  });

  document.addEventListener("click", function (e) {
    document.querySelectorAll(".floating-contact-widget").forEach(function (widget) {
      if (!widget.contains(e.target)) {
        widget.classList.remove("active");
      }
    });
  });

  function updateThemeButton() {
    document.querySelectorAll(".clean-theme-toggle").forEach(function (btn) {
      btn.textContent = document.body.classList.contains("light-theme")
        ? "Theme: Light"
        : "Theme: Dark";
    });
  }

  updateThemeButton();

  document.querySelectorAll(".clean-theme-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setTimeout(updateThemeButton, 0);
    });
  });
});


/* ONE FINAL FLOATING CONTACT BUTTON */
document.addEventListener("DOMContentLoaded", function () {
  const oldSelectors = [
    ".floating-contact-widget",
    ".contact-floating",
    ".floating-contact",
    ".contact-fab",
    ".fab-contact",
    ".quick-contact",
    ".contact-widget",
    ".social-floating",
    ".floating-actions"
  ];

  oldSelectors.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.remove();
    });
  });

  const final = document.createElement("div");
  final.className = "final-floating-contact";
  final.innerHTML = `
    <button class="final-floating-contact-btn" type="button" aria-label="Открыть контакты">✉</button>
    <div class="final-floating-contact-menu" aria-hidden="true">
      <a href="mailto:b26online@gmail.com?subject=${encodeURIComponent("Заявка на цифровую инфраструктуру")}">Email</a>
      <a href="https://t.me/shokalo160890" target="_blank" rel="noopener">Telegram</a>
      <a href="https://wa.me/?text=${encodeURIComponent("Здравствуйте, хочу заказать цифровую инфраструктуру для бизнеса")}" target="_blank" rel="noopener">WhatsApp</a>
    </div>
  `;

  document.body.appendChild(final);

  const btn = final.querySelector(".final-floating-contact-btn");
  const menu = final.querySelector(".final-floating-contact-menu");

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    final.classList.toggle("active");
    menu.setAttribute("aria-hidden", final.classList.contains("active") ? "false" : "true");
  });

  document.addEventListener("click", function (e) {
    if (!final.contains(e.target)) {
      final.classList.remove("active");
      menu.setAttribute("aria-hidden", "true");
    }
  });
});
