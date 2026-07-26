/* Kitchen — hash-routed views plus a shopping list that aggregates real quantities. */

/* ------------------------------------------------------------------ units */

/* dim: w = weight (base grams), v = volume (base tsp), c = count (per-unit) */
const UNITS = {
  g:       { dim: 'w', f: 1 },
  oz:      { dim: 'w', f: 28.3495 },
  lb:      { dim: 'w', f: 453.592 },
  tsp:     { dim: 'v', f: 1 },
  tbsp:    { dim: 'v', f: 3 },
  cup:     { dim: 'v', f: 48 },
  /* whole: you cannot buy ¾ of one, so the list rounds up */
  ea:      { dim: 'c', whole: true },
  clove:   { dim: 'c', plural: 'cloves', whole: true },
  bunch:   { dim: 'c', plural: 'bunches', whole: true },
  can:     { dim: 'c', plural: 'cans', whole: true },
  pouch:   { dim: 'c', plural: 'pouches', whole: true },
  bag:     { dim: 'c', plural: 'bags', whole: true },
  slice:   { dim: 'c', plural: 'slices', whole: true },
  scoop:   { dim: 'c', plural: 'scoops' },
  serving: { dim: 'c', plural: 'servings' },
};

const CATEGORIES = [
  ['produce', 'Produce'],
  ['frozen', 'Frozen'],
  ['protein', 'Meat, Fish & Eggs'],
  ['dairy', 'Dairy'],
  ['legume', 'Beans & Lentils'],
  ['grain', 'Grains & Bread'],
  ['pantry', 'Pantry, Nuts & Seeds'],
  ['powder', 'Powders'],
  ['spice', 'Spices & Seasonings'],
];

const MEALS = [
  ['breakfast', 'Breakfast'],
  ['lunch', 'Lunch'],
  ['snack', 'Post-training'],
  ['dinner', 'Dinner'],
];

const FRACTIONS = { 0.25: '¼', 0.5: '½', 0.75: '¾' };

/* Renders 4.75 as "4¾", 0.5 as "½". Quarters only — nobody shops in eighths. */
function num(v) {
  const r = Math.round(v * 4) / 4;
  if (r === 0) return String(Math.round(v * 10) / 10);
  const whole = Math.floor(r);
  const frac = +(r - whole).toFixed(2);
  if (!frac) return String(whole);
  return (whole ? whole : '') + FRACTIONS[frac];
}

/* Converts an aggregated base amount back into whatever unit reads best. */
function fmtAmount(dim, base, pref) {
  if (dim === 'w') {
    if (base >= 453.592) return num(base / 453.592) + ' lb';
    if (pref === 'g') return Math.round(base) + ' g';
    return num(base / 28.3495) + ' oz';
  }
  if (dim === 'v') {
    if (pref === 'cup' || base >= 48) return num(base / 48) + ' cup';
    if (base >= 6) return num(base / 3) + ' tbsp';
    return num(base) + ' tsp';
  }
  const u = UNITS[pref];
  const amount = u.whole ? Math.ceil(base - 1e-9) : base;
  if (pref === 'ea') return num(amount) + ' ×';
  return num(amount) + ' ' + (amount > 1 && u.plural ? u.plural : pref);
}

/* ------------------------------------------------------------------ state */

const STORE_KEY = 'kitchen.v1';

const state = load();

function load() {
  const fallback = { picks: {}, checked: {}, filter: 'all' };
  try {
    return Object.assign(fallback, JSON.parse(localStorage.getItem(STORE_KEY) || '{}'));
  } catch (e) {
    return fallback;
  }
}

function save() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (e) { /* private browsing — the page still works, it just forgets */ }
}

const byId = id => RECIPES.find(r => r.id === id);
const pickedIds = () => Object.keys(state.picks).filter(id => state.picks[id] > 0 && byId(id));
const totalMeals = () => pickedIds().reduce((s, id) => s + state.picks[id], 0);

/* --------------------------------------------------------- shopping list */

/* Groups every ingredient of every picked recipe by name, then by unit
   dimension, so "6 oz chicken" three times becomes "1¼ lb". */
