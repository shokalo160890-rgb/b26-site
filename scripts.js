
const SITE_CONFIG = {
  telegram: "https://t.me/shokalo160890",
  whatsapp: "https://wa.me/?text=" + encodeURIComponent("Здравствуйте, хочу заказать мини-сайт"),
  email: "shokalo160890@gmail.com"
};

const NAV_DICT = {
  ru: {
    nav_home: "Главная",
    nav_examples: "Примеры",
    nav_services: "Услуги",
    nav_articles: "Статьи",
    nav_about: "Обо мне",
    nav_contact: "Связаться",
    theme_dark: "Тёмная",
    theme_light: "Светлая",
    email_subject: "Заявка на мини-сайт"
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
    email_subject: "Mini website request"
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
    email_subject: "Anfrage für Mini-Webseite"
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

function applyNavLanguage() {
  const lang = getBrowserLang();
  const dict = NAV_DICT[lang] || NAV_DICT.ru;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key]) el.textContent = dict[key];
  });

  document.querySelectorAll(".clean-theme-toggle").forEach((btn) => {
    const isLight = document.body.classList.contains("light-theme");
    btn.textContent = isLight ? dict.theme_light : dict.theme_dark;
  });
}

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
    if (["contact", "kontakt", "связаться", "заказать мини-сайт", "order a mini website"].includes(txt)) {
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
