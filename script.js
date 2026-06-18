/* ============================================
   MARKIZARM PRODUCTION — Interactive Scripts
   Parallax · 3D Tilt · Masked Transitions
   ============================================ */

(function () {
  'use strict';

  // ── Preloader ──────────────────────────────────
  const preloader = document.getElementById('preloader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1200);
  });

  // Fallback: hide preloader after 4s max
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 4000);

  // ── Custom Cursor ──────────────────────────────
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;

  if (window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;

      // Dot follows immediately
      cursorDot.style.left = cursorX + 'px';
      cursorDot.style.top = cursorY + 'px';
    });

    // Smooth cursor ring follow
    function animateCursor() {
      dotX += (cursorX - dotX) * 0.15;
      dotY += (cursorY - dotY) * 0.15;

      cursor.style.left = dotX + 'px';
      cursor.style.top = dotY + 'px';

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states
    document.querySelectorAll('[data-hover], a, button').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  }

  // ── Navigation ─────────────────────────────────
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  // Scroll detection for nav background
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = scrollY;
  }, { passive: true });

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  document.querySelectorAll('[data-mobile-link]').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ── Smooth Scroll ──────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Parallax Effects ───────────────────────────
  const heroBgImg = document.getElementById('heroBgImg');
  const featuredBgs = document.querySelectorAll('.featured-project-bg img');

  function updateParallax() {
    const scrollY = window.scrollY;
    const windowH = window.innerHeight;

    // Hero parallax
    if (heroBgImg && scrollY < windowH * 1.5) {
      const translate = scrollY * 0.35;
      const scale = 1.1 + scrollY * 0.0002;
      heroBgImg.style.transform = `translateY(${translate}px) scale(${scale})`;
    }

    // Featured project parallax
    featuredBgs.forEach((img) => {
      const rect = img.closest('.featured-project').getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < windowH) {
        const progress = (windowH - rect.top) / (windowH + rect.height);
        const translate = (progress - 0.5) * 80;
        img.style.transform = `translateY(${translate}px) scale(1.05)`;
      }
    });

    // Project card images parallax
    document.querySelectorAll('.project-card-image img').forEach((img) => {
      const rect = img.closest('.project-card').getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < windowH) {
        const progress = (windowH - rect.top) / (windowH + rect.height);
        const translate = (progress - 0.5) * 30;
        img.style.transform = `translateY(${translate}px) scale(1.05)`;
      }
    });
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();

  // ── 3D Tilt Effect on Cards ────────────────────
  const tiltCards = document.querySelectorAll('[data-tilt]');
  const TILT_MAX = 12;
  const GLARE_SIZE = 600;

  tiltCards.forEach((card) => {
    const inner = card.querySelector('.video-card-inner') || card.querySelector('.project-card-inner');
    const shine = card.querySelector('.project-card-shine');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -TILT_MAX;
      const rotateY = ((x - centerX) / centerX) * TILT_MAX;

      inner.style.transform =
        `perspective(${1000}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      // Shine/glare position
      if (shine) {
        const percX = (x / rect.width) * 100;
        const percY = (y / rect.height) * 100;
        shine.style.setProperty('--mouse-x', percX + '%');
        shine.style.setProperty('--mouse-y', percY + '%');
      }
    });

    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      inner.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => {
        inner.style.transition = '';
      }, 600);
    });

    card.addEventListener('mouseenter', () => {
      inner.style.transition = 'none';
    });
  });

  // ── Reveal on Scroll (IntersectionObserver) ────
  const revealElements = document.querySelectorAll('.reveal, .reveal-mask, .reveal-scale');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Don't unobserve — keep for potential re-reveal
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ── Video Playback Logic ───────────────────────
  const videoCards = document.querySelectorAll('.video-card');
  videoCards.forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      video.play().catch(e => console.log('Video play prevented:', e));
      card.classList.add('playing');
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
      card.classList.remove('playing');
    });
  });

  // ── Counter Animation ──────────────────────────
  const counters = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          animateCounter(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  function animateCounter(el) {
    const text = el.textContent;
    // Extract the numeric part
    const match = text.match(/^([\d.]+)/);
    if (!match) return;

    const target = parseFloat(match[1]);
    const suffix = text.replace(match[1], '');
    const isDecimal = text.includes('.');
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quart
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = target * eased;

      if (isDecimal) {
        el.innerHTML = current.toFixed(1) + suffix;
      } else {
        el.innerHTML = Math.floor(current) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.innerHTML = text;
      }
    }

    requestAnimationFrame(update);
  }

  // ── Contact Form ───────────────────────────────
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('.btn-submit');
    const originalText = btn.innerHTML;

    btn.innerHTML = `
      <span>Отправлено</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    `;
    btn.style.borderColor = '#4ade80';
    btn.style.color = '#4ade80';

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.borderColor = '';
      btn.style.color = '';
      contactForm.reset();
    }, 3000);
  });

  // ── Magnetic Hover for Buttons ─────────────────
  document.querySelectorAll('.btn-submit, .project-card-view').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => {
        btn.style.transition = '';
      }, 400);
    });
  });

  // ── Page Load Init ─────────────────────────────
  document.body.style.overflow = 'hidden';

})();
