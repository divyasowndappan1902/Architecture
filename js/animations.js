/**
 * ARCHITECTURE PRIME — Animation Engine
 * Powered by GSAP 3, ScrollTrigger & Custom Micro-Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP plugins if available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Initialize architectural preloader on all main pages (triggers hero & scroll animations as curtain lifts)
  initPreloader();

  // Always initialize counters & interactive components (independent of external CDNs)
  initCounters();
  initCustomCursor();
  initTimeline();
  initProjectsFilter();
  initTestimonialsSlider();
  initFAQAccordion();
  initLuxuryFAQAccordion();
});

/* -------------------------------------------------------------
   0. ARCHITECTURAL PRELOADER & GSAP HEADING TEXT ENGINE
   ------------------------------------------------------------- */
let pageAnimationsStarted = false;
function startPageAnimations() {
  if (pageAnimationsStarted) return;
  pageAnimationsStarted = true;
  if (typeof gsap !== 'undefined') {
    initSectionHeadingAnimations();
    initHeroAnimations();
    initScrollAnimations();
    initParallax();
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }
}

function initPreloader() {
  const preloader = document.getElementById('pagePreloader');
  const bar = document.getElementById('preloaderBar');
  const counter = document.getElementById('preloaderCounter');

  if (!preloader) {
    startPageAnimations();
    return;
  }

  let dismissed = false;
  function dismissPreloader() {
    if (dismissed) return;
    dismissed = true;
    startPageAnimations();
    preloader.classList.add('preloader-hidden');
    setTimeout(() => {
      preloader.style.display = 'none';
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 650);
  }

  // Fail-safe fallback so the preloader never blocks the page if external scripts stall
  const fallbackTimer = setTimeout(() => {
    dismissPreloader();
  }, 2200);

  if (typeof gsap !== 'undefined') {
    const progressState = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(fallbackTimer);
        dismissPreloader();
      }
    });

    tl.fromTo(
      '.preloader-logo, .preloader-tagline',
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: 'power3.out' }
    )
    .to(
      progressState,
      {
        val: 100,
        duration: 0.85,
        ease: 'power2.inOut',
        onUpdate: () => {
          const pct = Math.round(progressState.val);
          if (bar) bar.style.width = pct + '%';
          if (counter) counter.textContent = (pct < 10 ? '0' : '') + pct + '%';
        }
      },
      '-=0.2'
    )
    .to(
      '.preloader-inner',
      { opacity: 0, y: -24, duration: 0.35, ease: 'power2.in' }
    )
    .to(
      preloader,
      {
        yPercent: -100,
        duration: 0.7,
        ease: 'power4.inOut',
        onStart: () => {
          startPageAnimations();
        }
      },
      '-=0.1'
    );
  } else {
    if (bar) bar.style.width = '100%';
    if (counter) counter.textContent = '100%';
    setTimeout(dismissPreloader, 400);
  }
}

/**
 * Splits a heading element's text nodes into masked word spans (.gsap-word-mask > .gsap-word)
 * while preserving child elements such as <span class="font-serif"> and <br>.
 */
function splitHeadingIntoWords(element) {
  if (!element || element.dataset.gsapSplit === 'true') {
    return element ? element.querySelectorAll('.gsap-word') : [];
  }
  element.dataset.gsapSplit = 'true';

  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (!text || !text.trim()) {
        return document.createTextNode(text);
      }
      const frag = document.createDocumentFragment();
      const tokens = text.split(/(\s+)/);
      tokens.forEach((token) => {
        if (!token) return;
        if (/^\s+$/.test(token)) {
          frag.appendChild(document.createTextNode(' '));
        } else {
          const mask = document.createElement('span');
          mask.className = 'gsap-word-mask';
          const word = document.createElement('span');
          word.className = 'gsap-word';
          word.textContent = token;
          mask.appendChild(word);
          frag.appendChild(mask);
        }
      });
      return frag;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'BR') {
        return node.cloneNode(false);
      }
      const clone = node.cloneNode(false);
      Array.from(node.childNodes).forEach((child) => {
        clone.appendChild(processNode(child));
      });
      return clone;
    }
    return node.cloneNode(true);
  }

  const newChildren = document.createDocumentFragment();
  Array.from(element.childNodes).forEach((child) => {
    newChildren.appendChild(processNode(child));
  });
  element.innerHTML = '';
  element.appendChild(newChildren);

  return element.querySelectorAll('.gsap-word');
}

