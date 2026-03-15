/* ============================================
   search.js — Recipe Search & Filter Engine
   ============================================ */

let allRecipes = [];
let activeFilter = 'all';

/* ─── Load JSON ─── */
async function loadRecipes() {
  try {
    const depth = window.location.pathname.split('/').filter(Boolean).length;
    const prefix = depth > 1 ? '../'.repeat(depth - 1) : '';
    const res = await fetch(`${prefix}data/recipes.json`);
    if (!res.ok) throw new Error('Failed to load recipes.json');
    const data = await res.json();
    allRecipes = data.recipes || [];
    return data;
  } catch (err) {
    console.error('Recipe load error:', err);
    return null;
  }
}

/* ─── Filter logic ─── */
function filterRecipes(query = '', category = 'all') {
  const q = query.toLowerCase().trim();
  return allRecipes.filter(r => {
    const matchSearch = !q || r.title.toLowerCase().includes(q);
    const matchCat = category === 'all' || (r.category || []).includes(category);
    return matchSearch && matchCat;
  });
}

/* ─── Render a single card ─── */
function renderCard(recipe, basePath = '') {
  const href   = `${basePath}recipes/${recipe.slug}.html`;
  const imgSrc = `${basePath}${recipe.thumb}`;
  const cats   = (recipe.category || []);

  return `
<article class="recipe-card reveal" role="listitem">
  <a href="${href}" class="recipe-card-link">
    <div class="recipe-card-img">
      <img
        src="${imgSrc}"
        alt="${recipe.title}"
        loading="lazy"
        onload="this.nextElementSibling.style.display='none'"
        onerror="this.style.display='none'"
      >
      <div class="img-placeholder" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M3 6h18M3 10h18M9 14h6M9 18h6"/>
        </svg>
        <span>Image coming soon</span>
      </div>
      <div class="recipe-card-overlay" aria-hidden="true">
        <span class="btn btn-gold" style="pointer-events:none">View Recipe →</span>
      </div>
    </div>
    <div class="recipe-card-body">
      <div class="recipe-card-cats" aria-label="Categories">
        ${cats.map(c => `<span class="recipe-tag ${c}">${c.replace(/-/g,' ')}</span>`).join('')}
      </div>
      <h3>${recipe.title}</h3>
      <p class="recipe-card-chef">Chef Rajesh Abraham</p>
    </div>
  </a>
</article>`;
}

/* ─── Empty state ─── */
function renderEmpty(query) {
  return `
<div class="recipes-empty">
  <div class="empty-icon" aria-hidden="true">♨</div>
  <h3>No recipes found</h3>
  <p>${query ? `No results for "<strong>${query}</strong>". Try a different search.` : 'Try a different filter.'}</p>
</div>`;
}

/* ─── Init recipe page ─── */
async function initRecipePage() {
  const data = await loadRecipes();
  if (!data) {
    document.getElementById('recipes-grid').innerHTML =
      `<div class="recipes-empty"><p style="color:var(--smoke)">Could not load recipes. Please try refreshing.</p></div>`;
    return;
  }

  const grid     = document.getElementById('recipes-grid');
  const search   = document.getElementById('recipe-search');
  const clearBtn = document.getElementById('search-clear');
  const counter  = document.getElementById('recipe-count');
  const pills    = document.querySelectorAll('[data-filter]');

  function render() {
    const q       = search ? search.value : '';
    const results = filterRecipes(q, activeFilter);

    if (counter) counter.textContent = `${results.length} recipe${results.length !== 1 ? 's' : ''}`;
    if (clearBtn) clearBtn.style.display = q.trim() ? 'flex' : 'none';

    grid.innerHTML = results.length
      ? results.map(r => renderCard(r)).join('')
      : renderEmpty(q);

    // Trigger reveal on new cards
    requestAnimationFrame(() => {
      grid.querySelectorAll('.reveal:not(.visible)').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 55);
      });
    });
  }

  /* Events */
  if (search) {
    let debounceTimer;
    search.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(render, 180);
    });
    search.addEventListener('keydown', e => {
      if (e.key === 'Escape') { search.value = ''; render(); search.blur(); }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      search.value = ''; render(); search.focus();
    });
  }

  pills.forEach(btn => {
    btn.addEventListener('click', () => {
      pills.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      render();
      // Scroll search into view on mobile
      if (window.innerWidth < 768) {
        document.getElementById('search-zone')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Initial render
  render();
}
