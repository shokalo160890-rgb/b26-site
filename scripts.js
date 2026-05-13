
const SITE_CONFIG = {
  telegram: "https://t.me/shokalo160890",
  whatsapp: "https://wa.me/?text=Здравствуйте,%20хочу%20заказать%20мини-сайт",
  email: "shokalo160890@gmail.com"
};

const DICT = {
  ru: {
    nav_home: "Главная",
    nav_examples: "Примеры",
    nav_services: "Услуги",
    nav_articles: "Статьи",
    nav_about: "Обо мне",
    nav_contact: "Связаться",
    theme_dark: "Тёмная",
    theme_light: "Светлая",
    email_subject: "Заявка на мини-сайт",
    brand_subtitle: "мини-сайты под смартфон"
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
    email_subject: "Mini website request",
    brand_subtitle: "mini websites for smartphones"
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
    email_subject: "Anfrage für Mini-Webseite",
    brand_subtitle: "Mini-Webseiten für Smartphones"
  }
};

const PHRASES = {
  en: {
    "Одна ссылка вместо кучи объяснений": "One link instead of long explanations",
    "Делаю мини-сайты для людей со смартфоном. Сайт работает как визитка, портфолио и продавец: показывает, кто вы, что делаете, почему вам можно доверять и как с вами связаться.": "I create mini websites for people with smartphones. The site works as a business card, portfolio and seller: it shows who you are, what you do, why people can trust you and how to contact you.",
    "Посмотреть пакеты": "View packages",
    "Заказать мини-сайт": "Order a mini website",
    "Что получает клиент": "What the client gets",
    "Профессиональный вид": "Professional look",
    "Быстрая отправка": "Easy to share",
    "Больше доверия": "More trust",
    "Мини-сайт для человека со смартфоном": "Mini website for a person with a smartphone",
    "Примеры мини-сайтов": "Mini website examples",
    "Статьи про мини-сайты, QR-коды и доверие": "Articles about mini websites, QR codes and trust",
    "Я делаю мини-сайты, которые объясняют за человека": "I create mini websites that explain for people",
    "Зачем человеку мини-сайт": "Why a person needs a mini website",
    "QR-код как быстрый вход к заявке": "QR code as a fast path to a request",
    "Почему мини-сайт повышает доверие": "Why a mini website increases trust",
    "Отправить заявку": "Send request",
    "Написать email": "Write email",
    "Telegram": "Telegram"
  },
  de: {
    "Одна ссылка вместо кучи объяснений": "Ein Link statt langer Erklärungen",
    "Делаю мини-сайты для людей со смартфоном. Сайт работает как визитка, портфолио и продавец: показывает, кто вы, что делаете, почему вам можно доверять и как с вами связаться.": "Ich erstelle Mini-Webseiten für Menschen mit Smartphone. Die Seite funktioniert wie Visitenkarte, Portfolio und Verkäufer: sie zeigt, wer Sie sind, was Sie anbieten, warum man Ihnen vertrauen kann und wie man Sie kontaktiert.",
    "Посмотреть пакеты": "Pakete ansehen",
    "Заказать мини-сайт": "Mini-Webseite bestellen",
    "Что получает клиент": "Was der Kunde bekommt",
    "Профессиональный вид": "Professioneller Auftritt",
    "Быстрая отправка": "Schnell teilbar",
    "Больше доверия": "Mehr Vertrauen",
    "Мини-сайт для человека со смартфоном": "Mini-Webseite für Menschen mit Smartphone",
    "Примеры мини-сайтов": "Beispiele für Mini-Webseiten",
    "Статьи про мини-сайты, QR-коды и доверие": "Artikel über Mini-Webseiten, QR-Codes und Vertrauen",
    "Я делаю мини-сайты, которые объясняют за человека": "Ich erstelle Mini-Webseiten, die für Menschen erklären",
    "Зачем человеку мини-сайт": "Warum man eine Mini-Webseite braucht",
    "QR-код как быстрый вход к заявке": "QR-Code als schneller Weg zur Anfrage",
    "Почему мини-сайт повышает доверие": "Warum eine Mini-Webseite Vertrauen schafft",
    "Отправить заявку": "Anfrage senden",
    "Написать email": "E-Mail schreiben",
    "Telegram": "Telegram"
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

function currentLang() {
  return getBrowserLang();
}

function translateStatic(lang) {
  const dict = DICT[lang] || DICT.ru;

  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key]) el.textContent = dict[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (dict[key]) el.setAttribute("placeholder", dict[key]);
  });
}

