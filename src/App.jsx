import { useEffect, useRef, useState } from "react";

const PAGE_ORDER = [
  "home",
  "portfolio",
  "services",
  "about",
  "journal",
  "contact",
];

const NAV_ITEMS = [
  { label: "Portfolio", page: "portfolio", href: "./portfolio.html" },
  { label: "Services", page: "services", href: "./services.html" },
  { label: "About", page: "about", href: "./about.html" },
  { label: "Journal", page: "journal", href: "./journal.html" },
  { label: "Contact", page: "contact", href: "./contact.html" },
];

const HOME_TEASERS = [
  {
    title: "Portrait",
    label: "Quiet frames",
    href: "./portfolio.html",
    image: "/img/home-portrait.svg",
  },
  {
    title: "Commercial",
    label: "Brand work",
    href: "./portfolio.html",
    image: "/img/home-commercial.svg",
  },
  {
    title: "Editorial",
    label: "Story-led",
    href: "./portfolio.html",
    image: "/img/home-editorial.svg",
  },
];

const PORTFOLIO_PROJECTS = [
  {
    title: "Northlight Portraits",
    category: "Portrait",
    location: "Brooklyn, NY",
    image: "/img/portfolio-portrait-01.svg",
  },
  {
    title: "Quiet Launch",
    category: "Commercial",
    location: "Austin, TX",
    image: "/img/portfolio-commercial-01.svg",
  },
  {
    title: "Field Notes",
    category: "Editorial",
    location: "Paris, FR",
    image: "/img/portfolio-editorial-01.svg",
  },
  {
    title: "After Hours",
    category: "Event",
    location: "New York, NY",
    image: "/img/portfolio-event-01.svg",
  },
  {
    title: "Low Tide Portraits",
    category: "Portrait",
    location: "Reykjavik, IS",
    image: "/img/portfolio-portrait-02.svg",
  },
  {
    title: "Surface Study",
    category: "Commercial",
    location: "Los Angeles, CA",
    image: "/img/portfolio-commercial-02.svg",
  },
];

const SERVICES = [
  {
    number: "01",
    title: "Portrait",
    description:
      "Controlled light. Clear direction. Portraits that feel calm, current, and direct.",
  },
  {
    number: "02",
    title: "Commercial & Product",
    description:
      "Clean sets, precise framing, and product imagery built to sell without noise.",
  },
  {
    number: "03",
    title: "Editorial & Fashion",
    description:
      "Cinematic pacing, stronger shapes, and image sequences with magazine-level edge.",
  },
  {
    number: "04",
    title: "Events & Coverage",
    description:
      "Fast, discreet, and complete coverage that keeps the atmosphere intact.",
  },
];

const VALUES = [
  {
    title: "We direct the frame.",
    description:
      "Every shoot is shaped with clear intent so the final image feels exact, not accidental.",
  },
  {
    title: "Light comes first.",
    description:
      "We build around the quality of light before we build around the subject.",
  },
  {
    title: "Edit hard. Keep the best.",
    description:
      "We protect the strongest frame and remove everything that weakens it.",
  },
];

const JOURNAL_POSTS = [
  {
    id: "light",
    title: "Why We Start With Shadow",
    category: "Light Notes",
    image: "/img/journal-light.svg",
    excerpt:
      "The cleanest frame usually begins by removing too much light, not adding more.",
  },
  {
    id: "craft",
    title: "The Value of a Tighter Edit",
    category: "Craft",
    image: "/img/journal-craft.svg",
    excerpt:
      "A better selection always feels smaller. That restraint is what gives the image force.",
  },
  {
    id: "vision",
    title: "What We Look For Before the Shoot Starts",
    category: "Vision",
    image: "/img/journal-vision.svg",
    excerpt:
      "Tone, pacing, and the final use of the image shape the direction before the first frame.",
  },
];

function resolvePageKey() {
  const pathname = window.location.pathname;
  const lastSegment = pathname.split("/").filter(Boolean).pop() || "index.html";

  if (lastSegment === "" || lastSegment === "index.html") return "home";

  const pageKey = lastSegment.replace(".html", "");
  return PAGE_ORDER.includes(pageKey) ? pageKey : "home";
}

function resolvePageHref(pageKey) {
  return pageKey === "home" ? "./index.html" : `./${pageKey}.html`;
}

function resolvePageKeyFromHref(href) {
  const normalizedHref = href.replace(/^\.\//, "");
  const pageKey = normalizedHref.replace(/\.html$/, "");

  return pageKey === "index" ? "home" : pageKey;
}

function collectRevealLines(element) {
  const lines = [];
  let currentLine = "";

  element.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "BR") {
      lines.push(currentLine);
      currentLine = "";
      return;
    }

    currentLine += node.textContent || "";
  });

  lines.push(currentLine);
  return lines;
}

