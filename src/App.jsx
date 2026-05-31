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
    image: "./img/home-portrait.svg",
  },
  {
    title: "Commercial",
    label: "Brand work",
    href: "./portfolio.html",
    image: "./img/home-commercial.svg",
  },
  {
    title: "Editorial",
    label: "Story-led",
    href: "./portfolio.html",
    image: "./img/home-editorial.svg",
  },
];

const PORTFOLIO_PROJECTS = [
  {
    title: "Northlight Portraits",
    category: "Portrait",
    location: "Brooklyn, NY",
    image: "./img/portfolio-portrait-01.svg",
  },
  {
    title: "Quiet Launch",
    category: "Commercial",
    location: "Austin, TX",
    image: "./img/portfolio-commercial-01.svg",
  },
  {
    title: "Field Notes",
    category: "Editorial",
    location: "Paris, FR",
    image: "./img/portfolio-editorial-01.svg",
  },
  {
    title: "After Hours",
    category: "Event",
    location: "New York, NY",
    image: "./img/portfolio-event-01.svg",
  },
  {
    title: "Low Tide Portraits",
    category: "Portrait",
    location: "Reykjavik, IS",
    image: "./img/portfolio-portrait-02.svg",
  },
  {
    title: "Surface Study",
    category: "Commercial",
    location: "Los Angeles, CA",
    image: "./img/portfolio-commercial-02.svg",
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
    image: "./img/journal-light.svg",
    excerpt:
      "The cleanest frame usually begins by removing too much light, not adding more.",
  },
  {
    id: "craft",
    title: "The Value of a Tighter Edit",
    category: "Craft",
    image: "./img/journal-craft.svg",
    excerpt:
      "A better selection always feels smaller. That restraint is what gives the image force.",
  },
  {
    id: "vision",
    title: "What We Look For Before the Shoot Starts",
    category: "Vision",
    image: "./img/journal-vision.svg",
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
  const currentPageRef = useRef(currentPage);
  const bootedRef = useRef(false);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    if (!bootedRef.current) return;

    const { ScrollTrigger } = window;
    if (ScrollTrigger) {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

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

    function prepareTextAnimations() {
      const textReveals = document.querySelectorAll(".text-reveal");
      textReveals.forEach((el) => {
        const lines = el.innerHTML.split("<br>");
        let formattedHTML = "";

        lines.forEach((line, index) => {
          const cleanLine = line.trim();
          let lineHTML = "";

          for (const char of cleanLine) {
            if (char === " ") {
              lineHTML += '<span class="inline-block w-2 md:w-3">&nbsp;</span>';
            } else {
              lineHTML += `<span class="reveal-char">${char}</span>`;
            }
          }

          formattedHTML +=
            '<span class="inline-block whitespace-nowrap">' +
            lineHTML +
            "</span>";

          if (index < lines.length - 1) {
            formattedHTML += "<br>";
          }
        });

        el.innerHTML = formattedHTML;
      });
    }

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
          <div className="w-8 h-[1px] bg-champagne/20 mx-auto mb-2"></div>
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
          <div className="w-8 h-[1px] bg-champagne/20 mx-auto mt-2"></div>
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
        className="fixed top-0 left-0 w-full z-[120] px-6 py-6 md:px-12 flex justify-between items-center pointer-events-none mix-blend-difference"
      >
        <a
          href="./index.html"
          className={`nav-link font-syne text-xl tracking-widest font-bold uppercase mix-blend-difference pointer-events-auto relative py-1 overflow-hidden group ${
            currentPage === "home" ? "text-champagne" : "text-white"
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
        <nav className="flex space-x-6 md:space-x-10 text-sm tracking-widest uppercase font-medium mix-blend-difference pointer-events-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPage === item.page;

            return (
              <a
                key={item.page}
                href={item.href}
                className={`nav-link relative py-1 overflow-hidden group transition-colors duration-300 ${
                  isActive ? "text-champagne" : "text-gray-400 hover:text-white"
                }`}
                data-page={item.page}
                aria-current={isActive ? "page" : undefined}
              >
                <span>{item.label}</span>
                <span
                  className={`absolute bottom-0 left-0 w-full h-[1px] bg-white transform origin-left transition-transform duration-300 group-hover:scale-x-100 ${
                    isActive ? "scale-x-100 bg-champagne" : "scale-x-0"
                  }`}
                ></span>
              </a>
            );
          })}
        </nav>
      </header>

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center my-auto">
          <div className="lg:col-span-6 space-y-6">
            <Eyebrow>LUMIS STUDIO</Eyebrow>
            <h1 className="text-4xl md:text-6xl xl:text-7xl font-syne font-extrabold uppercase leading-[0.92] tracking-tight text-reveal">
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

          <div className="lg:col-span-6 flex justify-center items-center">
            <a
              href="./portfolio.html"
              className="group block w-full max-w-lg aspect-[4/5] reveal-img-container rounded-2xl shadow-2xl shadow-black/50 relative overflow-hidden"
            >
              <img
                src="./img/home-golden-hour.svg"
                alt="Golden hour portrait session placeholder"
                className="w-full h-full object-cover reveal-img"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-80"></div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end gap-4">
                <div>
                  <span className="text-xs text-champagne/80 tracking-wider uppercase">
                    Featured Session
                  </span>
                  <h3 className="font-syne text-lg uppercase tracking-wide">
                    THE GOLDEN HOUR SESSION
                  </h3>
                </div>
                <span className="text-xs text-white/50 tracking-widest uppercase text-right">
                  Austin, TX
                </span>
              </div>
            </a>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start my-auto">
          <div className="lg:col-span-6 space-y-6">
            <Eyebrow>Studio services</Eyebrow>
            <h1 className="text-4xl md:text-6xl xl:text-7xl font-syne font-extrabold uppercase leading-[0.92] tracking-tight text-reveal">
              BUILT FOR
              <br />
              EVERY SHOOT.
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-xl font-light leading-relaxed text-reveal-p">
              One studio. Four ways to move. Sharp, simple, and ready to book.
            </p>
          </div>

          <div className="lg:col-span-6 grid gap-4">
            {SERVICES.map((service) => (
              <article
                key={service.title}
                className="p-8 border border-white/5 rounded-2xl bg-dark hover:border-champagne/40 transition-colors duration-500 space-y-4 initial-hide"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center my-auto">
          <div className="lg:col-span-6 space-y-6">
            <Eyebrow>About the studio</Eyebrow>
            <h1 className="text-4xl md:text-6xl xl:text-7xl font-syne font-extrabold uppercase leading-[0.92] tracking-tight text-reveal">
              OBSESSED
              <br />
              WITH THE FRAME.
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

          <div className="lg:col-span-6">
            <div className="w-full aspect-[4/5] reveal-img-container rounded-2xl shadow-2xl shadow-black/40">
              <img
                src="./img/about-studio.svg"
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
        <div className="space-y-6 max-w-4xl">
          <Eyebrow>Journal</Eyebrow>
          <h1 className="text-4xl md:text-6xl xl:text-7xl font-syne font-extrabold uppercase leading-[0.92] tracking-tight text-reveal">
            THOUGHTS ON
            <br />
            LIGHT, CRAFT &amp; VISION.
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start my-auto">
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