/**
 * Applies GSAP staggered word reveal animations to all section headings across all pages.
 */
function initSectionHeadingAnimations() {
  if (typeof gsap === 'undefined') return;

  // Pre-split hero headings so they are ready when the preloader lifts
  document.querySelectorAll('.hero-title, .page-hero-title').forEach((heroHeading) => {
    splitHeadingIntoWords(heroHeading);
  });

  // Select all section headings across Home, About, Services, Blog & Contact pages
  const sectionHeadings = document.querySelectorAll(
    '.section-title, .methodology-title, .chronology-main-title, .luxury-faq-title, .awards-intro h2, .newsletter-box h2, .cta-banner-text h2, .faq-info-card h3'
  );

  sectionHeadings.forEach((heading) => {
    const words = splitHeadingIntoWords(heading);
    if (!words.length) return;

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo(
        words,
        {
          yPercent: 115,
          opacity: 0,
          rotateZ: 2.5
        },
        {
          yPercent: 0,
          opacity: 1,
          rotateZ: 0,
          duration: 0.85,
          stagger: 0.045,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    } else {
      gsap.fromTo(
        words,
        { yPercent: 115, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.045, ease: 'power3.out' }
      );
    }
  });
}

/* -------------------------------------------------------------
   1. CUSTOM MAGNETIC CURSOR
   ------------------------------------------------------------- */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const cursorDot = document.querySelector('.custom-cursor-dot');

  if (!cursor || !cursorDot) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Hover states on interactive elements
  const hoverables = document.querySelectorAll('a, button, .project-card, .service-card-luxury, .award-item, .accordion-header, input, textarea, .timeline-node, .chronology-node, .chronology-item, .luxury-faq-header, .luxury-faq-toggle');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
}

/* -------------------------------------------------------------
   2. HERO CINEMATIC REVEAL ANIMATION
   ------------------------------------------------------------- */
function initHeroAnimations() {
  const heroSection = document.querySelector('.hero-section');
  const pageHeroSection = document.querySelector('.page-hero-section');

  if (heroSection) {
    const heroWords = heroSection.querySelectorAll('.hero-title .gsap-word');
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo('.hero-bg-img', 
      { scale: 1.18, filter: 'brightness(0.85) contrast(1.04)' }, 
      { scale: 1.04, filter: 'brightness(0.96) contrast(1.04)', duration: 1.8 }
    )
    .fromTo('.hero-badge', 
      { opacity: 0, y: -20 }, 
      { opacity: 1, y: 0, duration: 0.75 }, 
      '-=1.5'
    );

    if (heroWords.length) {
      tl.fromTo(heroWords,
        { yPercent: 115, opacity: 0, rotateZ: 2.5 },
        { yPercent: 0, opacity: 1, rotateZ: 0, duration: 0.9, stagger: 0.05 },
        '-=1.25'
      );
    } else {
      tl.fromTo('.hero-title', 
        { opacity: 0, y: 40 }, 
        { opacity: 1, y: 0, duration: 1.0 }, 
        '-=1.2'
      );
    }

    tl.fromTo('.hero-lead', 
      { opacity: 0, y: 25 }, 
      { opacity: 1, y: 0, duration: 0.85 }, 
      '-=0.7'
    )
    .fromTo('.hero-actions .btn', 
      { opacity: 0, y: 20, stagger: 0.14 }, 
      { opacity: 1, y: 0, duration: 0.75 }, 
      '-=0.55'
    )
    .fromTo('.hero-slider-dock',
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.7 },
      '-=0.55'
    )
    .fromTo('.hero-meta-item', 
      { opacity: 0, y: 20, stagger: 0.12 }, 
      { opacity: 1, y: 0, duration: 0.75 }, 
      '-=0.55'
    );

    initHeroSlider();
  }

  if (pageHeroSection) {
    const pageHeroWords = pageHeroSection.querySelectorAll('.page-hero-title .gsap-word');
    const tlPage = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tlPage.fromTo('.page-hero-bg',
      { scale: 1.18, filter: 'brightness(0.25)' },
      { scale: 1.0, filter: 'brightness(0.55)', duration: 1.8 }
    )
    .fromTo('.page-hero-content .section-badge',
      { opacity: 0, y: -16 },
      { opacity: 1, y: 0, duration: 0.7 },
      '-=1.3'
    );

    if (pageHeroWords.length) {
      tlPage.fromTo(pageHeroWords,
        { yPercent: 115, opacity: 0, rotateZ: 2.5 },
        { yPercent: 0, opacity: 1, rotateZ: 0, duration: 0.85, stagger: 0.05 },
        '-=1.05'
      );
    }

    tlPage.fromTo('.breadcrumb-nav',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.7 },
      '-=0.55'
    );
  }
}

