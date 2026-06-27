/* ============================================
   MARKIZARM PRODUCTION — Interactive Scripts
   Parallax · Canvas Abstract · Custom Cursor
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

  // ── Custom Cursor (replaces default completely) ─
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  let cursorX = -100, cursorY = -100;
  let ringX = -100, ringY = -100;

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
      ringX += (cursorX - ringX) * 0.12;
      ringY += (cursorY - ringY) * 0.12;

      cursor.style.left = ringX + 'px';
      cursor.style.top = ringY + 'px';

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states
    document.querySelectorAll('[data-hover], a, button').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovering');
        cursorDot.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovering');
        cursorDot.classList.remove('hovering');
      });
    });

    // Hide cursor when mouse leaves window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorDot.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      cursorDot.style.opacity = '1';
    });
  }

  // ── Abstract Canvas Background ──────────────────
  const heroCanvas = document.getElementById('heroCanvas');
  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let animationId;
    let mouseX = 0.5;
    let mouseY = 0.5;
    let time = 0;

    function resizeCanvas() {
      heroCanvas.width = heroCanvas.offsetWidth * window.devicePixelRatio;
      heroCanvas.height = heroCanvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse for subtle interactivity
    heroCanvas.closest('.hero').addEventListener('mousemove', (e) => {
      const rect = heroCanvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = (e.clientY - rect.top) / rect.height;
    });

    // Particles for abstract effect
    const particles = [];
    const PARTICLE_COUNT = 60;
    const GRID_LINES = 8;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        const w = heroCanvas.offsetWidth;
        const h = heroCanvas.offsetHeight;
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulseOffset = Math.random() * Math.PI * 2;
      }

      update(w, h) {
        this.x += this.speedX + (mouseX - 0.5) * 0.15;
        this.y += this.speedY + (mouseY - 0.5) * 0.15;

        if (this.x < 0) this.x = w;
        if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h;
        if (this.y > h) this.y = 0;
      }

      draw(ctx, t) {
        const pulse = Math.sin(t * this.pulseSpeed + this.pulseOffset) * 0.5 + 0.5;
        const alpha = this.opacity * (0.5 + pulse * 0.5);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 169, 126, ${alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    function drawAbstract() {
      const w = heroCanvas.offsetWidth;
      const h = heroCanvas.offsetHeight;

      ctx.clearRect(0, 0, w, h);

      // Background gradient
      const gradient = ctx.createRadialGradient(
        w * (0.5 + (mouseX - 0.5) * 0.1),
        h * (0.5 + (mouseY - 0.5) * 0.1),
        0,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.8
      );
      gradient.addColorStop(0, 'rgba(22, 18, 14, 0.6)');
      gradient.addColorStop(0.4, 'rgba(14, 12, 10, 0.4)');
      gradient.addColorStop(1, 'rgba(10, 10, 10, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Subtle geometric grid lines
      ctx.strokeStyle = 'rgba(200, 169, 126, 0.03)';
      ctx.lineWidth = 1;

      for (let i = 0; i <= GRID_LINES; i++) {
        const progress = i / GRID_LINES;
        const wave = Math.sin(time * 0.0005 + progress * Math.PI * 2) * 20;

        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, h * progress + wave);
        ctx.bezierCurveTo(
          w * 0.33, h * progress + wave + Math.sin(time * 0.0008 + i) * 15,
          w * 0.66, h * progress + wave - Math.sin(time * 0.0006 + i) * 15,
          w, h * progress + wave
        );
        ctx.stroke();

        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(w * progress + wave, 0);
        ctx.bezierCurveTo(
          w * progress + wave + Math.sin(time * 0.0007 + i) * 15, h * 0.33,
          w * progress + wave - Math.sin(time * 0.0005 + i) * 15, h * 0.66,
          w * progress + wave, h
        );
        ctx.stroke();
      }

      // Flowing curves
      for (let c = 0; c < 3; c++) {
        const offset = c * 1.2;
        ctx.beginPath();
        ctx.moveTo(-50, h * 0.3 + Math.sin(time * 0.0004 + offset) * h * 0.1);

        for (let x = 0; x <= w; x += 5) {
          const progress = x / w;
          const y = h * (0.3 + c * 0.2) +
            Math.sin(progress * Math.PI * 2 + time * 0.0005 + offset) * h * 0.08 +
            Math.sin(progress * Math.PI * 4 + time * 0.0003 + offset) * h * 0.03;
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = `rgba(200, 169, 126, ${0.025 - c * 0.006})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Accent glow orbs
      for (let g = 0; g < 3; g++) {
        const gx = w * (0.2 + g * 0.3) + Math.sin(time * 0.0003 + g * 2) * w * 0.1;
        const gy = h * (0.3 + g * 0.15) + Math.cos(time * 0.0004 + g * 1.5) * h * 0.1;
        const gRadius = 100 + Math.sin(time * 0.001 + g) * 30;

        const orbGrad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gRadius);
        orbGrad.addColorStop(0, `rgba(200, 169, 126, ${0.04 - g * 0.01})`);
        orbGrad.addColorStop(1, 'rgba(200, 169, 126, 0)');
        ctx.fillStyle = orbGrad;
        ctx.fillRect(gx - gRadius, gy - gRadius, gRadius * 2, gRadius * 2);
      }

      // Update and draw particles
      particles.forEach(p => {
        p.update(w, h);
        p.draw(ctx, time);
      });

      // Draw connections between nearby particles
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(200, 169, 126, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      time++;
      animationId = requestAnimationFrame(drawAbstract);
    }

    drawAbstract();

    // Pause animation when not visible
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animationId) drawAbstract();
        } else {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      });
    }, { threshold: 0.1 });

    heroObserver.observe(heroCanvas.closest('.hero'));
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
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Reveal on Scroll (IntersectionObserver) ────
  const revealElements = document.querySelectorAll('.reveal, .reveal-mask, .reveal-scale');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
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

  // ── Magnetic Hover for Buttons ─────────────────
  document.querySelectorAll('.btn-submit, .btn-more-works, .btn-primary, .btn-ghost').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.5s, color 0.5s, box-shadow 0.5s';
      setTimeout(() => {
        btn.style.transition = '';
      }, 400);
    });
  });

  // ── Smooth section fade with parallax-like depth ─
  const sections = document.querySelectorAll('.section');

  function updateSectionParallax() {
    const windowH = window.innerHeight;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < windowH) {
        const progress = (windowH - rect.top) / (windowH + rect.height);
        const header = section.querySelector('.section-header');
        if (header) {
          const translateY = (1 - progress) * 15;
          header.style.transform = `translateY(${translateY}px)`;
        }
      }
    });
  }

  window.addEventListener('scroll', updateSectionParallax, { passive: true });

  // ── Page Load Init ─────────────────────────────
  document.body.style.overflow = 'hidden';

})();
