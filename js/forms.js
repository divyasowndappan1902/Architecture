/**
 * ARCHITECTURE PRIME — Form Validation & Feedback System
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initPasswordToggle();
  initContactForm();
  initLoginForm();
  initNewsletterForms();
});

/* Sticky Header Scroll Effect */
function initNavbarScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* Mobile Fullscreen Navigation */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !overlay) return;

  function toggleMenu() {
    toggleBtn.classList.toggle('active');
    overlay.classList.toggle('open');
    const isOpen = overlay.classList.contains('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars', !isOpen);
      icon.classList.toggle('fa-times', isOpen);
    }
  }

  toggleBtn.addEventListener('click', toggleMenu);

  links.forEach((l) => {
    l.addEventListener('click', () => {
      if (overlay.classList.contains('open')) {
        toggleMenu();
      }
    });
  });
}

/* Password Visibility Toggle */
function initPasswordToggle() {
  const toggleBtns = document.querySelectorAll('.toggle-password-btn');

  toggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      const icon = btn.querySelector('i');

      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });
}

/* Toast Notification Utility */
function showToast(message, isSuccess = true) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  const iconClass = isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle';
  toast.innerHTML = `
    <i class="fas ${iconClass} toast-icon"></i>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* Contact Form Validation */
function initContactForm() {
  const contactForm = document.querySelector('#contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const name = contactForm.querySelector('#contactName');
    const email = contactForm.querySelector('#contactEmail');
    const phone = contactForm.querySelector('#contactPhone');
    const message = contactForm.querySelector('#contactMessage');

    // Name validation
    if (!name.value.trim()) {
      showError(name, 'Full name is required.');
      isValid = false;
    } else {
      clearError(name);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
      showError(email, 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearError(email);
    }

    // Message validation
    if (!message.value.trim()) {
      showError(message, 'Please provide details about your architectural inquiry.');
      isValid = false;
    } else {
      clearError(message);
    }

    if (isValid) {
      window.location.href = '404.html';
    }
  });
}

/* Login Form Validation */
function initLoginForm() {
  const loginForm = document.querySelector('#loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const email = loginForm.querySelector('#loginEmail');
    const password = loginForm.querySelector('#loginPassword');

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
      showError(email, 'Please enter a valid registered email.');
      isValid = false;
    } else {
      clearError(email);
    }

    // Password
    if (!password.value || password.value.length < 6) {
      showError(password, 'Password must be at least 6 characters.');
      isValid = false;
    } else {
      clearError(password);
    }

    if (isValid) {
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        showToast(`Welcome back to Architecture Prime Portal, ${email.value.split('@')[0]}!`);
      }, 1400);
    }
  });
}

/* Newsletter Subscription */
function initNewsletterForms() {
  const forms = document.querySelectorAll('.newsletter-form, .newsletter-form-inline');

  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  });
}

function showError(input, message) {
  const group = input.closest('.form-group');
  if (group) {
    group.classList.add('has-error');
    let errorElem = group.querySelector('.form-error-msg');
    if (!errorElem) {
      errorElem = document.createElement('span');
      errorElem.className = 'form-error-msg';
      group.appendChild(errorElem);
    }
    errorElem.innerText = message;
  }
}

function clearError(input) {
  const group = input.closest('.form-group');
  if (group) {
    group.classList.remove('has-error');
  }
}