/* -------------------------------------------------------------
   2B. HOMEPAGE HERO CINEMATIC SLIDER ENGINE
   ------------------------------------------------------------- */
let heroSliderInitialized = false;
function initHeroSlider() {
  if (heroSliderInitialized) return;
  const slideBgs = document.querySelectorAll('.hero-slide-bg');
  const dots = document.querySelectorAll('.hero-slide-dot');
  const prevBtn = document.getElementById('heroSlidePrev');
  const nextBtn = document.getElementById('heroSlideNext');
  const progressBar = document.getElementById('heroSlideProgress');
  const badgeEl = document.getElementById('heroSlideBadge');
  const titleEl = document.getElementById('heroSlideTitle');
  const leadEl = document.getElementById('heroSlideLead');

  if (!slideBgs.length || !titleEl) return;
  heroSliderInitialized = true;

  const slidesData = [
    {
      badgeIcon: 'fas fa-crown',
      badgeText: 'Architecture & Interiors Crafted With Precision',
      titleHTML: 'Designing Spaces That <span class="title-accent">Inspire</span> Everyday Living',
      leadText: 'We bridge monolithic purity with sensory intimacy. Architecture Prime conceptualizes high-end bespoke residences, avant-garde commercial headquarters, and tranquil living environments.'
    },
    {
      badgeIcon: 'fas fa-compass',
      badgeText: 'Cantilevered Coastal & Alpine Sanctuaries',
      titleHTML: 'Sculpting Monolithic <span class="title-accent">Elegance</span> In Raw Stone',
      leadText: 'Post-tensioned structural cantilevers, bush-hammered Pietrasanta travertine, and motorized frameless glass facades engineered to dissolve into the horizon.'
    },
    {
      badgeIcon: 'fas fa-layer-group',
      badgeText: 'Net-Zero Parametric Cultural Landmarks',
      titleHTML: 'Crafting Timeless <span class="title-accent">Landmarks</span> For Generations',
      leadText: 'From private family estates to iconic cultural pavilions, every commission is modeled in Level 400 Digital Twin BIM with micron-level Swiss engineering fidelity.'
    }
  ];

  let currentSlide = 0;
  let isTransitioning = false;
  let progressTween = null;
  const slideDuration = 2.0; // 2 seconds per slide

  function startProgressTimer() {
    if (progressTween) progressTween.kill();
    if (typeof gsap !== 'undefined' && progressBar) {
      gsap.set(progressBar, { width: '0%' });
      progressTween = gsap.to(progressBar, {
        width: '100%',
        duration: slideDuration,
        ease: 'none',
        onComplete: () => {
          goToSlide((currentSlide + 1) % slidesData.length);
        }
      });
    }
  }

  function goToSlide(nextIndex) {
    if (isTransitioning || nextIndex === currentSlide) return;
    isTransitioning = true;
    if (progressTween) progressTween.kill();

    const prevBg = slideBgs[currentSlide];
    const nextBg = slideBgs[nextIndex];
    const nextImg = nextBg ? nextBg.querySelector('.hero-bg-img') : null;
    const data = slidesData[nextIndex];

    dots.forEach((d, idx) => d.classList.toggle('active', idx === nextIndex));

    if (typeof gsap !== 'undefined' && nextBg) {
      gsap.set(nextBg, { visibility: 'visible', opacity: 0, zIndex: 2 });
      if (prevBg) gsap.set(prevBg, { zIndex: 1 });

      if (nextImg) {
        gsap.fromTo(
          nextImg,
          { scale: 1.14, filter: 'brightness(0.88) contrast(1.04)' },
          { scale: 1.04, filter: 'brightness(0.96) contrast(1.04)', duration: 1.1, ease: 'power3.out' }
        );
      }

      gsap.to(nextBg, {
        opacity: 1,
        duration: 0.65,
        ease: 'power2.inOut',
        onComplete: () => {
          slideBgs.forEach((bg, idx) => {
            bg.classList.toggle('active', idx === nextIndex);
            if (idx !== nextIndex) {
              gsap.set(bg, { opacity: 0, visibility: 'hidden' });
            }
          });
        }
      });

      const outTl = gsap.timeline({
        onComplete: () => {
          if (badgeEl) {
            badgeEl.innerHTML = `<i class="${data.badgeIcon}"></i><span>${data.badgeText}</span>`;
          }
          titleEl.removeAttribute('data-gsap-split');
          titleEl.innerHTML = data.titleHTML;
          const newWords = splitHeadingIntoWords(titleEl);
          if (leadEl) {
            leadEl.textContent = data.leadText;
          }

          const inTl = gsap.timeline({
            defaults: { ease: 'power3.out' },
            onComplete: () => {
              currentSlide = nextIndex;
              isTransitioning = false;
              startProgressTimer();
            }
          });

          inTl.fromTo(badgeEl, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.35 });
          if (newWords.length) {
            inTl.fromTo(
              newWords,
              { yPercent: 115, opacity: 0, rotateZ: 2.5 },
              { yPercent: 0, opacity: 1, rotateZ: 0, duration: 0.5, stagger: 0.035 },
              '-=0.2'
            );
          }
          inTl.fromTo(leadEl, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.38 }, '-=0.3');
        }
      });

      outTl.to([badgeEl, titleEl, leadEl], {
        opacity: 0,
        y: -12,
        duration: 0.2,
        stagger: 0.03,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set([badgeEl, titleEl, leadEl], { opacity: 1, y: 0 });
        }
      });
    } else {
      currentSlide = nextIndex;
      isTransitioning = false;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide((currentSlide - 1 + slidesData.length) % slidesData.length);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide((currentSlide + 1) % slidesData.length);
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
    });
  });

  startProgressTimer();
}

