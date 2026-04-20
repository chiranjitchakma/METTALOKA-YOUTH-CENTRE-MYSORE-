/* ═══════════════════════════════════════════════════════
   METTALOKA YOUTH CENTRE — script.js
   Fixes: burger menu, back-to-top, hero slideshow, lightbox
   ═══════════════════════════════════════════════════════ */
(function(){
'use strict';

/* ── Wait for DOM ── */
document.addEventListener('DOMContentLoaded', function(){

  /* ── 1. ELEMENT REFS ───────────────────────────────── */
  var hdr       = document.getElementById('hdr');
  var hbg       = document.getElementById('hbg');
  var nmenu     = document.getElementById('nmenu');
  var btt       = document.getElementById('btt');
  var slides    = document.querySelectorAll('.slide');
  var sdotsWrap = document.getElementById('sdots');
  var galGrid   = document.getElementById('gal');
  var lbox      = document.getElementById('lbox');
  var lbxImg    = document.getElementById('lbx-img');
  var lbxClose  = document.getElementById('lbx-close');
  var lbxPrev   = document.getElementById('lbx-prev');
  var lbxNext   = document.getElementById('lbx-next');
  var lbxCnt    = document.getElementById('lbx-cnt');

  /* ═══════════════════════════════════════════════════
     2. STICKY HEADER + BACK-TO-TOP
  ═══════════════════════════════════════════════════ */
  function handleScroll(){
    var y = window.pageYOffset || document.documentElement.scrollTop;

    /* header */
    if(y > 60){ hdr.classList.add('scrolled'); }
    else       { hdr.classList.remove('scrolled'); }

    /* back-to-top */
    if(y > 400){ btt.classList.add('show'); }
    else        { btt.classList.remove('show'); }

    /* scroll reveal */
    revealCheck();
  }

  window.addEventListener('scroll', handleScroll, {passive:true});
  handleScroll(); /* run on load */

  /* ═══════════════════════════════════════════════════
     3. BACK TO TOP — click
  ═══════════════════════════════════════════════════ */
  if(btt){
    btt.addEventListener('click', function(){
      window.scrollTo({top:0, behavior:'smooth'});
    });
  }

  /* ═══════════════════════════════════════════════════
     4. BURGER / MOBILE NAV
     — The ONLY thing that should toggle .open on nmenu
  ═══════════════════════════════════════════════════ */
  var menuOpen = false;

  function openMenu(){
    menuOpen = true;
    nmenu.classList.add('open');
    hbg.classList.add('open');
    hbg.setAttribute('aria-expanded','true');
    document.body.style.overflow = ''; /* don't lock body scroll */
  }

  function closeMenu(){
    menuOpen = false;
    nmenu.classList.remove('open');
    hbg.classList.remove('open');
    hbg.setAttribute('aria-expanded','false');
  }

  if(hbg && nmenu){
    hbg.addEventListener('click', function(e){
      e.stopPropagation();
      if(menuOpen){ closeMenu(); } else { openMenu(); }
    });

    /* Close when a nav link is tapped */
    nmenu.querySelectorAll('.nlink').forEach(function(a){
      a.addEventListener('click', function(){
        closeMenu();
      });
    });

    /* Close when tapping outside */
    document.addEventListener('click', function(e){
      if(menuOpen && !hdr.contains(e.target)){
        closeMenu();
      }
    });

    /* Close on Escape */
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && menuOpen){ closeMenu(); }
    });
  }

  /* ═══════════════════════════════════════════════════
     5. SMOOTH ANCHOR SCROLL (offset for fixed header)
  ═══════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var hash = a.getAttribute('href');
      if(hash === '#') return;
      var target = document.querySelector(hash);
      if(!target) return;
      e.preventDefault();
      var offset = (hdr ? hdr.offsetHeight : 72) + 8;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({top: top, behavior:'smooth'});
    });
  });

  /* ═══════════════════════════════════════════════════
     6. HERO SLIDESHOW — auto every 2.5 s
  ═══════════════════════════════════════════════════ */
  var curSlide = 0;
  var slideTimer = null;
  var dots = [];

  /* Build dots dynamically */
  if(sdotsWrap && slides.length){
    slides.forEach(function(_,i){
      var btn = document.createElement('button');
      btn.className = 'sdot' + (i===0?' active':'');
      btn.setAttribute('aria-label','Slide '+(i+1));
      btn.dataset.s = i;
      sdotsWrap.appendChild(btn);
      dots.push(btn);
      btn.addEventListener('click',function(){
        goSlide(i);
        resetTimer();
      });
    });
  }

  function goSlide(n){
    slides[curSlide].classList.remove('active');
    if(dots[curSlide]) dots[curSlide].classList.remove('active');
    curSlide = (n + slides.length) % slides.length;
    slides[curSlide].classList.add('active');
    if(dots[curSlide]) dots[curSlide].classList.add('active');
  }

  function tick(){ goSlide(curSlide + 1); }

  function startTimer(){
    slideTimer = setInterval(tick, 2500); /* 2.5 seconds */
  }

  function resetTimer(){
    clearInterval(slideTimer);
    startTimer();
  }

  if(slides.length > 1){ startTimer(); }

  /* ═══════════════════════════════════════════════════
     7. GALLERY LIGHTBOX
  ═══════════════════════════════════════════════════ */
  var galImgs = [];
  var curImg  = 0;

  if(galGrid){
    galGrid.querySelectorAll('.gi').forEach(function(gi,i){
      var img = gi.querySelector('img');
      if(img) galImgs.push(img.src);
      gi.addEventListener('click', function(){ openLbox(i); });
    });
  }

  function openLbox(i){
    curImg = i;
    lbxImg.src = galImgs[i];
    updateCount();
    lbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLbox(){
    lbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function(){ if(!lbox.classList.contains('open')) lbxImg.src=''; }, 350);
  }

  function showImg(i){
    curImg = (i + galImgs.length) % galImgs.length;
    lbxImg.style.opacity = '0';
    setTimeout(function(){
      lbxImg.src = galImgs[curImg];
      updateCount();
      lbxImg.style.opacity = '1';
    }, 120);
  }

  function updateCount(){
    if(lbxCnt) lbxCnt.textContent = (curImg+1) + ' / ' + galImgs.length;
  }

  lbxImg.style.transition = 'opacity .15s ease';

  if(lbxClose) lbxClose.addEventListener('click', closeLbox);
  if(lbxPrev)  lbxPrev.addEventListener('click',  function(){ showImg(curImg-1); });
  if(lbxNext)  lbxNext.addEventListener('click',  function(){ showImg(curImg+1); });

  lbox.addEventListener('click', function(e){
    if(e.target === lbox) closeLbox();
  });

  document.addEventListener('keydown', function(e){
    if(!lbox.classList.contains('open')) return;
    if(e.key === 'Escape')      closeLbox();
    if(e.key === 'ArrowLeft')   showImg(curImg-1);
    if(e.key === 'ArrowRight')  showImg(curImg+1);
  });

  /* Touch swipe */
  var tx = 0;
  lbox.addEventListener('touchstart', function(e){ tx = e.changedTouches[0].clientX; }, {passive:true});
  lbox.addEventListener('touchend',   function(e){
    var dx = e.changedTouches[0].clientX - tx;
    if(Math.abs(dx) > 40){ dx < 0 ? showImg(curImg+1) : showImg(curImg-1); }
  });

  /* ═══════════════════════════════════════════════════
     8. SCROLL REVEAL
  ═══════════════════════════════════════════════════ */
  var revItems = document.querySelectorAll('.reveal');

  var revObs = null;
  if('IntersectionObserver' in window){
    revObs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('vis');
          revObs.unobserve(entry.target);
        }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -24px 0px'});

    revItems.forEach(function(el){ revObs.observe(el); });
  } else {
    /* Fallback: just show all */
    revItems.forEach(function(el){ el.classList.add('vis'); });
  }

  function revealCheck(){
    revItems.forEach(function(el){
      var r = el.getBoundingClientRect();
      if(r.top < window.innerHeight - 24){ el.classList.add('vis'); }
    });
  }
  revealCheck();

  /* ═══════════════════════════════════════════════════
     9. STATS COUNTER
  ═══════════════════════════════════════════════════ */
  var statsBar  = document.querySelector('.stats-bar');
  var counted   = false;

  if(statsBar){
    var sObs = new IntersectionObserver(function(entries){
      if(entries[0].isIntersecting && !counted){
        counted = true;
        document.querySelectorAll('.stt-n').forEach(function(el){
          var raw    = el.getAttribute('data-target') || el.textContent;
          var suffix = el.getAttribute('data-suffix') || '';
          var target = parseInt(raw, 10);
          if(isNaN(target)) return;
          var dur = 1400, start = performance.now();
          (function tick(now){
            var p = Math.min((now-start)/dur, 1);
            var v = Math.round((1 - Math.pow(1-p,3)) * target);
            el.textContent = v + suffix;
            if(p < 1) requestAnimationFrame(tick);
          })(start);
        });
      }
    },{threshold:0.5});
    sObs.observe(statsBar);
  }

  console.log('✅ Mettaloka Youth Centre — ready');

}); /* end DOMContentLoaded */

})();
