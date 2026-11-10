/* Email sign-up forms → Google Sheet (via a Google Apps Script web app).
   Any <form data-signup-form="name" data-endpoint="https://script.google.com/..."> is handled here.
   The endpoint is set once in _config.yml as `signup_endpoint`. */
(function () {
  if (window.__rbtSignupInit) return;
  window.__rbtSignupInit = true;

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setMsg(form, text, isError) {
    var el = form.querySelector('.signup-msg');
    if (!el) return;
    el.textContent = text;
    el.classList.toggle('is-error', !!isError);
  }

  function handle(form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var hp = form.querySelector('[name="website"]');
      if (hp && hp.value) return; // bot

      var email = (form.querySelector('[name="email"]') || {}).value || '';
      email = email.trim();
      if (!EMAIL_RE.test(email)) {
        setMsg(form, 'Please enter a valid email address.', true);
        return;
      }
      var endpoint = form.getAttribute('data-endpoint');
      if (!endpoint) {
        console.warn('Sign-up endpoint not configured (site.signup_endpoint in _config.yml).');
        setMsg(form, 'Sorry, sign-up is temporarily unavailable. Please email info@reachbeyondtherapy.com.', true);
        return;
      }

      var data = new URLSearchParams();
      Array.prototype.forEach.call(form.elements, function (el) {
        if (el.name && el.name !== 'website') data.append(el.name, (el.value || '').trim());
      });
      data.set('email', email);
      data.append('form', form.getAttribute('data-signup-form') || 'signup');
      data.append('page', location.pathname);

      var btn = form.querySelector('[type="submit"]');
      if (btn) btn.disabled = true;
      setMsg(form, 'Signing you up…');

      // Apps Script web apps don't send CORS headers, so the response is opaque;
      // a resolved fetch means the request reached Google.
      fetch(endpoint, { method: 'POST', mode: 'no-cors', body: data })
        .then(function () {
          form.reset();
          setMsg(form, form.getAttribute('data-success') || "You're on the list — thank you!");
          if (window.fbq) window.fbq('track', 'Lead', { content_name: form.getAttribute('data-signup-form') });
          if (window.gtag) window.gtag('event', 'generate_lead', { form_name: form.getAttribute('data-signup-form') });
        })
        .catch(function () {
          setMsg(form, 'Something went wrong. Please try again or email info@reachbeyondtherapy.com.', true);
        })
        .then(function () { if (btn) btn.disabled = false; });
    });
  }

  function init() {
    document.querySelectorAll('form[data-signup-form]').forEach(handle);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