/* -------------------------------------------------------------
   3. SCROLL-TRIGGERED ENTRANCES (PER-SECTION UNIQUE STYLES)
   ------------------------------------------------------------- */
function initScrollAnimations() {
  if (typeof ScrollTrigger === 'undefined') return;

  // Architectural Dual-Shutter Curtain & Clip-Path Image Reveal
  const revealBoxes = document.querySelectorAll(
    '.service-detail-img-box, .why-image-wrap, .story-mosaic-item'
  );
  revealBoxes.forEach((box, idx) => {
    if (box.dataset.gsapImgReveal === 'true') return;
    box.dataset.gsapImgReveal = 'true';

    const img = box.querySelector('img');
    if (!img) return;

    // Ensure positioned container for curtains
    const computedPos = window.getComputedStyle(box).position;
    if (computedPos === 'static') {
      box.style.position = 'relative';
    }
    box.style.overflow = 'hidden';

    const curtainPrimary = document.createElement('div');
    curtainPrimary.className = 'gsap-img-curtain-primary';
    const curtainDark = document.createElement('div');
    curtainDark.className = 'gsap-img-curtain-dark';
    box.appendChild(curtainPrimary);
    box.appendChild(curtainDark);

    const isReverse =
      box.closest('.reverse') !== null || idx % 2 === 1;
    const originSide = isReverse ? 'left center' : 'right center';

    gsap.set([curtainPrimary, curtainDark], {
      scaleX: 1,
      transformOrigin: originSide
    });
    gsap.set(box, {
      clipPath: 'inset(6% 6% 6% 6% round 8px)'
    });
    gsap.set(img, {
      scale: 1.28,
      filter: 'brightness(0.55) contrast(1.15)'
    });

    const tlImg = gsap.timeline({
      scrollTrigger: {
        trigger: box,
        start: 'top 86%',
        toggleActions: 'restart none none reset'
      }
    });

    tlImg
      .to(box, {
        clipPath: 'inset(0% 0% 0% 0% round 8px)',
        duration: 0.9,
        ease: 'power3.out'
      }, 0)
      .to(curtainDark, {
        scaleX: 0,
        duration: 0.8,
        ease: 'power4.inOut'
      }, 0.05)
      .to(
        curtainPrimary,
        {
          scaleX: 0,
          duration: 0.95,
          ease: 'power4.inOut'
        },
        0.22
      )
      .to(
        img,
        {
          scale: 1,
          filter: 'brightness(1) contrast(1)',
          duration: 1.45,
          ease: 'power3.out'
        },
        0.15
      );

    // Interactive 3D Magnetic Tilt on Hover
    box.addEventListener('mousemove', (e) => {
      const rect = box.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(box, {
        rotateY: relX * 8,
        rotateX: -relY * 8,
        duration: 0.4,
        ease: 'power2.out'
      });
    });

    box.addEventListener('mouseleave', () => {
      gsap.to(box, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: 'power3.out'
      });
    });
  });

  // About Section: Image Clip-Path Reveal
  const aboutMainImg = document.querySelector('.about-img-main');
  if (aboutMainImg) {
    gsap.fromTo(aboutMainImg,
      { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)', opacity: 0.4 },
      {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        opacity: 1,
        duration: 1.4,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: '.about-split-section',
          start: 'top 75%'
        }
      }
    );

    gsap.fromTo('.about-experience-badge',
      { scale: 0.6, opacity: 0, rotation: -6 },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.9,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.about-split-section',
          start: 'top 65%'
        }
      }
    );
  }

  // Services Cards: Staggered Card + Image Mask Curtain Reveal
  const serviceCards = document.querySelectorAll('.service-card-luxury');
  if (serviceCards.length > 0) {
    serviceCards.forEach((card, idx) => {
      const imgWrap = card.querySelector('.service-card-img-wrap');
      const img = imgWrap ? imgWrap.querySelector('img') : null;
      const numBadge = card.querySelector('.service-card-number');

      if (imgWrap && img && imgWrap.dataset.gsapMaskInit !== 'true') {
        imgWrap.dataset.gsapMaskInit = 'true';

        const curtainPrimary = document.createElement('div');
        curtainPrimary.className = 'gsap-img-curtain-primary';
        const curtainDark = document.createElement('div');
        curtainDark.className = 'gsap-img-curtain-dark';
        imgWrap.appendChild(curtainPrimary);
        imgWrap.appendChild(curtainDark);

        const staggerDelay = (idx % 3) * 0.14;

        gsap.set(card, { opacity: 0, y: 45 });
        gsap.set(imgWrap, {
          clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
        });
        gsap.set([curtainPrimary, curtainDark], {
          scaleX: 1,
          transformOrigin: 'right center'
        });
        gsap.set(img, {
          scale: 1.32,
          filter: 'brightness(0.5) contrast(1.15)'
        });
        if (numBadge) {
          gsap.set(numBadge, { opacity: 0, scale: 0.6, y: -10 });
        }

        const tlCard = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'restart none none reset'
          }
        });

        tlCard
          .to(
            card,
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: 'power3.out'
            },
            staggerDelay
          )
          .to(
            imgWrap,
            {
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              duration: 0.85,
              ease: 'power4.inOut'
            },
            staggerDelay
          )
          .to(
            curtainDark,
            {
              scaleX: 0,
              duration: 0.75,
              ease: 'power4.inOut'
            },
            staggerDelay + 0.12
          )
          .to(
            curtainPrimary,
            {
              scaleX: 0,
              duration: 0.9,
              ease: 'power4.inOut'
            },
            staggerDelay + 0.26
          )
          .to(
            img,
            {
              scale: 1,
              filter: 'brightness(1) contrast(1)',
              duration: 1.35,
              ease: 'power3.out'
            },
            staggerDelay + 0.2
          );

        if (numBadge) {
          tlCard.to(
            numBadge,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.5,
              ease: 'back.out(1.8)'
            },
            staggerDelay + 0.65
          );
        }
      }
    });
  }

  // Why Choose Us: Reason cards sequential slide
  const reasonCards = document.querySelectorAll('.reason-card');
  if (reasonCards.length > 0) {
    gsap.fromTo(reasonCards,
      { opacity: 0, x: 40 },
      {
        opacity: 1,
        x: 0,
        stagger: 0.18,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.why-choose-section',
          start: 'top 70%'
        }
      }
    );
  }

  // Awards Section: Staggered Gold Line Reveal
  const awardItems = document.querySelectorAll('.award-item');
  if (awardItems.length > 0) {
    gsap.fromTo(awardItems,
      { opacity: 0, x: -30, borderBottomColor: 'transparent' },
      {
        opacity: 1,
        x: 0,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        stagger: 0.15,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.awards-section',
          start: 'top 70%'
        }
      }
    );
  }

  // Latest Blogs Stagger
  const blogCards = document.querySelectorAll('.blog-card');
  if (blogCards.length > 0) {
    gsap.fromTo(blogCards,
      { opacity: 0, y: 45 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.blogs-cta-footer-section',
          start: 'top 80%'
        }
      }
    );
  }

  // Contact CTA Banner Zoom In
  const ctaBanner = document.querySelector('.contact-cta-banner');
  if (ctaBanner) {
    gsap.fromTo(ctaBanner,
      { opacity: 0, scale: 0.94, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ctaBanner,
          start: 'top 85%'
        }
      }
    );
  }
}

