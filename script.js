'use strict';

/* ============================================================
   Nav scroll state
   ============================================================ */
(function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const threshold = 20;

  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > threshold);
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
})();

/* ============================================================
   Scroll reveal with IntersectionObserver
   ============================================================ */
(function initReveal() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: show everything immediately
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ============================================================
   Contact form validation and submission
   ============================================================ */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('submit-btn');
  const successMsg = document.getElementById('form-success');

  const rules = {
    name:    { required: true, minLength: 2, label: 'Name' },
    email:   { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, label: 'Email' },
    message: { required: true, minLength: 20, label: 'Message' },
  };

  function getError(field) {
    const rule = rules[field.name];
    if (!rule) return '';
    const val = field.value.trim();

    if (rule.required && !val) return `${rule.label} is required.`;
    if (rule.minLength && val.length < rule.minLength)
      return `${rule.label} must be at least ${rule.minLength} characters.`;
    if (rule.pattern && !rule.pattern.test(val))
      return 'Please enter a valid email address.';

    return '';
  }

  function showError(field, msg) {
    const errorEl = document.getElementById(`${field.name}-error`);
    field.classList.toggle('error', !!msg);
    if (errorEl) errorEl.textContent = msg;
  }

  function clearError(field) {
    showError(field, '');
  }

  // Validate on blur for UX
  form.querySelectorAll('.form-input').forEach(field => {
    field.addEventListener('blur', () => {
      if (rules[field.name]) showError(field, getError(field));
    });
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) {
        showError(field, getError(field));
      }
    });
  });

  function validateAll() {
    let valid = true;
    form.querySelectorAll('.form-input').forEach(field => {
      if (rules[field.name]) {
        const msg = getError(field);
        showError(field, msg);
        if (msg) valid = false;
      }
    });
    return valid;
  }

  function simulateSubmit() {
    return new Promise(resolve => setTimeout(resolve, 1400));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    submitBtn.classList.add('btn--submitting');
    successMsg.hidden = true;

    try {
      // Replace simulateSubmit() with a real fetch() when you have a backend endpoint.
      await simulateSubmit();

      form.reset();
      form.querySelectorAll('.form-input').forEach(f => clearError(f));
      successMsg.hidden = false;
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch {
      // In production, surface a real error message here
      const errorEl = form.querySelector('.form-error');
      if (errorEl) errorEl.textContent = 'Something went wrong. Please try again.';
    } finally {
      submitBtn.classList.remove('btn--submitting');
    }
  });
})();

/* ============================================================
   Smooth-scroll for anchor links (supplements CSS scroll-behavior
   for browsers that need JS fallback, and handles offset for fixed nav)
   ============================================================ */
(function initAnchorScroll() {
  const NAV_HEIGHT = 72;

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
