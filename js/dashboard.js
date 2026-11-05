/**
 * STACKLY ATELIER — Admin & Client Dual-Dashboard Command Engine
 * Unique Role Selection Slot, Respective Admin & Client Workspaces, Tabs & Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  initUserSession();
  initRoleSlotSwitcher();
  initNavTabs();
  initProjectSelector();
  initAdminDirectorateSelector();
  initBlueprintModal();
  initMobileSidebar();
  initHeaderPrimaryAction();
});

/* -------------------------------------------------------------
   1. USER SESSION & ROLE INITIALIZATION (ADMIN VS CLIENT)
   ------------------------------------------------------------- */
function initUserSession() {
  const storedUser = localStorage.getItem('stackly_user');
  let user = {
    name: 'Arch. Kaelen Vance',
    email: 'admin@stacklyatelier.com',
    role: 'admin',
    roleLabel: 'Admin Command Center',
    project: 'Villa Aurelia — St. Moritz',
    title: 'Founding Principal & Studio Admin'
  };

  if (storedUser) {
    try {
      user = Object.assign(user, JSON.parse(storedUser));
    } catch (e) {}
  }

  // Normalize legacy roles if any
  if (user.role !== 'admin' && user.role !== 'client') {
    user.role = user.role === 'interior' ? 'client' : 'admin';
  }

  // Check URL query parameters for role override (?role=admin or ?role=client)
  const urlParams = new URLSearchParams(window.location.search);
  const roleParam = (urlParams.get('role') || '').toLowerCase();
  if (roleParam === 'admin' || roleParam === 'client') {
    user.role = roleParam;
  }

  applyDashboardRole(user.role, false);
}

/* -------------------------------------------------------------
   2. UNIQUE ROLE SELECTION SLOT SWITCHER (SIDEBAR & HEADER)
   ------------------------------------------------------------- */
function initRoleSlotSwitcher() {
  const roleSwitchBtns = document.querySelectorAll('[data-switch-role]');
  roleSwitchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetRole = (btn.getAttribute('data-switch-role') || 'admin').toLowerCase();
      switchDashboardRole(targetRole);
    });
  });
}

function switchDashboardRole(role) {
  const normalizedRole = role === 'client' ? 'client' : 'admin';
  applyDashboardRole(normalizedRole, true);
}