/* -------------------------------------------------------------
   4. ANIMATED HIGH-PERFORMANCE EASING COUNTERS
   ------------------------------------------------------------- */
function initCounters() {
  const counterElements = document.querySelectorAll('.counter-val');
  if (!counterElements.length) return;

  // Cubic deceleration curve: rapid start, buttery smooth luxury landing
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function startCounter(el) {
    if (el.dataset.animated === 'true') return;
    el.dataset.animated = 'true';

    const targetVal = parseFloat(el.getAttribute('data-target')) || parseInt(el.innerText, 10) || 0;
    const isDecimal = String(targetVal).includes('.');
    const decimalPlaces = isDecimal ? String(targetVal).split('.')[1].length : 0;
    const duration = 2000; // 2000ms duration for refined luxury pacing
    let startTimestamp = null;

    el.classList.add('counting');

    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const currentVal = easedProgress * targetVal;

      if (isDecimal) {
        el.innerText = currentVal.toFixed(decimalPlaces);
      } else {
        el.innerText = Math.floor(currentVal);
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.innerText = isDecimal ? targetVal.toFixed(decimalPlaces) : targetVal;
        el.classList.remove('counting');
        el.classList.add('counted');
      }
    }

    window.requestAnimationFrame(step);
  }

  function isVisible(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    );
  }

  // IntersectionObserver to trigger as soon as stat block enters view
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    counterElements.forEach((el) => {
      if (isVisible(el)) {
        setTimeout(() => startCounter(el), 120);
      } else {
        observer.observe(el);
      }
    });
  } else {
    // Immediate fallback
    counterElements.forEach((el) => startCounter(el));
  }

  // Scroll backup to ensure trigger reliability under fast scrolling
  function scrollCheck() {
    let allDone = true;
    counterElements.forEach((el) => {
      if (el.dataset.animated !== 'true') {
        allDone = false;
        if (isVisible(el)) {
          startCounter(el);
        }
      }
    });
    if (allDone) {
      window.removeEventListener('scroll', scrollCheck);
    }
  }
  window.addEventListener('scroll', scrollCheck, { passive: true });

  // Listen for AOS animation completion
  document.addEventListener('aos:in', (e) => {
    if (e.detail) {
      const counters = e.detail.querySelectorAll('.counter-val');
      counters.forEach((c) => startCounter(c));
    }
  });
}

