/* ═══════════════════════════════════════════════════════════════════
   BHARAT DREAM FIELDS — Interactive Script
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

// ─── DOM Ready ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initScrollReveal();
  initCounters();
  initContactForm();
  initSmoothScroll();
  initParticles();
});

// ═══════════════════════════════════════════════════════════════════
// NAVBAR — scroll behavior
// ═══════════════════════════════════════════════════════════════════
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Highlight active nav link on scroll
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const activateLink = () => {
    let current = '';
    sections.forEach(sec => {
      const sectionTop = sec.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.style.color = '';
      const href = link.getAttribute('href');
      if (href === `#${current}`) {
        link.style.color = 'var(--gold)';
      }
    });
  };

  window.addEventListener('scroll', activateLink, { passive: true });
}

// ═══════════════════════════════════════════════════════════════════
// HAMBURGER MENU
// ═══════════════════════════════════════════════════════════════════
function initHamburger() {
  const btn = document.getElementById('hamburger-btn');
  const nav = document.getElementById('nav-links');
  if (!btn || !nav) return;

  const toggle = () => {
    const isOpen = btn.classList.toggle('open');
    nav.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  btn.addEventListener('click', toggle);

  // Close on nav link click
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') && !btn.contains(e.target) && !nav.contains(e.target)) {
      btn.classList.remove('open');
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

// ═══════════════════════════════════════════════════════════════════
// SCROLL REVEAL — Intersection Observer
// ═══════════════════════════════════════════════════════════════════
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// ═══════════════════════════════════════════════════════════════════
// ANIMATED COUNTERS
// ═══════════════════════════════════════════════════════════════════
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(ease * target);
      el.textContent = current.toLocaleString('en-IN');

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString('en-IN');
      }
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

// ═══════════════════════════════════════════════════════════════════
// SMOOTH SCROLL — for anchor links
// ═══════════════════════════════════════════════════════════════════
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = anchor.getAttribute('href');
      if (target === '#') return;

      const targetEl = document.querySelector(target);
      if (!targetEl) return;

      e.preventDefault();
      const navHeight = 72;
      const top = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ═══════════════════════════════════════════════════════════════════
// CONTACT FORM — client-side handling
// ═══════════════════════════════════════════════════════════════════
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('#contact-submit-btn');
    const firstName = form.querySelector('#contact-first-name').value.trim();
    const lastName = form.querySelector('#contact-last-name').value.trim();
    const mobile = form.querySelector('#contact-mobile').value.trim();
    const email = form.querySelector('#contact-email').value.trim();

    // Simple validation
    if (!firstName || !mobile || !email) {
      showFormError('Please fill in all required fields.');
      return;
    }

    if (!isValidEmail(email)) {
      showFormError('Please enter a valid email address.');
      return;
    }

    // Simulate submission (form action would go to WordPress endpoint on live site)
    btn.textContent = 'Sending...';
    btn.disabled = true;

    await delay(1200);

    // Show success message
    form.innerHTML = `
      <div class="form-success" style="display:flex; flex-direction:column; align-items:center; gap:16px; padding:40px 20px;">
        <div style="font-size:3rem;">🌱</div>
        <h3 style="font-family:var(--font-serif); color:var(--text-primary);">Message Received!</h3>
        <p style="color:var(--text-secondary); text-align:center; line-height:1.7;">
          Thank you, <strong style="color:var(--text-primary);">${firstName}</strong>! We'll get back to you at <strong style="color:var(--gold);">${email}</strong> within 24 hours.
        </p>
        <a href="mailto:contact@bharathdreamfields.com" class="btn btn-outline-gold" style="margin-top:8px;">
          Email Us Directly
        </a>
      </div>
    `;
  });
}

function showFormError(msg) {
  const existing = document.querySelector('.form-error-msg');
  if (existing) existing.remove();

  const err = document.createElement('p');
  err.className = 'form-error-msg';
  err.style.cssText = 'color:#ff6b6b;font-size:0.85rem;margin-top:8px;font-family:var(--font-mono);';
  err.textContent = msg;

  const form = document.getElementById('contact-form');
  form.appendChild(err);

  setTimeout(() => err.remove(), 4000);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ═══════════════════════════════════════════════════════════════════
// FLOATING PARTICLES — Hero Section
// ═══════════════════════════════════════════════════════════════════
function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  const particleCount = 18;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    const isGold = Math.random() > 0.6;
    const size = Math.random() * 4 + 2;

    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${isGold ? 'rgba(201,168,76,' : 'rgba(76,175,106,'}${Math.random() * 0.3 + 0.1});
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: particle-float ${Math.random() * 8 + 6}s ease-in-out infinite;
      animation-delay: ${Math.random() * -8}s;
      pointer-events: none;
    `;

    container.appendChild(particle);
  }

  // Inject particle keyframes
  if (!document.getElementById('particle-style')) {
    const style = document.createElement('style');
    style.id = 'particle-style';
    style.textContent = `
      @keyframes particle-float {
        0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.6; }
        25% { transform: translateY(-${Math.random() * 30 + 15}px) translateX(${Math.random() * 20 - 10}px) scale(1.2); opacity: 0.9; }
        50% { transform: translateY(-${Math.random() * 50 + 20}px) translateX(${Math.random() * 30 - 15}px) scale(0.9); opacity: 0.5; }
        75% { transform: translateY(-${Math.random() * 25 + 10}px) translateX(${Math.random() * 20 - 10}px) scale(1.1); opacity: 0.8; }
      }
    `;
    document.head.appendChild(style);
  }
}

// ═══════════════════════════════════════════════════════════════════
// PRELOADER (optional polish)
// ═══════════════════════════════════════════════════════════════════
window.addEventListener('load', () => {
  document.body.classList.add('loaded');

  // Add a subtle entrance animation to the page
  const style = document.createElement('style');
  style.textContent = `
    body { opacity: 0; transition: opacity 0.4s ease; }
    body.loaded { opacity: 1; }
  `;
  document.head.insertBefore(style, document.head.firstChild);
});