function prepareTextAnimations() {
  const textReveals = document.querySelectorAll(".text-reveal");

  textReveals.forEach((el) => {
    if (el.dataset.textRevealPrepared === "true") return;

    const lines = collectRevealLines(el);
    const fragment = document.createDocumentFragment();

    lines.forEach((line, index) => {
      const cleanLine = line.trim();
      const lineWrapper = document.createElement("span");
      lineWrapper.className = "inline-block whitespace-nowrap";

      for (const char of cleanLine) {
        if (char === " ") {
          const space = document.createElement("span");
          space.className = "inline-block w-2 md:w-3";
          space.innerHTML = "&nbsp;";
          lineWrapper.appendChild(space);
        } else {
          const charSpan = document.createElement("span");
          charSpan.className = "reveal-char";
          charSpan.textContent = char;
          lineWrapper.appendChild(charSpan);
        }
      }

      fragment.appendChild(lineWrapper);

      if (index < lines.length - 1) {
        fragment.appendChild(document.createElement("br"));
      }
    });

    el.replaceChildren(fragment);
    el.dataset.textRevealPrepared = "true";
  });
}

function resetPageElements(pageId) {
  const { gsap } = window;
  if (!gsap) return;

  const page = document.getElementById(`page-${pageId}`);
  if (!page) return;

  gsap.set(page.querySelectorAll(".reveal-char"), {
    opacity: 0,
    filter: "blur(25px)",
    scale: 1.3,
    y: 0,
  });

  gsap.set(page.querySelectorAll(".text-reveal-p"), {
    opacity: 0,
    filter: "blur(10px)",
    y: 10,
  });

  gsap.set(page.querySelectorAll(".initial-hide"), {
    opacity: 0,
    y: 15,
  });

  gsap.set(page.querySelectorAll(".reveal-img-container"), {
    clipPath: "inset(25% 25% 25% 25% round 32px)",
  });

  gsap.set(page.querySelectorAll(".reveal-img"), {
    scale: 1.35,
    rotate: -2,
    filter: "blur(10px) brightness(0.2) contrast(180%)",
  });
}

function setupScrollTriggers(pageId) {
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) return;

  const page = document.getElementById(`page-${pageId}`);
  if (!page) return;

  const blocks = page.querySelectorAll(".scroll-block");
  blocks.forEach((block) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: block,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      defaults: { ease: "power3.out" },
    });

    const initialHides = block.querySelectorAll(".initial-hide");
    if (initialHides.length > 0) {
      tl.fromTo(
        initialHides,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.1 },
        0.2,
      );
    }

    const chars = block.querySelectorAll(".reveal-char");
    if (chars.length > 0) {
      tl.to(
        chars,
        {
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          y: 0,
          stagger: {
            amount: 0.8,
            from: "random",
          },
          duration: 1.5,
        },
        0.1,
      );
    }

    const paragraphs = block.querySelectorAll(".text-reveal-p");
    if (paragraphs.length > 0) {
      tl.fromTo(
        paragraphs,
        { opacity: 0, filter: "blur(10px)", y: 10 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: 1.5 },
        0.4,
      );
    }

    const imgContainers = block.querySelectorAll(".reveal-img-container");
    const images = block.querySelectorAll(".reveal-img");

    if (imgContainers.length > 0 && images.length > 0) {
      tl.to(
        imgContainers,
        {
          clipPath: "inset(0% 0% 0% 0% round 16px)",
          duration: 1.8,
          ease: "power4.inOut",
          stagger: 0.15,
        },
        0.3,
      );

      tl.to(
        images,
        {
          scale: 1,
          rotate: 0,
          filter: "blur(0px) brightness(1) contrast(100%)",
          duration: 2.2,
          ease: "power3.out",
          stagger: 0.15,
        },
        0.3,
      );
    }
  });

  ScrollTrigger.refresh();
}

function Eyebrow({ children }) {
  return (
    <span className="text-xs tracking-[0.3em] text-champagne uppercase font-medium block initial-hide">
      {children}
    </span>
  );
}