/* -------------------------------------------------------------
   5. PARALLAX EFFECT ON BACKGROUNDS & IMAGES
   ------------------------------------------------------------- */
function initParallax() {
  if (typeof ScrollTrigger === 'undefined') return;

  const parallaxImgs = document.querySelectorAll('[data-parallax]');
  parallaxImgs.forEach((img) => {
    gsap.to(img, {
      y: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: img,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}

/* -------------------------------------------------------------
   6. INTERACTIVE DESIGN TIMELINE & METHODOLOGY
   ------------------------------------------------------------- */
function initTimeline() {
  const phaseItems = document.querySelectorAll('.timeline-phase-item');
  if (phaseItems.length) {
    phaseItems.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        phaseItems.forEach((p) => p.classList.remove('active'));
        item.classList.add('active');
      });
    });
  }

  const chronologyItems = document.querySelectorAll('.chronology-item');
  if (chronologyItems.length) {
    chronologyItems.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        chronologyItems.forEach((p) => p.classList.remove('active'));
        item.classList.add('active');
      });
    });
  }

  const steps = document.querySelectorAll('.process-step');
  if (steps.length) {
    steps.forEach((step, idx) => {
      step.addEventListener('click', () => {
        steps.forEach((s) => s.classList.remove('active'));
        step.classList.add('active');

        if (typeof gsap !== 'undefined') {
          gsap.fromTo(step.querySelector('.step-content'), 
            { scale: 0.96 }, 
            { scale: 1, duration: 0.4, ease: 'back.out(2)' }
          );
        }
      });
    });
  }
}

