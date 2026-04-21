/* ============================================================
   METTALOKA YOUTH CENTRE — script.js
   Robust, fully working. No content ever hidden on load.
============================================================ */
(function () {
  'use strict';

  /* ── WAIT FOR DOM ── */
  document.addEventListener('DOMContentLoaded', function () {

    /* ── ELEMENTS ─────────────────────────── */
    var HDR       = document.getElementById('hdr');
    var BURGER    = document.getElementById('burger');
    var NAVMENU   = document.getElementById('nav-menu');
    var BTT       = document.getElementById('btt');
    var DOTS_ROW  = document.getElementById('hero-dots-row');
    var GALGRID   = document.getElementById('gallery-grid');
    var LBOX      = document.getElementById('lightbox');
    var LBIMG     = document.getElementById('lb-img');
    var LBX       = document.getElementById('lb-x');
    var LBPREV    = document.getElementById('lb-prev');
    var LBNEXT    = document.getElementById('lb-next');
    var LBCNT     = document.getElementById('lb-cnt');

    /* ============================================================
       1. SCROLL REVEAL — CORRECT APPROACH
       Elements are VISIBLE by default (opacity:1 in CSS).
       JS adds .hidden to make them invisible, then .show to reveal.
       This means content is ALWAYS visible even if JS is slow.
    ============================================================ */
    var revEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

    /* Step 1: Add .hidden to elements that are NOT in viewport */
    function initReveal() {
      var vh = window.innerHeight;
      revEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top > vh - 20) {
          el.classList.add('hidden');
        }
      });
    }

    /* Step 2: Show elements when they enter viewport */
    function checkReveal() {
      var vh = window.innerHeight;
      revEls.forEach(function (el) {
        if (el.classList.contains('hidden')) {
          if (el.getBoundingClientRect().top < vh - 24) {
            el.classList.add('show');
            el.classList.remove('hidden');
          }
        }
      });
    }

    /* Use IntersectionObserver for performance */
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && en.target.classList.contains('hidden')) {
            en.target.classList.add('show');
            en.target.classList.remove('hidden');
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });

      /* Wait a frame so initReveal runs first */
      requestAnimationFrame(function () {
        initReveal();
        revEls.forEach(function (el) {
          if (el.classList.contains('hidden')) io.observe(el);
        });
      });
    } else {
      /* Fallback */
      requestAnimationFrame(function () {
        initReveal();
        window.addEventListener('scroll', checkReveal, { passive: true });
        checkReveal();
      });
    }

    /* ============================================================
       2. SCROLL — header + back-to-top
    ============================================================ */
    function onScroll() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      HDR.classList[y > 60  ? 'add' : 'remove']('scrolled');
      BTT.classList[y > 400 ? 'add' : 'remove']('show');
      checkReveal();
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ============================================================
       3. BACK TO TOP
    ============================================================ */
    BTT.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ============================================================
       4. BURGER / MOBILE NAV
    ============================================================ */
    var navIsOpen = false;

    function openNav() {
      navIsOpen = true;
      NAVMENU.classList.add('is-open');
      BURGER.classList.add('is-open');
      BURGER.setAttribute('aria-expanded', 'true');
    }
    function closeNav() {
      navIsOpen = false;
      NAVMENU.classList.remove('is-open');
      BURGER.classList.remove('is-open');
      BURGER.setAttribute('aria-expanded', 'false');
    }

    BURGER.addEventListener('click', function (e) {
      e.stopPropagation();
      navIsOpen ? closeNav() : openNav();
    });

    /* Close on any nav link click */
    var navLinks = NAVMENU.querySelectorAll('.nlink');
    navLinks.forEach(function (a) {
      a.addEventListener('click', closeNav);
    });

    /* Close on outside click */
    document.addEventListener('click', function (e) {
      if (navIsOpen && !HDR.contains(e.target)) closeNav();
    });

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (navIsOpen)  closeNav();
        if (lbIsOpen)   closeLbox();
      }
    });

    /* ============================================================
       5. SMOOTH SCROLL with fixed-header offset
    ============================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (!id || id === '#') return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        closeNav();
        var navH = HDR ? HDR.offsetHeight : 70;
        var top  = target.getBoundingClientRect().top + window.pageYOffset - navH - 8;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });

    /* ============================================================
       6. HERO SLIDESHOW — 2.5 second auto-advance
    ============================================================ */
    var slides    = document.querySelectorAll('.hs');
    var dotBtns   = [];
    var curSlide  = 0;
    var sTimer    = null;

    /* Build dots */
    if (DOTS_ROW && slides.length) {
      slides.forEach(function (_, i) {
        var d = document.createElement('button');
        d.className = 'hd-dot' + (i === 0 ? ' on' : '');
        d.setAttribute('aria-label', 'Slide ' + (i + 1));
        DOTS_ROW.appendChild(d);
        dotBtns.push(d);
        (function (idx) {
          d.addEventListener('click', function () {
            goSlide(idx);
            resetTimer();
          });
        }(i));
      });
    }

    function goSlide(n) {
      slides[curSlide].classList.remove('on');
      if (dotBtns[curSlide]) dotBtns[curSlide].classList.remove('on');
      curSlide = (n + slides.length) % slides.length;
      slides[curSlide].classList.add('on');
      if (dotBtns[curSlide]) dotBtns[curSlide].classList.add('on');
    }

    function resetTimer() {
      clearInterval(sTimer);
      sTimer = setInterval(function () { goSlide(curSlide + 1); }, 2500);
    }

    if (slides.length > 1) resetTimer();

    /* ============================================================
       7. GALLERY LIGHTBOX
    ============================================================ */
    var galSrcs  = [];
    var curImg   = 0;
    var lbIsOpen = false;

    if (GALGRID) {
      var items = GALGRID.querySelectorAll('.gi');
      items.forEach(function (item, i) {
        var img = item.querySelector('img');
        if (img) galSrcs.push(img.src);
        (function (idx) {
          item.addEventListener('click', function () { openLbox(idx); });
        }(i));
      });
    }

    if (LBIMG) LBIMG.style.transition = 'opacity 0.15s ease';

    function openLbox(i) {
      curImg = i;
      LBIMG.src = galSrcs[i];
      LBCNT.textContent = (i + 1) + ' / ' + galSrcs.length;
      LBOX.classList.add('open');
      lbIsOpen = true;
      document.body.style.overflow = 'hidden';
    }
    function closeLbox() {
      LBOX.classList.remove('open');
      lbIsOpen = false;
      document.body.style.overflow = '';
      setTimeout(function () { if (!lbIsOpen) LBIMG.src = ''; }, 350);
    }
    function showImg(i) {
      curImg = (i + galSrcs.length) % galSrcs.length;
      LBIMG.style.opacity = '0';
      setTimeout(function () {
        LBIMG.src = galSrcs[curImg];
        LBCNT.textContent = (curImg + 1) + ' / ' + galSrcs.length;
        LBIMG.style.opacity = '1';
      }, 130);
    }

    if (LBX)    LBX.addEventListener('click', closeLbox);
    if (LBPREV) LBPREV.addEventListener('click', function () { showImg(curImg - 1); });
    if (LBNEXT) LBNEXT.addEventListener('click', function () { showImg(curImg + 1); });
    if (LBOX)   LBOX.addEventListener('click', function (e) { if (e.target === LBOX) closeLbox(); });

    document.addEventListener('keydown', function (e) {
      if (!lbIsOpen) return;
      if (e.key === 'ArrowLeft')  showImg(curImg - 1);
      if (e.key === 'ArrowRight') showImg(curImg + 1);
    });

    /* Touch swipe on lightbox */
    var tx = 0;
    if (LBOX) {
      LBOX.addEventListener('touchstart', function (e) { tx = e.changedTouches[0].clientX; }, { passive: true });
      LBOX.addEventListener('touchend',   function (e) {
        var dx = e.changedTouches[0].clientX - tx;
        if (Math.abs(dx) > 40) dx < 0 ? showImg(curImg + 1) : showImg(curImg - 1);
      });
    }

    /* ============================================================
       8. STATS COUNTER
    ============================================================ */
    var sBar  = document.querySelector('.stats-strip');
    var ssDone = false;
    if (sBar && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting || ssDone) return;
        ssDone = true;
        document.querySelectorAll('.ss-num').forEach(function (el) {
          var to  = parseInt(el.getAttribute('data-to'), 10);
          var sfx = el.getAttribute('data-sfx') || '';
          if (isNaN(to)) return;
          var dur = 1400, t0 = performance.now();
          (function frame(now) {
            var p = Math.min((now - t0) / dur, 1);
            el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * to) + sfx;
            if (p < 1) requestAnimationFrame(frame);
          })(t0);
        });
      }, { threshold: 0.5 }).observe(sBar);
    }

    console.log('✅ Mettaloka Youth Centre — fully loaded');

  }); /* end DOMContentLoaded */

}());