function translateKnownPhrases(lang) {
  if (lang === "ru") return;
  const map = PHRASES[lang];
  if (!map) return;

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const text = node.nodeValue.trim().replace(/\s+/g, " ");
        if (!text) return NodeFilter.FILTER_REJECT;
        return map[text] ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    }
  );

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((node) => {
    const clean = node.nodeValue.trim().replace(/\s+/g, " ");
    node.nodeValue = node.nodeValue.replace(node.nodeValue.trim(), map[clean]);
  });
}

function wireLinks() {
  document.querySelectorAll("[data-link-key]").forEach((a) => {
    const key = a.dataset.linkKey;
    let value = SITE_CONFIG[key] || "#";

    if (key === "email") {
      const subject = encodeURIComponent(DICT[currentLang()].email_subject);
      value = `mailto:${SITE_CONFIG.email}?subject=${subject}`;
    }

    if (value === "#") {
      a.style.display = "none";
    } else {
      a.href = value;
    }
  });

  document.querySelectorAll("a").forEach((a) => {
    const text = (a.textContent || "").trim().toLowerCase();
    if (["contact", "kontakt", "связаться"].includes(text)) {
      a.href = "contact.html";
      a.removeAttribute("data-link-key");
    }
  });
}

function applyTheme(mode) {
  document.body.classList.toggle("light-theme", mode === "light");
  localStorage.setItem("b26_theme", mode);

  const lang = currentLang();
  const dict = DICT[lang] || DICT.ru;

  document.querySelectorAll(".clean-theme-toggle").forEach((btn) => {
    btn.textContent = mode === "light" ? dict.theme_light : dict.theme_dark;
    btn.setAttribute("aria-label", mode === "light" ? dict.theme_light : dict.theme_dark);
  });
}

function initTheme() {
  const saved = localStorage.getItem("b26_theme");

  if (saved === "light" || saved === "dark") {
    applyTheme(saved);
  } else {
    const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    applyTheme(prefersLight ? "light" : "dark");
  }

  document.querySelectorAll(".clean-theme-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = document.body.classList.contains("light-theme") ? "dark" : "light";
      applyTheme(next);
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

    document.addEventListener("click", (e) => {
      if (!widget.contains(e.target)) {
        widget.classList.remove("active");
        menu.setAttribute("aria-hidden", "true");
      }
    });
  });
}

function sendMailForm(e) {
  e.preventDefault();

  const form = e.target;
  const fd = new FormData(form);
  const lang = currentLang();
  const subject = DICT[lang].email_subject;

  const body = [
    `Name: ${fd.get("name") || ""}`,
    `Email: ${fd.get("email") || ""}`,
    "",
    `${fd.get("message") || ""}`
  ].join("\\n");

  location.href = `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
  const lang = currentLang();

  translateStatic(lang);
  translateKnownPhrases(lang);
  wireLinks();
  initTheme();
  initFloatingContact();
  initReveal();

  document.getElementById("mobileMenuBtn")?.addEventListener("click", () => {
    document.getElementById("mobileNav")?.classList.toggle("active");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".floating-contact-widget").forEach((widget) => {
        widget.classList.remove("active");
      });
    }
  });
});


document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("a").forEach(function (a) {
    const txt = (a.textContent || "").trim().toLowerCase();
    if (["contact", "kontakt", "связаться", "заказать мини-сайт", "order a mini website"].includes(txt)) {
      a.href = "contact.html";
      a.removeAttribute("data-link-key");
      a.style.pointerEvents = "auto";
    }
  });

  document.querySelectorAll("[data-link-key]").forEach(function (a) {
    const key = a.dataset.linkKey;
    if (key === "email") {
      a.href = "mailto:shokalo160890@gmail.com?subject=" + encodeURIComponent("Заявка на мини-сайт");
      a.style.display = "";
    }
    if (key === "telegram") {
      a.href = "https://t.me/shokalo160890";
      a.style.display = "";
    }
    if (key === "whatsapp") {
      a.href = "https://wa.me/?text=" + encodeURIComponent("Здравствуйте, хочу заказать мини-сайт");
      a.style.display = "";
    }
  });

  document.querySelectorAll(".floating-contact-widget").forEach(function (widget) {
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
      if (!widget.contains(e.target)) widget.classList.remove("active");
    });
  });
});