function buildList() {
  const items = new Map();

  pickedIds().forEach(id => {
    const recipe = byId(id);
    const servings = state.picks[id];

    recipe.ingredients.forEach(ing => {
      let entry = items.get(ing.n);
      if (!entry) {
        entry = {
          name: ing.n,
          cat: ing.cat,
          src: ing.src || 'walmart',
          staple: !!ing.staple,
          optOnly: true,
          amounts: new Map(), // dim -> { base, pref, prefBase }
          from: new Set(),
        };
        items.set(ing.n, entry);
      }
      entry.from.add(recipe.title);
      if (!ing.opt) entry.optOnly = false;
      if (ing.src === 'amazon') entry.src = 'amazon';
      if (ing.staple || ing.q == null || !UNITS[ing.u]) return;

      const unit = UNITS[ing.u];
      const base = ing.q * (unit.f || 1) * servings;
      const key = unit.dim === 'c' ? 'c:' + ing.u : unit.dim;
      const acc = entry.amounts.get(key) || { base: 0, pref: ing.u, prefBase: 0, dim: unit.dim };
      acc.base += base;
      // The unit that contributes most decides how the total gets displayed.
      if (base > acc.prefBase) { acc.prefBase = base; acc.pref = ing.u; }
      entry.amounts.set(key, acc);
    });
  });

  return CATEGORIES
    .map(([key, label]) => ({
      key,
      label,
      items: [...items.values()]
        .filter(i => i.cat === key)
        .sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .filter(c => c.items.length);
}

function amountText(entry) {
  if (entry.staple || !entry.amounts.size) return '';
  return [...entry.amounts.values()]
    .map(a => fmtAmount(a.dim, a.base, a.pref))
    .join(' + ');
}

function listAsText() {
  const lines = [`Shopping list — ${totalMeals()} meals`, ''];
  buildList().forEach(cat => {
    lines.push(cat.label.toUpperCase());
    cat.items.forEach(i => {
      const amt = amountText(i);
      lines.push(
        '  [ ] ' + (amt ? amt + ' ' : '') + i.name +
        (i.src === 'amazon' ? ' (Amazon)' : '') +
        (i.optOnly ? ' (optional)' : '')
      );
    });
    lines.push('');
  });
  return lines.join('\n');
}

/* --------------------------------------------------------------- helpers */

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* Ingredient names carry spaces, parens, and percent signs — not usable as an id. */
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function ingLine(ing) {
  if (ing.d) return ing.d;
  if (ing.staple || ing.q == null) return ing.n;
  const u = UNITS[ing.u];
  const amount = u && u.dim === 'c' && ing.u === 'ea'
    ? num(ing.q) + ' ×'
    : num(ing.q) + ' ' + ing.u;
  return amount + ' ' + ing.n.charAt(0).toLowerCase() + ing.n.slice(1);
}

/* ----------------------------------------------------------------- views */

/* A curated handful of filters — every tag at once is just noise. */
const FILTERS = [
  ['blueprint', 'Blueprint'],
  ['attia', 'Attia'],
  ['meal-prep', 'Meal prep'],
  ['no-cook', 'No cook'],
  ['high-protein', 'High protein'],
  ['seafood', 'Seafood'],
];

function viewHome() {
  const filter = state.filter || 'all';
  const shown = RECIPES.filter(r => filter === 'all' || r.tags.includes(filter) || r.meal === filter);

  const chip = (val, label) =>
    `<button class="chip" aria-pressed="${filter === val}" data-filter="${esc(val)}">${esc(label)}</button>`;

  return `
    <p class="section-hint">Blueprint-adjacent, protein-forward, reflux-aware</p>
    <h1>The Kitchen</h1>
    <p class="lede">${RECIPES.length} repeatable meals built around a plant-forward base that still
    carries enough protein for soccer and lifting — roughly 150–180&nbsp;g a day, spread across four
    feedings. Every recipe is written for one serving; the
    <a href="#/list">shopping list</a> does the multiplication.</p>

    <div class="filters">
      ${chip('all', 'Everything')}
      ${MEALS.map(([k, l]) => chip(k, l)).join('')}
      ${FILTERS.map(([k, l]) => chip(k, l)).join('')}
    </div>

    <div class="grid">
      ${shown.map(cardHtml).join('')}
    </div>

    <hr>

    <h2>How it fits together</h2>
    <p>Rather than a total diet change: three Super Veggie lunches a week, two sweet-potato or
    salmon dinners, two of the familiar chicken and turkey-burger meals upgraded with a bean,
    grain, and vegetable side, and one red-meat meal. The shake every other morning.
    See the <a href="#/plan">weekly plan</a> for the day-by-day version.</p>
    <p>The pattern is what matters, not the branding: vegetables and fruit at most meals,
    regular legumes, nuts, seeds, whole grains, fish, lean poultry, and the dairy that works
    for you — with less processed meat, added sugar, and refined grain. Last substantive meal
    3–4 hours before bed, then the walk.</p>
  `;
}

function cardHtml(r) {
  return `
    <a class="card" href="#/r/${r.id}">
      <div class="kicker">${esc(r.meal)}${r.featured ? ' · core rotation' : ''}</div>
      <h3>${esc(r.title)}</h3>
      <p class="sub">${esc(r.subtitle)}</p>
      <div class="meta">
        <span><b>${esc(r.protein)}</b> protein</span>
        <span>${esc(r.time)}</span>
      </div>
      <div class="tags">${r.tags.map(t => `<span class="tag${t === 'blueprint' ? ' hl' : ''}">${esc(t.replace(/-/g, ' '))}</span>`).join('')}</div>
    </a>`;
}

function viewRecipe(id) {
  const r = byId(id);
  if (!r) return `<p>Recipe not found. <a href="#/">Back to all recipes</a></p>`;

  const inCart = state.picks[r.id] || 0;

  return `
    <a class="back" href="#/">← All recipes</a>
    <div class="recipe-head">
      <p class="section-hint">${esc(r.meal)}</p>
      <h1>${esc(r.title)}</h1>
      <p class="lede">${esc(r.subtitle)}</p>
      <div class="stat-row">
        <div class="stat"><div class="label">Protein</div><div class="value">${esc(r.protein)}</div></div>
        <div class="stat"><div class="label">Time</div><div class="value">${esc(r.time)}</div></div>
        <div class="stat"><div class="label">Makes</div><div class="value">1 serving</div></div>
      </div>
    </div>

    <div class="recipe-body">
      <div>
        <h2 style="margin-top:24px">Ingredients</h2>
        <ul class="ing-list">
          ${r.ingredients.map(i => `
            <li class="${i.opt ? 'is-opt' : ''}">${i.d ? i.d : esc(ingLine(i))}${
              i.opt ? '<span class="badge opt">optional</span>' : ''
            }${i.src === 'amazon' ? '<span class="badge amazon">Amazon</span>' : ''}</li>`).join('')}
        </ul>
        <div class="toolbar" style="margin-top:22px">
          <button class="btn primary" data-add="${r.id}">
            ${inCart ? `In the list (${inCart}×)` : 'Add to shopping list'}
          </button>
          ${inCart ? `<button class="btn ghost" data-remove="${r.id}">Remove</button>` : ''}
        </div>
      </div>

      <div>
        <p>${r.blurb}</p>
        <h2 style="margin-top:32px">Method</h2>
        <ol class="steps">${r.steps.map(s => `<li>${s}</li>`).join('')}</ol>
        ${r.notes && r.notes.length ? `
          <div class="callout">
            <h3>Worth knowing</h3>
            <ul>${r.notes.map(n => `<li>${n}</li>`).join('')}</ul>
          </div>` : ''}
      </div>
    </div>
  `;
}

function viewList() {
  const cats = buildList();
  const meals = totalMeals();

  const pickRow = r => {
    const n = state.picks[r.id] || 0;
    return `
      <div class="pick ${n ? 'on' : ''}">
        <input type="checkbox" id="pick-${r.id}" ${n ? 'checked' : ''} data-toggle="${r.id}">
        <label for="pick-${r.id}">${esc(r.title)}<small>${esc(r.protein)} protein · ${esc(r.time)}</small></label>
        <div class="stepper">
          <button data-dec="${r.id}" aria-label="One fewer ${esc(r.title)}">−</button>
          <output>${n}</output>
          <button data-inc="${r.id}" aria-label="One more ${esc(r.title)}">+</button>
        </div>
      </div>`;
  };

  return `
    <h1>Shopping list</h1>
    <p class="lede">Pick the meals you plan to eat and how many of each. Quantities are summed
    across recipes and converted into something you can actually shop with.</p>

    <div class="toolbar no-print">
      <button class="btn primary" data-plan>Load the weekly plan</button>
      <button class="btn" data-all>Select everything once</button>
      <button class="btn ghost" data-clear>Clear</button>
    </div>

    <div class="picker">
      ${MEALS.map(([key, label]) => `
        <div class="picker-group">
          <h3>${label}</h3>
          ${RECIPES.filter(r => r.meal === key).map(pickRow).join('')}
        </div>`).join('')}
    </div>

    <hr>

    <h2>${meals ? `Your list — ${meals} meal${meals === 1 ? '' : 's'}` : 'Your list'}</h2>

    ${!cats.length ? `<div class="empty">Nothing selected yet. Load the weekly plan above, or tick a few meals.</div>` : `
      <div class="toolbar no-print">
        <button class="btn" data-print>Print</button>
        <button class="btn" data-copy>Copy as text</button>
        <button class="btn ghost" data-uncheck>Reset the ticks</button>
      </div>
      <div class="list-out">
        ${cats.map(cat => `
          <div class="cat">
            <h3>${esc(cat.label)}</h3>
            <ul>
              ${cat.items.map(i => {
                const key = i.name;
                const done = !!state.checked[key];
                const amt = amountText(i);
                const from = [...i.from];
                const domId = 'chk-' + slug(key);
                return `
                  <li class="${done ? 'done' : ''}">
                    <input type="checkbox" id="${domId}" ${done ? 'checked' : ''} data-check="${esc(key)}">
                    <label for="${domId}">
                      ${amt ? `<span class="qty">${amt}</span> ` : ''}${esc(i.name)}
                      ${i.src === 'amazon' ? '<span class="badge amazon">Amazon</span>' : ''}
                      ${i.optOnly ? '<span class="badge opt">optional</span>' : ''}
                      <span class="why">${esc(from.slice(0, 3).join(', '))}${from.length > 3 ? ` +${from.length - 3} more` : ''}</span>
                    </label>
                  </li>`;
              }).join('')}
            </ul>
          </div>`).join('')}
      </div>
      <div class="no-print" id="copy-wrap"></div>
    `}

    <div class="callout no-print" style="margin-top:36px">
      <h3>Where to buy what</h3>
      <ul>
        <li>Nearly all of this is a Walmart run. The <span class="badge amazon">Amazon</span> tags
        are the four things worth ordering: black beluga lentils, hemp hearts, pumpkin-seed
        protein, and cocoa nibs — plus allulose if you use it.</li>
        <li>Frozen is fine and often better for broccoli, cauliflower, berries, spinach, green
        beans, and edamame. Buy the fresh version of whatever you will actually cook this week.</li>
        <li>Check the pantry section against what you own before you go — spices and oil are
        where the double-buying happens.</li>
      </ul>
    </div>
  `;
}

function viewPlan() {
  const link = id => {
    const r = byId(id);
    return r ? `<a href="#/r/${r.id}">${esc(r.title)}</a>` : '—';
  };

  return `
    <h1>The weekly plan</h1>
    <p class="lede">Run this for four weeks before judging it. Four protein feedings a day: three
    Super Veggie lunches, two seafood meals, two of the familiar chicken and turkey-burger dinners,
    one red-meat meal, and a post-training feeding every day. The ${RECIPES.length - 16} recipes
    that do not appear here are the bench — swap them in freely.</p>

    <div class="table-wrap">
      <table>
        <thead><tr><th>Day</th>${MEALS.map(([, l]) => `<th>${l}</th>`).join('')}</tr></thead>
        <tbody>
          ${WEEKLY_PLAN.map(d => `
            <tr>
              <td>${esc(d.day)}</td>
              ${PLAN_SLOTS.map(slot => `<td>${link(d[slot])}</td>`).join('')}
            </tr>`).join('')}
        </tbody>
      </table>
    </div>

    <div class="toolbar no-print">
      <a class="btn primary" href="#/list" data-plan>Build the shopping list for this week</a>
    </div>

    <h2>The protein math</h2>
    <p>Four feedings gets you to roughly 145–190&nbsp;g without deli meat, enormous dinners, or a
    second full shake. At 180&nbsp;lb, the 1&nbsp;g/lb target is an upper aim rather than a
    pass/fail line — resistance-training benefits tend to level off nearer 1.6&nbsp;g/kg for
    most people. Distribution matters as much as the daily total.</p>

    <div class="table-wrap">
      <table>
        <thead><tr><th>Meal</th><th>Target</th><th>What covers it</th></tr></thead>
        <tbody>
          ${PROTEIN_SCHEDULE.map(([meal, target, ex]) =>
            `<tr><td>${esc(meal)}</td><td>${esc(target)}</td><td>${esc(ex)}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>

    <h2>Protein hierarchy</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Make frequent</th><th>Make occasional</th><th>Improve the existing version</th></tr></thead>
        <tbody>
          <tr>
            <td style="white-space:normal">Chicken, turkey, fish, Greek yogurt and skyr, cottage cheese, beans, lentils, tofu and edamame</td>
            <td>Steak burritos, richer cheeses, higher-fat dairy, restaurant meals</td>
            <td>Turn burritos into bowls: steak or chicken, black beans, fajita vegetables, brown rice when training calls for it, modest cheese, avocado</td>
          </tr>
          <tr>
            <td style="white-space:normal">Salmon, sardines, trout, and other seafood — vary the species</td>
            <td>Processed deli meat and heavily processed “protein foods”</td>
            <td>Roast and slice your own chicken or turkey breast, then freeze it in 6&nbsp;oz portions</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>Fish without leaning on tuna</h2>
    <ul>
      <li><strong>Two lunches a week:</strong> salmon, canned salmon, sardines, or trout.</li>
      <li><strong>Two to three lunches:</strong> chicken or turkey.</li>
      <li><strong>One to two lunches:</strong> lean ground turkey with beans, eggs with cottage cheese, or a tofu/edamame meal.</li>
      <li><strong>Tuna:</strong> optional rather than forbidden — an occasional convenience food, not the default daily protein. Canned light runs lower in mercury than albacore.</li>
    </ul>

    <h2>What the reflux caution was costing</h2>
    <p>Every recipe here was written to hold back the usual triggers first. That was the right
    starting point, but it is worth being explicit that those omissions were not free — several
    of them are the actual functional ingredients in Johnson’s meals, not garnish. Now that
    symptoms are managed without medication, these are the ones worth earning back:</p>

    <div class="table-wrap">
      <table>
        <thead><tr><th>Held back</th><th>What you were giving up</th><th>How to reintroduce</th></tr></thead>
        <tbody>
          <tr>
            <td>Lime &amp; lemon</td>
            <td>Vitamin C, and the thing that makes a lentil bowl taste finished. Vitamin C also
            markedly increases absorption of non-heme iron — which is the only kind lentils, spinach,
            and hemp hearts provide. On a plant-forward plan this is a real nutritional loss, not
            just a flavor one.</td>
            <td>Start here. A quarter lime over a lunch bowl. Johnson’s Super Veggie calls for a whole one.</td>
          </tr>
          <tr>
            <td>Fermented vegetables</td>
            <td>Blueprint specifies 1–4&nbsp;tbsp of kimchi, sauerkraut, or fermented beets in every
            Super Veggie. Live cultures and the microbiome diversity that comes with them are a
            genuine component of the protocol, and nothing else in the rotation supplies them.</td>
            <td>1&nbsp;tbsp of sauerkraut at lunch, twice, then build. Refrigerated and unpasteurized — shelf-stable jars are dead.</td>
          </tr>
          <tr>
            <td>Apple-cider vinegar</td>
            <td>1&nbsp;tbsp is in the original Super Veggie. Modest evidence for blunting the
            post-meal glucose rise, and it sharpens an otherwise very earthy bowl.</td>
            <td>Diluted, mixed into the dressing rather than splashed on. 1&nbsp;tsp first.</td>
          </tr>
          <tr>
            <td>Tomatoes</td>
            <td>Twelve grape tomatoes are in Johnson’s stuffed sweet potato. Lycopene, and it is
            more bioavailable cooked than raw.</td>
            <td>Cooked first — roasted or in the curry — since cooked tomato tends to be gentler than raw.</td>
          </tr>
          <tr>
            <td>Raw garlic</td>
            <td>Allicin only forms when garlic is crushed raw and it degrades with heat, so cooked
            garlic is not a substitute for the same compound.</td>
            <td>Grated fine into a dressing, one clove. Grating distributes it instead of leaving hot bites.</td>
          </tr>
          <tr>
            <td>Chili &amp; jalapeño</td>
            <td>Capsaicin, and the reason the taco bowl and the stuffed sweet potato are interesting
            rather than dutiful. The smallest genuine loss on this list.</td>
            <td>Last, and lowest priority. Test at lunch on a day you have no evening plans.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="callout">
      <h3>How to reintroduce without losing ground</h3>
      <ul>
        <li><strong>One at a time, at lunch, for three days each.</strong> Two new things at once tells
        you nothing when something flares. Lunch leaves the whole afternoon upright.</li>
        <li><strong>Keep what is working while you experiment.</strong> Being off medication is the
        outcome to protect — the 3–4 hour window before bed, staying upright, the walk, and the
        alginate in the evening are doing real work. Change the food, not the habits, and not
        both in the same week.</li>
        <li><strong>Dinner stays the conservative meal.</strong> Earlier, leaner, simpler. Nothing on
        the list above needs to be tested at 8&nbsp;pm.</li>
        <li><strong>Fats earlier rather than later.</strong> A large bolus of fat late is more likely to
        matter than an acidic bite at midday, which is why the oil moved onto lunch vegetables
        instead of a bedtime shot.</li>
        <li><strong>One caveat worth naming:</strong> absent symptoms are not the same as an absent
        problem, and long-standing reflux is the one place where "it feels fine" is not fully
        reassuring on its own. Worth a sentence with your doctor at the annual — especially about
        whether anything warrants a look — rather than a reason not to add lime back to your lunch.</li>
      </ul>
    </div>
  `;
}

const STATUS_LABEL = {
  have: ['Already have it', 'ok'],
  first: ['Buy first', 'buy'],
  later: ['Nice to have', 'later'],
};

function viewSetup() {
  const group = s => EQUIPMENT.filter(e => e.status === s);

  const equipTable = list => `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Equipment</th><th>Why it matters here</th><th>Used by</th></tr></thead>
        <tbody>
          ${list.map(e => `
            <tr>
              <td style="white-space:normal">${esc(e.item)}
                <span class="badge ${STATUS_LABEL[e.status][1]}">${STATUS_LABEL[e.status][0]}</span></td>
              <td style="white-space:normal">${esc(e.why)}</td>
              <td style="white-space:normal"><small>${esc(e.used)}</small></td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;

  return `
    <h1>Kitchen setup</h1>
    <p class="lede">What you need to actually cook everything here, then how to store it so that
    getting ingredients out of their packaging never becomes the reason you skip a meal.</p>

    <h2>Equipment</h2>
    <p>You are already set for every blended recipe — between the Ninja Pro and the Fit cup, the
    shakes and Nutty Pudding are covered. The gaps are all on the legume-and-vegetable side, and
    the total for everything in the "buy first" list is roughly $150–200.</p>

    ${equipTable([...group('have'), ...group('first')])}

    <h3>Worth it eventually</h3>
    ${equipTable(group('later'))}

    <div class="callout">
      <h3>On the Cuckoo — and how to cook lentils fast</h3>
      <p>Short answer: <strong>yes, a Cuckoo would work, and it is a genuinely excellent machine —
      but it is not the one to buy first for this plan.</strong></p>
      <p>The Cuckoo CRP induction-heating models are pressure cookers that happen to be specialized
      for rice. They run around 29&nbsp;psi, which is well above a standard electric pressure
      cooker, and the reputation is earned — the multigrain program on the twin-pressure models
      will cook unsoaked beans, and rice comes out better than anything else will manage.</p>
      <p>The problem is fit. This rotation is built on lentils, chickpeas, and vegetables; rice
      appears as a half-cup side on training days. You would be buying a superb specialist for the
      ingredient you use least, and the fixed inner pot and rice-oriented programs make it awkward
      for the things you would do constantly — sautéing aromatics before a dal, poaching chicken,
      cooking dry chickpeas, or making stock.</p>
      <p>A $90 generic electric pressure cooker covers all of that plus rice at maybe 85% of the
      Cuckoo's quality. If you find later that you are eating rice often enough to care about the
      last 15%, buy the Cuckoo <em>then</em> — the two coexist happily, and that is the order that
      gets you the most cooking per dollar.</p>
      <h3 style="margin-top:18px">Fast lentils, ranked</h3>
      <ul>
        <li><strong>Pressure cooker, 10–12 minutes, no soaking.</strong> Rinse, 1 part lentils to
        2½ parts water, high pressure, then <em>natural release for 10 minutes</em> — a quick release
        bursts them and you get grainy mush. This is the method for a batch.</li>
        <li><strong>Stovetop simmer, 18–25 minutes.</strong> Perfectly fine and needs no new
        appliance. Plenty of water, gentle simmer, drain. Black and brown lentils hold their shape;
        red lentils collapse and are for dal only.</li>
        <li><strong>Microwave lentil pouches, 90 seconds.</strong> More expensive per serving, but
        the rescue-lunch option and worth keeping two in the pantry.</li>
        <li><strong>Salt and acid go in at the end, always.</strong> Both slow softening. Acid added
        early is the single most common reason lentils stay stubborn — which matters double for
        that old bag.</li>
        <li><strong>Batch it.</strong> 180&nbsp;g dry gives four portions. Cooked lentils keep five days
        in the fridge and freeze for months in flat bags, so there is little reason to cook them
        more than weekly.</li>
      </ul>
    </div>

    <h2>Storage</h2>
    <p>Decant the things you touch daily into rigid, wide-mouth containers; keep the original bag
    sealed as backup stock.</p>

    <div class="table-wrap">
      <table>
        <thead><tr><th>Ingredient</th><th>Container</th><th>Where</th><th>Why</th></tr></thead>
        <tbody>
          ${STORAGE_PLAN.map(row => `<tr>${row.map((c, i) =>
            `<td${i === 1 ? ' style="white-space:normal"' : ''}>${esc(c)}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </div>

    <h2>What to buy once</h2>
    <ul>
      <li><strong>Six to ten wide-mouth, straight-sided containers</strong>, 16–32&nbsp;oz. Glass Mason
      jars are cheap and durable; clear polypropylene deli containers are lighter and do not shatter.</li>
      <li><strong>Two 2–3&nbsp;quart containers</strong> for lentils and pearl couscous.</li>
      <li><strong>Bag clips</strong> for frozen berries and spinach, and any bulk bag you do not fully decant.</li>
      <li><strong>A dry-erase marker or dissolvable labels.</strong> Label the lid, not just the side:
      ingredient, date opened, and the scoop size.</li>
    </ul>
    <p>Skip the giant pantry-organization set with fifteen odd sizes. One container style —
    wide opening, stackable, dishwasher-safe, readable from above — beats variety.</p>

    <h2>The fastest workflow</h2>
    <ol class="steps">
      <li><strong>Make a smoothie bin.</strong> Flax, chia, cocoa nibs, PB powder, hemp hearts, and a
      scoop in one shallow bin. The blender cup lives next to it.</li>
      <li><strong>Decant one to two weeks at a time.</strong> Fill the small working jars from the bulk
      bag, then clip the bag and put it in the freezer or the back of the pantry.</li>
      <li><strong>Pre-measure smoothie boosters.</strong> Six to ten small containers, each with
      1&nbsp;tbsp ground flax, 1&nbsp;tbsp chia, 1&nbsp;tbsp PB powder, and the cocoa. Dump one in and go.</li>
      <li><strong>Make a bowl bin.</strong> Lentils, pearl couscous, hemp hearts, and the bowl spices
      together, so Super Veggie is one operation instead of a cabinet hunt.</li>
      <li><strong>Refill only when empty.</strong> Never pour new food over old. Finish it, wash and dry
      the container completely, then refill — that is what makes the date on the lid mean something.</li>
    </ol>

    <div class="callout">
      <h3>Ziplocs, used well</h3>
      <ul>
        <li>Good for portioning and freezer work: extra nuts and seeds, pre-measured boosters,
        marinating or freezing cooked chicken, and anywhere a rigid container would waste space.</li>
        <li>Poor as the daily-access solution — they slump, the closures get powdery, and you open
        them every single morning. Rigid and wide-mouth wins there.</li>
      </ul>
    </div>

    <h2>On those expired lentils</h2>
    <p>An unopened bag of dry lentils past a 2023 best-by date is a quality date, not a safety
    cutoff — the real risk is that they never soften. Discard the bag for moisture damage, mold,
    clumping, pantry-moth webbing, insects, or a musty or rancid smell. Otherwise cook
    <strong>½ cup</strong> as a test: rinse, simmer in fresh water, and expect 45–60+ minutes rather
    than the usual 20. Hold off on tomato, vinegar, or lemon until they are tender, since acid slows
    softening. Still gritty after a fair cook? Toss them — fresh lentils are cheap and texture
    reliability is the whole point.</p>
  `;
}

/* ---------------------------------------------------------------- router */

const ROUTES = [
  [/^#\/?$/, viewHome],
  [/^#\/r\/([\w-]+)$/, (m) => viewRecipe(m[1])],
  [/^#\/list$/, viewList],
  [/^#\/plan$/, viewPlan],
  [/^#\/setup$/, viewSetup],
];

function currentRoute() {
  const hash = location.hash || '#/';
  for (const [re, fn] of ROUTES) {
    const m = hash.match(re);
    if (m) return { html: fn(m), hash };
  }
  return { html: viewHome(), hash: '#/' };
}

function render(keepScroll) {
  const { html, hash } = currentRoute();
  const main = document.getElementById('view');
  const y = window.scrollY;

  main.innerHTML = html;
  /* Prose is capped at 68ch by the stylesheet, so these pages can run full width
     for the sake of their three- and five-column tables. */
  main.className = '';

  document.querySelectorAll('.nav a').forEach(a => {
    const base = hash.startsWith('#/r/') ? '#/' : hash;
    a.classList.toggle('active', a.getAttribute('href') === base);
  });

  const badge = document.getElementById('cart-count');
  const meals = totalMeals();
  badge.textContent = meals || '';
  badge.style.display = meals ? '' : 'none';

  if (keepScroll) window.scrollTo(0, y);
  else if (!location.hash || location.hash === '#/') window.scrollTo(0, 0);
  else window.scrollTo(0, 0);
}

/* ---------------------------------------------------------------- events */

function setPick(id, n) {
  if (n <= 0) delete state.picks[id];
  else state.picks[id] = Math.min(n, 21);
  save();
}

document.addEventListener('click', e => {
  const t = e.target.closest('[data-filter],[data-add],[data-remove],[data-inc],[data-dec],[data-plan],[data-all],[data-clear],[data-print],[data-copy],[data-uncheck]');
  if (!t) return;

  const d = t.dataset;

  if (d.filter !== undefined) { state.filter = d.filter; save(); render(true); return; }

  if (d.add) { setPick(d.add, (state.picks[d.add] || 0) + 1); render(true); return; }
  if (d.remove) { setPick(d.remove, 0); render(true); return; }
  if (d.inc) { setPick(d.inc, (state.picks[d.inc] || 0) + 1); render(true); return; }
  if (d.dec) { setPick(d.dec, (state.picks[d.dec] || 0) - 1); render(true); return; }

  if (d.plan !== undefined) {
    state.picks = {};
    WEEKLY_PLAN.forEach(day => {
      PLAN_SLOTS.forEach(slot => {
        const id = day[slot];
        if (byId(id)) state.picks[id] = (state.picks[id] || 0) + 1;
      });
    });
    save();
    if (t.tagName === 'A') return;   // the plan-page link navigates on its own
    render(true);
    return;
  }

  if (d.all !== undefined) {
    RECIPES.forEach(r => { state.picks[r.id] = 1; });
    save(); render(true); return;
  }

  if (d.clear !== undefined) {
    state.picks = {}; state.checked = {}; save(); render(true); return;
  }

  if (d.uncheck !== undefined) { state.checked = {}; save(); render(true); return; }

  if (d.print !== undefined) { window.print(); return; }

  if (d.copy !== undefined) {
    const text = listAsText();
    const done = () => { t.textContent = 'Copied'; setTimeout(() => { t.textContent = 'Copy as text'; }, 1600); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, () => showTextarea(text));
    } else {
      showTextarea(text);
    }
  }
});

function showTextarea(text) {
  const wrap = document.getElementById('copy-wrap');
  if (!wrap) return;
  wrap.innerHTML = '<textarea class="copy-area" readonly></textarea>';
  const ta = wrap.querySelector('textarea');
  ta.value = text;
  ta.focus();
  ta.select();
}

document.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset.toggle) {
    setPick(el.dataset.toggle, el.checked ? Math.max(1, state.picks[el.dataset.toggle] || 0) : 0);
    render(true);
  } else if (el.dataset.check) {
    const key = el.dataset.check;
    if (el.checked) state.checked[key] = 1; else delete state.checked[key];
    save();
    el.closest('li').classList.toggle('done', el.checked);
  }
});

window.addEventListener('hashchange', () => render(false));
render(false);
