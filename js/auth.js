/**
 * STACKLY ATELIER — Client & Admin Portal Authentication Engine
 * Unique Role Selection Slot (Admin & Client), Dynamic Email & 6-Char Password Validation & Routing
 */

const VALID_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MIN_PASSWORD_LENGTH = 6;

document.addEventListener('DOMContentLoaded', () => {
  initRoleSelection();
  initPasswordToggles();
  initLoginForm();
  initSignupForm();
});

/* -------------------------------------------------------------
   1. UNIQUE STUDIO ROLE SELECTION SLOT (ADMIN & CLIENT)
   ------------------------------------------------------------- */
function initRoleSelection() {
  const roleCards = document.querySelectorAll('.auth-role-card');
  if (!roleCards.length) return;

  roleCards.forEach(card => {
    card.addEventListener('click', () => {
      roleCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const radio = card.querySelector('input[type="radio"]');
      const role = (radio ? radio.value : card.getAttribute('data-role') || 'admin').toLowerCase();
      if (radio) radio.checked = true;

      updateLoginRoleUI(role);
      updateSignupRoleUI(role);
    });
  });

  // Check URL query param if someone linked with ?role=client or ?role=admin
  const urlParams = new URLSearchParams(window.location.search);
  const urlRole = (urlParams.get('role') || '').toLowerCase();
  if (urlRole === 'admin' || urlRole === 'client') {
    const targetCard = document.querySelector(`.auth-role-card[data-role="${urlRole}"]`);
    if (targetCard) {
      targetCard.click();
    }
  }
}

/* Dynamic Respective Content Updater for Login Page (Does NOT overwrite user-typed values) */
function updateLoginRoleUI(role) {
  const clearanceTag = document.getElementById('loginRoleClearanceTag');
  const emailLabel = document.getElementById('loginEmailLabel');
  const emailInput = document.getElementById('loginEmail');
  const passLabel = document.getElementById('loginPasswordLabel');
  const submitBtnText = document.getElementById('loginSubmitBtnText');
  const submitBtnIcon = document.getElementById('loginSubmitBtnIcon');

  if (!clearanceTag && !submitBtnText) return;

  if (role === 'admin') {
    if (clearanceTag) clearanceTag.innerHTML = 'Tier 01 &bull; Admin Command';
    if (emailLabel) emailLabel.textContent = 'Admin Studio Email';
    if (emailInput) emailInput.placeholder = 'Enter valid email (e.g. admin@stacklyatelier.com)';
    if (passLabel) passLabel.textContent = 'Admin Master Passkey';
    if (submitBtnText) submitBtnText.textContent = 'Launch Admin Command Center';
    if (submitBtnIcon) submitBtnIcon.className = 'fas fa-shield-alt';
  } else {
    if (clearanceTag) clearanceTag.innerHTML = 'Tier 02 &bull; Client Patron';
    if (emailLabel) emailLabel.textContent = 'Client Patron Email';
    if (emailInput) emailInput.placeholder = 'Enter valid email (e.g. patron@stacklyatelier.com)';
    if (passLabel) passLabel.textContent = 'Patron Vault Passkey';
    if (submitBtnText) submitBtnText.textContent = 'Enter Client Patron Suite';
    if (submitBtnIcon) submitBtnIcon.className = 'fas fa-gem';
  }
}

