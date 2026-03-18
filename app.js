/* ═══════════════════════════════════════════════════
   OCOTE COCINA — App JavaScript
   Bilingual toggle, scroll reveal, header behavior, mobile menu
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── BILINGUAL TOGGLE ──
  let currentLang = 'es';

  function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);

    // Update all translatable elements
    document.querySelectorAll('[data-es][data-en]').forEach(function (el) {
      el.textContent = el.getAttribute('data-' + lang);
    });

    // Update lang toggle buttons
    document.querySelectorAll('.lang-toggle').forEach(function (btn) {
      var showLang = lang === 'es' ? 'EN' : 'ES';
      btn.textContent = showLang;
      btn.setAttribute('aria-label', 'Switch to ' + (lang === 'es' ? 'English' : 'Español'));
    });

    // Update page title
    document.title = lang === 'es'
      ? 'Ocote Cocina — Cocina Contemporánea Oaxaqueña'
      : 'Ocote Cocina — Contemporary Oaxacan Kitchen';
  }

  // Attach toggle listeners
  document.querySelectorAll('.lang-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLanguage(currentLang === 'es' ? 'en' : 'es');
    });
  });


  // ── HEADER SCROLL BEHAVIOR ──
  var header = document.getElementById('header');
  var lastScrollY = 0;
  var ticking = false;

  function onScroll() {
    var scrollY = window.scrollY;

    if (scrollY > 80 && scrollY > lastScrollY) {
      header.classList.add('header--hidden');
    } else {
      header.classList.remove('header--hidden');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });


  // ── MOBILE MENU ──
  var menuBtn = document.getElementById('mobileMenuBtn');
  var mobileMenu = document.getElementById('mobileMenu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      var isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', !isOpen);
      mobileMenu.classList.toggle('is-open');
      mobileMenu.setAttribute('aria-hidden', isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close on nav link click
    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        menuBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('is-open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }


  // ── SCROLL REVEAL ──
  function setupReveal() {
    // Add reveal classes to elements
    var revealSelectors = [
      '.about__label', '.about__heading', '.about__text', '.about__divider',
      '.menu__label', '.menu__heading', '.menu__subtext',
      '.location__label', '.location__heading',
      '.footer__brand'
    ];

    revealSelectors.forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) el.classList.add('reveal');
    });

    // Staggered reveals for repeating elements
    document.querySelectorAll('.feature').forEach(function (el, i) {
      el.classList.add('reveal-stagger');
      el.style.transitionDelay = (i * 0.1) + 's';
    });

    document.querySelectorAll('.dish').forEach(function (el, i) {
      el.classList.add('reveal-stagger');
      el.style.transitionDelay = (i * 0.08) + 's';
    });

    document.querySelectorAll('.info-block').forEach(function (el, i) {
      el.classList.add('reveal-stagger');
      el.style.transitionDelay = (i * 0.1) + 's';
    });

    // IntersectionObserver
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });

      document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback: show everything
      document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
        el.classList.add('is-visible');
      });
    }
  }

  // ── SMOOTH SCROLL FOR ANCHOR LINKS ──
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── INIT ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupReveal);
  } else {
    setupReveal();
  }

})();
