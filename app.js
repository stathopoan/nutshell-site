/* Nutshell static site — i18n, navigation, toasts */
(function () {
  "use strict";

  var LANGUAGES = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "el", name: "Ελληνικά", flag: "🇬🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "es", name: "Español", flag: "🇪🇸" },
  ];

  var current = "en";

  function get(obj, path) {
    return path.split(".").reduce(function (acc, key) {
      return acc && acc[key] !== undefined ? acc[key] : undefined;
    }, obj);
  }

  function t(key) {
    var value = get(window.TRANSLATIONS[current] || {}, key);
    if (value === undefined) value = get(window.TRANSLATIONS.en, key);
    return value === undefined ? key : value;
  }

  function detectLanguage() {
    var stored = null;
    try {
      stored = localStorage.getItem("nutshell-lang");
    } catch (e) {}
    if (stored && window.TRANSLATIONS[stored]) return stored;
    var nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    return window.TRANSLATIONS[nav] ? nav : "en";
  }

  function applyTranslations() {
    document.documentElement.lang = current;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    renderLanguageSwitchers();
  }

  function setLanguage(code) {
    current = code;
    try {
      localStorage.setItem("nutshell-lang", code);
    } catch (e) {}
    applyTranslations();
  }

  /* ---------- Language switcher ---------- */
  var GLOBE_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>';
  var CHEVRON_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';

  function renderLanguageSwitchers() {
    document.querySelectorAll(".lang-switcher").forEach(function (root) {
      var isOpen = root.getAttribute("data-open") === "true";
      var variant = root.getAttribute("data-variant") || "light";
      var lang =
        LANGUAGES.filter(function (l) {
          return l.code === current;
        })[0] || LANGUAGES[0];

      var triggerClasses =
        variant === "light"
          ? "text-cream hover:bg-cream/10"
          : "text-foreground hover:bg-muted";

      var html =
        '<button type="button" data-lang-trigger class="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ' +
        triggerClasses +
        '">' +
        GLOBE_ICON +
        '<span class="text-sm font-medium hidden sm:inline">' +
        lang.flag +
        " " +
        lang.name +
        "</span>" +
        '<span class="text-sm font-medium sm:hidden">' +
        lang.flag +
        "</span>" +
        '<span class="transition-transform inline-flex ' +
        (isOpen ? "rotate-180" : "") +
        '">' +
        CHEVRON_ICON +
        "</span>" +
        "</button>";

      if (isOpen) {
        html +=
          '<div data-lang-backdrop class="fixed inset-0 z-40"></div>' +
          '<div class="absolute right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-strong overflow-hidden z-50 min-w-[160px] animate-scale-in">' +
          LANGUAGES.map(function (l) {
            return (
              '<button type="button" data-lang-option="' +
              l.code +
              '" class="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-muted ' +
              (l.code === current
                ? "bg-muted text-primary font-medium"
                : "text-foreground") +
              '"><span class="text-lg">' +
              l.flag +
              "</span><span>" +
              l.name +
              "</span></button>"
            );
          }).join("") +
          "</div>";
      }
      root.innerHTML = html;
    });
  }

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-lang-trigger]");
    if (trigger) {
      var root = trigger.closest(".lang-switcher");
      var open = root.getAttribute("data-open") === "true";
      document.querySelectorAll(".lang-switcher").forEach(function (el) {
        el.setAttribute("data-open", "false");
      });
      root.setAttribute("data-open", open ? "false" : "true");
      renderLanguageSwitchers();
      return;
    }
    var option = event.target.closest("[data-lang-option]");
    if (option) {
      document.querySelectorAll(".lang-switcher").forEach(function (el) {
        el.setAttribute("data-open", "false");
      });
      setLanguage(option.getAttribute("data-lang-option"));
      return;
    }
    if (event.target.closest("[data-lang-backdrop]")) {
      document.querySelectorAll(".lang-switcher").forEach(function (el) {
        el.setAttribute("data-open", "false");
      });
      renderLanguageSwitchers();
    }
  });

  /* ---------- Smooth scrolling ---------- */
  document.addEventListener("click", function (event) {
    var link = event.target.closest("[data-scroll]");
    if (!link) return;
    event.preventDefault();
    var hash = link.getAttribute("href");
    if (hash === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      var el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    if (link.hasAttribute("data-mobile-close")) closeMobileMenu();
  });

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById("site-header");
  var navLinks = document.querySelectorAll(".nav-link");
  var logoMark = document.querySelector(".logo-mark");
  var logoLetter = document.querySelector(".logo-letter");
  var logoText = document.querySelector(".logo-text");
  var mobileToggle = document.getElementById("mobile-toggle");
  var scrolled = false;

  function setHeaderState(isScrolled) {
    if (isScrolled === scrolled) return;
    scrolled = isScrolled;

    header.classList.toggle("bg-cream/95", isScrolled);
    header.classList.toggle("backdrop-blur-md", isScrolled);
    header.classList.toggle("shadow-soft", isScrolled);
    header.classList.toggle("py-4", isScrolled);
    header.classList.toggle("bg-transparent", !isScrolled);
    header.classList.toggle("py-6", !isScrolled);

    logoMark.classList.toggle("bg-primary", isScrolled);
    logoMark.classList.toggle("bg-golden", !isScrolled);
    logoLetter.classList.toggle("text-primary-foreground", isScrolled);
    logoLetter.classList.toggle("text-earth", !isScrolled);
    logoText.classList.toggle("text-primary", isScrolled);
    logoText.classList.toggle("text-cream", !isScrolled);

    navLinks.forEach(function (link) {
      link.classList.toggle("text-foreground", isScrolled);
      link.classList.toggle("text-cream", !isScrolled);
    });

    mobileToggle.classList.toggle("text-foreground", isScrolled);
    mobileToggle.classList.toggle("text-cream", !isScrolled);

    document.querySelectorAll(".lang-switcher").forEach(function (el) {
      el.setAttribute("data-variant", isScrolled ? "dark" : "light");
    });
    renderLanguageSwitchers();

    document.querySelectorAll("[data-toast='nav.shopNow']").forEach(function (btn) {
      if (btn.closest("#mobile-menu")) return;
      btn.classList.toggle("btn-hero", isScrolled);
      btn.classList.toggle("btn-golden", !isScrolled);
    });
  }

  window.addEventListener("scroll", function () {
    setHeaderState(window.scrollY > 50);
  });

  /* ---------- Mobile menu ---------- */
  var mobileMenu = document.getElementById("mobile-menu");

  function closeMobileMenu() {
    mobileMenu.classList.add("hidden");
    mobileToggle.querySelector(".icon-menu").classList.remove("hidden");
    mobileToggle.querySelector(".icon-close").classList.add("hidden");
  }

  mobileToggle.addEventListener("click", function () {
    var hidden = mobileMenu.classList.contains("hidden");
    mobileMenu.classList.toggle("hidden", !hidden);
    mobileToggle.querySelector(".icon-menu").classList.toggle("hidden", hidden);
    mobileToggle.querySelector(".icon-close").classList.toggle("hidden", !hidden);
  });

  /* ---------- Toasts ---------- */
  var toastContainer = document.getElementById("toast-container");

  function showToast(title, description) {
    var toast = document.createElement("div");
    toast.className =
      "pointer-events-auto bg-card border border-border text-foreground rounded-xl shadow-strong px-4 py-3 animate-scale-in";
    var heading = document.createElement("p");
    heading.className = "text-sm font-medium";
    heading.textContent = title;
    toast.appendChild(heading);
    if (description) {
      var sub = document.createElement("p");
      sub.className = "text-muted-foreground text-sm mt-1";
      sub.textContent = description;
      toast.appendChild(sub);
    }
    toastContainer.appendChild(toast);
    setTimeout(function () {
      toast.style.transition = "opacity .3s ease";
      toast.style.opacity = "0";
      setTimeout(function () {
        toast.remove();
      }, 300);
    }, 4000);
  }

  document.addEventListener("click", function (event) {
    var keyed = event.target.closest("[data-toast]");
    if (keyed) {
      showToast(
        t(keyed.getAttribute("data-toast")) + " - Coming soon!",
        "Our online shop will be available soon."
      );
      return;
    }
    var plain = event.target.closest("[data-toast-text]");
    if (plain) showToast(plain.getAttribute("data-toast-text"));
  });

  /* ---------- Init ---------- */
  current = detectLanguage();
  applyTranslations();
  setHeaderState(window.scrollY > 50);
})();
