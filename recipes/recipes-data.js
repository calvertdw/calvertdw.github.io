/*
 * Recipe data.
 *
 * Every recipe is defined for ONE serving. Batch guidance lives in the steps/notes,
 * and the shopping list multiplies servings itself.
 *
 * Ingredient fields:
 *   n      canonical shopping name — must match character-for-character across
 *          recipes, since that string is the aggregation key
 *   q      quantity for shopping math (upper end of a range, so you buy enough)
 *   u      unit key from UNITS in app.js
 *   d      how the line reads inside the recipe (falls back to "q u n")
 *   cat    shopping category key from CATEGORIES in app.js
 *   src    'walmart' (default) or 'amazon'
 *   opt    optional in the recipe; still lands on the list, flagged
 *   staple spice/condiment — listed to check, never quantified
 */

const STAPLES = {
  cumin:        { n: 'Ground cumin',    cat: 'spice', staple: true },
  paprika:      { n: 'Smoked paprika',  cat: 'spice', staple: true },
  cinnamon:     { n: 'Ceylon cinnamon', cat: 'spice', staple: true },
  turmeric:     { n: 'Turmeric',        cat: 'spice', staple: true },
  chili:        { n: 'Chili powder',    cat: 'spice', staple: true },
  salt:         { n: 'Salt',            cat: 'spice', staple: true },
  pepper:       { n: 'Black pepper',    cat: 'spice', staple: true },
  nutriYeast:   { n: 'Nutritional yeast', cat: 'spice', staple: true },
};

