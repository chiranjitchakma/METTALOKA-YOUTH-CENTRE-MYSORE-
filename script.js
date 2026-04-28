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
       1. PREMIUM MOTION SYSTEM
       ─ 4 reveal types: reveal / reveal-scale / reveal-left / reveal-right
       ─ Auto-assigned by element type
       ─ Staggered within sibling groups
       ─ IntersectionObserver with rootMargin for smooth pre-reveal
       ─ Elements always visible if JS slow (hidden only after rAF)
    ============================================================ */

    /* Assign reveal types by element role */
    function assignRevealTypes() {
      /* About cards → scale */
      document.querySelectorAll('.ac').forEach(function(el) {
        el.classList.add('reveal-scale');
      });
      /* Carla stat boxes → scale */
      document.querySelectorAll('.cstat').forEach(function(el) {
        el.classList.add('reveal-scale');
      });
      /* Centre cards → scale */
      document.querySelectorAll('.cc-card').forEach(function(el) {
        el.classList.add('reveal-scale');
      });
      /* Programme cards → scale */
      document.querySelectorAll('.pg').forEach(function(el) {
        el.classList.add('reveal-scale');
      });
      /* Life cards → scale */
      document.querySelectorAll('.lc').forEach(function(el) {
        el.classList.add('reveal-scale');
      });
      /* About left → from left */
      document.querySelectorAll('.about-left').forEach(function(el) {
        el.classList.add('reveal', 'reveal-left');
      });
      /* About right → from right */
      document.querySelectorAll('.about-right').forEach(function(el) {
        el.classList.add('reveal', 'reveal-right');
      });
      /* Contact card left → from left */
      var contactCards = document.querySelectorAll('.con-card');
      if (contactCards[0]) contactCards[0].classList.add('reveal-left');
      if (contactCards[1]) contactCards[1].classList.add('reveal-right');
      /* Carla left → left, right → right */
      var carlaLeft  = document.querySelector('.carla-left');
      var carlaRight = document.querySelector('.carla-right');
      if (carlaLeft)  carlaLeft.classList.add('reveal-left');
      if (carlaRight) carlaRight.classList.add('reveal-right');
    }

    /* Stagger siblings within the same parent group */
    function applyStagger() {
      var groups = [
        '.about-right',
        '.carla-stats',
        '.prog-grid',
        '.centres-grid',
        '.life-grid'
      ];
      groups.forEach(function(sel) {
        var parent = document.querySelector(sel);
        if (!parent) return;
        var children = Array.prototype.slice.call(parent.children);
        children.forEach(function(child, i) {
          if (i < 6) child.classList.add('stagger-' + (i + 1));
        });
      });
      /* Stagger step items */
      document.querySelectorAll('.step').forEach(function(el, i) {
        if (i < 6) el.classList.add('stagger-' + (i + 1));
      });
    }

    /* Collect ALL reveal types */
    var ALL_REVEAL = '.reveal, .reveal-scale, .reveal-left, .reveal-right';

    function getAllRevealEls() {
      return Array.prototype.slice.call(document.querySelectorAll(ALL_REVEAL));
    }

    function initReveal() {
      var vh = window.innerHeight;
      getAllRevealEls().forEach(function(el) {
        var r = el.getBoundingClientRect();
        if (r.top > vh - 20) el.classList.add('hidden');
      });
    }

    function triggerReveal(el) {
      el.classList.add('show');
      el.classList.remove('hidden');
    }

    function checkReveal() {
      var vh = window.innerHeight;
      getAllRevealEls().forEach(function(el) {
        if (el.classList.contains('hidden') && el.getBoundingClientRect().top < vh - 24) {
          triggerReveal(el);
        }
      });
    }

    /* Run type assignment and stagger first */
    assignRevealTypes();
    applyStagger();

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function(entries) {
        entries.forEach(function(en) {
          if (en.isIntersecting && en.target.classList.contains('hidden')) {
            triggerReveal(en.target);
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

      requestAnimationFrame(function() {
        initReveal();
        getAllRevealEls().forEach(function(el) {
          if (el.classList.contains('hidden')) io.observe(el);
        });
      });
    } else {
      requestAnimationFrame(function() {
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
      sTimer = setInterval(function () { goSlide(curSlide + 1); }, 1700);
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

    /* ============================================================
       9. THOUGHT OF THE DAY — changes once per day at midnight only
    ============================================================ */
    var thoughts = [
      "Discipline is the foundation on which success and character are built.",
      "A calm and focused mind leads to wise decisions and a peaceful life.",
      "True education is not just knowledge, but right conduct and compassion.",
      "Serve others selflessly — this is the highest form of living.",
      "Control your thoughts, and you will shape your destiny.",
      "Patience and perseverance are the keys to lasting success.",
      "Walk the path of truth and kindness, and success will follow naturally."
    ];
    var thoughtAuthor = "— Acharya Buddharakkhita";

    var tQuote  = document.getElementById('thought-quote');
    var tAuthor = document.getElementById('thought-author');

    if (tQuote && tAuthor) {
      /* Use day of year so same quote shows all day, changes at midnight */
      var now    = new Date();
      var start  = new Date(now.getFullYear(), 0, 0);
      var dayIdx = Math.floor((now - start) / 86400000) % thoughts.length;

      tQuote.textContent  = '\u201C' + thoughts[dayIdx] + '\u201D';
      tAuthor.textContent = thoughtAuthor;

      /* Schedule change at midnight using time-to-midnight */
      function scheduleNextDay() {
        var n    = new Date();
        var msToMidnight = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1, 0, 0, 0, 0) - n;
        setTimeout(function () {
          var s2    = new Date();
          var s2day = Math.floor((s2 - new Date(s2.getFullYear(), 0, 0)) / 86400000) % thoughts.length;
          tQuote.classList.add('fading');
          tAuthor.classList.add('fading');
          setTimeout(function () {
            tQuote.textContent  = '\u201C' + thoughts[s2day] + '\u201D';
            tAuthor.textContent = thoughtAuthor;
            tQuote.classList.remove('fading');
            tAuthor.classList.remove('fading');
          }, 650);
          scheduleNextDay(); /* schedule the day after that */
        }, msToMidnight);
      }
      scheduleNextDay();
    }

    /* ============================================================
       10. SCHEDULE — highlight EXACTLY ONE current time slot
           Uses data-from (hour), data-min (start minute),
           data-to (end hour), data-tomin (end minute)
    ============================================================ */
    function highlightSchedule() {
      var now  = new Date();
      var h    = now.getHours();   /* 0–23 */
      var m    = now.getMinutes(); /* 0–59 */
      var nowMins = h * 60 + m;   /* total minutes since midnight */

      var rows = document.querySelectorAll('.sr[data-from]');
      var bestRow = null;

      rows.forEach(function (row) {
        /* Remove any existing highlight */
        row.classList.remove('sr-now');
        var dot = row.querySelector('.sd');
        if (dot) dot.classList.remove('sd-now');

        var fH   = parseInt(row.getAttribute('data-from'),  10);
        var fM   = parseInt(row.getAttribute('data-min')  || '0', 10);
        var tH   = parseInt(row.getAttribute('data-to'),    10);
        var tM   = parseInt(row.getAttribute('data-tomin') || '0', 10);

        var startMins = fH * 60 + fM;
        var endMins   = tH * 60 + tM;

        var isNow = false;

        if (endMins === 0 && tH === 6) {
          /* Overnight slot: 11:15 PM → 6:00 AM
             data-to="6" data-tomin="0" → endMins = 360, NOT 0
             So we must check using startMins > endMins pattern */
          isNow = (nowMins >= startMins || nowMins < 360);
        } else if (startMins > endMins) {
          /* Generic overnight: e.g. start 23:15 (=1395), end 6:00 (=360) */
          isNow = (nowMins >= startMins || nowMins < endMins);
        } else if (startMins < endMins) {
          isNow = (nowMins >= startMins && nowMins < endMins);
        } else {
          /* startMins === endMins: single point (wake-up 6:00) */
          isNow = (nowMins === startMins);
        }

        if (isNow) bestRow = row;
      });

      /* Apply green to ONLY the best matching row */
      if (bestRow) {
        bestRow.classList.add('sr-now');
        var bd = bestRow.querySelector('.sd');
        if (bd) bd.classList.add('sd-now');
      }
    }

    highlightSchedule();
    setInterval(highlightSchedule, 30000); /* re-check every 30s */

    /* ============================================================
       11. GALLERY VIEW MORE
    ============================================================ */
    var moreBtn    = document.getElementById('gallery-more-btn');
    var moreLabel  = document.getElementById('gallery-more-label');
    var hiddenGIs  = document.querySelectorAll('.gi-hidden');
    var galExpanded = false;

    if (moreBtn) {
      moreBtn.addEventListener('click', function () {
        if (!galExpanded) {
          hiddenGIs.forEach(function (gi) { gi.classList.add('gi-shown'); });
          moreLabel.textContent = 'Show Less';
          moreBtn.classList.add('expanded');
          galExpanded = true;
        } else {
          hiddenGIs.forEach(function (gi) { gi.classList.remove('gi-shown'); });
          moreLabel.textContent = 'View All Photos (29)';
          moreBtn.classList.remove('expanded');
          galExpanded = false;
          var galSec = document.getElementById('s-gallery');
          if (galSec) {
            var navH = HDR ? HDR.offsetHeight : 70;
            window.scrollTo({ top: galSec.getBoundingClientRect().top + window.pageYOffset - navH - 8, behavior: 'smooth' });
          }
        }
      });
    }

    console.log('✅ Mettaloka Youth Centre — fully loaded');

    /* ============================================================
       12. BACKGROUND MUSIC — floating play/pause button
           No autoplay. User must click. Remembers state.
    ============================================================ */
    var musicBtn   = document.getElementById('music-btn');
    var bgMusic    = document.getElementById('bg-music');
    var iconPlay   = document.getElementById('music-icon-play');
    var iconPause  = document.getElementById('music-icon-pause');

    if (musicBtn && bgMusic) {
      var isPlaying = false;

      function setPlaying(playing) {
        isPlaying = playing;
        if (playing) {
          iconPlay.style.display  = 'none';
          iconPause.style.display = '';
          musicBtn.classList.add('playing');
          musicBtn.setAttribute('aria-label', 'Pause background music');
          musicBtn.setAttribute('data-label', 'Pause music');
        } else {
          iconPlay.style.display  = '';
          iconPause.style.display = 'none';
          musicBtn.classList.remove('playing');
          musicBtn.setAttribute('aria-label', 'Play background music');
          musicBtn.setAttribute('data-label', 'Play music');
        }
      }

      musicBtn.addEventListener('click', function () {
        if (isPlaying) {
          bgMusic.pause();
          setPlaying(false);
        } else {
          bgMusic.volume = 0.35; /* gentle background volume */
          bgMusic.play().then(function () {
            setPlaying(true);
          }).catch(function () {
            /* Browser blocked — still show paused state */
            setPlaying(false);
          });
        }
      });

      /* If audio ends unexpectedly, reset UI */
      bgMusic.addEventListener('ended', function () { setPlaying(false); });
      bgMusic.addEventListener('pause', function () {
        if (!bgMusic.ended) setPlaying(false);
      });
    }

  }); /* end DOMContentLoaded */

}());