/* Dynamic Respective Content Updater for Signup Page */
function updateSignupRoleUI(role) {
  const clearanceTag = document.getElementById('signupRoleClearanceTag');
  const preTitle = document.getElementById('signupPreTitle');
  const mainTitle = document.getElementById('signupMainTitle');
  const subDesc = document.getElementById('signupSubDesc');
  const nameLabel = document.getElementById('signupNameLabel');
  const nameInput = document.getElementById('signupName');
  const emailLabel = document.getElementById('signupEmailLabel');
  const emailInput = document.getElementById('signupEmail');
  const termsLabel = document.getElementById('signupTermsLabel');
  const submitBtnText = document.getElementById('signupSubmitBtnText');
  const visualBadge = document.getElementById('signupVisualBadge');
  const visualQuote = document.getElementById('signupVisualQuote');
  const visualAuthor = document.getElementById('signupVisualAuthor');
  const perk1 = document.getElementById('signupPerk1');
  const perk2 = document.getElementById('signupPerk2');
  const perk3 = document.getElementById('signupPerk3');

  if (!clearanceTag && !submitBtnText) return;

  if (role === 'admin') {
    if (clearanceTag) clearanceTag.innerHTML = 'Tier 01 &bull; Admin Command';
    if (preTitle) preTitle.innerHTML = '&mdash; EXECUTIVE STUDIO PROVISIONING';
    if (mainTitle) mainTitle.innerHTML = 'Provision <span style="font-family: var(--auth-font-serif); font-style: italic; color: var(--auth-rose-accent);">Admin Key</span>';
    if (subDesc) subDesc.textContent = 'Register an executive Studio Administrator credential to oversee global commissions, approve BIM Level 400 blueprints, and authorize escrow disbursements.';
    if (nameLabel) nameLabel.textContent = 'Principal / Architect Name *';
    if (nameInput) nameInput.placeholder = 'e.g. Arch. Kaelen Vance';
    if (emailLabel) emailLabel.textContent = 'Studio Corporate Email *';
    if (emailInput) emailInput.placeholder = 'vance@stacklyatelier.com';
    if (termsLabel) termsLabel.innerHTML = 'I accept the Stackly Principal Governance Charter &amp; ISO-19650 BIM Seal Protocol';
    if (submitBtnText) submitBtnText.textContent = 'Provision Admin Command Key';

    if (visualBadge) visualBadge.innerHTML = '<i class="fas fa-user-shield"></i><span>Executive Studio Governance &bull; Level 05 Clearance</span>';
    if (visualQuote) visualQuote.innerHTML = '&ldquo;Architectural mastery demands absolute precision from quarry block selection to final structural sign-off.&rdquo;';
    if (visualAuthor) visualAuthor.innerHTML = '&mdash; Kaelen Vance, Founding Principal';
    if (perk1) perk1.textContent = 'Global oversight across all 12 active luxury commissions ($142.8M portfolio)';
    if (perk2) perk2.textContent = 'Authority to seal & approve Level 400 CAD/BIM structural engineering sheets';
    if (perk3) perk3.textContent = 'Manage patron onboarding, quarry allocations & construction escrow draws';
  } else {
    if (clearanceTag) clearanceTag.innerHTML = 'Tier 02 &bull; Client Patron';
    if (preTitle) preTitle.innerHTML = '&mdash; PRIVATE PATRON ONBOARDING';
    if (mainTitle) mainTitle.innerHTML = 'Request <span style="font-family: var(--auth-font-serif); font-style: italic; color: var(--auth-rose-accent);">Patron Access</span>';
    if (subDesc) subDesc.textContent = 'Initialize your encrypted Client Patron Suite to inspect live 4K drone telemetry, review 3D BIM models, and approve curated material palettes for your estate.';
    if (nameLabel) nameLabel.textContent = 'Patron Full Name *';
    if (nameInput) nameInput.placeholder = 'e.g. Lord Alexander Wright';
    if (emailLabel) emailLabel.textContent = 'Executive Email *';
    if (emailInput) emailInput.placeholder = 'patron@estateholdings.com';
    if (termsLabel) termsLabel.innerHTML = 'I accept the Stackly Non-Disclosure Covenant &amp; Biometric Telemetry Protocol';
    if (submitBtnText) submitBtnText.textContent = 'Initialize Client Patron Suite';

    if (visualBadge) visualBadge.innerHTML = '<i class="fas fa-gem"></i><span>Private Patron Onboarding &bull; 256-Bit Vault</span>';
    if (visualQuote) visualQuote.innerHTML = '&ldquo;Every commission begins as a sacred dialogue between geological permanence and human aspiration.&rdquo;';
    if (visualAuthor) visualAuthor.innerHTML = '&mdash; Stackly Patron Onboarding Committee';
    if (perk1) perk1.textContent = 'Real-time 4K drone & biometric site telemetry feeds';
    if (perk2) perk2.textContent = 'Interactive Level 400 3D BIM blueprints & material approvals';
    if (perk3) perk3.textContent = 'Direct encrypted escrow & milestone disbursement ledgers';
  }
}