/* -------------------------------------------------------------
   7. FEATURED PROJECTS FILTER
   ------------------------------------------------------------- */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(card, 
              { opacity: 0, scale: 0.9 }, 
              { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
            );
          }
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------
   8. CLIENT TESTIMONIALS SLIDER
   ------------------------------------------------------------- */
function initTestimonialsSlider() {
  const testimonials = [
    {
      quote: "Architecture Prime redesigned our waterfront estate beyond our loftiest expectations. The interplay of natural limestone and floor-to-ceiling glass creates an ethereal living atmosphere that transforms with every sunset.",
      name: "Victoria & David Sterling",
      role: "Private Villa Owners, Malibu",
      avatar: "assets/client-victoria.webp",
      rating: '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>'
    },
    {
      quote: "Their commercial design for our international headquarters captured both corporate gravitas and organic biophilic serenity. Our productivity and employee satisfaction metrics have seen unprecedented elevation.",
      name: "Harrison Vance",
      role: "CEO, Lumina Global Holdings",
      avatar: "assets/client-harrison.webp",
      rating: '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>'
    },
    {
      quote: "Every inch of our penthouse renovation radiates understated luxury and meticulous craftsmanship. The team respected our tight timelines without compromising structural precision or material beauty.",
      name: "Dr. Evelyn Montgomery",
      role: "Founder, Montgomery Art Foundation",
      avatar: "assets/client-evelyn.webp",
      rating: '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>'
    }
  ];

  let currentIndex = 0;
  const quoteElem = document.querySelector('.testimonial-text');
  const nameElem = document.querySelector('.client-name');
  const roleElem = document.querySelector('.client-role');
  const avatarElem = document.querySelector('.client-avatar');
  const starsElem = document.querySelector('.star-rating');
  const prevBtn = document.querySelector('.nav-prev');
  const nextBtn = document.querySelector('.nav-next');

  if (!quoteElem || !prevBtn || !nextBtn) return;

  function updateTestimonial(index) {
    if (typeof gsap !== 'undefined') {
      gsap.to('.testimonial-card-single', {
        opacity: 0.3,
        x: -20,
        duration: 0.25,
        onComplete: () => {
          const item = testimonials[index];
          quoteElem.innerText = `“${item.quote}”`;
          nameElem.innerText = item.name;
          roleElem.innerText = item.role;
          avatarElem.src = item.avatar;
          if (starsElem) starsElem.innerHTML = item.rating;

          gsap.fromTo('.testimonial-card-single',
            { opacity: 0.3, x: 20 },
            { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
          );
        }
      });
    } else {
      const item = testimonials[index];
      quoteElem.innerText = `“${item.quote}”`;
      nameElem.innerText = item.name;
      roleElem.innerText = item.role;
      avatarElem.src = item.avatar;
      if (starsElem) starsElem.innerHTML = item.rating;
    }
  }

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % testimonials.length;
    updateTestimonial(currentIndex);
  });

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    updateTestimonial(currentIndex);
  });

  // Auto slide every 7 seconds
  setInterval(() => {
    currentIndex = (currentIndex + 1) % testimonials.length;
    updateTestimonial(currentIndex);
  }, 7000);
}

