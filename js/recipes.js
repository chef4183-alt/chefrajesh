/* ============================================
   recipes.js — Nav, Reveal, Hamburger
   ============================================ */

function initReveal() {
  const els = document.querySelectorAll('.reveal:not(.visible)');
  if (!els.length) return;

  // If IntersectionObserver not supported, just show everything
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const obs = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    }),
    { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
  );
  els.forEach(el => obs.observe(el));
}

function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop() || 'index.html';
    if (href === page) a.classList.add('active');
  });
}

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

function initNavLogoColor() {
  const nav  = document.querySelector('.nav');
  const logo = nav && nav.querySelector('.nav-logo');
  const lines = nav && nav.querySelectorAll('.hamburger span');
  const hero = document.querySelector('.hero, .page-header');
  if (!nav || !logo || !hero) return;

  const update = () => {
    const isDark = hero.getBoundingClientRect().bottom > 0 && !nav.classList.contains('scrolled');
    logo.style.color = isDark ? '#FAF8F4' : '';
    lines && lines.forEach(s => s.style.background = isDark ? '#FAF8F4' : '');
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initActiveNav();
  initHamburger();
  initNavLogoColor();

  // Reveal elements already in viewport immediately
  initReveal();

  // Also trigger on scroll in case observer missed any
  window.addEventListener('scroll', initReveal, { passive: true, once: false });

  // Watch for dynamically added cards (search results)
  const grid = document.getElementById('recipes-grid');
  if (grid) {
    new MutationObserver(() => setTimeout(initReveal, 60))
      .observe(grid, { childList: true });
  }
});

// Extra safety net — run again after full page load
window.addEventListener('load', () => {
  setTimeout(initReveal, 200);
});