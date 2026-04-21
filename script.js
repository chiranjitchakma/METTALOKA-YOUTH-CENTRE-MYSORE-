/* ================================================================
   METTALOKA YOUTH CENTRE — script.js
   All features: nav scroll, burger menu, hero slideshow,
   lightbox, scroll reveal, stats counter, back-to-top,
   smooth scroll with header offset.
================================================================ */

(function () {
  'use strict';

  /* ── WAIT FOR DOM ── */
  document.addEventListener('DOMContentLoaded', function () {

    /* ── ELEMENTS ─────────────────────────────────────────────── */
    var HEADER   = document.getElementById('site-header');
    var BURGER   = document.getElementById('burger');
    var NAVLIST  = document.getElementById('nav-list');
    var BTT      = document.getElementById('btt');
    var SLIDES   = document.querySelectorAll('.hs');
    var DOTS_ROW = document.getElementById('hero-dots');
    var GAL      = document.getElementById('gallery-grid');
    var LBOX     = document.getElementById('lightbox');
    var LB_IMG   = document.getElementById('lb-img');
    var LB_X     = document.getElementById('lb-x');
    var LB_PREV  = document.getElementById('lb-prev');
    var LB_NEXT  = document.getElementById('lb-next');
    var LB_CNT   = document.getElementById('lb-cnt');

    /* ============================================================
       1. SCROLL — header style + back-to-top visibility
    ============================================================ */
    function onScroll() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      HEADER.classList[y > 60  ? 'add' : 'remove']('scrolled');
      BTT.classList[y > 400 ? 'add' : 'remove']('show');
      revealCheck();
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); /* run immediately on load */

    /* ============================================================
       2. BACK TO TOP
    ============================================================ */
    BTT.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ============================================================
       3. BURGER MENU
    ============================================================ */
    var isOpen = false;

    function openNav() {
      isOpen = true;
      NAVLIST.classList.add('open');
      BURGER.classList.add('open');
      BURGER.setAttribute('aria-expanded', 'true');
    }

    function closeNav() {
      isOpen = false;
      NAVLIST.classList.remove('open');
      BURGER.classList.remove('open');
      BURGER.setAttribute('aria-expanded', 'false');
    }

    /* Click burger button */
    BURGER.addEventListener('click', function (e) {
      e.stopPropagation();
      isOpen ? closeNav() : openNav();
    });

    /* Click any nav link — close drawer and scroll */
    var allNavLinks = NAVLIST.querySelectorAll('.nl');
    allNavLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeNav();
      });
    });

    /* Click outside header */
    document.addEventListener('click', function (e) {
      if (isOpen && !HEADER.contains(e.target)) {
        closeNav();
      }
    });

    /* Escape key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (isOpen)    closeNav();
        if (lbIsOpen)  closeLbox();
      }
    });

    /* ============================================================
       4. SMOOTH SCROLL — offset for fixed header
    ============================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (!id || id === '#') return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        closeNav();
        var navH = HEADER ? HEADER.offsetHeight : 70;
        var top  = target.getBoundingClientRect().top + window.pageYOffset - navH - 8;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });

    /* ============================================================
       5. HERO SLIDESHOW — changes every 2.5 seconds
    ============================================================ */
    var curSlide  = 0;
    var dotBtns   = [];
    var slideTimer;

    /* Build dots */
    SLIDES.forEach(function (_, i) {
      var d = document.createElement('button');
      d.className = 'hd' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      DOTS_ROW.appendChild(d);
      dotBtns.push(d);
      d.addEventListener('click', function () {
        goSlide(i);
        resetTimer();
      });
    });

    function goSlide(n) {
      SLIDES[curSlide].classList.remove('active');
      dotBtns[curSlide].classList.remove('active');
      curSlide = (n + SLIDES.length) % SLIDES.length;
      SLIDES[curSlide].classList.add('active');
      dotBtns[curSlide].classList.add('active');
    }

    function resetTimer() {
      clearInterval(slideTimer);
      slideTimer = setInterval(function () { goSlide(curSlide + 1); }, 2500);
    }

    if (SLIDES.length > 1) resetTimer();

    /* ============================================================
       6. GALLERY LIGHTBOX
    ============================================================ */
    var galImgs  = [];
    var curImg   = 0;
    var lbIsOpen = false;

    if (GAL) {
      GAL.querySelectorAll('.gi').forEach(function (item, i) {
        var img = item.querySelector('img');
        if (img) galImgs.push(img.src);
        item.addEventListener('click', function () { openLbox(i); });
      });
    }

    LB_IMG.style.transition = 'opacity 0.15s ease';

    function openLbox(i) {
      curImg = i;
      LB_IMG.src = galImgs[i];
      LB_CNT.textContent = (i + 1) + ' / ' + galImgs.length;
      LBOX.classList.add('open');
      lbIsOpen = true;
      document.body.style.overflow = 'hidden';
    }

    function closeLbox() {
      LBOX.classList.remove('open');
      lbIsOpen = false;
      document.body.style.overflow = '';
      setTimeout(function () { if (!lbIsOpen) LB_IMG.src = ''; }, 350);
    }

    function showImg(i) {
      curImg = (i + galImgs.length) % galImgs.length;
      LB_IMG.style.opacity = '0';
      setTimeout(function () {
        LB_IMG.src = galImgs[curImg];
        LB_CNT.textContent = (curImg + 1) + ' / ' + galImgs.length;
        LB_IMG.style.opacity = '1';
      }, 130);
    }

    LB_X.addEventListener('click', closeLbox);
    LB_PREV.addEventListener('click', function () { showImg(curImg - 1); });
    LB_NEXT.addEventListener('click', function () { showImg(curImg + 1); });
    LBOX.addEventListener('click',    function (e) { if (e.target === LBOX) closeLbox(); });

    document.addEventListener('keydown', function (e) {
      if (!lbIsOpen) return;
      if (e.key === 'ArrowLeft')  showImg(curImg - 1);
      if (e.key === 'ArrowRight') showImg(curImg + 1);
    });

    /* Touch swipe */
    var tx = 0;
    LBOX.addEventListener('touchstart', function (e) { tx = e.changedTouches[0].clientX; }, { passive: true });
    LBOX.addEventListener('touchend',   function (e) {
      var dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 40) dx < 0 ? showImg(curImg + 1) : showImg(curImg - 1);
    });

    /* ============================================================
       7. SCROLL REVEAL
    ============================================================ */
    var fuEls = document.querySelectorAll('.fu');

    function revealCheck() {
      var vh = window.innerHeight;
      fuEls.forEach(function (el) {
        if (el.getBoundingClientRect().top < vh - 24) {
          el.classList.add('visible');
        }
      });
    }

    /* IntersectionObserver for better performance */
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });
      fuEls.forEach(function (el) { io.observe(el); });
    }

    revealCheck();

    /* ============================================================
       8. STATS COUNTER
    ============================================================ */
    var statsBar  = document.querySelector('.stats-strip');
    var counted   = false;

    if (statsBar && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting || counted) return;
        counted = true;
        document.querySelectorAll('.ss-num').forEach(function (el) {
          var target = parseInt(el.getAttribute('data-to'), 10);
          var suffix = el.getAttribute('data-sfx') || '';
          if (isNaN(target)) return;
          var dur = 1400, t0 = performance.now();
          (function frame(now) {
            var p = Math.min((now - t0) / dur, 1);
            el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target) + suffix;
            if (p < 1) requestAnimationFrame(frame);
          })(t0);
        });
      }, { threshold: 0.5 }).observe(statsBar);
    }

    /* ── DONE ─────────────────────────────────────────────────── */
    console.log('✅ Mettaloka Youth Centre — All systems ready');
    console.log('🏠 Est. 2003 · Brotherhood · Discipline · Learning');

  }); /* end DOMContentLoaded */

}());
