import { useEffect } from "react";

export default function App() {
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

    let currentPage = "home";
    let isTransitioning = false;
    let toastTimeout;
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
              lineHTML += '<span class="reveal-char">' + char + "</span>";
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

    function resetPageElements(pageId) {
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
      const page = document.getElementById(`page-${pageId}`);
      if (!page) return;

      page.classList.remove("hidden");

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
        setupScrollTriggers("home");
      }, "-=0.8");

      tl.set(strips, { x: "-100%" });
    }

    function setupNavigation() {
      const navLinks = document.querySelectorAll(".nav-link");

      navLinks.forEach((link) => {
        const handler = (event) => {
          event.preventDefault();

          const targetPage = link.getAttribute("data-target");
          if (targetPage === currentPage || isTransitioning) return;

          executePageTransition(targetPage);
        };

        link.addEventListener("click", handler);
        navCleanup.push(() => link.removeEventListener("click", handler));
      });
    }

    function executePageTransition(targetPage) {
      isTransitioning = true;
      document.body.classList.add("no-scroll");

      const currentActiveSection = document.getElementById(
        `page-${currentPage}`,
      );
      const targetSection = document.getElementById(`page-${targetPage}`);
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
          duration: 0.6,
          stagger: 0.01,
          ease: "power2.in",
        });
      }

      transitionTimeline.to(
        strips,
        {
          x: "0%",
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.inOut",
        },
        "-=0.3",
      );

      transitionTimeline.add(() => {
        document.querySelectorAll(".nav-link").forEach((link) => {
          const isTarget = link.getAttribute("data-target") === targetPage;
          const lineSpan = link.querySelector("span:nth-child(2)");

          if (isTarget) {
            link.classList.add("text-champagne");
            link.classList.remove("text-gray-400", "hover:text-white");
            if (lineSpan) lineSpan.classList.add("scale-x-100");
          } else {
            link.classList.remove("text-champagne");
            link.classList.add("text-gray-400", "hover:text-white");
            if (lineSpan) lineSpan.classList.remove("scale-x-100");
          }
        });

        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

        if (currentActiveSection) currentActiveSection.classList.add("hidden");
        if (targetSection) targetSection.classList.remove("hidden");

        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        resetPageElements(targetPage);
        currentPage = targetPage;
      });

      transitionTimeline.to(strips, {
        x: "100%",
        duration: 0.8,
        stagger: 0.06,
        ease: "power3.inOut",
      });

      transitionTimeline.add(() => {
        setupScrollTriggers(targetPage);
      }, "-=0.6");

      transitionTimeline.set(strips, { x: "-100%" });
    }

    function hideToast() {
      const toast = document.getElementById("toast");
      toast.style.transform = "translateY(100px)";
      toast.style.opacity = "0";
    }

    function showToast() {
      const toast = document.getElementById("toast");
      toast.style.transform = "translateY(0px)";
      toast.style.opacity = "1";

      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(hideToast, 4000);
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
          href="#"
          className="nav-link font-syne text-xl tracking-widest font-bold uppercase mix-blend-difference pointer-events-auto"
          data-target="home"
        >
          LUMIS STUDIO
        </a>
        <nav className="flex space-x-8 md:space-x-16 text-sm tracking-widest uppercase font-medium mix-blend-difference pointer-events-auto">
          <button
            type="button"
            className="nav-link relative py-1 overflow-hidden group text-champagne"
            data-target="home"
          >
            <span>Showcase</span>
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-champagne transform origin-left transition-transform duration-300 scale-x-100 group-hover:scale-x-0"></span>
          </button>
          <button
            type="button"
            className="nav-link relative py-1 overflow-hidden group text-gray-400 hover:text-white transition-colors duration-300"
            data-target="studio"
          >
            <span>The Studio</span>
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100"></span>
          </button>
        </nav>
      </header>

      <main id="global-main" className="relative min-h-screen w-full">
        <section
          id="page-home"
          className="page-section min-h-screen flex flex-col justify-start"
        >
          <div className="scroll-block min-h-screen flex flex-col justify-center px-6 py-24 md:px-12 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center my-auto">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs tracking-[0.3em] text-champagne uppercase font-medium block initial-hide">
                  FEATURED EXHIBITION
                </span>
                <h1
                  className="text-4xl md:text-6xl xl:text-7xl font-syne font-extrabold uppercase leading-[0.95] tracking-tight text-reveal"
                  data-delay="0.1"
                >
                  Shaping
                  <br />
                  Invisible
                  <br />
                  Realms.
                </h1>
                <p
                  className="text-gray-400 text-sm md:text-base max-w-md font-light leading-relaxed text-reveal-p"
                  data-delay="0.8"
                >
                  A digital exploration mapping organic contours against rigid
                  architectural grids. Discovering beauty in the spaces left
                  entirely unsaid.
                </p>
                <div className="pt-4 initial-hide">
                  <button
                    type="button"
                    className="px-6 py-3 border border-white/20 hover:border-champagne hover:text-champagne rounded-full text-xs uppercase tracking-widest transition-all duration-300 hover:scale-105"
                  >
                    Explore Gallery
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 flex justify-center items-center">
                <div className="w-full max-w-lg aspect-[4/5] reveal-img-container rounded-2xl shadow-2xl shadow-black/50">
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"
                    alt="Minimalist Architecture"
                    className="w-full h-full object-cover reveal-img"
                    onError={(event) => {
                      event.currentTarget.src =
                        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div>
                      <span className="text-xs text-champagne/80 tracking-wider uppercase">
                        01 / Curated
                      </span>
                      <h3 className="font-syne text-lg uppercase tracking-wide">
                        The Obsidian Villa
                      </h3>
                    </div>
                    <span className="text-xs text-white/50 tracking-widest uppercase">
                      Tokyo, JP
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="scroll-block bg-darkgray py-32 px-6 md:px-12 w-full border-t border-white/5">
            <div className="max-w-7xl mx-auto space-y-16">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-4">
                  <span className="text-xs tracking-[0.3em] text-champagne uppercase font-medium block initial-hide">
                    SELECT ARCHIVES
                  </span>
                  <h2 className="text-3xl md:text-5xl font-syne font-extrabold uppercase tracking-tight text-reveal">
                    Spatial
                    <br />
                    Studios.
                  </h2>
                </div>
                <p className="text-gray-400 text-sm max-w-sm font-light leading-relaxed text-reveal-p">
                  A showcase of our spatial studies, capturing environments that
                  manipulate local luminescence, negative space, and raw
                  material weight.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
                <div className="space-y-4 group cursor-pointer">
                  <div className="aspect-[3/4] w-full reveal-img-container rounded-xl">
                    <img
                      src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
                      alt="Brutalist Pavilion"
                      className="w-full h-full object-cover reveal-img"
                    />
                  </div>
                  <div className="flex justify-between items-start pt-2 initial-hide">
                    <div>
                      <h4 className="font-syne text-lg uppercase tracking-wider group-hover:text-champagne transition-colors duration-300">
                        Brutalist Shell
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Monolithic Concrete Structure
                      </p>
                    </div>
                    <span className="text-xs text-champagne font-medium tracking-widest">
                      2025
                    </span>
                  </div>
                </div>

                <div className="space-y-4 group cursor-pointer">
                  <div className="aspect-[3/4] w-full reveal-img-container rounded-xl">
                    <img
                      src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800"
                      alt="Luminous Loft"
                      className="w-full h-full object-cover reveal-img"
                    />
                  </div>
                  <div className="flex justify-between items-start pt-2 initial-hide">
                    <div>
                      <h4 className="font-syne text-lg uppercase tracking-wider group-hover:text-champagne transition-colors duration-300">
                        Luminous Loft
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Diffused Lighting Philosophy
                      </p>
                    </div>
                    <span className="text-xs text-champagne font-medium tracking-widest">
                      2026
                    </span>
                  </div>
                </div>

                <div className="space-y-4 group cursor-pointer md:col-span-2 lg:col-span-1">
                  <div className="aspect-[3/4] w-full reveal-img-container rounded-xl">
                    <img
                      src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800"
                      alt="Aqueous Atrium"
                      className="w-full h-full object-cover reveal-img"
                    />
                  </div>
                  <div className="flex justify-between items-start pt-2 initial-hide">
                    <div>
                      <h4 className="font-syne text-lg uppercase tracking-wider group-hover:text-champagne transition-colors duration-300">
                        Aqueous Atrium
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Reflective Pool Installations
                      </p>
                    </div>
                    <span className="text-xs text-champagne font-medium tracking-widest">
                      2026
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="scroll-block py-32 px-6 md:px-12 w-full bg-dark">
            <div className="max-w-5xl mx-auto text-center space-y-12">
              <span className="text-xs tracking-[0.4em] text-champagne uppercase font-medium block initial-hide">
                THE CORE MANIFESTO
              </span>
              <h3 className="text-3xl md:text-5xl lg:text-6xl font-syne font-extrabold uppercase leading-[1.1] tracking-tight text-reveal">
                We strip away
                <br />
                noise until only
                <br />
                resonance remains.
              </h3>
              <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto font-light leading-relaxed text-reveal-p">
                Architecture is more than physical envelopes; it is the
                choreographing of light, shadow, and air. Our spaces do not
                command your attention—they gently return you to yourself.
              </p>
              <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto initial-hide">
                <div className="p-6 border border-white/5 rounded-xl bg-darkgray">
                  <span className="block text-3xl font-syne font-bold text-champagne">
                    14
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-widest mt-2 block">
                    Global Offices
                  </span>
                </div>
                <div className="p-6 border border-white/5 rounded-xl bg-darkgray">
                  <span className="block text-3xl font-syne font-bold text-champagne">
                    120k
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-widest mt-2 block">
                    Sq. Meters Built
                  </span>
                </div>
                <div className="p-6 border border-white/5 rounded-xl bg-darkgray">
                  <span className="block text-3xl font-syne font-bold text-champagne">
                    08
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-widest mt-2 block">
                    Monographs
                  </span>
                </div>
                <div className="p-6 border border-white/5 rounded-xl bg-darkgray">
                  <span className="block text-3xl font-syne font-bold text-champagne">
                    99%
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-widest mt-2 block">
                    Pure Silence
                  </span>
                </div>
              </div>
            </div>
          </div>

          <footer className="py-12 border-t border-white/5 w-full bg-darkgray px-6 md:px-12 text-center text-xs text-gray-500 uppercase tracking-widest">
            <p>© 2026 LUMIS STUDIO. Built for timeless design interfaces.</p>
          </footer>
        </section>

        <section
          id="page-studio"
          className="page-section min-h-screen hidden flex flex-col justify-start"
        >
          <div className="scroll-block min-h-screen flex flex-col justify-center px-6 py-24 md:px-12 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center my-auto">
              <div className="lg:col-span-6 grid grid-cols-2 gap-4 order-2 lg:order-1">
                <div className="space-y-4">
                  <div className="aspect-[3/4] w-full reveal-img-container rounded-xl">
                    <img
                      src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=800"
                      alt="Studio Interior"
                      className="w-full h-full object-cover reveal-img"
                      onError={(event) => {
                        event.currentTarget.src =
                          "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800";
                      }}
                    />
                  </div>
                  <div className="aspect-square w-full reveal-img-container rounded-xl">
                    <img
                      src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800"
                      alt="Design Process"
                      className="w-full h-full object-cover reveal-img"
                      onError={(event) => {
                        event.currentTarget.src =
                          "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=800";
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-square w-full reveal-img-container rounded-xl">
                    <img
                      src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
                      alt="Architectural Model"
                      className="w-full h-full object-cover reveal-img"
                      onError={(event) => {
                        event.currentTarget.src =
                          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800";
                      }}
                    />
                  </div>
                  <div className="aspect-[3/4] w-full reveal-img-container rounded-xl">
                    <img
                      src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800"
                      alt="Creative Space"
                      className="w-full h-full object-cover reveal-img"
                      onError={(event) => {
                        event.currentTarget.src =
                          "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800";
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
                <span className="text-xs tracking-[0.3em] text-champagne uppercase font-medium block initial-hide">
                  OUR PHILOSOPHY
                </span>
                <h2
                  className="text-4xl md:text-5xl xl:text-6xl font-syne font-extrabold uppercase leading-[0.95] tracking-tight text-reveal"
                  data-delay="0.1"
                >
                  Crafting
                  <br />
                  Sensory
                  <br />
                  Silence.
                </h2>
                <p
                  className="text-gray-400 text-sm md:text-base max-w-md font-light leading-relaxed text-reveal-p"
                  data-delay="0.8"
                >
                  Lumis Studio is an award-winning interdisciplinary practice
                  specializing in architecture, spatial identity, and immersive
                  sensory design. We build atmospheres, not just structures.
                </p>
                <div className="pt-4 grid grid-cols-2 gap-4 border-t border-white/10 initial-hide">
                  <div>
                    <h4 className="font-syne text-champagne text-sm uppercase tracking-wider">
                      Est. 2018
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Stuttgart & Tokyo
                    </p>
                  </div>
                  <div>
                    <h4 className="font-syne text-champagne text-sm uppercase tracking-wider">
                      30+ Awards
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Design & Experience
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="scroll-block bg-darkgray py-32 px-6 md:px-12 w-full border-t border-white/5">
            <div className="max-w-7xl mx-auto space-y-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 space-y-4">
                  <span className="text-xs tracking-[0.3em] text-champagne uppercase font-medium block initial-hide">
                    WHAT WE OFFER
                  </span>
                  <h2 className="text-3xl md:text-5xl font-syne font-extrabold uppercase tracking-tight text-reveal">
                    Strategic
                    <br />
                    Practices.
                  </h2>
                </div>
                <div className="lg:col-span-8">
                  <p className="text-gray-400 text-base font-light leading-relaxed text-reveal-p">
                    We handle design across multiple scales, transforming
                    abstract briefs into spatial experiences. Our systems ensure
                    high-fidelity delivery from initial concepts to the finished
                    architectural environment.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
                <div className="p-8 border border-white/5 rounded-2xl bg-dark hover:border-champagne/40 transition-colors duration-500 space-y-6 initial-hide">
                  <span className="text-champagne font-syne text-xl">01</span>
                  <h3 className="font-syne text-xl uppercase tracking-wide">
                    Architectural Masterplanning
                  </h3>
                  <p className="text-gray-400 text-sm font-light leading-relaxed">
                    Curating large-scale landscape complexes, residential
                    structures, and experimental interior design layouts that
                    adapt organically to local environmental variables.
                  </p>
                </div>

                <div className="p-8 border border-white/5 rounded-2xl bg-dark hover:border-champagne/40 transition-colors duration-500 space-y-6 initial-hide">
                  <span className="text-champagne font-syne text-xl">02</span>
                  <h3 className="font-syne text-xl uppercase tracking-wide">
                    Spatial Soundscape Design
                  </h3>
                  <p className="text-gray-400 text-sm font-light leading-relaxed">
                    Acoustical architecture crafted to interact naturally with
                    concrete, marble, and wood, generating specialized
                    structural echoes and comforting silences.
                  </p>
                </div>

                <div className="p-8 border border-white/5 rounded-2xl bg-dark hover:border-champagne/40 transition-colors duration-500 space-y-6 initial-hide">
                  <span className="text-champagne font-syne text-xl">03</span>
                  <h3 className="font-syne text-xl uppercase tracking-wide">
                    Luminous Mapping
                  </h3>
                  <p className="text-gray-400 text-sm font-light leading-relaxed">
                    Deep simulation workflows of natural solar tracks across
                    seasons, planning skylight angles and shadow geometries for
                    high-contrast, visually pleasing structures.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="scroll-block py-32 px-6 md:px-12 w-full bg-dark">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 space-y-6">
                <span className="text-xs tracking-[0.3em] text-champagne uppercase font-medium block initial-hide">
                  OUR SANCTUARY
                </span>
                <h2 className="text-3xl md:text-5xl font-syne font-extrabold uppercase leading-[0.95] tracking-tight text-reveal">
                  Designed to
                  <br />
                  Conceive.
                </h2>
                <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed text-reveal-p">
                  Our primary creative studio in Tokyo is a physical embodiment
                  of our philosophies. Flooded with natural top-light, detailed
                  with monolithic sandstone tables, and framed by raw,
                  hand-polished concrete.
                </p>
                <div className="pt-4 initial-hide">
                  <button
                    type="button"
                    className="px-6 py-3 border border-white/20 hover:border-champagne hover:text-champagne rounded-full text-xs uppercase tracking-widest transition-all duration-300"
                  >
                    Book Studio Tour
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="w-full aspect-[16/10] reveal-img-container rounded-2xl shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
                    alt="Modern architectural space"
                    className="w-full h-full object-cover reveal-img"
                  />
                </div>
              </div>
            </div>
          </div>

          <footer className="py-12 border-t border-white/5 w-full bg-darkgray px-6 md:px-12 text-center text-xs text-gray-500 uppercase tracking-widest">
            <p>© 2026 LUMIS STUDIO. Built for timeless design interfaces.</p>
          </footer>
        </section>
      </main>

      <div
        id="toast"
        className="fixed bottom-6 right-6 bg-champagne text-dark px-6 py-4 rounded-xl shadow-2xl transform translate-y-24 opacity-0 transition-all duration-500 z-[55] text-sm font-medium flex items-center gap-3"
      >
        <span>Interactive elements are for aesthetic demonstration.</span>
        <button
          type="button"
          onClick={() => {
            const toast = document.getElementById("toast");
            toast.style.transform = "translateY(100px)";
            toast.style.opacity = "0";
          }}
          className="hover:opacity-75 font-bold"
        >
          ✕
        </button>
      </div>
    </>
  );
}
