(() => {
  "use strict";

  const menuToggle = document.querySelector(".menu-toggle");
  const navList = document.querySelector(".nav-list");
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileQuery = window.matchMedia("(max-width: 700px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (menuToggle && navList) {
    const setMenuState = (isOpen) => {
      menuToggle.classList.toggle("is-active", isOpen);
      navList.classList.toggle("is-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
      document.body.classList.toggle("menu-open", isOpen);
    };

    menuToggle.addEventListener("click", () => {
      setMenuState(menuToggle.getAttribute("aria-expanded") !== "true");
    });
    navLinks.forEach((link) => link.addEventListener("click", () => setMenuState(false)));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        setMenuState(false);
        menuToggle.focus();
      }
    });

    mobileQuery.addEventListener("change", (event) => {
      if (!event.matches) setMenuState(false);
    });
  }

  // Animação de empilhamento durante a rolagem em telas mobile.
  // Se GSAP/ScrollTrigger não carregar, o conteúdo continua utilizável.
  function initCardStack() {
    const cards = gsap.utils.toArray(".card-container > article");
    if (cards.length < 2) return;

    ScrollTrigger.matchMedia({
      "(max-width: 700px) and (prefers-reduced-motion: no-preference)": () => {
        cards.forEach((card, index) => {
          if (index === cards.length - 1) return;
          gsap.to(card, {
            scale: 0.94,
            opacity: 0.72,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top top+=92",
              end: "bottom top+=92",
              scrub: true,
              invalidateOnRefresh: true
            }
          });
        });
      }
    });
  }

  function startAnimations() {
    if (reducedMotion.matches || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    initCardStack();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startAnimations, { once: true });
  } else {
    startAnimations();
  }
})();