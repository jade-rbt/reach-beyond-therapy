/* ============================================================
   REACH BEYOND THERAPY — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* --- Mobile nav toggle --- */
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.querySelector('.nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      const isOpen = menu.classList.toggle('mobile-open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('mobile-open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* --- FAQ accordion --- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(function (i) { i.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });

  /* --- Highlight active nav link --- */
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const navLinks = document.querySelectorAll('.nav-link, .nav-dropdown a');
  navLinks.forEach(function (link) {
    const linkPath = new URL(link.href, window.location.href).pathname.replace(/\/$/, '') || '/';
    if (linkPath === currentPath || (currentPath === '/' && linkPath === '/index.html')) {
      link.classList.add('active');
    }
  });

  /* --- Smooth-reveal on scroll (simple IntersectionObserver) --- */
  const revealEls = document.querySelectorAll('.feature-card, .service-card, .testimonial-card, .staff-card, .blog-card, .media-card');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }

  /* --- Contact form basic validation --- */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name  = form.querySelector('[name="name"]');
      const email = form.querySelector('[name="email"]');
      const msg   = form.querySelector('[name="message"]');
      let valid = true;

      [name, email, msg].forEach(function (field) {
        if (!field) return;
        if (!field.value.trim()) {
          field.style.borderColor = '#c0392b';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (valid) {
        const btn = form.querySelector('.btn');
        if (btn) {
          btn.textContent = 'Message Sent!';
          btn.disabled = true;
        }
      }
    });
  }

});