function PageFooter() {
  return (
    <footer className="py-12 border-t border-white/5 w-full bg-darkgray px-6 md:px-12 text-center text-xs text-gray-500 uppercase tracking-widest">
      <p>© 2026 LUMIS STUDIO. Built for photographic clarity.</p>
    </footer>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState(() => resolvePageKey());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentPageRef = useRef(currentPage);
  const bootedRef = useRef(false);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPage]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!bootedRef.current) return;

    const { ScrollTrigger } = window;
    if (ScrollTrigger) {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    prepareTextAnimations();
    resetPageElements(currentPage);
    requestAnimationFrame(() => {
      setupScrollTriggers(currentPage);
    });
  }, [currentPage]);

  useEffect(() => {
    if (
      typeof window.gsap === "undefined" ||
      typeof window.ScrollTrigger === "undefined"
    ) {
      return undefined;
    }

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    const originalBodyClassName = document.body.className;
    document.body.className =
      "text-white font-sans selection:bg-champagne selection:text-dark no-scroll";

    let toastTimeout;
    let isTransitioning = false;
    const navCleanup = [];

    function runScramble(element, targetWord, duration = 1000, callback) {
      const chars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
      const length = targetWord.length;
      let start = null;

      function update(timestamp) {
        if (!start) start = timestamp;
        const progress = (timestamp - start) / duration;

        if (progress < 1) {
          let currentWord = "";
          const revealedCount = Math.floor(progress * length);

          for (let i = 0; i < length; i += 1) {
            if (i < revealedCount) {
              currentWord += targetWord[i];
            } else {
              currentWord += chars[Math.floor(Math.random() * chars.length)];
            }
          }

          element.innerHTML = currentWord;
          requestAnimationFrame(update);
        } else {
          element.innerHTML = targetWord;
          if (callback) callback();
        }
      }

      requestAnimationFrame(update);
    }

    function completePreloader() {
      const preloader = document.getElementById("preloader");
      const strips = document.querySelectorAll(".transition-strip");
      const header = document.getElementById("global-header");
      const main = document.getElementById("global-main");

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.classList.remove("no-scroll");
          preloader.style.display = "none";
        },
      });

      tl.to(strips, {
        x: "0%",
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.inOut",
      });

      tl.add(() => {
        preloader.style.opacity = "0";
        gsap.set(main, { autoAlpha: 1 });
        gsap.set(header, { y: -20, autoAlpha: 1 });
      });

      tl.to(strips, {
        x: "100%",
        duration: 0.8,
        stagger: 0.06,
        ease: "power3.inOut",
      });

      tl.to(
        header,
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.4",
      );

      tl.add(() => {
        bootedRef.current = true;
        resetPageElements(currentPageRef.current);
        setupScrollTriggers(currentPageRef.current);
      }, "-=0.8");

      tl.set(strips, { x: "-100%" });
    }

    function executeNavigation(targetHref) {
      if (isTransitioning) return;

      isTransitioning = true;
      document.body.classList.add("no-scroll");

      const currentActiveSection = document.getElementById(
        `page-${currentPageRef.current}`,
      );
      const strips = document.querySelectorAll(".transition-strip");

      const transitionTimeline = gsap.timeline({
        onComplete: () => {
          isTransitioning = false;
          document.body.classList.remove("no-scroll");
        },
      });

      if (currentActiveSection) {
        const pageElements = currentActiveSection.querySelectorAll(
          ".reveal-char, .reveal-img-container, .reveal-img, .initial-hide, .text-reveal-p",
        );
        transitionTimeline.to(pageElements, {
          filter: "blur(15px)",
          opacity: 0,
          scale: 0.95,
          duration: 0.5,
          stagger: 0.01,
          ease: "power2.in",
        });
      }

      transitionTimeline.to(strips, {
        x: "0%",
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.inOut",
      });

      transitionTimeline.add(() => {
        const targetPage = resolvePageKeyFromHref(targetHref);
        history.pushState({}, "", targetHref);
        currentPageRef.current = targetPage;
        setCurrentPage(targetPage);
      });

      transitionTimeline.to(strips, {
        x: "100%",
        duration: 0.8,
        stagger: 0.06,
        ease: "power3.inOut",
      });
    }

    function setupNavigation() {
      const navLinks = document.querySelectorAll('a[href$=".html"]');

      navLinks.forEach((link) => {
        const handler = (event) => {
          const targetHref = link.getAttribute("href");
          if (!targetHref) return;

          const resolvedHref = new URL(targetHref, window.location.href).href;
          if (resolvedHref === window.location.href || isTransitioning) {
            event.preventDefault();
            return;
          }

          event.preventDefault();
          executeNavigation(targetHref);
        };

        link.addEventListener("click", handler);
        navCleanup.push(() => link.removeEventListener("click", handler));
      });

      const handlePopState = () => {
        const targetPage = resolvePageKey();
        currentPageRef.current = targetPage;
        setCurrentPage(targetPage);
      };

      window.addEventListener("popstate", handlePopState);
      navCleanup.push(() =>
        window.removeEventListener("popstate", handlePopState),
      );
    }

    setupNavigation();
    prepareTextAnimations();

    const titleElement = document.getElementById("preloader-title");
    const statusElement = document.getElementById("preloader-status");

    const sequence = [
      { text: "LUMIS", status: "SCRAMBLING MATRIX..." },
      { text: "STUDIO", status: "DECRYPTING CORE..." },
      { text: "LOADED", status: "SYSTEM SUCCESS" },
    ];

    let step = 0;

    function nextStep() {
      if (step < sequence.length) {
        runScramble(titleElement, sequence[step].text, 1000, () => {
          statusElement.innerText = sequence[step].status;
          step += 1;
          setTimeout(nextStep, 350);
        });
      } else {
        completePreloader();
      }
    }

    setTimeout(nextStep, 150);

    return () => {
      navCleanup.forEach((cleanup) => cleanup());
      clearTimeout(toastTimeout);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.globalTimeline.clear();
      document.body.className = originalBodyClassName;
    };
  }, []);

  return (
    <>
      <div
        id="preloader"
        className="fixed inset-0 bg-dark z-[100] flex flex-col justify-center items-center px-6"
      >
        <div className="text-center space-y-4 max-w-md w-full">
          <div className="w-8 h-[2px] md:h-px bg-champagne/20 mx-auto mb-2 transform-gpu"></div>
          <h2
            id="preloader-title"
            className="font-mono text-sm md:text-base font-bold tracking-[0.5em] text-white select-none uppercase"
          >
            ------
          </h2>
          <div
            id="preloader-status"
            className="font-mono text-[9px] tracking-[0.4em] text-champagne uppercase opacity-50"
          >
            BOOTING SYSTEM_
          </div>
          <div className="w-8 h-[2px] md:h-px bg-champagne/20 mx-auto mt-2 transform-gpu"></div>
        </div>
      </div>

      <div
        id="transition-curtain"
        className="fixed inset-0 z-[110] pointer-events-none flex flex-col justify-between"
      >
        <div className="transition-strip w-full h-[33.4%] bg-champagne transform -translate-x-full"></div>
        <div className="transition-strip w-full h-[33.4%] bg-champagne transform -translate-x-full"></div>
        <div className="transition-strip w-full h-[33.4%] bg-champagne transform -translate-x-full"></div>
      </div>

      <header
        id="global-header"
        className="fixed top-0 left-0 w-full z-[120] px-6 py-6 md:px-12 flex items-start md:items-center justify-between gap-4 pointer-events-none mix-blend-difference"
      >
        <a
          href="./index.html"
          className={`nav-link font-syne text-lg md:text-xl tracking-wide font-semibold uppercase mix-blend-difference pointer-events-auto relative py-1 overflow-hidden group focus:outline-none focus:ring-2 focus:ring-champagne/25 ${
            currentPage === "home" ? "text-gray-400" : "text-white"
          }`}
          data-page="home"
        >
          <span>LUMIS</span>
          <span
            className={`absolute bottom-0 left-0 w-full h-[1px] bg-champagne transform origin-left transition-transform duration-300 ${
              currentPage === "home" ? "scale-x-100" : "scale-x-0"
            }`}
          ></span>
        </a>
        <div className="pointer-events-auto flex items-center gap-3 md:hidden">
          <a
            href="./contact.html"
            className={`nav-link inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-[10px] tracking-[0.35em] uppercase transition-colors duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-champagne/20 ${
              currentPage === "contact"
                ? "text-gray-400 border-champagne/50"
                : "text-white hover:text-gray-300 hover:border-champagne/40"
            }`}
            data-page="contact"
            aria-current={currentPage === "contact" ? "page" : undefined}
          >
            Contact
          </a>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="nav-link inline-flex items-center gap-3 rounded-full border border-white/15 px-4 py-2 text-[10px] tracking-[0.35em] uppercase text-white transition-colors duration-200 ease-out hover:text-gray-300 hover:border-champagne/40 focus:outline-none focus:ring-2 focus:ring-champagne/20"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            <span
              className={`relative flex h-3 w-4 items-center justify-center transition-transform duration-300 ease-out ${
                isMobileMenuOpen ? "rotate-45" : "rotate-0"
              }`}
            >
              <span
                className={`absolute h-px w-4 bg-current transition-transform duration-300 ease-out ${
                  isMobileMenuOpen ? "translate-y-0 rotate-90" : "-translate-y-[4px]"
                }`}
              ></span>
              <span
                className={`absolute h-px w-4 bg-current transition-transform duration-300 ease-out ${
                  isMobileMenuOpen ? "scale-x-0" : "translate-y-[4px]"
                }`}
              ></span>
            </span>
            <span>{isMobileMenuOpen ? "Close" : "Menu"}</span>
          </button>
        </div>
        <nav className="hidden md:flex space-x-6 md:space-x-10 text-xs md:text-sm tracking-wide uppercase font-normal mix-blend-difference pointer-events-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPage === item.page;

            return (
              <a
                key={item.page}
                href={item.href}
                className={`nav-link relative py-1 overflow-hidden group transition-colors duration-200 ease-out text-xs md:text-sm font-normal tracking-wide focus:outline-none focus:ring-2 focus:ring-champagne/20 rounded-sm ${
                  isActive
                    ? "text-gray-400"
                    : "text-white hover:text-gray-300 focus:text-gray-300"
                }`}
                data-page={item.page}
                aria-current={isActive ? "page" : undefined}
              >
                <span>{item.label}</span>
                <span
                  className={`absolute bottom-0 left-0 w-full h-[1px] bg-gray-400 transform origin-left transition-transform duration-300 ease-out ${
                    isActive
                      ? "scale-x-100 bg-champagne"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </a>
            );
          })}
        </nav>
      </header>

      <div
        id="mobile-navigation"
        className={`fixed inset-x-0 top-[72px] z-[119] md:hidden transition-all duration-300 ease-out ${
          isMobileMenuOpen
            ? "pointer-events-auto opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 -translate-y-2"
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="mx-4 rounded-[28px] border border-white/10 bg-black/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
          <div className="px-5 pt-5 pb-3 border-b border-white/5 flex items-center justify-between">
            <span className="text-[10px] tracking-[0.35em] uppercase text-champagne/70 font-syne">
              Navigation
            </span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-gray-500">
              LUMIS STUDIO
            </span>
          </div>
          <nav className="px-5 py-4 space-y-2">
            {NAV_ITEMS.map((item, index) => {
              const isActive = currentPage === item.page;

              return (
                <a
                  key={item.page}
                  href={item.href}
                  data-page={item.page}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ transitionDelay: `${index * 60}ms` }}
                  className={`nav-link flex items-center justify-between rounded-2xl border px-4 py-4 font-syne text-lg uppercase tracking-wide transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-champagne/20 ${
                    isMobileMenuOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-2 opacity-0"
                  } ${
                    isActive
                      ? "border-champagne/40 bg-white/5 text-gray-300"
                      : "border-white/10 text-white hover:border-champagne/30 hover:bg-white/5 hover:text-gray-200"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-gray-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      <main id="global-main" className="relative min-h-screen w-full">
        {currentPage === "home" && <HomePage />}
        {currentPage === "portfolio" && <PortfolioPage />}
        {currentPage === "services" && <ServicesPage />}
        {currentPage === "about" && <AboutPage />}
        {currentPage === "journal" && <JournalPage />}
        {currentPage === "contact" && <ContactPage />}
      </main>
    </>
  );
}

function HomePage() {
  return (
    <section
      id="page-home"
      className="page-section min-h-screen flex flex-col justify-start"
    >
      <div className="scroll-block min-h-screen flex flex-col justify-center px-6 py-24 md:px-12 max-w-7xl mx-auto w-full">
        <div className="relative min-h-screen w-full overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            src=""
          />
          <div className="absolute bottom-20 md:bottom-24 left-8 md:left-12 max-w-4xl z-10 space-y-6 xl:pr-8 overflow-hidden">
            <Eyebrow>LUMIS STUDIO</Eyebrow>
            <h1 className="text-3xl md:text-5xl xl:text-6xl font-syne font-extrabold uppercase leading-[0.88] tracking-tight text-reveal max-w-[10ch] sm:max-w-[12ch]">
              WE SHOOT
              <br />
              WHAT OTHERS
              <br />
              MISS.
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-md font-light leading-relaxed text-reveal-p">
              Portraits, campaigns, editorials, and events with a clean edge and
              a sharp eye.
            </p>
            <div className="pt-4 flex flex-wrap gap-3 initial-hide">
              <a
                href="./portfolio.html"
                className="px-6 py-3 border border-white/20 hover:border-champagne hover:text-champagne rounded-full text-xs uppercase tracking-widest transition-all duration-300"
              >
                View Portfolio
              </a>
              <a
                href="./contact.html"
                className="px-6 py-3 border border-white/10 hover:border-champagne/60 rounded-full text-xs uppercase tracking-widest transition-all duration-300 text-gray-300"
              >
                Book a Shoot
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-block bg-darkgray py-32 px-6 md:px-12 w-full border-t border-white/5">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-4">
              <Eyebrow>Three ways in</Eyebrow>
              <h2 className="text-3xl md:text-5xl font-syne font-extrabold uppercase tracking-tight text-reveal">
                Portrait.
                <br />
                Commercial.
                <br />
                Editorial.
              </h2>
            </div>
            <p className="text-gray-400 text-sm max-w-sm font-light leading-relaxed text-reveal-p">
              Three direct entry points into the studio. Each link leads to the
              same standard: disciplined, cinematic, ready to publish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            {HOME_TEASERS.map((item) => (
              <a key={item.title} href={item.href} className="space-y-4 group">
                <div className="aspect-[3/4] w-full reveal-img-container rounded-xl">
                  <img
                    src={item.image}
                    alt={`${item.title} teaser placeholder`}
                    className="w-full h-full object-cover reveal-img"
                  />
                </div>
                <div className="flex justify-between items-start pt-2 initial-hide">
                  <div>
                    <h4 className="font-syne text-lg uppercase tracking-wider group-hover:text-champagne transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">{item.label}</p>
                  </div>
                  <span className="text-xs text-champagne font-medium tracking-widest">
                    01
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <PageFooter />
    </section>
  );
}

function PortfolioPage() {
  return (
    <section
      id="page-portfolio"
      className="page-section min-h-screen flex flex-col justify-start"
    >
      <div className="scroll-block min-h-screen flex flex-col justify-center px-6 py-24 md:px-12 max-w-7xl mx-auto w-full">
        <div className="space-y-6 max-w-3xl">
          <Eyebrow>Selected work</Eyebrow>
          <h1 className="text-4xl md:text-6xl xl:text-7xl font-syne font-extrabold uppercase leading-[0.92] tracking-tight text-reveal">
            EVERY FRAME
            <br />
            TELLS A STORY.
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl font-light leading-relaxed text-reveal-p">
            Six shoots. Six directions. Same studio discipline.
          </p>
        </div>
      </div>

      <div className="scroll-block bg-darkgray py-32 px-6 md:px-12 w-full border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {PORTFOLIO_PROJECTS.map((project) => (
              <article key={project.title} className="space-y-4 group">
                <div className="aspect-[3/4] w-full reveal-img-container rounded-xl overflow-hidden">
                  <img
                    src={project.image}
                    alt={`${project.title} placeholder`}
                    className="w-full h-full object-cover reveal-img"
                  />
                </div>
                <div className="flex justify-between items-start pt-2 initial-hide gap-4">
                  <div>
                    <span className="text-xs tracking-[0.3em] text-champagne uppercase font-medium block mb-2">
                      {project.category}
                    </span>
                    <h3 className="font-syne text-lg uppercase tracking-wider group-hover:text-champagne transition-colors duration-300">
                      {project.title}
                    </h3>
                  </div>
                  <span className="text-xs text-gray-500 tracking-widest uppercase text-right">
                    {project.location}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <PageFooter />
    </section>
  );
}

function ServicesPage() {
  return (
    <section
      id="page-services"
      className="page-section min-h-screen flex flex-col justify-start"
    >
      <div className="scroll-block min-h-screen flex flex-col justify-center px-6 py-24 md:px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-1 gap-10 lg:gap-16 items-start my-auto">
          <div className="lg:col-span-6 xl:col-span-1 space-y-6 pr-6 lg:pr-12 overflow-hidden">
            <Eyebrow>Studio services</Eyebrow>
            <h1 className="text-4xl md:text-6xl xl:text-7xl font-syne font-extrabold uppercase leading-[0.92] tracking-tight text-reveal max-w-[40ch] md:max-w-[48ch] lg:max-w-[34ch]">
              BUILT FOR
              <br />
              EVERY SHOOT.
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-xl font-light leading-relaxed text-reveal-p">
              One studio. Four ways to move. Sharp, simple, and ready to book.
            </p>
          </div>

          <div className="lg:col-span-6 xl:col-span-1 flex flex-col justify-center items-end gap-8 px-4 relative z-10">
            {SERVICES.map((service) => (
              <article
                key={service.title}
                className="w-full max-w-md p-8 border border-white/5 rounded-2xl bg-dark hover:border-champagne/40 transition-colors duration-500 space-y-4 initial-hide"
              >
                <span className="text-champagne font-syne text-xl">
                  {service.number}
                </span>
                <h2 className="font-syne text-xl uppercase tracking-wide">
                  {service.title}
                </h2>
                <p className="text-gray-400 text-sm font-light leading-relaxed max-w-lg">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="scroll-block bg-darkgray py-24 px-6 md:px-12 w-full border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <Eyebrow>Start here</Eyebrow>
            <h2 className="text-3xl md:text-5xl font-syne font-extrabold uppercase tracking-tight text-reveal">
              Send the brief.
              <br />
              We will shape the frame.
            </h2>
          </div>
          <a
            href="./contact.html"
            className="px-6 py-3 border border-white/20 hover:border-champagne hover:text-champagne rounded-full text-xs uppercase tracking-widest transition-all duration-300 inline-flex self-start"
          >
            Contact the Studio
          </a>
        </div>
      </div>

      <PageFooter />
    </section>
  );
}

function AboutPage() {
  return (
    <section
      id="page-about"
      className="page-section min-h-screen flex flex-col justify-start"
    >
      <div className="scroll-block min-h-screen flex flex-col justify-center px-6 py-24 md:px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:items-start my-auto">
          <div className="lg:col-span-7 space-y-6 xl:pr-8">
            <Eyebrow>About the studio</Eyebrow>
            <h1 className="text-4xl md:text-6xl xl:text-7xl font-syne font-extrabold uppercase leading-[0.88] tracking-tight text-reveal max-w-[10ch] sm:max-w-[12ch]">
              OBSESSED
              <br />
              WITH THE
              <br />
              FRAME.
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-xl font-light leading-relaxed text-reveal-p">
              LUMIS STUDIO is a lean photography practice built for portraits,
              brands, fashion, and live moments that need a sharper eye.
            </p>
            <div className="pt-4 grid grid-cols-3 gap-4 initial-hide max-w-lg">
              <div className="p-4 border border-white/5 rounded-xl bg-darkgray">
                <span className="block text-3xl font-syne font-bold text-champagne">
                  350+
                </span>
                <span className="text-xs text-gray-500 uppercase tracking-widest mt-2 block">
                  Shoots
                </span>
              </div>
              <div className="p-4 border border-white/5 rounded-xl bg-darkgray">
                <span className="block text-3xl font-syne font-bold text-champagne">
                  12
                </span>
                <span className="text-xs text-gray-500 uppercase tracking-widest mt-2 block">
                  Countries
                </span>
              </div>
              <div className="p-4 border border-white/5 rounded-xl bg-darkgray">
                <span className="block text-3xl font-syne font-bold text-champagne">
                  8
                </span>
                <span className="text-xs text-gray-500 uppercase tracking-widest mt-2 block">
                  Years
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 xl:mt-20 xl:self-start">
            <div className="w-full aspect-[4/5] reveal-img-container rounded-2xl shadow-2xl shadow-black/40">
              <img
                src="/img/about-studio.svg"
                alt="Studio interior placeholder"
                className="w-full h-full object-cover reveal-img"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-block bg-darkgray py-32 px-6 md:px-12 w-full border-t border-white/5">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-4 max-w-3xl">
            <Eyebrow>Three rules</Eyebrow>
            <h2 className="text-3xl md:text-5xl font-syne font-extrabold uppercase tracking-tight text-reveal">
              We keep it tight.
              <br />
              We keep it clean.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            {VALUES.map((value) => (
              <article
                key={value.title}
                className="p-8 border border-white/5 rounded-2xl bg-dark space-y-4 initial-hide"
              >
                <h3 className="font-syne text-xl uppercase tracking-wide">
                  {value.title}
                </h3>
                <p className="text-gray-400 text-sm font-light leading-relaxed">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <PageFooter />
    </section>
  );
}

function JournalPage() {
  return (
    <section
      id="page-journal"
      className="page-section min-h-screen flex flex-col justify-start"
    >
      <div className="scroll-block min-h-screen flex flex-col justify-center px-6 py-24 md:px-12 max-w-7xl mx-auto w-full">
        <div className="space-y-6 max-w-4xl mx-auto">
          <Eyebrow>Journal</Eyebrow>
          <h1 className="text-4xl md:text-6xl xl:text-7xl font-syne font-extrabold uppercase leading-[0.92] tracking-tight text-reveal">
            THOUGHTS ON
            <br />
            LIGHT, CRAFT &amp;
            <br />
            VISION.
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl font-light leading-relaxed text-reveal-p">
            Short notes from the studio floor. Clear, direct, and useful.
          </p>
        </div>
      </div>

      <div className="scroll-block bg-darkgray py-32 px-6 md:px-12 w-full border-t border-white/5">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {JOURNAL_POSTS.map((post) => (
              <article
                key={post.id}
                className="space-y-4 group border border-white/5 rounded-2xl bg-dark p-4 md:p-5"
              >
                <div className="aspect-[4/3] w-full reveal-img-container rounded-xl overflow-hidden">
                  <img
                    src={post.image}
                    alt={`${post.title} placeholder`}
                    className="w-full h-full object-cover reveal-img"
                  />
                </div>
                <div className="space-y-3 initial-hide">
                  <span className="text-xs tracking-[0.3em] text-champagne uppercase font-medium block">
                    {post.category}
                  </span>
                  <h3 className="font-syne text-lg uppercase tracking-wider group-hover:text-champagne transition-colors duration-300">
                    {post.title}
                  </h3>
                  <a
                    href={`#${post.id}`}
                    className="text-xs uppercase tracking-[0.3em] text-gray-400 hover:text-champagne transition-colors duration-300"
                  >
                    Read More
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {JOURNAL_POSTS.map((post) => (
              <article
                key={`${post.id}-detail`}
                id={post.id}
                className="p-6 border border-white/5 rounded-2xl bg-dark space-y-3 initial-hide scroll-mt-24"
              >
                <span className="text-xs tracking-[0.3em] text-champagne uppercase font-medium block">
                  {post.category}
                </span>
                <h4 className="font-syne text-xl uppercase tracking-wide">
                  {post.title}
                </h4>
                <p className="text-gray-400 text-sm font-light leading-relaxed">
                  {post.excerpt}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <PageFooter />
    </section>
  );
}

function ContactPage() {
  return (
    <section
      id="page-contact"
      className="page-section min-h-screen flex flex-col justify-start"
    >
      <div className="scroll-block min-h-screen flex flex-col justify-center px-6 py-24 md:px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-1 gap-12 lg:gap-16 items-start my-auto">
          <div className="lg:col-span-5 space-y-6">
            <Eyebrow>Contact</Eyebrow>
            <h1 className="text-4xl md:text-6xl xl:text-7xl font-syne font-extrabold uppercase leading-[0.92] tracking-tight text-reveal">
              LET&apos;S MAKE
              <br />
              SOMETHING GREAT.
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-xl font-light leading-relaxed text-reveal-p">
              Tell us what you need. We will reply with a clean plan and a fast
              next step.
            </p>
          </div>

          <div className="lg:col-span-7">
            <form
              className="grid gap-4 p-6 md:p-8 border border-white/5 rounded-2xl bg-dark"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-2 initial-hide">
                  <span className="text-xs uppercase tracking-[0.3em] text-gray-400 block">
                    Name
                  </span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    className="w-full rounded-xl border border-white/10 bg-darkgray px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-champagne transition-colors duration-300"
                  />
                </label>
                <label className="space-y-2 initial-hide">
                  <span className="text-xs uppercase tracking-[0.3em] text-gray-400 block">
                    Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-darkgray px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-champagne transition-colors duration-300"
                  />
                </label>
              </div>

              <label className="space-y-2 initial-hide">
                <span className="text-xs uppercase tracking-[0.3em] text-gray-400 block">
                  Shoot Type
                </span>
                <select className="w-full rounded-xl border border-white/10 bg-darkgray px-4 py-3 text-sm text-white outline-none focus:border-champagne transition-colors duration-300">
                  <option>Portrait</option>
                  <option>Commercial</option>
                  <option>Editorial</option>
                  <option>Event</option>
                </select>
              </label>

              <label className="space-y-2 initial-hide">
                <span className="text-xs uppercase tracking-[0.3em] text-gray-400 block">
                  Project description
                </span>
                <textarea
                  name="message"
                  rows="6"
                  placeholder="Tell us about the shoot, timing, and what the images need to do."
                  className="w-full rounded-2xl border border-white/10 bg-darkgray px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-champagne transition-colors duration-300 resize-none"
                ></textarea>
              </label>

              <div className="pt-2 initial-hide">
                <button
                  type="submit"
                  className="px-6 py-3 border border-white/20 hover:border-champagne hover:text-champagne rounded-full text-xs uppercase tracking-widest transition-all duration-300"
                >
                  Submit Brief
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="scroll-block bg-darkgray py-24 px-6 md:px-12 w-full border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border border-white/5 rounded-2xl bg-dark space-y-3 initial-hide">
            <span className="text-xs tracking-[0.3em] text-champagne uppercase font-medium block">
              Location
            </span>
            <p className="text-sm text-gray-300">Austin, TX</p>
          </div>
          <div className="p-6 border border-white/5 rounded-2xl bg-dark space-y-3 initial-hide">
            <span className="text-xs tracking-[0.3em] text-champagne uppercase font-medium block">
              Email
            </span>
            <p className="text-sm text-gray-300">hello@lumisstudio.com</p>
          </div>
          <div className="p-6 border border-white/5 rounded-2xl bg-dark space-y-3 initial-hide">
            <span className="text-xs tracking-[0.3em] text-champagne uppercase font-medium block">
              Response time
            </span>
            <p className="text-sm text-gray-300">Within 24 hours</p>
          </div>
        </div>
      </div>

      <PageFooter />
    </section>
  );
}

export default App;