const RECIPES = [
  /* ------------------------------------------------------------------ */
  {
    id: 'everyday-shake',
    title: 'The Everyday Shake',
    subtitle: 'Your original shake, with the nut load rotated and actually measured.',
    meal: 'breakfast',
    protein: '~40 g',
    time: '5 min',
    tags: ['no-cook', 'post-training', 'blender'],
    blurb: 'Already more nutrient-dense than a normal protein shake: protein, fiber-rich seeds, ' +
           'nuts, cocoa polyphenols, and ALA from flax and chia. Treat it as a meal — breakfast or ' +
           'post-training — not something stacked on top of an otherwise full day of food.',
    ingredients: [
      { n: 'Unsweetened almond milk', q: 1, u: 'cup', cat: 'dairy' },
      { n: 'Banana', q: 1, u: 'ea', cat: 'produce' },
      { n: 'Whey protein powder', q: 1, u: 'scoop', cat: 'powder' },
      { n: 'Pumpkin seed protein powder', q: 1, u: 'scoop', cat: 'powder', src: 'amazon' },
      { n: 'Collagen peptides', q: 1, u: 'scoop', cat: 'powder' },
      { n: 'Peanut butter powder', q: 1, u: 'tbsp', cat: 'powder' },
      { n: 'Ground flaxseed', q: 1, u: 'tbsp', cat: 'pantry' },
      { n: 'Chia seeds', q: 1, u: 'tbsp', cat: 'pantry' },
      { n: 'Cocoa nibs', q: 1, u: 'tbsp', cat: 'pantry', src: 'amazon' },
      { n: 'Walnuts', q: 1, u: 'oz', d: '1 oz walnuts — <em>or</em> peanuts, not both', cat: 'pantry' },
      { n: 'Peanuts', q: 1, u: 'oz', d: '1 oz peanuts, on the days you skip walnuts', cat: 'pantry', opt: true },
    ],
    steps: [
      'Liquid first: almond milk into the Bullet cup.',
      'Soft ingredients next: banana and peanut butter powder.',
      'Then the powders and seeds: whey, pumpkin protein, collagen, flax, chia.',
      'Nuts and cocoa nibs on top, staying under the max-fill line.',
      'Blend 30–45 seconds, tap the cup, blend another 15 seconds if anything is still gritty.',
    ],
    notes: [
      'Pick <strong>either</strong> walnuts or peanuts on a given day. Peanut powder plus peanuts plus walnuts together makes this very calorie-dense.',
      'Reflux: if the fat and fiber load sits heavy, drop flax and chia to 1 tsp each and skip the cocoa before changing anything else.',
      'Use extra-virgin olive oil on lunch or dinner vegetables rather than as a bedtime shot — earlier fat is easier on reflux.',
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'berry-green-smoothie',
    title: 'Berry-Green Protein Smoothie',
    subtitle: 'The rotation shake. Pairs with three eggs for a 45–55 g protein breakfast.',
    meal: 'breakfast',
    protein: '30–40 g (55 g with the eggs)',
    time: '5 min',
    tags: ['no-cook', 'greens', 'blender'],
    blurb: 'Uses the greens without tasting aggressively green — the berries carry it. Frozen ' +
           'berries do the work of ice, so the texture stays thick without watering the shake down.',
    ingredients: [
      { n: 'Unsweetened almond milk', q: 0.75, u: 'cup', d: '¾ cup unsweetened almond milk (or dairy milk)', cat: 'dairy' },
      { n: 'Frozen mixed berries', q: 1, u: 'cup', d: '1 cup frozen mixed berries — blueberry / blackberry / strawberry', cat: 'frozen' },
      { n: 'Baby spinach', q: 2, u: 'cup', d: '1 packed handful baby spinach (1–2 cups)', cat: 'produce' },
      { n: 'Banana', q: 0.5, u: 'ea', d: '½ banana', cat: 'produce' },
      { n: 'Whey protein powder', q: 1, u: 'scoop', cat: 'powder' },
      { n: 'Ground flaxseed', q: 1, u: 'tbsp', cat: 'pantry' },
      { n: 'Chia seeds', q: 1, u: 'tbsp', cat: 'pantry' },
      { n: 'Peanut butter powder', q: 1, u: 'tbsp', cat: 'powder' },
      { n: 'Cocoa nibs', q: 1, u: 'tsp', d: '1 tsp cocoa nibs or cocoa powder', cat: 'pantry', src: 'amazon' },
      { n: 'Plain Greek yogurt', q: 0.25, u: 'cup', d: '¼ cup plain Greek yogurt — thicker, tangier, +5–6 g protein', cat: 'dairy', opt: true },
      { n: 'Eggs', q: 3, u: 'ea', d: '3 eggs, cooked alongside', cat: 'protein', opt: true },
    ],
    steps: [
      'Put ¾ cup almond milk in the Bullet cup first.',
      'Add the soft ingredients: banana, spinach, Greek yogurt if using, peanut butter powder.',
      'Add the powder and seeds: whey, flax, chia, cocoa.',
      'Frozen berries last, leaving a little room below the max-fill line.',
      'Screw on the blade lid and blend 30–45 seconds. Shake or tap the cup, then blend another 15–20 seconds if needed.',
      'Adjust: too thick, add 2–4 tbsp more milk; too thin, add more frozen berries or Greek yogurt.',
      'Drink it with the eggs and stop there — eggs plus this shake is already a strong protein breakfast.',
    ],
    notes: [
      'Rinse fresh spinach and any fresh berries under cool running water. No soap, no produce wash.',
      'Reflux: skip acidic add-ins — orange, pineapple, lemon, lime. Mornings are usually your easier window anyway.',
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'yogurt-oat-bowl',
    title: 'Yogurt-Oat Berry Bowl',
    subtitle: 'The no-blender breakfast. Different texture, same protein-plus-fiber floor.',
    meal: 'breakfast',
    protein: '30–35 g',
    time: '5 min',
    tags: ['no-cook', 'dairy-forward', 'meal-prep'],
    blurb: 'Not a Blueprint meal, but it leans on the dairy you tolerate well and gives you ' +
           'somewhere to go on days you do not want a shake.',
    ingredients: [
      { n: 'Plain Greek yogurt', q: 1, u: 'cup', d: '1 cup plain Greek yogurt or skyr', cat: 'dairy' },
      { n: 'Rolled oats', q: 0.5, u: 'cup', d: '½ cup rolled oats, raw or cooked-and-cooled', cat: 'grain' },
      { n: 'Blueberries or strawberries', q: 0.75, u: 'cup', d: '¾ cup blueberries, strawberries, or cherries', cat: 'produce' },
      { n: 'Ground flaxseed', q: 1, u: 'tbsp', cat: 'pantry' },
      { n: 'Chia seeds', q: 1, u: 'tbsp', cat: 'pantry' },
      { n: 'Walnuts', q: 1, u: 'oz', d: '1 oz walnuts or pumpkin seeds — measured, not poured', cat: 'pantry' },
      STAPLES.cinnamon,
    ],
    steps: [
      'Yogurt into a bowl. Stir in the oats.',
      'Fold in flax, chia, and cinnamon. If you want the oats softer, do this the night before and refrigerate.',
      'Top with berries and the measured nuts or seeds just before eating.',
    ],
    notes: [
      'Overnight version: mix yogurt, oats, flax, chia, and cinnamon in a jar; add berries and nuts in the morning so they stay crisp.',
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'super-veggie-bowl',
    title: 'Reflux-Aware Super Veggie Bowl',
    subtitle: 'Blueprint’s Super Veggie, served chunky instead of blended into green paste.',
    meal: 'lunch',
    protein: '15 g base · 50–60 g with chicken',
    time: '30 min',
    tags: ['blueprint', 'high-fiber', 'meal-prep', 'reflux-aware'],
    featured: true,
    blurb: 'The highest-value Blueprint-inspired meal to add, 2–4 times a week. Same ingredients ' +
           'as Johnson’s version — black lentils, broccoli, cauliflower, mushrooms, garlic, ginger, ' +
           'hemp, cumin, olive oil — but kept whole, which is far more palatable and much better for meal prep.',
    ingredients: [
      { n: 'Dry lentils', q: 45, u: 'g', d: '45 g dry black / beluga lentils (~¼ cup) — ordinary brown lentils are fine', cat: 'legume' },
      { n: 'Broccoli', q: 250, u: 'g', d: '250 g broccoli, chopped, including the peeled stem', cat: 'produce' },
      { n: 'Cauliflower', q: 150, u: 'g', d: '150 g cauliflower, chopped', cat: 'produce' },
      { n: 'Baby bella mushrooms', q: 50, u: 'g', d: '50 g shiitake or baby bella mushrooms, sliced', cat: 'produce' },
      { n: 'Garlic', q: 1, u: 'clove', d: '1 clove garlic, minced', cat: 'produce' },
      { n: 'Fresh ginger', q: 1, u: 'tsp', d: '1 tsp grated fresh ginger', cat: 'produce' },
      { n: 'Hemp hearts', q: 1, u: 'tbsp', cat: 'pantry', src: 'amazon' },
      { n: 'Extra-virgin olive oil', q: 3, u: 'tsp', d: '1 tsp to 1 tbsp extra-virgin olive oil, added after cooking', cat: 'pantry' },
      STAPLES.cumin, STAPLES.paprika, STAPLES.salt,
      { n: 'Chicken breast', q: 6, u: 'oz', d: '5–6 oz grilled chicken breast, sliced — makes it a 50–60 g protein lunch', cat: 'protein', opt: true },
      { n: 'Pearl couscous', q: 0.33, u: 'cup', d: '½–1 cup cooked pearl couscous (⅓ cup dry) on soccer days', cat: 'grain', opt: true },
      { n: 'Fresh parsley', q: 0.25, u: 'bunch', d: 'Parsley, dill, or cilantro', cat: 'produce', opt: true },
      { n: 'Plain Greek yogurt', q: 2, u: 'tbsp', d: '1–2 tbsp plain Greek yogurt, for a creamy dressing', cat: 'dairy', opt: true },
      /* The three authentic components held back at first — see the reflux tradeoffs table. */
      { n: 'Lime', q: 1, u: 'ea', d: '1 lime, juiced — the original calls for a whole one', cat: 'produce', opt: true },
      { n: 'Apple-cider vinegar', q: 1, u: 'tbsp', d: '1 tbsp apple-cider vinegar', cat: 'pantry', opt: true },
      { n: 'Fermented vegetables', q: 2, u: 'tbsp', d: '1–4 tbsp fermented vegetables — kimchi, sauerkraut, or fermented beets', cat: 'produce', opt: true },
    ],
    steps: [
      '<strong>Lentils:</strong> rinse 45 g dry lentils, cover with plenty of water, bring to a boil, then drop to a gentle simmer. Cook until tender but not mushy — 18–25 minutes for black lentils. Older lentils take longer, so start checking at 25 minutes and keep going. Drain.',
      '<strong>Vegetables:</strong> while the lentils cook, steam broccoli, cauliflower, mushrooms, garlic, and ginger 7–9 minutes, until tender but still substantial. Steaming beats boiling here — no watery result.',
      '<strong>Or roast them:</strong> 425 °F with a light oil spray for 20–25 minutes. Better flavor, though it is a departure from Johnson’s lower-temperature method.',
      '<strong>Combine:</strong> lentils and vegetables in a big bowl. Add cumin, smoked paprika, salt, hemp hearts, and the EVOO. Toss.',
      'Add the sliced chicken, and the cooked pearl couscous if it is a high-output soccer day.',
      '<strong>Meal-prep:</strong> make four portions at once. Store the lentil-and-vegetable base separately from the chicken and toppings, and add the EVOO and hemp hearts when you eat it.',
    ],
    notes: [
      '<strong>Now that your reflux is managed, this is the recipe to make authentic.</strong> The lime, the apple-cider vinegar, and the fermented vegetables are the three components originally held back, and they are functional rather than decorative — the vitamin C in the lime substantially improves how much of the lentils’ iron you absorb, and the ferment is the only source of live cultures in the whole rotation.',
      'Reintroduce them one at a time, at lunch, three days each. Start with a quarter lime; it also happens to be the single biggest flavor upgrade available here.',
      'Baby bellas are a fine stand-in for shiitake or maitake.',
      'Buy refrigerated, unpasteurized sauerkraut or kimchi. The shelf-stable jars have been heat-treated and contain nothing alive.',
      'Keep the EVOO a measured drizzle here rather than another oil shot later in the evening.',
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'sweet-potato-bowl',
    title: 'Sweet-Potato Protein Bowl',
    subtitle: 'Blueprint’s stuffed sweet potato, made soccer-friendly.',
    meal: 'dinner',
    protein: '45–55 g',
    time: '45 min',
    tags: ['blueprint', 'high-fiber', 'training-day', 'reflux-aware'],
    featured: true,
    blurb: 'Keeps the high-fiber carbohydrate base that makes this useful around training, with ' +
           'enough protein to be a real meal rather than a side dish.',
    ingredients: [
      { n: 'Sweet potato', q: 1, u: 'ea', d: '1 medium sweet potato, roasted', cat: 'produce' },
      { n: 'Canned chickpeas', q: 0.5, u: 'can', d: '½–¾ cup chickpeas', cat: 'legume' },
      { n: 'Chicken breast', q: 6, u: 'oz', d: '4–6 oz grilled chicken, turkey, or salmon', cat: 'protein' },
      { n: 'Arugula', q: 2, u: 'cup', d: 'A couple of handfuls arugula or baby spinach', cat: 'produce' },
      { n: 'Avocado', q: 0.25, u: 'ea', d: '¼ avocado', cat: 'produce' },
      { n: 'Fresh cilantro', q: 0.25, u: 'bunch', d: '¼ cup fresh cilantro', cat: 'produce' },
      { n: 'Extra-virgin olive oil', q: 2, u: 'tsp', d: '1–2 tsp extra-virgin olive oil', cat: 'pantry' },
      /* Johnson's original: 12 grape tomatoes, 4 radishes, 1 jalapeño, 2 limes, 1 lemon. */
      { n: 'Grape tomatoes', q: 12, u: 'ea', d: '12 grape tomatoes, halved', cat: 'produce', opt: true },
      { n: 'Radishes', q: 4, u: 'ea', d: '4 radishes, sliced thin', cat: 'produce', opt: true },
      { n: 'Lime', q: 1, u: 'ea', d: '1–2 limes, juiced', cat: 'produce', opt: true },
      { n: 'Jalapeño', q: 1, u: 'ea', d: '1 jalapeño — the last thing to reintroduce, not the first', cat: 'produce', opt: true },
      STAPLES.cumin, STAPLES.salt,
    ],
    steps: [
      'Roast the sweet potato at 400 °F for 40–50 minutes, until a knife goes through with no resistance. Do several at once — they reheat well.',
      'Rinse and drain the chickpeas. Warm them in a pan with the cumin and a little of the oil, or roast them alongside the potato for 20 minutes if you want them crisp.',
      'Split the potato open, fork the flesh, and pile on the chickpeas and greens.',
      'Add the sliced chicken, turkey, or salmon.',
      'Finish with avocado, cilantro, the remaining EVOO, and salt.',
    ],
    notes: [
      'Johnson’s original has tomato, radish, jalapeño, and the juice of two limes plus a lemon — all four were held back at first, and all four are now worth adding in that order. Radishes are the free one: no acid, no capsaicin, just crunch.',
      'The tomatoes are better roasted alongside the potato than raw — more available lycopene, and cooked tomato tends to sit easier.',
      'Salmon here doubles as one of your two seafood meals for the week.',
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'chicken-lentil-bowl',
    title: 'Batch-Cooked Chicken-Lentil Bowl',
    subtitle: 'The direct replacement for a turkey sandwich. Same convenience, far more food.',
    meal: 'lunch',
    protein: '50–60 g',
    time: '20 min + Sunday prep',
    tags: ['meal-prep', 'high-protein', 'no-deli-meat'],
    featured: true,
    blurb: 'Cook 2–3 lb of chicken on Sunday, cook a pot of lentils, and build four containers. ' +
           'Markedly less sodium and fewer additives than sliced deli meat, and a lot more fiber ' +
           'and micronutrient density.',
    ingredients: [
      { n: 'Chicken breast', q: 6, u: 'oz', d: '6 oz cooked grilled chicken breast — about 50 g protein', cat: 'protein' },
      { n: 'Dry lentils', q: 45, u: 'g', d: '½ cup cooked lentils (45 g dry) — about 9 g protein', cat: 'legume' },
      { n: 'Broccoli', q: 150, u: 'g', d: 'Broccoli, cauliflower, mushrooms, greens — whatever you have', cat: 'produce' },
      { n: 'Baby bella mushrooms', q: 50, u: 'g', cat: 'produce' },
      { n: 'Baby spinach', q: 1, u: 'cup', cat: 'produce' },
      { n: 'Extra-virgin olive oil', q: 2, u: 'tsp', d: '1–2 tsp extra-virgin olive oil', cat: 'pantry' },
      STAPLES.cumin, STAPLES.paprika, STAPLES.salt,
      { n: 'Brown rice or quinoa', q: 0.2, u: 'cup', d: '½ cup cooked brown rice or quinoa on hard soccer days', cat: 'grain', opt: true },
      { n: 'Fresh parsley', q: 0.25, u: 'bunch', d: 'Parsley or dill', cat: 'produce', opt: true },
    ],
    steps: [
      '<strong>Sunday:</strong> season 2–3 lb of chicken breast with cumin, smoked paprika, and salt. Grill or bake at 425 °F for 20–25 minutes, to 165 °F internal. Rest, then slice.',
      'Simmer a full pot of lentils — 180 g dry gives you four ½-cup cooked portions. Drain and cool.',
      'Roast or steam a big tray of broccoli, cauliflower, and mushrooms.',
      'Build four containers: vegetables on the bottom, lentils, then chicken. Leave the greens, EVOO, and herbs out until serving.',
      'At lunch: add spinach, drizzle the oil, reheat gently or eat it cold.',
    ],
    notes: [
      'This is the single highest-leverage prep in the whole rotation. Four containers on Sunday removes four decisions.',
      'Add the grain only on days the training load justifies it.',
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'pearl-couscous-bowl',
    title: 'Pearl Couscous Power Bowl',
    subtitle: 'Uses up the couscous you already own. Roughly 60–65 g protein.',
    meal: 'dinner',
    protein: '60–65 g',
    time: '25 min',
    tags: ['training-day', 'high-protein', 'use-what-you-have'],
    blurb: 'Pearl couscous fits the plan as a carbohydrate base — use it exactly where brown rice, ' +
           'quinoa, barley, or farro would go. It contributes some protein but is not a protein source; ' +
           'the chicken and lentils carry that.',
    ingredients: [
      { n: 'Chicken breast', q: 6, u: 'oz', d: '6 oz cooked chicken breast — about 50 g protein', cat: 'protein' },
      { n: 'Dry lentils', q: 45, u: 'g', d: '½ cup cooked lentils (45 g dry) — about 9 g protein', cat: 'legume' },
      { n: 'Pearl couscous', q: 0.33, u: 'cup', d: '¾–1 cup cooked pearl couscous (⅓ cup dry) — 6–8 g protein, mostly carbohydrate', cat: 'grain' },
      { n: 'Broccoli', q: 150, u: 'g', d: 'Broccoli, cauliflower, spinach, mushrooms — any vegetables on hand', cat: 'produce' },
      { n: 'Baby spinach', q: 1, u: 'cup', cat: 'produce' },
      { n: 'Extra-virgin olive oil', q: 2, u: 'tsp', d: 'A modest amount of EVOO', cat: 'pantry' },
      STAPLES.cumin, STAPLES.paprika, STAPLES.salt,
    ],
    steps: [
      'Toast the dry pearl couscous in a dry pan for 2 minutes until it smells nutty, then simmer in water or low-sodium broth 8–10 minutes. Drain any excess.',
      'Warm the pre-cooked lentils and chicken.',
      'Roast or steam the vegetables while the couscous cooks.',
      'Combine everything, then season with cumin, smoked paprika, salt, and a modest drizzle of EVOO.',
    ],
    notes: [
      'Pearl couscous is more refined and lower in fiber than farro, barley, or whole-grain couscous — let the lentils, vegetables, and seeds carry the fiber.',
      'Serve this as lunch or an earlier dinner. Keep the oil moderate and skip tomato sauce, raw onion, big garlic doses, and lemon-heavy dressings until you know how you react.',
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'turkey-taco-bowl',
    title: 'Turkey Taco Bowl',
    subtitle: 'The burrito flavor you already like, moved toward lean protein and legumes.',
    meal: 'dinner',
    protein: '45–55 g',
    time: '20 min',
    tags: ['meal-prep', 'high-protein', 'familiar'],
    blurb: 'Make the turkey-and-bean base in bulk and it covers three lunches. Greek yogurt does ' +
           'the job of sour cream and adds protein instead of just fat.',
    ingredients: [
      { n: 'Ground turkey (93–99% lean)', q: 7, u: 'oz', d: '6–7 oz 93–99% lean ground turkey', cat: 'protein' },
      { n: 'Canned black beans', q: 0.5, u: 'can', d: '½–¾ cup black beans', cat: 'legume' },
      { n: 'Brown rice or quinoa', q: 0.2, u: 'cup', d: '½ cup cooked rice, or a roasted sweet potato — scale to training load', cat: 'grain' },
      { n: 'Romaine or leaf lettuce', q: 2, u: 'cup', d: 'Lettuce or spinach', cat: 'produce' },
      { n: 'Frozen corn', q: 0.25, u: 'cup', cat: 'frozen' },
      { n: 'Avocado', q: 0.25, u: 'ea', d: '¼ avocado', cat: 'produce' },
      { n: 'Fresh cilantro', q: 0.25, u: 'bunch', d: 'A little fresh cilantro', cat: 'produce' },
      { n: 'Plain Greek yogurt', q: 2, u: 'tbsp', d: '2 tbsp plain Greek yogurt, in place of sour cream', cat: 'dairy' },
      STAPLES.cumin, STAPLES.chili, STAPLES.salt,
    ],
    steps: [
      'Brown the turkey over medium-high heat, breaking it up as it goes, 7–8 minutes.',
      'Add cumin, chili powder, salt, and the drained beans. Cook another 3–4 minutes so it comes together.',
      'Scale up: 2 lb of turkey and two cans of beans gives you the base for three more lunches.',
      'Build the bowl over rice or a split sweet potato, then lettuce, corn, avocado, cilantro, and the yogurt.',
    ],
    notes: [
      'Reflux: hold the salsa and hot sauce until you know how they land. Chili powder is milder than hot sauce but still worth testing at lunch first.',
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'steak-burrito-bowl',
    title: 'Upgraded Steak Burrito Bowl',
    subtitle: 'Once a week or less. Not a cheat meal — just the less-frequent red-meat meal.',
    meal: 'dinner',
    protein: '45–55 g',
    time: '25 min',
    tags: ['weekly-or-less', 'familiar'],
    blurb: 'Keep the burrito, change the ratios. Turning it into a bowl gets you beans, ' +
           'fajita vegetables, and avocado instead of a tortilla doing most of the volume.',
    ingredients: [
      { n: 'Lean steak (sirloin or flank)', q: 5, u: 'oz', d: '5 oz lean steak — or chicken', cat: 'protein' },
      { n: 'Canned black beans', q: 0.5, u: 'can', d: '½ cup black beans', cat: 'legume' },
      { n: 'Bell pepper', q: 1, u: 'ea', d: '1 bell pepper, sliced for fajita vegetables', cat: 'produce' },
      { n: 'Onion', q: 0.5, u: 'ea', d: '½ onion, sliced', cat: 'produce' },
      { n: 'Brown rice or quinoa', q: 0.2, u: 'cup', d: '½ cup cooked brown rice, if training calls for it', cat: 'grain' },
      { n: 'Avocado', q: 0.25, u: 'ea', d: '¼ avocado', cat: 'produce' },
      { n: 'Shredded cheese', q: 1, u: 'oz', d: '1 oz shredded cheese — modest', cat: 'dairy' },
      { n: 'Salsa', q: 2, u: 'tbsp', d: '2 tbsp salsa, only if tolerated', cat: 'pantry', opt: true },
      { n: 'Whole-grain tortilla', q: 1, u: 'ea', d: '1 whole-grain tortilla, if you want it wrapped', cat: 'grain', opt: true },
      STAPLES.cumin, STAPLES.chili, STAPLES.salt,
    ],
    steps: [
      'Season the steak with cumin, chili powder, and salt. Sear 3–4 minutes a side for medium-rare, then rest 5 minutes before slicing across the grain.',
      'In the same pan, cook the peppers and onion hard for 6–8 minutes until they take some color.',
      'Warm the beans and rice.',
      'Build the bowl and add avocado and a modest amount of cheese. Salsa only if it agrees with you.',
    ],
    notes: [
      'Use lean steak about weekly or less, rather than treating it as a default protein.',
      'This is the one meal in the rotation where cooked onion, cheese, and salsa all show up at once — a reasonable candidate for an earlier dinner and a longer walk afterward.',
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'greek-yogurt-wrap',
    title: 'Salmon or Chicken Greek-Yogurt Wrap',
    subtitle: 'The tuna-salad replacement that does not depend on tuna.',
    meal: 'lunch',
    protein: '45–55 g',
    time: '10 min',
    tags: ['no-cook', 'seafood', 'low-mercury'],
    blurb: 'Greek yogurt is the creamy binder instead of mayo, which turns the whole thing into a ' +
           'protein delivery vehicle. Canned salmon makes it a pantry meal.',
    ingredients: [
      { n: 'Canned salmon', q: 6, u: 'oz', d: '5–6 oz cooked salmon or chicken — canned salmon works', cat: 'protein' },
      { n: 'Plain Greek yogurt', q: 0.5, u: 'cup', d: '½ cup plain Greek yogurt, as the binder', cat: 'dairy' },
      { n: 'Cucumber', q: 0.5, u: 'ea', d: '½ cucumber, diced', cat: 'produce' },
      { n: 'Celery', q: 1, u: 'ea', d: '1 stalk celery, diced', cat: 'produce' },
      { n: 'Fresh dill', q: 0.25, u: 'bunch', d: 'A little fresh dill', cat: 'produce' },
      { n: 'Fresh parsley', q: 0.25, u: 'bunch', d: 'A little fresh parsley', cat: 'produce' },
      { n: 'Whole-grain tortilla', q: 1, u: 'ea', d: '1 whole-grain wrap or pita', cat: 'grain' },
      { n: 'Baby carrots', q: 1, u: 'cup', d: 'Baby carrots on the side', cat: 'produce' },
      { n: 'Banana', q: 1, u: 'ea', d: 'A piece of fruit on the side', cat: 'produce' },
      STAPLES.salt, STAPLES.pepper,
    ],
    steps: [
      'Flake the salmon or shred the chicken into a bowl.',
      'Fold in the Greek yogurt, cucumber, celery, dill, parsley, salt, and pepper.',
      'Spoon into the wrap or pita and roll it up.',
      'Serve with baby carrots and fruit.',
    ],
    notes: [
      'Reflux: avoid or minimize lemon, raw onion, hot sauce, and heavy garlic unless you know you tolerate them.',
      'This counts as one of your two weekly seafood meals — salmon, canned salmon, sardines, or trout, rotating rather than defaulting to tuna.',
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'cottage-cheese-plate',
    title: 'Cottage-Cheese Power Plate',
    subtitle: 'A no-cook desk lunch that still clears 45 g of protein.',
    meal: 'lunch',
    protein: '45–60 g',
    time: '5 min',
    tags: ['no-cook', 'dairy-forward', 'no-deli-meat'],
    blurb: 'Given how well you handle dairy, cottage cheese and Greek yogurt are unusually ' +
           'efficient whole-food routes to the daily protein target. Nothing here needs a stove.',
    ingredients: [
      { n: 'Cottage cheese', q: 1.5, u: 'cup', d: '1 to 1½ cups cottage cheese — 25–40 g protein depending on brand', cat: 'dairy' },
      { n: 'Eggs', q: 2, u: 'ea', d: '2 hard-boiled eggs — about 12 g protein', cat: 'protein' },
      { n: 'Edamame', q: 0.5, u: 'cup', d: '½ cup edamame or roasted chickpeas — 8–12 g protein', cat: 'frozen' },
      { n: 'Whole-grain crackers', q: 1, u: 'bag', d: 'Whole-grain crackers or toast', cat: 'grain' },
      { n: 'Blueberries or strawberries', q: 0.5, u: 'cup', cat: 'produce' },
      { n: 'Cucumber', q: 0.5, u: 'ea', cat: 'produce' },
      { n: 'Walnuts', q: 1, u: 'oz', cat: 'pantry' },
      STAPLES.pepper,
    ],
    steps: [
      'Boil a half-dozen eggs at the start of the week: 10–11 minutes, then straight into ice water. They keep a week in the shell.',
      'Cottage cheese in the middle of the plate, black pepper over it.',
      'Arrange eggs, edamame, crackers, berries, cucumber, and walnuts around it.',
    ],
    notes: [
      'Compare cottage cheese brands — protein per cup varies a lot, from about 22 g to 28 g.',
      'Steam frozen edamame from the pod straight from the freezer, or keep shelled edamame for speed.',
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'rotisserie-rescue',
    title: 'Rotisserie Chicken Rescue Lunch',
    subtitle: 'The I-didn’t-meal-prep solution. Four minutes, 45+ g protein.',
    meal: 'lunch',
    protein: '45–55 g',
    time: '5 min',
    tags: ['no-cook', 'emergency', 'high-protein'],
    blurb: 'Worth keeping in your back pocket precisely so that a missed Sunday prep does not ' +
           'turn into a deli-meat week.',
    ingredients: [
      { n: 'Rotisserie chicken', q: 7, u: 'oz', d: '6–7 oz breast meat pulled from a plain rotisserie chicken', cat: 'protein' },
      { n: 'Microwave lentil or bean pouch', q: 1, u: 'pouch', d: '1 microwave lentil or bean pouch, or a can of low-sodium beans', cat: 'legume' },
      { n: 'Frozen steam-in-bag vegetables', q: 1, u: 'bag', cat: 'frozen' },
      { n: 'Extra-virgin olive oil', q: 2, u: 'tsp', cat: 'pantry' },
      STAPLES.cumin, STAPLES.paprika, STAPLES.salt,
    ],
    steps: [
      'Microwave the vegetable bag per the package.',
      'Heat the lentil pouch, or rinse and drain the canned beans.',
      'Pull the breast meat off the bird.',
      'Combine, then hit it with EVOO, cumin, smoked paprika, and salt.',
    ],
    notes: [
      'Choose the least-seasoned rotisserie option. Commercial seasoning runs high in sodium and often carries reflux-triggering spice.',
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'home-deli-chicken',
    title: 'Home “Deli” Chicken',
    subtitle: 'Sandwich convenience without packaged cold cuts.',
    meal: 'lunch',
    protein: '~50 g per portion',
    time: '40 min + freezing',
    tags: ['meal-prep', 'no-deli-meat', 'freezer'],
    blurb: 'Cooked-and-sliced poultry at home is a great lunch staple. Packaged deli turkey is a ' +
           'convenience food, not a daily protein foundation — regular processed-meat intake is ' +
           'associated with colorectal-cancer risk, and that includes the turkey and chicken versions.',
    ingredients: [
      { n: 'Chicken breast', q: 8, u: 'oz', d: 'Roast 2 lb of chicken or turkey breast; this is one 6–8 oz portion', cat: 'protein' },
      { n: 'Whole-grain bread', q: 2, u: 'slice', cat: 'grain' },
      { n: 'Plain Greek yogurt', q: 2, u: 'tbsp', d: '2 tbsp Greek yogurt, mixed with herbs as the spread', cat: 'dairy' },
      { n: 'Fresh dill', q: 0.25, u: 'bunch', d: 'A little fresh dill', cat: 'produce' },
      { n: 'Cucumber', q: 0.5, u: 'ea', d: '½ cucumber, sliced', cat: 'produce' },
      { n: 'Baby spinach', q: 1, u: 'cup', cat: 'produce' },
      { n: 'Banana', q: 1, u: 'ea', d: 'Fruit on the side', cat: 'produce' },
      STAPLES.salt, STAPLES.pepper,
    ],
    steps: [
      'Roast 2 lb of chicken breast or a turkey breast at 400 °F to 165 °F internal, 30–40 minutes depending on thickness.',
      '<strong>Cool completely</strong> before slicing — this is what lets you cut it thin.',
      'Slice thinly, then portion into 6 oz packets and freeze the ones you will not eat in three days.',
      'To build the sandwich: mix Greek yogurt with dill, salt, and pepper as the spread, then layer chicken, cucumber, and spinach on whole-grain bread. Fruit on the side.',
    ],
    notes: [
      'Plain roasted turkey breast from a deli counter is a reasonable fallback — compare sodium and ingredient lists against the packaged stuff.',
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'salmon-veg-grain',
    title: 'Salmon, Vegetables & a Whole Grain',
    subtitle: 'The simplest dinner in the rotation, and one of the two weekly seafood meals.',
    meal: 'dinner',
    protein: '40–45 g',
    time: '25 min',
    tags: ['seafood', 'low-mercury', 'reflux-aware'],
    blurb: 'Fish stays valuable for protein and cardiometabolic nutrition — the move is to vary ' +
           'the species rather than lean on tuna. Salmon, sardines, trout, pollock, shrimp, and cod all rotate in here.',
    ingredients: [
      { n: 'Salmon fillet', q: 6, u: 'oz', d: '6 oz salmon fillet — frozen is fine', cat: 'protein' },
      { n: 'Broccoli', q: 200, u: 'g', d: 'Broccoli, green beans, or zucchini — about 2 cups', cat: 'produce' },
      { n: 'Frozen green beans', q: 1, u: 'cup', cat: 'frozen' },
      { n: 'Pearl couscous', q: 0.33, u: 'cup', d: '½–1 cup cooked pearl couscous, quinoa, or brown rice', cat: 'grain' },
      { n: 'Extra-virgin olive oil', q: 2, u: 'tsp', cat: 'pantry' },
      { n: 'Fresh dill', q: 0.25, u: 'bunch', d: 'A little fresh dill', cat: 'produce' },
      STAPLES.paprika, STAPLES.salt,
    ],
    steps: [
      'Thaw the salmon in the fridge overnight, or under cold running water for 15 minutes.',
      'Pat dry, season with smoked paprika and salt, and roast at 400 °F for 12–15 minutes, until it flakes.',
      'Roast or steam the vegetables at the same time.',
      'Cook the grain. Plate, drizzle the EVOO, and finish with dill.',
    ],
    notes: [
      'Keep dinner the simpler, lower-fat, earlier meal and make lunch your more experimental high-fiber one.',
      'Last substantive meal 3–4 hours before bed, then the walk.',
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'turkey-burger-plate',
    title: 'Grilled Chicken or Turkey-Burger Plate',
    subtitle: 'Your familiar dinner, upgraded with a bean, grain, and vegetable side.',
    meal: 'dinner',
    protein: '45–55 g',
    time: '20 min',
    tags: ['familiar', 'high-protein'],
    blurb: 'No reason to abandon the meal you already cook and enjoy. The change is what sits ' +
           'next to it on the plate.',
    ingredients: [
      { n: 'Turkey burger patties', q: 7, u: 'oz', d: '6–7 oz turkey burger patties, or grilled chicken — short ingredient list', cat: 'protein' },
      { n: 'Canned black beans', q: 0.5, u: 'can', d: '½ cup beans or lentils', cat: 'legume' },
      { n: 'Broccoli', q: 200, u: 'g', d: 'About 1 cup roasted vegetables — broccoli, cauliflower, zucchini, carrots', cat: 'produce' },
      { n: 'Zucchini', q: 1, u: 'ea', cat: 'produce' },
      { n: 'Brown rice or quinoa', q: 0.2, u: 'cup', d: '½ cup cooked whole grain', cat: 'grain' },
      { n: 'Extra-virgin olive oil', q: 2, u: 'tsp', cat: 'pantry' },
      STAPLES.paprika, STAPLES.salt, STAPLES.pepper,
    ],
    steps: [
      'Grill the patties or chicken to 165 °F.',
      'Roast the vegetables at 425 °F for 20–25 minutes with a light oil spray.',
      'Warm the beans and the grain.',
      'Plate all three, then finish the vegetables with EVOO after cooking rather than before.',
    ],
    notes: [
      'Pick turkey burgers with a short ingredient list — this is the difference between lean poultry and a processed-meat product.',
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'nutty-pudding',
    title: 'Nutty Pudding',
    subtitle: 'Blueprint’s signature breakfast. The dish your original shake was reaching for.',
    meal: 'breakfast',
    protein: '35–45 g',
    time: '10 min',
    tags: ['blueprint', 'no-cook', 'blender', 'high-polyphenol'],
    featured: true,
    blurb: 'This is the meal Johnson has eaten nearly every morning for years, and it is a close ' +
           'cousin of the shake you already make — same nuts, seeds, cocoa, and berries, but ' +
           'thick enough to eat with a spoon. Macadamia carries the fat here instead of peanut.',
    ingredients: [
      { n: 'Unsweetened almond milk', q: 0.5, u: 'cup', d: '50–100 ml macadamia or almond milk — start low, it should be thick', cat: 'dairy' },
      { n: 'Macadamia nuts', q: 25, u: 'g', d: '3 tbsp ground macadamia nuts (~25 g)', cat: 'pantry', src: 'amazon' },
      { n: 'Walnuts', q: 5, u: 'g', d: '2 tsp ground walnuts (~5 g)', cat: 'pantry' },
      { n: 'Chia seeds', q: 2, u: 'tbsp', cat: 'pantry' },
      { n: 'Ground flaxseed', q: 1, u: 'tsp', cat: 'pantry' },
      { n: 'Cocoa powder', q: 1, u: 'tbsp', d: '1 tbsp unsweetened cocoa powder', cat: 'pantry' },
      { n: 'Sunflower lecithin', q: 1, u: 'tsp', d: '1 tsp sunflower lecithin — emulsifies it, big texture upgrade', cat: 'powder', src: 'amazon', opt: true },
      { n: 'Ceylon cinnamon', d: '½ tsp Ceylon cinnamon', cat: 'spice', staple: true },
      { n: 'Whey protein powder', q: 1, u: 'scoop', d: '30–60 g protein powder — Johnson uses pea; whey works and digests fine for you', cat: 'powder' },
      { n: 'Blueberries or strawberries', q: 0.5, u: 'cup', d: '½ cup blueberries, raspberries, or strawberries', cat: 'produce' },
      { n: 'Frozen cherries', q: 3, u: 'ea', d: '3 pitted dark cherries', cat: 'frozen' },
      { n: 'Pomegranate juice', q: 2, u: 'oz', d: '2 oz pomegranate juice — see the reflux note', cat: 'pantry', opt: true },
      { n: 'Brazil nuts', q: 0.25, u: 'ea', d: '¼ of one Brazil nut — selenium; do not exceed this', cat: 'pantry', src: 'amazon', opt: true },
    ],
    steps: [
      'Grind the macadamias and walnuts first if they are whole — the Ninja Fit cup does this dry in a few pulses.',
      'Add the milk, then everything except the berries and cherries.',
      'Blend on high 3–4 minutes. It is supposed to run long; that is what makes it pudding rather than gritty paste.',
      'Pour into a dish and top with the berries and cherries.',
      'Eat it with a spoon. If it is too thick to blend, add milk 1 tbsp at a time — going too thin is the common mistake.',
    ],
    notes: [
      '<strong>One Brazil nut has a full day of selenium.</strong> A quarter nut is the whole intended dose — this is not an ingredient to eyeball.',
      'The pomegranate juice is the acidic component. Now that your reflux is quiet it is worth trying at breakfast; if it bites, the pudding is still excellent without it.',
      'Macadamia is the expensive ingredient. Buying halves or pieces rather than whole nuts cuts the cost, and you are grinding them anyway.',
      'Ceylon cinnamon rather than cassia is a deliberate Blueprint choice — cassia carries far more coumarin at daily doses.',
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'blueberry-nut-mix',
    title: 'Blueberry Nut Mix',
    subtitle: 'Three ingredients. Johnson’s breakfast side, and your answer to a mid-afternoon snack.',
    meal: 'snack',
    protein: '6–8 g',
    time: '2 min',
    tags: ['blueprint', 'no-cook', 'high-polyphenol', 'meal-prep'],
    blurb: 'The Blueprint version is sold as a product with exactly three things in it: macadamia ' +
           'nuts, walnuts, and blueberries. There is no reason to buy it pre-mixed — make a jar ' +
           'and it is the cheapest polyphenol-dense snack in the rotation.',
    ingredients: [
      { n: 'Macadamia nuts', q: 0.75, u: 'oz', d: '¾ oz macadamia nuts, roasted unsalted', cat: 'pantry', src: 'amazon' },
      { n: 'Walnuts', q: 0.75, u: 'oz', cat: 'pantry' },
      { n: 'Dried blueberries', q: 2, u: 'tbsp', d: '2 tbsp dried blueberries, no added sugar', cat: 'pantry' },
    ],
    steps: [
      'Mix a batch at a 1:1:1 ratio by volume in a jar. Ten minutes of work covers two weeks.',
      'Portion into 1½ oz servings if you would otherwise eat the jar.',
      'Keep it in the fridge or freezer — macadamia and walnut are both fat-rich enough to go rancid on a warm shelf.',
    ],
    notes: [
      'Check the dried blueberries for added sugar and oil; plenty of brands add both. Freeze-dried is the cleanest option and stays crisp in the jar.',
      'This is a snack, not a meal — it is nearly all fat and runs 250+ kcal per generous handful. It pairs well with the Super Shake on a training day rather than replacing it.',
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'super-shake',
    title: 'The Post-Training Super Shake',
    subtitle: 'Attia’s fourth feeding: 40–50 g of protein in a glass, built for after soccer or lifting.',
    meal: 'snack',
    protein: '45–50 g',
    time: '5 min',
    tags: ['attia', 'no-cook', 'high-protein', 'post-training', 'blender'],
    featured: true,
    blurb: 'Attia’s own version is a large shake built on almond milk and frozen fruit to land at ' +
           'about 50 g of protein — the point being that four feedings of 40–50 g is far easier to ' +
           'hit than three enormous meals. This is the feeding that closes the gap on a 180 g day.',
    ingredients: [
      { n: 'Unsweetened almond milk', q: 2, u: 'cup', d: '16–24 oz unsweetened almond milk', cat: 'dairy' },
      { n: 'Whey protein powder', q: 2, u: 'scoop', d: '2 scoops whey — this is the whole point of the shake', cat: 'powder' },
      { n: 'Frozen mixed berries', q: 1, u: 'cup', cat: 'frozen' },
      { n: 'Baby spinach', q: 2, u: 'cup', d: 'A big handful of baby spinach', cat: 'produce', opt: true },
      { n: 'Collagen peptides', q: 1, u: 'scoop', d: '1 scoop collagen peptides — not a complete protein, so it is on top of the whey, not instead of it', cat: 'powder', opt: true },
      { n: 'Ground flaxseed', q: 1, u: 'tbsp', cat: 'pantry', opt: true },
      { n: 'Banana', q: 1, u: 'ea', d: '1 banana on hard soccer days, for the carbohydrate', cat: 'produce', opt: true },
    ],
    steps: [
      'This is a full-size Ninja Pro job, not the Fit cup — 24 oz of liquid will not fit in the small vessel.',
      'Liquid first, then powders, then the frozen fruit on top.',
      'Blend 45 seconds. Drink within an hour or so of finishing training.',
      'On a rest day, drop to one scoop of whey and skip the banana.',
    ],
    notes: [
      'Whey is the right protein here specifically because it is fast-digesting and leucine-rich. Collagen is a supplement to it, never a substitute — it lacks tryptophan and is a poor muscle-protein stimulus on its own.',
      'If the shake plus your other three meals is pushing you past comfortable, this is the feeding to shrink first. The 1 g/lb figure is a target to approach, not a quota to force.',
      'Attia is deliberately not dogmatic about eating windows — he cares about hitting the protein and the training, not the clock. Which suits your reflux timing better anyway.',
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'black-lentil-roasted-veg-bowl',
    title: 'Black Lentil & Roasted Veg Bowl',
    subtitle: 'A published Blueprint recipe, with a chickpea dressing that does the work of cheese.',
    meal: 'lunch',
    protein: '20 g base · 50–60 g with chicken',
    time: '35 min',
    tags: ['blueprint', 'high-fiber', 'meal-prep'],
    blurb: 'This is Blueprint’s own bowl rather than my adaptation of it, and the blended-chickpea ' +
           'dressing is the part worth stealing: nutritional yeast and lemon give it a savory, ' +
           'almost cheesy weight with no dairy and no added oil beyond a spoonful.',
    ingredients: [
      { n: 'Dry lentils', q: 55, u: 'g', d: '¼ cup dry black lentils, rinsed (~¾ cup cooked)', cat: 'legume' },
      { n: 'Zucchini', q: 1, u: 'ea', d: '1 small zucchini, chopped', cat: 'produce' },
      { n: 'Bell pepper', q: 1, u: 'ea', d: '1 small red bell pepper, chopped', cat: 'produce' },
      { n: 'Cauliflower', q: 150, u: 'g', d: '1 cup cauliflower florets', cat: 'produce' },
      { n: 'Baby bella mushrooms', q: 50, u: 'g', d: '50 g shiitake mushrooms, or baby bellas', cat: 'produce' },
      { n: 'Baby spinach', q: 1, u: 'cup', d: '1 packed cup baby spinach or massaged kale', cat: 'produce' },
      { n: 'Extra-virgin olive oil', q: 3, u: 'tsp', d: '2 tsp macadamia or avocado oil for roasting, 1 tbsp EVOO in the dressing', cat: 'pantry' },
      { n: 'Canned chickpeas', q: 0.5, u: 'can', d: '¾ cup cooked chickpeas, for the dressing', cat: 'legume' },
      { n: 'Nutritional yeast', q: 1, u: 'tbsp', cat: 'pantry' },
      { n: 'Lemon', q: 0.5, u: 'ea', d: '1 tbsp lemon juice, in the dressing', cat: 'produce' },
      { n: 'Garlic', q: 1, u: 'clove', d: '1 small garlic clove, for the dressing', cat: 'produce' },
      { n: 'Chicken breast', q: 6, u: 'oz', d: '6 oz grilled chicken, to make it a real lunch', cat: 'protein', opt: true },
      STAPLES.salt, STAPLES.pepper,
    ],
    steps: [
      'Simmer the lentils in about twice their volume of water for 20 minutes, until tender. Drain.',
      'Roast the zucchini, bell pepper, and cauliflower at 400 °F for 20–25 minutes with 1 tsp of oil.',
      'Sauté the mushrooms separately in a hot pan for 3–5 minutes with the other teaspoon — they release water and will steam rather than brown if you crowd them onto the roasting tray.',
      '<strong>Dressing:</strong> blend the chickpeas, EVOO, lemon juice, nutritional yeast, garlic, and 4 tbsp water until smooth. The Ninja Fit cup is perfect for this.',
      'Layer lentils, roasted vegetables, mushrooms, and greens. Add the chicken, then drizzle the dressing over the top.',
    ],
    notes: [
      'The dressing makes about four servings and keeps five days — it is worth making the full batch and using it on the Super Veggie bowl too.',
      'Blueprint calls for macadamia nut oil for the roasting. Avocado oil is a cheaper high-heat stand-in; save the EVOO for the dressing where its polyphenols survive.',
      'Reflux: the lemon and raw garlic in the dressing are the two things to watch. Roasting the garlic clove first mellows it a lot if raw is too sharp.',
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'sweet-potato-curry',
    title: 'Sweet Potato Curry with Quinoa',
    subtitle: 'Another published Blueprint meal. Six vegetables, one pot, freezes well.',
    meal: 'dinner',
    protein: '15 g base · 50 g with chicken',
    time: '40 min',
    tags: ['blueprint', 'high-fiber', 'meal-prep', 'training-day'],
    blurb: 'The most dinner-like thing in the Blueprint canon, and the best vehicle in this whole ' +
           'rotation for clearing out whatever vegetables are about to turn. Turmeric plus black ' +
           'pepper is deliberate — piperine sharply increases curcumin absorption.',
    ingredients: [
      { n: 'Sweet potato', q: 1.5, u: 'ea', d: '1½ medium sweet potatoes, cubed', cat: 'produce' },
      { n: 'Cauliflower', q: 75, u: 'g', d: '½ cup cauliflower florets', cat: 'produce' },
      { n: 'Frozen green beans', q: 0.5, u: 'cup', cat: 'frozen' },
      { n: 'Broccoli', q: 75, u: 'g', d: '½ cup chopped broccoli', cat: 'produce' },
      { n: 'Carrots', q: 0.5, u: 'cup', d: '½ cup chopped carrots', cat: 'produce' },
      { n: 'Frozen peas', q: 0.25, u: 'cup', cat: 'frozen' },
      { n: 'Fresh ginger', q: 1, u: 'tsp', d: '1 tsp grated fresh ginger', cat: 'produce' },
      { n: 'Garlic', q: 1, u: 'clove', d: '1 garlic clove, minced', cat: 'produce' },
      { n: 'Onion', q: 0.25, u: 'ea', d: '¼ small onion, diced', cat: 'produce' },
      { n: 'Unsweetened almond milk', q: 0.5, u: 'cup', d: '½ cup macadamia or almond milk', cat: 'dairy' },
      { n: 'Fresh cilantro', q: 0.25, u: 'bunch', d: '1 cup fresh cilantro, chopped', cat: 'produce' },
      { n: 'Brown rice or quinoa', q: 0.2, u: 'cup', d: '½ cup cooked quinoa', cat: 'grain' },
      { n: 'Extra-virgin olive oil', q: 1, u: 'tsp', d: '1 tsp avocado oil for the sauté', cat: 'pantry' },
      { n: 'Lemon', q: 0.5, u: 'ea', d: '1 tsp fresh lime juice, at the end', cat: 'produce', opt: true },
      { n: 'Chicken breast', q: 6, u: 'oz', d: '6 oz chicken, poached in the curry', cat: 'protein', opt: true },
      STAPLES.turmeric, STAPLES.pepper, STAPLES.salt,
    ],
    steps: [
      'Cook the quinoa — 1 part quinoa to 2 parts water, 15 minutes, then rest off the heat 5 minutes.',
      'Sauté the garlic, ginger, onion, turmeric, and black pepper in the oil for 2 minutes, until fragrant.',
      'Add the sweet potato, carrots, broccoli, and cauliflower with enough water or broth to come halfway up. Simmer 25 minutes.',
      'Add the green beans, peas, and almond milk. Simmer 5 minutes more. If you are adding chicken, slice it thin and poach it in here now.',
      'Off the heat, stir in the cilantro and the lime juice if you are using it. Season and serve over the quinoa.',
    ],
    notes: [
      'Do not skip the black pepper with the turmeric — the piperine is what makes the curcumin bioavailable at all.',
      'This is the one dinner here that genuinely improves on day two, and it freezes in portions better than any bowl in the rotation.',
      'Reflux: onion and lime are the two candidates. Cooked onion is much gentler than raw, and the lime is a teaspoon you can simply leave out.',
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'pressure-cooker-dal',
    title: 'Pressure-Cooker Black Lentil Dal',
    subtitle: 'Twelve minutes under pressure, four dinners out, freezes for a month.',
    meal: 'dinner',
    protein: '18 g base · 45–55 g with chicken or yogurt',
    time: '30 min mostly unattended',
    tags: ['meal-prep', 'high-fiber', 'freezer', 'pressure-cooker'],
    featured: true,
    blurb: 'The single highest-yield thing a pressure cooker does for this rotation. Dry lentils ' +
           'to finished dal without soaking, without watching a pot, and at a cost per serving ' +
           'that makes the rest of the week’s salmon look expensive.',
    ingredients: [
      { n: 'Dry lentils', q: 60, u: 'g', d: '⅓ cup dry black or brown lentils per serving (1½ cups for a full batch of four)', cat: 'legume' },
      { n: 'Onion', q: 0.25, u: 'ea', d: '¼ onion, diced', cat: 'produce' },
      { n: 'Garlic', q: 1, u: 'clove', cat: 'produce' },
      { n: 'Fresh ginger', q: 1, u: 'tsp', d: '1 tsp grated fresh ginger', cat: 'produce' },
      { n: 'Carrots', q: 0.5, u: 'cup', d: '½ cup diced carrot', cat: 'produce' },
      { n: 'Baby spinach', q: 2, u: 'cup', d: '2 cups baby spinach, stirred in at the end', cat: 'produce' },
      { n: 'Unsweetened almond milk', q: 0.25, u: 'cup', d: '¼ cup almond milk or a spoon of yogurt, for body', cat: 'dairy' },
      { n: 'Extra-virgin olive oil', q: 2, u: 'tsp', cat: 'pantry' },
      { n: 'Plain Greek yogurt', q: 0.5, u: 'cup', d: '½ cup Greek yogurt on top — adds 12 g protein', cat: 'dairy', opt: true },
      { n: 'Chicken breast', q: 5, u: 'oz', d: '5 oz shredded chicken, stirred through', cat: 'protein', opt: true },
      STAPLES.cumin, STAPLES.turmeric, STAPLES.pepper, STAPLES.salt,
    ],
    steps: [
      'Sauté mode: oil, onion, carrot, garlic, and ginger for 3–4 minutes. Add the cumin, turmeric, and black pepper and stir for 30 seconds until they smell toasted.',
      'Add the rinsed lentils and water at roughly 1 part lentils to 2½ parts water. Scrape the bottom so nothing is stuck — that is what causes a burn warning.',
      'Seal and cook 10–12 minutes at high pressure, then let it release naturally for 10 minutes. Natural release matters: a fast release makes lentils burst and go grainy.',
      'Stir in the spinach — the residual heat wilts it in under a minute — then the almond milk. Season.',
      'Serve with yogurt on top, or shredded chicken stirred through for a full-protein dinner.',
    ],
    notes: [
      'No soaking, and no need for fresh lentils. This is also the most forgiving use for an old bag: if they are stubborn, add 3 minutes and they still come out fine, which is not true on the stovetop.',
      'Hold the salt and any acid until after cooking. Both slow softening, and acid is the main reason lentils refuse to break down.',
      'Freezes in portions for a month. Two batches a month is most of your legume intake handled.',
      'No pressure cooker? Same recipe on the stove: 30–35 minutes at a simmer, stirring now and then.',
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'tofu-edamame-bowl',
    title: 'Crispy Tofu & Edamame Bowl',
    subtitle: 'The plant-protein slot in the weekly rotation, done so the tofu is actually good.',
    meal: 'lunch',
    protein: '40–45 g',
    time: '30 min',
    tags: ['high-protein', 'high-fiber', 'meal-prep'],
    blurb: 'One or two lunches a week are meant to come from something other than poultry or fish. ' +
           'Tofu plus edamame gets there without a supplement, and pressing then cornstarch-dusting ' +
           'the tofu is the difference between crisp cubes and the sad wet version people give up on.',
    ingredients: [
      { n: 'Extra-firm tofu', q: 7, u: 'oz', d: '7 oz extra-firm tofu (half a block), pressed', cat: 'protein' },
      { n: 'Edamame', q: 1, u: 'cup', d: '1 cup shelled edamame — about 18 g protein', cat: 'frozen' },
      { n: 'Broccoli', q: 150, u: 'g', d: '150 g broccoli', cat: 'produce' },
      { n: 'Carrots', q: 0.5, u: 'cup', d: '½ cup shredded carrot', cat: 'produce' },
      { n: 'Baby spinach', q: 1, u: 'cup', cat: 'produce' },
      { n: 'Brown rice or quinoa', q: 0.2, u: 'cup', d: '½ cup cooked brown rice or quinoa', cat: 'grain' },
      { n: 'Cornstarch', q: 1, u: 'tbsp', d: '1 tbsp cornstarch, for the crust', cat: 'pantry' },
      { n: 'Extra-virgin olive oil', q: 2, u: 'tsp', cat: 'pantry' },
      { n: 'Hemp hearts', q: 1, u: 'tbsp', cat: 'pantry', src: 'amazon' },
      { n: 'Fresh ginger', q: 1, u: 'tsp', d: '1 tsp grated ginger', cat: 'produce' },
      { n: 'Low-sodium soy sauce', q: 1, u: 'tbsp', d: '1 tbsp low-sodium soy sauce or tamari', cat: 'pantry' },
      STAPLES.pepper,
    ],
    steps: [
      '<strong>Press the tofu</strong> 15 minutes — wrap the block in a towel with something heavy on top. This is the step that matters; skip it and nothing crisps.',
      'Cube it, toss with the cornstarch and a pinch of pepper until evenly dusted.',
      'Pan-fry in the oil over medium-high, 3–4 minutes a side, without moving it around. Or air-fry / oven-roast at 425 °F for 20 minutes.',
      'Steam the edamame and broccoli from frozen, 4–5 minutes.',
      'Build over the grain: tofu, edamame, broccoli, carrot, spinach. Finish with ginger, the soy sauce, and hemp hearts.',
    ],
    notes: [
      'Tofu and edamame are both complete proteins — this bowl does not need animal protein bolted on to count as a real 40 g feeding.',
      'Soy sauce is the sodium in this dish. Low-sodium tamari at a single tablespoon keeps it reasonable.',
      'Freeze the other half-block of tofu if you are not using it within a few days. Frozen-then-thawed tofu has a chewier, spongier texture that soaks up more flavor — many people prefer it.',
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'sardine-toast',
    title: 'Sardines on Whole-Grain Toast',
    subtitle: 'The cheapest omega-3 lunch there is, and near the bottom of the mercury table.',
    meal: 'lunch',
    protein: '35–45 g',
    time: '5 min',
    tags: ['no-cook', 'seafood', 'low-mercury', 'emergency'],
    blurb: 'Sardines are small, short-lived, and low on the food chain, which is exactly why they ' +
           'carry so little mercury compared with tuna — and they deliver EPA and DHA directly ' +
           'rather than the ALA your flax and chia have to convert inefficiently.',
    ingredients: [
      { n: 'Canned sardines', q: 1, u: 'can', d: '1 can sardines in olive oil or water, drained', cat: 'protein' },
      { n: 'Whole-grain bread', q: 2, u: 'slice', d: '2 slices whole-grain bread, toasted', cat: 'grain' },
      { n: 'Plain Greek yogurt', q: 0.25, u: 'cup', d: '¼ cup Greek yogurt, as the spread — adds 6 g protein', cat: 'dairy' },
      { n: 'Cottage cheese', q: 0.5, u: 'cup', d: '½ cup cottage cheese on the side, to bring it to a full 45 g', cat: 'dairy', opt: true },
      { n: 'Cucumber', q: 0.5, u: 'ea', d: '½ cucumber, sliced', cat: 'produce' },
      { n: 'Baby spinach', q: 1, u: 'cup', cat: 'produce' },
      { n: 'Fresh dill', q: 0.25, u: 'bunch', cat: 'produce' },
      { n: 'Extra-virgin olive oil', q: 1, u: 'tsp', cat: 'pantry' },
      { n: 'Lemon', q: 0.5, u: 'ea', d: '½ lemon — traditional with sardines, and now worth trying', cat: 'produce', opt: true },
      STAPLES.pepper,
    ],
    steps: [
      'Toast the bread. Mix the yogurt with the dill and pepper and spread it on.',
      'Lay the drained sardines over the top and break them up with a fork.',
      'Pile on the spinach and cucumber, then the olive oil and a squeeze of lemon.',
      'Cottage cheese on the side if you want this to clear 45 g of protein.',
    ],
    notes: [
      'Bone-in sardines are the ones to buy. The bones are soft, you will not notice them, and they are a genuinely significant calcium source.',
      'Two of these a week covers the seafood slot at a fraction of what salmon costs, and with a fraction of tuna’s mercury.',
      'Reflux: sardines are oily and lemon is acidic, so this is a lunch rather than a dinner. Worth a try now that things are settled.',
    ],
  },
];

/* The 7-day rotation: 3 Super Veggie lunches, 2 familiar chicken/turkey dinners,
   1 red-meat meal, 2 seafood meals, and four protein feedings a day including the
   post-training shake. The recipes not listed here are the bench, not rejects. */
const WEEKLY_PLAN = [
  { day: 'Monday',    breakfast: 'nutty-pudding',        lunch: 'super-veggie-bowl',    snack: 'blueberry-nut-mix', dinner: 'turkey-burger-plate' },
  { day: 'Tuesday',   breakfast: 'yogurt-oat-bowl',      lunch: 'chicken-lentil-bowl',  snack: 'super-shake',       dinner: 'sweet-potato-bowl' },
  { day: 'Wednesday', breakfast: 'berry-green-smoothie', lunch: 'super-veggie-bowl',    snack: 'blueberry-nut-mix', dinner: 'salmon-veg-grain' },
  { day: 'Thursday',  breakfast: 'everyday-shake',       lunch: 'sardine-toast',        snack: 'super-shake',       dinner: 'pressure-cooker-dal' },
  { day: 'Friday',    breakfast: 'nutty-pudding',        lunch: 'chicken-lentil-bowl',  snack: 'blueberry-nut-mix', dinner: 'turkey-burger-plate' },
  { day: 'Saturday',  breakfast: 'berry-green-smoothie', lunch: 'cottage-cheese-plate', snack: 'super-shake',       dinner: 'steak-burrito-bowl' },
  { day: 'Sunday',    breakfast: 'yogurt-oat-bowl',      lunch: 'super-veggie-bowl',    snack: 'blueberry-nut-mix', dinner: 'sweet-potato-curry' },
];

const PLAN_SLOTS = ['breakfast', 'lunch', 'snack', 'dinner'];

const PROTEIN_SCHEDULE = [
  ['Breakfast', '35–45 g', 'Nutty Pudding, the shake with a full whey serving, or eggs plus the yogurt-oat bowl'],
  ['Lunch', '45–55 g', 'Chicken-lentil bowl, Super Veggie with chicken, tofu-edamame bowl, or sardines'],
  ['Post-training', '25–50 g', 'The Super Shake, or Greek yogurt, skyr, or cottage cheese'],
  ['Dinner', '40–55 g', 'Chicken, turkey, fish, or dal plus vegetables and legumes'],
];

/* status: 'have' | 'first' | 'later' | 'skip' */
const EQUIPMENT = [
  {
    item: 'Ninja Pro blender',
    status: 'have',
    why: 'The full-size jar is what you want for the Super Shake (24 oz of liquid will not fit a personal cup) and for Nutty Pudding, which needs 3–4 minutes of continuous high-speed blending.',
    used: 'Super Shake, Nutty Pudding, all smoothies',
  },
  {
    item: 'Ninja Fit personal blender',
    status: 'have',
    why: 'Single-serve smoothies and, more usefully, small jobs the big jar cannot do well: grinding macadamias and walnuts dry, and blending the chickpea dressing in a batch too small for the large blade to catch.',
    used: 'Everyday Shake, berry-green smoothie, chickpea dressing, grinding nuts',
  },
  {
    item: 'Electric pressure cooker, 6 qt',
    status: 'first',
    why: 'The one appliance that changes this rotation. Black lentils in 10–12 minutes from dry with no soaking, dry chickpeas without an overnight plan, unattended batch dal, and a sauté mode so it is one pot rather than three. Roughly $80–100.',
    used: 'Pressure-cooker dal, every lentil and chickpea in the plan',
  },
  {
    item: 'Digital kitchen scale',
    status: 'first',
    why: 'Non-negotiable, and about $12. Every Blueprint recipe is specified in grams — 45 g lentils, 250 g broccoli, 150 g cauliflower — and "1 oz walnuts" is the whole mechanism keeping the shake from becoming 900 calories. Volume guesses are how portions drift.',
    used: 'Super Veggie, Nutty Pudding, every nut portion',
  },
  {
    item: 'Two half-sheet pans + parchment',
    status: 'first',
    why: 'Roasting at 425 °F is what makes the vegetables taste good enough to eat three times a week. Two pans means the Sunday tray of broccoli and cauliflower does not have to go in shifts, and crowding one pan steams instead of roasts.',
    used: 'Super Veggie, chicken-lentil bowls, turkey-burger plate, every roasted vegetable',
  },
  {
    item: 'Instant-read thermometer',
    status: 'first',
    why: 'Chicken breast is dry at 175 °F and perfect at 165 °F, and the gap is about ninety seconds. This is the difference between batch-cooked chicken you look forward to and chicken you choke down. About $15.',
    used: 'All batch chicken, turkey burgers, salmon',
  },
  {
    item: 'Microplane / rasp grater',
    status: 'first',
    why: 'Fresh ginger and garlic appear in most of the bowls, and grated is not the same as chopped — you get the flavor distributed instead of hot pockets of raw garlic, which also matters for reflux.',
    used: 'Super Veggie, dal, curry, tofu bowl',
  },
  {
    item: 'Collapsible steamer basket',
    status: 'first',
    why: 'Johnson’s method for Super Veggie is steaming, and it beats boiling badly — no waterlogged broccoli, no nutrients poured down the drain. A few dollars, fits any pot you own.',
    used: 'Super Veggie, edamame, broccoli',
  },
  {
    item: 'Glass meal-prep containers, 8+',
    status: 'first',
    why: 'Four lunches on Sunday is the load-bearing habit of this whole plan. Glass reheats without absorbing smells, and being able to see what is in the fridge is most of why prepped food actually gets eaten.',
    used: 'Every batch-cooked recipe',
  },
  {
    item: 'Tofu press (or a heavy pan and a towel)',
    status: 'later',
    why: 'Pressing is the step that decides whether tofu crisps. A dedicated press is about $20 and removes the excuse, but a cast-iron pan on a towel-wrapped block works identically for free.',
    used: 'Crispy tofu & edamame bowl',
  },
  {
    item: 'Air fryer',
    status: 'later',
    why: 'Genuinely faster than the oven for one portion of tofu, chickpeas, or salmon, and it does not heat the kitchen. Redundant with sheet pans for batch cooking, though — this is a convenience upgrade, not a capability one.',
    used: 'Tofu, roasted chickpeas, single salmon fillets',
  },
  {
    item: 'Cuckoo induction pressure rice cooker',
    status: 'later',
    why: 'A superb machine that solves a problem this plan mostly does not have. See the note below.',
    used: 'Rice, quinoa, multigrain — and beans on the twin-pressure models',
  },
];

const STORAGE_PLAN = [
  ['Whey / pumpkin protein, PB powder', 'Wide-mouth screw-top container or the original tub', 'Pantry', 'Large opening; keep a dedicated scoop inside'],
  ['Ground flax, chia, hemp hearts', 'Small airtight jars', 'Fridge or freezer', 'Fat-rich seeds hold their quality better cold'],
  ['Walnuts, peanuts, cocoa nibs', 'Airtight jars or deli containers', 'Fridge or freezer', 'Less rancidity, easy grab-and-pour'],
  ['Pearl couscous, lentils, oats', 'Large airtight canisters', 'Pantry', 'Pourable and easy to measure'],
  ['Frozen berries and spinach', 'Original bag plus a bag clip', 'Freezer', 'No gain from decanting; saves freezer space'],
  ['Spices', 'Small jars or the original bottles', 'Pantry', 'Label the tops, not just the sides'],
];