function applyDashboardRole(role, notify = false) {
  const stored = localStorage.getItem('stackly_user');
  let user = stored ? JSON.parse(stored) : {};

  user.role = role;
  if (role === 'admin') {
    user.name = (user.name && user.name !== 'Lord Alexander Wright') ? user.name : 'Arch. Kaelen Vance';
    user.roleLabel = 'Admin Command Center';
    user.title = 'Founding Principal & Studio Admin';
  } else {
    user.name = (user.name && user.name !== 'Arch. Kaelen Vance') ? user.name : 'Lord Alexander Wright';
    user.roleLabel = 'Client Patron Suite';
    user.title = 'Private Estate Patron';
  }

  localStorage.setItem('stackly_user', JSON.stringify(user));

  // Update URL parameter cleanly without reload
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('role', role);
    window.history.replaceState({}, '', url);
  } catch (e) {}

  // Update Sidebar & Header Role Slot Active States
  const allRoleBtns = document.querySelectorAll('[data-switch-role]');
  allRoleBtns.forEach(btn => {
    if (btn.getAttribute('data-switch-role') === role) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update Clearance Pill in Sidebar Slot
  const clearancePill = document.getElementById('sidebarClearancePill');
  if (clearancePill) {
    clearancePill.textContent = role === 'admin' ? 'TIER 01 MASTER' : 'TIER 02 PATRON';
  }

  // Toggle Admin vs Client Navigation Lists in Sidebar
  const adminNavList = document.getElementById('adminNavList');
  const clientNavList = document.getElementById('clientNavList');
  if (adminNavList && clientNavList) {
    adminNavList.style.display = role === 'admin' ? 'flex' : 'none';
    clientNavList.style.display = role === 'client' ? 'flex' : 'none';
  }

  // Toggle Admin vs Client Header Context Selector
  const adminHeaderContext = document.getElementById('adminHeaderContext');
  const clientHeaderContext = document.getElementById('clientHeaderContext');
  if (adminHeaderContext && clientHeaderContext) {
    adminHeaderContext.style.display = role === 'admin' ? 'flex' : 'none';
    clientHeaderContext.style.display = role === 'client' ? 'flex' : 'none';
  }

  // Update Header Status Pill & Action Button
  const headerStatusText = document.getElementById('headerStatusText');
  if (headerStatusText) {
    headerStatusText.textContent = role === 'admin'
      ? 'Admin Governance Active'
      : 'Phase 03: Stone & Glazing';
  }

  const headerPrimaryActionText = document.getElementById('headerPrimaryActionText');
  const headerPrimaryActionBtn = document.getElementById('headerPrimaryActionBtn');
  if (headerPrimaryActionText && headerPrimaryActionBtn) {
    if (role === 'admin') {
      headerPrimaryActionBtn.innerHTML = '<i class="fas fa-plus-circle"></i><span id="headerPrimaryActionText">New Commission</span>';
    } else {
      headerPrimaryActionBtn.innerHTML = '<i class="fas fa-helicopter"></i><span id="headerPrimaryActionText">Book Site Visit</span>';
    }
  }

  // Update Sidebar User Profile Card
  const userNameEl = document.getElementById('sidebarUserName');
  const userRoleEl = document.getElementById('sidebarUserRole');
  const userAvatarEl = document.getElementById('sidebarUserAvatar');
  if (userNameEl) userNameEl.textContent = user.name;
  if (userRoleEl) userRoleEl.textContent = user.title;
  if (userAvatarEl) {
    const cleanName = user.name.replace(/^(Arch\.|Lord|Lady|Dr\.)\s+/i, '');
    const initials = cleanName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    userAvatarEl.textContent = initials || (role === 'admin' ? 'KV' : 'AW');
  }

  // Toggle Admin Workspace vs Client Workspace
  const adminWorkspace = document.getElementById('adminWorkspace');
  const clientWorkspace = document.getElementById('clientWorkspace');
  if (adminWorkspace && clientWorkspace) {
    if (role === 'admin') {
      adminWorkspace.classList.add('active-workspace');
      clientWorkspace.classList.remove('active-workspace');
    } else {
      clientWorkspace.classList.add('active-workspace');
      adminWorkspace.classList.remove('active-workspace');
    }
  }

  if (notify) {
    showToast(`Switched to ${role === 'admin' ? 'Admin Executive Dashboard' : 'Client Patron Dashboard'}`);
  }
}

/* -------------------------------------------------------------
   3. NAVIGATION TABS WITHIN ADMIN & CLIENT WORKSPACES
   ------------------------------------------------------------- */
function initNavTabs() {
  const navBtns = document.querySelectorAll('.dashboard-nav-btn');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      if (!targetTab) return;

      const isAdminTab = targetTab.startsWith('admin-');
      const parentList = btn.closest('.dashboard-nav-list');
      const workspace = document.getElementById(isAdminTab ? 'adminWorkspace' : 'clientWorkspace');

      if (parentList) {
        parentList.querySelectorAll('.dashboard-nav-btn').forEach(b => b.classList.remove('active'));
      }
      btn.classList.add('active');

      if (workspace) {
        workspace.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        const targetPane = document.getElementById(`tab-${targetTab}`);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      }

      // Close mobile sidebar on selection
      const sidebar = document.getElementById('dashboardSidebar');
      if (sidebar && window.innerWidth <= 1024) {
        sidebar.classList.remove('open');
      }
    });
  });
}

/* -------------------------------------------------------------
   4. ADMIN DIRECTORATE SCOPE SELECTOR
   ------------------------------------------------------------- */
function initAdminDirectorateSelector() {
  const selector = document.getElementById('adminDirectorateSelector');
  if (!selector) return;

  const directorates = {
    'global': {
      estates: '12 Estates',
      revenue: '$18.4M',
      bim: '7 Sheets',
      qa: '99.4%',
      label: 'Global Portfolio (All 12 Commissions)'
    },
    'zurich': {
      estates: '5 Estates',
      revenue: '$8.2M',
      bim: '3 Sheets',
      qa: '99.8%',
      label: 'Zurich & St. Moritz Alpine Directorate'
    },
    'americas': {
      estates: '4 Estates',
      revenue: '$6.5M',
      bim: '2 Sheets',
      qa: '99.1%',
      label: 'New York & Malibu Coastal Directorate'
    },
    'tokyo': {
      estates: '3 Estates',
      revenue: '$3.7M',
      bim: '2 Sheets',
      qa: '99.6%',
      label: 'Tokyo Aoyama & Kyoto Directorate'
    }
  };

  selector.addEventListener('change', () => {
    const data = directorates[selector.value];
    if (!data) return;

    const estatesEl = document.getElementById('admin-metric-estates');
    const revEl = document.getElementById('admin-metric-revenue');
    const bimEl = document.getElementById('admin-metric-bim');
    const qaEl = document.getElementById('admin-metric-qa');

    if (estatesEl) estatesEl.textContent = data.estates;
    if (revEl) revEl.textContent = data.revenue;
    if (bimEl) bimEl.textContent = data.bim;
    if (qaEl) qaEl.textContent = data.qa;

    showToast(`Admin scope filtered to ${data.label}`);
  });
}