/* -------------------------------------------------------------
   2. PASSWORD VISIBILITY TOGGLE
   ------------------------------------------------------------- */
function initPasswordToggles() {
  const toggleBtns = document.querySelectorAll('.password-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('.auth-input-wrapper');
      const input = wrapper.querySelector('input');
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

/* Helper: Dynamic Field State Setter */
function setFieldValidity(fieldEl, isValid, errorMsg) {
  if (!fieldEl) return;
  const errSpan = fieldEl.querySelector('.auth-field-error');
  if (errorMsg && errSpan) {
    errSpan.textContent = errorMsg;
  }
  if (isValid) {
    fieldEl.classList.remove('has-error');
    fieldEl.classList.add('is-valid');
  } else {
    fieldEl.classList.remove('is-valid');
    fieldEl.classList.add('has-error');
  }
}

/* -------------------------------------------------------------
   3. LOGIN FORM LIVE VALIDATION & SUBMISSION (VALID EMAIL + 6-CHAR PASSWORD)
   ------------------------------------------------------------- */
function initLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const emailField = document.getElementById('login-field-email');
  const emailInput = document.getElementById('loginEmail');
  const passField = document.getElementById('login-field-password');
  const passInput = document.getElementById('loginPassword');

  function validateLoginEmail() {
    const val = emailInput.value.trim();
    const ok = VALID_EMAIL_REGEX.test(val);
    setFieldValidity(
      emailField,
      ok,
      val.length === 0
        ? 'Email address is required.'
        : 'Please enter a valid email ID (e.g. name@domain.com).'
    );
    return ok;
  }

  function validateLoginPassword() {
    const val = passInput.value;
    const ok = val.length >= MIN_PASSWORD_LENGTH;
    setFieldValidity(
      passField,
      ok,
      val.length === 0
        ? 'Password is required (minimum 6 characters).'
        : `Password must be at least ${MIN_PASSWORD_LENGTH} characters (currently ${val.length}).`
    );
    return ok;
  }

  // Real-time dynamic validation as the user types or blurs
  if (emailInput) {
    emailInput.addEventListener('input', validateLoginEmail);
    emailInput.addEventListener('blur', validateLoginEmail);
  }
  if (passInput) {
    passInput.addEventListener('input', validateLoginPassword);
    passInput.addEventListener('blur', validateLoginPassword);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isEmailValid = validateLoginEmail();
    const isPassValid = validateLoginPassword();

    if (!isEmailValid || !isPassValid) return;

    const email = emailInput.value.trim();
    const activeRoleCard = document.querySelector('.auth-role-card.active');
    const roleRadio = activeRoleCard ? activeRoleCard.querySelector('input[name="studio_role"]') : null;
    const rawRole = (roleRadio ? roleRadio.value : 'admin').toLowerCase();
    const role = rawRole === 'client' ? 'client' : 'admin';

    const submitBtn = form.querySelector('.auth-submit-btn');
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Authenticating ${role === 'admin' ? 'Admin Command' : 'Client Suite'}...`;
    submitBtn.disabled = true;

    const defaultName = role === 'admin' ? 'Arch. Kaelen Vance' : 'Lord Alexander Wright';
    const parsedName = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const displayName = parsedName || defaultName;

    const userData = {
      name: displayName,
      email: email,
      role: role,
      project: 'Villa Aurelia — St. Moritz',
      roleLabel: role === 'admin' ? 'Admin Command Center' : 'Client Patron Suite',
      title: role === 'admin' ? 'Founding Principal & Studio Admin' : 'Private Estate Patron'
    };
    localStorage.setItem('stackly_user', JSON.stringify(userData));

    showAuthToast(`Clearance verified for ${email}. Launching ${userData.roleLabel}...`);

    setTimeout(() => {
      window.location.href = `dashboard.html?role=${role}`;
    }, 750);
  });
}

/* -------------------------------------------------------------
   4. SIGNUP FORM LIVE VALIDATION & SUBMISSION (VALID EMAIL + 6-CHAR PASSWORD)
   ------------------------------------------------------------- */
function initSignupForm() {
  const form = document.getElementById('signupForm');
  if (!form) return;

  const nameField = document.getElementById('signup-field-name');
  const nameInput = document.getElementById('signupName');
  const emailField = document.getElementById('signup-field-email');
  const emailInput = document.getElementById('signupEmail');
  const passField = document.getElementById('signup-field-password');
  const passInput = document.getElementById('signupPassword');
  const confirmField = document.getElementById('signup-field-confirm');
  const confirmInput = document.getElementById('signupConfirmPassword');

  function validateSignupName() {
    const ok = nameInput.value.trim().length >= 2;
    setFieldValidity(nameField, ok, 'Full name is required.');
    return ok;
  }

  function validateSignupEmail() {
    const val = emailInput.value.trim();
    const ok = VALID_EMAIL_REGEX.test(val);
    setFieldValidity(
      emailField,
      ok,
      val.length === 0
        ? 'Email address is required.'
        : 'Please enter a valid email ID (e.g. name@domain.com).'
    );
    return ok;
  }

  function validateSignupPassword() {
    const val = passInput.value;
    const ok = val.length >= MIN_PASSWORD_LENGTH;
    setFieldValidity(
      passField,
      ok,
      val.length === 0
        ? 'Password is required (minimum 6 characters).'
        : `Password must be at least ${MIN_PASSWORD_LENGTH} characters (currently ${val.length}).`
    );
    if (confirmInput && confirmInput.value.length > 0) {
      validateSignupConfirm();
    }
    return ok;
  }

  function validateSignupConfirm() {
    const val = confirmInput.value;
    const ok = val.length >= MIN_PASSWORD_LENGTH && val === passInput.value;
    setFieldValidity(
      confirmField,
      ok,
      val.length < MIN_PASSWORD_LENGTH
        ? `Confirm password must be at least ${MIN_PASSWORD_LENGTH} characters.`
        : 'Passwords do not match.'
    );
    return ok;
  }

  if (nameInput) {
    nameInput.addEventListener('input', validateSignupName);
    nameInput.addEventListener('blur', validateSignupName);
  }
  if (emailInput) {
    emailInput.addEventListener('input', validateSignupEmail);
    emailInput.addEventListener('blur', validateSignupEmail);
  }
  if (passInput) {
    passInput.addEventListener('input', validateSignupPassword);
    passInput.addEventListener('blur', validateSignupPassword);
  }
  if (confirmInput) {
    confirmInput.addEventListener('input', validateSignupConfirm);
    confirmInput.addEventListener('blur', validateSignupConfirm);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameOk = validateSignupName();
    const isEmailOk = validateSignupEmail();
    const isPassOk = validateSignupPassword();
    const isConfirmOk = validateSignupConfirm();

    if (!isNameOk || !isEmailOk || !isPassOk || !isConfirmOk) return;

    const activeRoleCard = document.querySelector('.auth-role-card.active');
    const roleRadio = activeRoleCard ? activeRoleCard.querySelector('input[name="studio_role"]') : null;
    const rawRole = (roleRadio ? roleRadio.value : 'client').toLowerCase();
    const role = rawRole === 'admin' ? 'admin' : 'client';

    const submitBtn = form.querySelector('.auth-submit-btn');
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Provisioning ${role === 'admin' ? 'Admin Key' : 'Patron Vault'}...`;
    submitBtn.disabled = true;

    const userData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      role: role,
      project: 'Villa Aurelia — St. Moritz',
      roleLabel: role === 'admin' ? 'Admin Command Center' : 'Client Patron Suite',
      title: role === 'admin' ? 'Founding Principal & Studio Admin' : 'Private Estate Patron'
    };
    localStorage.setItem('stackly_user', JSON.stringify(userData));

    showAuthToast(`${userData.roleLabel} provisioned. Redirecting to Login...`);

    setTimeout(() => {
      window.location.href = `login.html?role=${role}`;
    }, 650);
  });
}

/* -------------------------------------------------------------
   5. AUTH NOTIFICATION TOAST
   ------------------------------------------------------------- */
function showAuthToast(message) {
  let toast = document.querySelector('.auth-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'auth-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fas fa-check-circle" style="color: var(--auth-rose-accent); margin-right: 0.5rem;"></i> ${message}`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
