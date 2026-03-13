/* ============================================
   recipes.js — Shared JS: Nav, Reveal, Scroll
   ============================================ */

/* ─── SCROLL REVEAL ─── */
function initReveal() {
  const els = document.querySelectorAll('.reveal:not(.visible)');
  if (!els.length) return;
  const obs = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    }),
    { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
  );
  els.forEach(el => obs.observe(el));
}

/* ─── STICKY NAV ─── */
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

/* ─── ACTIVE LINK ─── */
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

  const open  = () => {
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
  const toggle = () => btn.classList.contains('open') ? close() : open();

  btn.addEventListener('click', toggle);
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  // Close on Escape
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // Close on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) close();
  }, { passive: true });
}

/* ─── NAV LOGO: always white text on hero dark overlays ─── */
function initNavLogoColor() {
  const nav  = document.querySelector('.nav');
  const logo = nav && nav.querySelector('.nav-logo');
  const hamburgerLines = nav && nav.querySelectorAll('.hamburger span');
  const hero = document.querySelector('.hero, .page-header');
  if (!nav || !logo || !hero) return;

  const update = () => {
    const heroBottom = hero.getBoundingClientRect().bottom;
    const isDark = heroBottom > 0 && !nav.classList.contains('scrolled');
    if (isDark) {
      logo.style.color = '#FAF8F4';
      hamburgerLines && hamburgerLines.forEach(s => s.style.background = '#FAF8F4');
    } else {
      logo.style.color = '';
      hamburgerLines && hamburgerLines.forEach(s => s.style.background = '');
    }
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

  // Small delay for DOM to settle, then reveal
  requestAnimationFrame(() => {
    setTimeout(initReveal, 80);
  });

  // Re-observe when dynamic content added (search grid)
  const grid = document.getElementById('recipes-grid');
  if (grid) {
    new MutationObserver(() => setTimeout(initReveal, 60))
      .observe(grid, { childList: true });
  }
});