/* -------------------------------------------------------------
   5. CLIENT ACTIVE COMMISSION SELECTOR
   ------------------------------------------------------------- */
function initProjectSelector() {
  const selector = document.getElementById('projectSelector');
  if (!selector) return;

  const projectData = {
    'aurelia': {
      title: 'Villa Aurelia',
      location: 'St. Moritz, Switzerland',
      progress: '68%',
      days: '184 Days',
      budget: '$4,850,000',
      heroImg: 'assets/hero-villa.webp',
      desc: 'Monolithic alpine sanctuary carved into granite terrain with zero-edge thermal pools and cantilevered cedar roofs.'
    },
    'limmat': {
      title: 'Limmat Pavilion',
      location: 'Zurich, Switzerland',
      progress: '92%',
      days: '38 Days',
      budget: '$7,200,000',
      heroImg: 'assets/interior-detail.webp',
      desc: 'Riverside cultural headquarters integrating carbon-neutral timber-concrete composites and raking daylight atriums.'
    },
    'aoyama': {
      title: 'Aoyama Carbon Retreat',
      location: 'Tokyo, Japan',
      progress: '44%',
      days: '310 Days',
      budget: '$3,600,000',
      heroImg: 'assets/blog-charred-cedar.webp',
      desc: 'Subterranean zen courtyard sanctuary fusing charred yakisugi cedar with parametric seismic dampers.'
    }
  };

  selector.addEventListener('change', () => {
    const proj = projectData[selector.value];
    if (!proj) return;

    const heroTitle = document.querySelector('.dash-hero-title');
    if (heroTitle) heroTitle.textContent = proj.title;

    const heroDesc = document.querySelector('.dash-hero-desc');
    if (heroDesc) heroDesc.textContent = `${proj.location} — ${proj.desc}`;

    const heroBg = document.querySelector('.dash-hero-bg');
    if (heroBg) heroBg.src = proj.heroImg;

    const progressVal = document.getElementById('metric-progress-val');
    if (progressVal) progressVal.textContent = proj.progress;

    const daysVal = document.getElementById('metric-days-val');
    if (daysVal) daysVal.textContent = proj.days;

    const budgetVal = document.getElementById('metric-budget-val');
    if (budgetVal) budgetVal.textContent = proj.budget;

    showToast(`Active commission switched to ${proj.title}`);
  });
}

/* -------------------------------------------------------------
   6. HEADER PRIMARY ACTION BUTTON
   ------------------------------------------------------------- */
function initHeaderPrimaryAction() {
  const btn = document.getElementById('headerPrimaryActionBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.location.href = '404.html';
  });
}

/* -------------------------------------------------------------
   7. INTERACTIVE BLUEPRINT MODAL
   ------------------------------------------------------------- */
function initBlueprintModal() {
  const modal = document.getElementById('blueprintModal');
  const modalImg = document.getElementById('modalBlueprintImg');
  const modalTitle = document.getElementById('modalBlueprintTitle');
  const closeBtn = document.getElementById('modalCloseBtn');
  if (!modal) return;

  const triggerCards = document.querySelectorAll('[data-blueprint-modal]');
  triggerCards.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const imgSrc = trigger.getAttribute('data-img');
      const title = trigger.getAttribute('data-title');

      if (modalImg && imgSrc) modalImg.src = imgSrc;
      if (modalTitle && title) modalTitle.textContent = title;

      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

/* -------------------------------------------------------------
   8. MOBILE SIDEBAR TOGGLE & LOGOUT
   ------------------------------------------------------------- */
function initMobileSidebar() {
  const toggleBtn = document.getElementById('mobileSidebarToggle');
  const sidebar = document.getElementById('dashboardSidebar');
  const closeBtn = document.getElementById('sidebarCloseBtn');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.add('open');
    });
  }

  if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('stackly_user');
      window.location.href = 'login.html';
    });
  }
}

function showToast(msg) {
  let toast = document.querySelector('.auth-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'auth-toast';
    toast.style.cssText = 'position:fixed;bottom:2rem;right:2rem;padding:1rem 1.5rem;background:#16181B;border-left:4px solid #B84A65;box-shadow:0 10px 30px rgba(0,0,0,0.6);color:#fff;border-radius:6px;z-index:9999;font-size:0.88rem;transition:transform 0.35s ease, opacity 0.35s ease;transform:translateY(120%);opacity:0;';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fas fa-check-circle" style="color: #B84A65; margin-right: 0.5rem;"></i> ${msg}`;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  clearTimeout(window._dashToastTimer);
  window._dashToastTimer = setTimeout(() => {
    toast.style.transform = 'translateY(120%)';
    toast.style.opacity = '0';
  }, 3200);
}
