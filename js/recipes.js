/* ============================================
   recipes.js — Nav, Reveal, Hamburger
   Strategy: content is ALWAYS visible.
   Scroll animation is progressive enhancement only.
   ============================================ */

/* ============================================
   recipes.js — Nav, Reveal, Hamburger
   Reveal: content is ALWAYS visible.
   Animation is pure CSS, no JS hiding.
   ============================================ */

/* ─── SCROLL REVEAL ─── */
function initReveal() {
  if (!('IntersectionObserver' in window)) return;

  const obs = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    }),
    { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
  );

  // Only animate elements that are NOT yet visible
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    obs.observe(el);
  });
}

/* ─── STICKY NAV ─── */
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─── ACTIVE NAV LINK ─── */
function initActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop() || 'index.html';
    if (href === page) a.classList.add('active');
  });
}

/* ─── HAMBURGER MENU ─── */
function initHamburger() {
  const btn  = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-menu');
  if (!btn || !menu) return;

  const open = () => {
    btn.classList.add('open');
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
    btn.setAttribute('aria-expanded', 'true');
  };
  const close = () => {
    btn.classList.remove('open');
    menu.classList.remove('open');
    document.body.style.overflow = '';
    btn.setAttribute('aria-expanded', 'false');
  };

  btn.addEventListener('click', () => btn.classList.contains('open') ? close() : open());
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 768) close(); }, { passive: true });
}

/* ─── NAV LOGO COLOUR on dark hero ─── */
function initNavLogoColor() {
  const nav   = document.querySelector('.nav');
  const logo  = nav && nav.querySelector('.nav-logo');
  const lines = nav && nav.querySelectorAll('.hamburger span');
  const hero  = document.querySelector('.hero, .page-header');
  if (!nav || !logo || !hero) return;

  const update = () => {
    const isDark = hero.getBoundingClientRect().bottom > 0 && !nav.classList.contains('scrolled');
    logo.style.color = isDark ? '#FAF8F4' : '';
    lines && lines.forEach(s => s.style.background = isDark ? '#FAF8F4' : '');
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ─── INIT ALL ─── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initActiveNav();
  initHamburger();
  initNavLogoColor();
  setTimeout(initReveal, 150);

  // Watch for dynamically added recipe cards
  const grid = document.getElementById('recipes-grid');
  if (grid) {
    new MutationObserver(() => {
      grid.querySelectorAll('.reveal:not(.visible)').forEach(el => {
        el.classList.add('visible');
      });
      setTimeout(initReveal, 60);
    }).observe(grid, { childList: true });
  }
});

// Final safety net — ensure nothing is ever stuck invisible
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      el.classList.add('visible');
    });
  }, 600);
});
