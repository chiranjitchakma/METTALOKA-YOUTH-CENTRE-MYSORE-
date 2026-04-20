/* ============================================================
   METTALOKA YOUTH CENTRE – SCRIPT.JS
   Handles: nav scroll, mobile menu, gallery filter, lightbox,
            back-to-top, scroll animations
   ============================================================ */

(function () {
  'use strict';

  /* ---- DOM References ---- */
  const header      = document.getElementById('site-header');
  const hamburger   = document.getElementById('hamburger');
  const navLinks    = document.getElementById('nav-links');
  const backToTop   = document.getElementById('back-to-top');
  const lightbox    = document.getElementById('lightbox');
  const lbClose     = document.getElementById('lightbox-close');
  const lbPrev      = document.getElementById('lightbox-prev');
  const lbNext      = document.getElementById('lightbox-next');
  const lbContent   = document.getElementById('lightbox-content');
  const galleryGrid = document.getElementById('gallery-grid');

  /* ============================================================
     1. STICKY HEADER – changes style on scroll
     ============================================================ */
  let lastScrollY = 0;

  function onScroll() {
    const scrollY = window.scrollY;

    // Header style toggle
    if (scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back-to-top visibility
    if (scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run on load

  /* ============================================================
     2. MOBILE NAVIGATION TOGGLE
     ============================================================ */
  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);

    // Animate hamburger bars
    const bars = hamburger.querySelectorAll('span');
    if (isOpen) {
      bars[0].style.transform = 'translateY(7px) rotate(45deg)';
      bars[1].style.opacity   = '0';
      bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      bars[0].style.transform = '';
      bars[1].style.opacity   = '';
      bars[2].style.transform = '';
    }
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      const bars = hamburger.querySelectorAll('span');
      bars[0].style.transform = '';
      bars[1].style.opacity   = '';
      bars[2].style.transform = '';
    });
  });

  // Close nav when clicking outside
  document.addEventListener('click', function (e) {
    if (!header.contains(e.target)) {
      navLinks.classList.remove('open');
      const bars = hamburger.querySelectorAll('span');
      bars[0].style.transform = '';
      bars[1].style.opacity   = '';
      bars[2].style.transform = '';
    }
  });

  /* ============================================================
     3. BACK TO TOP
     ============================================================ */
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============================================================
     4. GALLERY FILTER
     ============================================================ */
  const filterBtns  = document.querySelectorAll('.gallery-filter');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Update active button
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(function (item) {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          item.style.animation = 'galleryFadeIn 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Inject filter fade-in keyframe dynamically
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes galleryFadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to   { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(styleEl);

  /* ============================================================
     5. LIGHTBOX
     ============================================================ */
  // Gallery data (placeholder labels and descriptions)
  const galleryData = [
    { label: 'Student Life Photo 1',   cat: 'Student Life',  desc: 'Everyday moments in the Mettaloka community.' },
    { label: 'Student Life Photo 2',   cat: 'Study Time',    desc: 'Focused study sessions at the centre.' },
    { label: 'Student Life Photo 3',   cat: 'Daily Routine', desc: 'Morning routines that build discipline.' },
    { label: 'Events Photo 1',         cat: 'Annual Event',  desc: 'Celebrations that bring the whole family together.' },
    { label: 'Events Photo 2',         cat: 'Celebration',   desc: 'Moments of joy and achievement.' },
    { label: 'Events Photo 3',         cat: 'Special Event', desc: 'Special occasions mark milestones in our journey.' },
    { label: 'Seminar Photo 1',        cat: 'Sunday Seminar',desc: 'Weekly seminars igniting curiosity and conversation.' },
    { label: 'Seminar Photo 2',        cat: 'Guest Speaker', desc: 'Inspiring voices from the outside world.' },
    { label: 'MPL Photo 1',            cat: 'MPL Match',     desc: 'The spirit of sportsmanship alive in every game.' },
    { label: 'MPL Photo 2',            cat: 'MPL Champions', desc: 'Champions celebrated with pride and brotherhood.' },
    { label: 'MPL Photo 3',            cat: 'Team Spirit',   desc: 'Because winning together is what Mettaloka is about.' }
  ];

  let currentIndex = 0;
  let visibleItems = [];

  function openLightbox(index) {
    // Build list of currently visible items
    visibleItems = [];
    galleryItems.forEach(function (item) {
      if (item.style.display !== 'none') {
        visibleItems.push(parseInt(item.dataset.index));
      }
    });

    currentIndex = visibleItems.indexOf(index);
    if (currentIndex === -1) currentIndex = 0;
    renderLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function renderLightbox() {
    const idx  = visibleItems[currentIndex];
    const data = galleryData[idx] || { label: 'Photo', cat: '', desc: '' };
    lbContent.innerHTML = `
      <div class="lb-placeholder">
        <span style="font-size:3rem;">📷</span>
        <p style="font-weight:600;font-size:1.1rem;">${data.label}</p>
        <p style="font-size:0.85rem;opacity:0.6;">${data.desc}</p>
        <small style="opacity:0.4;font-style:italic;font-size:0.75rem;">Editable / Replace Later – swap with real &lt;img&gt; tag</small>
      </div>
    `;
  }

  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      openLightbox(parseInt(item.dataset.index));
    });
  });

  lbClose.addEventListener('click', closeLightbox);

  lbPrev.addEventListener('click', function () {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    renderLightbox();
  });

  lbNext.addEventListener('click', function () {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    renderLightbox();
  });

  // Close on backdrop click
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   { currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length; renderLightbox(); }
    if (e.key === 'ArrowRight')  { currentIndex = (currentIndex + 1) % visibleItems.length; renderLightbox(); }
  });

  /* ============================================================
     6. SCROLL REVEAL – lightweight IntersectionObserver animation
     ============================================================ */
  const revealElements = document.querySelectorAll(
    '.about-card, .center-card, .life-card, .activity-card, ' +
    '.criteria-item, .benefit-item, .notice-card, .gallery-item, ' +
    '.contact-info-card, .contact-message-card, .stat-item'
  );

  // Set initial state
  revealElements.forEach(function (el) {
    el.style.opacity  = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  });

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity  = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ============================================================
     7. ACTIVE NAV LINK – highlight based on scroll position
     ============================================================ */
  const sections   = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-links .nav-link');

  function updateActiveNavLink() {
    let currentSection = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    allNavLinks.forEach(function (link) {
      link.classList.remove('active-link');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active-link');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // Inject active-link style
  const activeStyle = document.createElement('style');
  activeStyle.textContent = `
    .site-header.scrolled .nav-link.active-link {
      background: var(--saffron-pale);
      color: var(--saffron);
    }
  `;
  document.head.appendChild(activeStyle);

  /* ============================================================
     8. SMOOTH ANCHOR OFFSET (account for fixed header)
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerHeight = header.offsetHeight;
      const targetY = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });

  /* ============================================================
     9. STATS COUNTER ANIMATION
     ============================================================ */
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statNumbers.forEach(function (el) {
        const text = el.textContent.trim();
        // Animate numeric values only
        const match = text.match(/^(\d+)/);
        if (!match) return;
        const target   = parseInt(match[1]);
        const suffix   = text.replace(match[1], '');
        const duration = 1200;
        const start    = performance.now();

        function tick(now) {
          const elapsed  = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased    = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      });
    }
  }, { threshold: 0.5 });

  const statsStrip = document.querySelector('.stats-strip');
  if (statsStrip) statsObserver.observe(statsStrip);

  /* ============================================================
     INIT
     ============================================================ */
  console.log('✅ Mettaloka Youth Centre – Website loaded successfully.');
  console.log('🏠 Est. 2003 | Brotherhood • Discipline • Learning');

})();
