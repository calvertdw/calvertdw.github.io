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
  cinnamon:     { n: 'Cinnamon',        cat: 'spice', staple: true },
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
      'Skip the literal Blueprint acid component to start — it calls for about 1 tbsp apple-cider vinegar plus fresh lime juice, and both are common reflux triggers. Get brightness from herbs, ginger if tolerated, or Greek yogurt mixed with dill and cumin instead.',
      'If you want to test lime or vinegar later, do it in a <em>lunch</em> portion, start with a teaspoon, and watch what happens. Never test at dinner.',
      'Also worth easing into rather than starting with: raw garlic, large amounts of fermented vegetables, and hot spice.',
      'Baby bellas are a fine stand-in for shiitake or maitake.',
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
      { n: 'Fresh cilantro', q: 0.25, u: 'bunch', d: 'A little fresh cilantro', cat: 'produce' },
      { n: 'Extra-virgin olive oil', q: 2, u: 'tsp', d: '1–2 tsp extra-virgin olive oil', cat: 'pantry' },
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
      'For reflux, leave off the jalapeño, lemon, lime, and tomato at first. Johnson’s original has all four.',
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
      { n: 'Whole-grain tortillas', q: 1, u: 'ea', d: '1 whole-grain tortilla, if you want it wrapped', cat: 'grain', opt: true },
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
      { n: 'Whole-grain tortillas', q: 1, u: 'ea', d: '1 whole-grain wrap or pita', cat: 'grain' },
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
];

/* The 7-day rotation: 3 Super Veggie lunches, 2 sweet-potato-or-salmon dinners,
   2 familiar chicken/turkey dinners, 1 red-meat meal, shake every other morning. */
const WEEKLY_PLAN = [
  { day: 'Monday',    breakfast: 'everyday-shake',       lunch: 'super-veggie-bowl',    dinner: 'turkey-burger-plate' },
  { day: 'Tuesday',   breakfast: 'yogurt-oat-bowl',      lunch: 'chicken-lentil-bowl',  dinner: 'sweet-potato-bowl' },
  { day: 'Wednesday', breakfast: 'berry-green-smoothie', lunch: 'super-veggie-bowl',    dinner: 'salmon-veg-grain' },
  { day: 'Thursday',  breakfast: 'yogurt-oat-bowl',      lunch: 'greek-yogurt-wrap',    dinner: 'turkey-taco-bowl' },
  { day: 'Friday',    breakfast: 'everyday-shake',       lunch: 'chicken-lentil-bowl',  dinner: 'turkey-burger-plate' },
  { day: 'Saturday',  breakfast: 'berry-green-smoothie', lunch: 'cottage-cheese-plate', dinner: 'steak-burrito-bowl' },
  { day: 'Sunday',    breakfast: 'yogurt-oat-bowl',      lunch: 'super-veggie-bowl',    dinner: 'pearl-couscous-bowl' },
];

const PROTEIN_SCHEDULE = [
  ['Breakfast', '35–45 g', 'The shake with a full whey serving, or eggs plus the yogurt-oat bowl'],
  ['Lunch', '45–55 g', 'Chicken-lentil bowl, Super Veggie with chicken, or a salmon yogurt wrap'],
  ['Post-training snack', '25–35 g', 'Greek yogurt, skyr, cottage cheese, or whey'],
  ['Dinner', '40–55 g', 'Chicken, turkey, fish, or lean beef plus vegetables and legumes'],
];

const STORAGE_PLAN = [
  ['Whey / pumpkin protein, PB powder', 'Wide-mouth screw-top container or the original tub', 'Pantry', 'Large opening; keep a dedicated scoop inside'],
  ['Ground flax, chia, hemp hearts', 'Small airtight jars', 'Fridge or freezer', 'Fat-rich seeds hold their quality better cold'],
  ['Walnuts, peanuts, cocoa nibs', 'Airtight jars or deli containers', 'Fridge or freezer', 'Less rancidity, easy grab-and-pour'],
  ['Pearl couscous, lentils, oats', 'Large airtight canisters', 'Pantry', 'Pourable and easy to measure'],
  ['Frozen berries and spinach', 'Original bag plus a bag clip', 'Freezer', 'No gain from decanting; saves freezer space'],
  ['Spices', 'Small jars or the original bottles', 'Pantry', 'Label the tops, not just the sides'],
];