/* -------------------------------------------------------------
   9. FAQ ACCORDION ENGINE
   ------------------------------------------------------------- */
function initFAQAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  if (!accordionItems.length) return;

  accordionItems.forEach((item) => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all others
      accordionItems.forEach((other) => {
        other.classList.remove('active');
        const otherContent = other.querySelector('.accordion-content');
        if (otherContent) otherContent.style.maxHeight = null;
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // Open first item by default if exists
  const firstActive = document.querySelector('.accordion-item.active');
  if (firstActive) {
    const content = firstActive.querySelector('.accordion-content');
    if (content) content.style.maxHeight = content.scrollHeight + 'px';
  }
}

/* -------------------------------------------------------------
   7. SERVICES LUXURY FAQ ACCORDION ENGINE
   ------------------------------------------------------------- */
function initLuxuryFAQAccordion() {
  const items = document.querySelectorAll('.luxury-faq-item');
  if (!items.length) return;

  items.forEach((item) => {
    const header = item.querySelector('.luxury-faq-header');
    const body = item.querySelector('.luxury-faq-body');
    if (!header || !body) return;

    header.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = item.classList.contains('active');

      // Close all other items for a clean single-open accordion feel
      items.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          const otherHeader = other.querySelector('.luxury-faq-header');
          const otherBody = other.querySelector('.luxury-faq-body');
          if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
          if (otherBody) otherBody.style.maxHeight = null;
        }
      });

      // Toggle clicked item
      if (isOpen) {
        item.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
        body.style.maxHeight = null;
      } else {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // Ensure default active item starts open with proper maxHeight
  const initialActive = document.querySelector('.luxury-faq-item.active');
  if (initialActive) {
    const activeBody = initialActive.querySelector('.luxury-faq-body');
    if (activeBody) {
      activeBody.style.maxHeight = activeBody.scrollHeight + 'px';
    }
  }

  // Recalculate max-height on window resize for fluid responsiveness
  window.addEventListener('resize', () => {
    const active = document.querySelector('.luxury-faq-item.active');
    if (active) {
      const activeBody = active.querySelector('.luxury-faq-body');
      if (activeBody) {
        activeBody.style.maxHeight = activeBody.scrollHeight + 'px';
      }
    }
  });
}

