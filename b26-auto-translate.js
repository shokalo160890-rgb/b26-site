(function () {
  const ORIGINAL_LANGS = ["ru", "uk"];
  const SUPPORTED_LANGS = [
    "de","en","pl","fr","es","it","nl","cs","sk","tr","ro","bg",
    "pt","da","sv","fi","no","lt","lv","et","hu"
  ];

  function getBrowserLang() {
    const raw = (navigator.languages && navigator.languages[0]) || navigator.language || "ru";
    return raw.toLowerCase().split("-")[0];
  }

  function setCookie(name, value) {
    document.cookie = name + "=" + value + "; path=/";
    document.cookie = name + "=" + value + "; path=/; domain=" + location.hostname;
  }

  function getCookie(name) {
    return document.cookie
      .split("; ")
      .find(row => row.startsWith(name + "="))
      ?.split("=")[1];
  }

  function shouldTranslate(lang) {
    if (ORIGINAL_LANGS.includes(lang)) return false;
    return SUPPORTED_LANGS.includes(lang);
  }

  function applyAutoTranslate() {
    if (sessionStorage.getItem("b26TranslateDone") === "1") return;

    const lang = getBrowserLang();

    if (!shouldTranslate(lang)) {
      sessionStorage.setItem("b26TranslateDone", "1");
      return;
    }

    const target = "/ru/" + lang;
    const current = getCookie("googtrans");

    if (current !== target) {
      setCookie("googtrans", target);
      sessionStorage.setItem("b26TranslateDone", "1");
      location.reload();
    }
  }

  window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement({
      pageLanguage: "ru",
      autoDisplay: false,
      includedLanguages: SUPPORTED_LANGS.concat(ORIGINAL_LANGS).join(",")
    }, "google_translate_element");

    setTimeout(applyAutoTranslate, 800);
  };

  const box = document.createElement("div");
  box.id = "google_translate_element";
  box.style.position = "fixed";
  box.style.left = "-9999px";
  box.style.top = "-9999px";
  document.body.appendChild(box);

  const style = document.createElement("style");
  style.textContent = `
    iframe.skiptranslate,
    .goog-te-banner-frame,
    .goog-te-balloon-frame,
    .VIpgJd-ZVi9od-ORHb-OEVmcd,
    .VIpgJd-ZVi9od-aZ2wEe-wOHMyf,
    #goog-gt-tt,
    .goog-te-gadget,
    .goog-te-gadget-icon {
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
      width: 0 !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    html,
    body {
      top: 0 !important;
      margin-top: 0 !important;
      position: static !important;
    }

    .goog-text-highlight {
      background: transparent !important;
      box-shadow: none !important;
    }
  `;

  function removeGoogleTranslateBar() {
    document.querySelectorAll(
      "iframe.skiptranslate, .goog-te-banner-frame, .VIpgJd-ZVi9od-ORHb-OEVmcd"
    ).forEach(el => {
      el.style.display = "none";
      el.style.visibility = "hidden";
      el.style.height = "0";
      el.style.width = "0";
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
    });

    document.documentElement.style.top = "0";
    document.body.style.top = "0";
    document.body.style.marginTop = "0";
  }

  setInterval(removeGoogleTranslateBar, 300);
  document.head.appendChild(style);

  const script = document.createElement("script");
  script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.body.appendChild(script);
})();
