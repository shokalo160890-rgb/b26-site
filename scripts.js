
const SITE_CONFIG = {
  telegram: "https://t.me/shokalo160890",
  whatsapp: "https://wa.me/?text=" + encodeURIComponent("Здравствуйте, хочу заказать цифровую инфраструктуру для бизнеса") + encodeURIComponent("Здравствуйте, хочу заказать цифровую инфраструктуру для бизнеса"),
  email: "shokalo160890@gmail.com"
};

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

function sendMailForm(e) {
  e.preventDefault();

  const fd = new FormData(e.target);
  const lang = getBrowserLang();
  const subject = NAV_DICT[lang]?.email_subject || NAV_DICT.ru.email_subject;

  const body = [
    "Name: " + (fd.get("name") || ""),
    "Email: " + (fd.get("email") || ""),
    "",
    fd.get("message") || ""
  ].join("\\n");

  location.href = "mailto:" + SITE_CONFIG.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  return false;
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

document.addEventListener("DOMContentLoaded", () => {
  applyNavLanguage();
  wireLinks();
  initTheme();
  initFloatingContact();
  initReveal();

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
      <a href="mailto:shokalo160890@gmail.com?subject=${encodeURIComponent("Заявка на цифровую инфраструктуру")}">Email</a>
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
