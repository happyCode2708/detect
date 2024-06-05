import { lowerCase } from 'lodash';

export const containValidator = async (modifiedProductDataPoints: any) => {
  const current_allergen_freeOf =
    modifiedProductDataPoints['allergen']['allergen_freeOf'][
      'allergen_freeOf_list'
    ] || [];

  const current_allergen_contain =
    modifiedProductDataPoints['allergen']['allergen_contain'][
      'allergen_contain_list'
    ] || [];

  const current_allergen_containOnEquipment =
    modifiedProductDataPoints['allergen']['allergen_containOnEquipment'][
      'allergen_containOnEquipment_list'
    ] || [];

  const current_product_does_not_contain =
    modifiedProductDataPoints['contain_and_notContain'][
      'product_does_not_contain'
    ] || [];

  const current_product_contain =
    modifiedProductDataPoints['contain_and_notContain']['product_contain'] ||
    [];

  const process = modifiedProductDataPoints['process'] || [];

  const { other_things } = process;

  const ingredients_group = modifiedProductDataPoints?.[
    'ingredients_group'
  ]?.reduce(
    (accumulator: string[], currentValue: { ingredients: string[] }) => {
      const nextIngredientList = [...accumulator, ...currentValue?.ingredients];

      return [...new Set(nextIngredientList)];
    },
    []
  );

  console.log('ingredient  groups', ingredients_group);

  await validateContainOrDoesNotContain(
    [...current_allergen_freeOf, ...current_product_does_not_contain],
    modifiedProductDataPoints,
    'validated_product_does_not_contain'
  );

  console.log('contain -- 1');

  await validateContainOrDoesNotContain(
    [
      ...current_allergen_contain,
      ...current_product_contain,
      ...ingredients_group,
      ...other_things,
    ],
    modifiedProductDataPoints,
    'validated_product_contain'
  );

  console.log('contain -- 2');

  console.log('contain validator -- finish');
};

const validateContainOrDoesNotContain = async (
  ingredientList: string[],
  modifiedProductDataPoints: any,
  dataPointKey: string
) => {
  let validated_fields = [] as any;

  for (const ingredientName of ingredientList) {
    const lowercaseIngredientName = lowerCase(ingredientName);
    const matchedAllergens = await checkMatch(lowercaseIngredientName);
    if (matchedAllergens?.length > 0) {
      validated_fields = [...validated_fields, ...matchedAllergens];
    }
  }

  let currentValues =
    modifiedProductDataPoints['contain_and_notContain']?.[dataPointKey] || [];

  modifiedProductDataPoints['contain_and_notContain'][dataPointKey] = [
    ...currentValues,
    ...new Set(validated_fields),
  ];
};

const checkMatch = async (ingredientName: string) => {
  let matchContains = [] as any;

  for (const keyNvalue of Object.entries(CONTAIN_MAPPING)) {
    const foundMatchs = await promiseCheckEachEnum(keyNvalue, ingredientName);
    matchContains = [...matchContains, ...foundMatchs];
  }

  console.log('matchContains', matchContains);

  return Promise.resolve(matchContains);
};

const promiseCheckEachEnum = async (keyNvalue: any, ingredientName: string) => {
  const [containEnum, possibleValueList] = keyNvalue;
  let foundMatches = [] as any;

  possibleValueList.forEach((possibleValueItem: string) => {
    if (ingredientName.includes(possibleValueItem)) {
      if (
        [
          'added preservatives',
          'artificial preservatives',
          'chemical preservatives',
          'natural preservatives',
          'synthetic preservatives',
          'preservatives',
        ].includes(containEnum)
      ) {
        if (!possibleValueList.includes(ingredientName)) {
          return;
        }
      }

      foundMatches.push(containEnum);
    }
  });

  return Promise.resolve(foundMatches);
};

const CONTAIN_MAPPING = {
  '1,4-dioxane': ['1,4-dioxane'],
  'active yeast': ['active yeast'],
  'added antibiotics': ['added antibiotics'],
  'added colors': ['added colors'],
  'added dyes': ['added dyes'],
  'added flavors': ['added flavors'],
  'added fragrances': ['added fragrances'],
  'added hormones': ['added hormones'],
  'added nitrates': ['added nitrates'],
  'added nitrites': ['added nitrites'],
  'added preservatives': ['added preservatives'],
  'artificial preservatives': ['artificial preservatives'],
  'chemical preservatives': ['chemical preservatives'],
  'natural preservatives': ['natural preservatives'],
  'synthetic preservatives': ['synthetic preservatives'],
  preservatives: ['preservatives'],
  additives: ['additives'],
  alcohol: ['alcohol'],
  allergen: ['allergen'],
  aluminum: ['aluminum'],
  'amino acids': ['amino acids'],
  ammonia: ['ammonia'],
  'animal by-products': ['animal by-products'],
  'animal derivatives': ['animal derivatives'],
  'animal ingredients': ['animal ingredients'],
  'animal products': ['animal products'],
  'animal rennet': ['animal rennet'],
  antibiotics: ['antibiotics'],
  'artificial additives': ['artificial additives'],
  'artificial colors': ['artificial colors'],
  'artificial dyes': ['artificial dyes'],
  'artificial flavors': ['artificial flavors'],
  'artificial fragrance': ['artificial fragrance'],
  'artificial ingredients': ['artificial ingredients'],
  'binders and/or fillers': ['binders and/or fillers'],
  bleach: ['bleach'],
  'bpa (bisphenol-a)': ['bpa (bisphenol-a)'],
  'butylene glycol': ['butylene glycol'],
  'by-products': ['by-products'],
  caffeine: ['caffeine'],
  carrageenan: ['carrageenan'],
  casein: ['casein'],
  'cbd / cannabidiol': ['cbd / cannabidiol'],
  'chemical additives': ['chemical additives'],
  'chemical colors': ['chemical colors'],
  'chemical dyes': ['chemical dyes'],
  'chemical flavors': ['chemical flavors'],
  'chemical fragrances': ['chemical fragrances'],
  'chemical ingredients': ['chemical ingredients'],
  'chemical sunscreens': ['chemical sunscreens'],
  chemicals: ['chemicals'],
  chlorine: ['chlorine'],
  cholesterol: ['cholesterol'],
  coatings: ['coatings'],
  'corn fillers': ['corn fillers'],
  'cottonseed oil': ['cottonseed oil'],
  dyes: ['dyes'],
  edta: ['edta'],
  emulsifiers: ['emulsifiers'],
  erythorbates: ['erythorbates'],
  'expeller-pressed oils': ['expeller-pressed oils'],
  fillers: ['fillers'],
  fluoride: ['fluoride'],
  formaldehyde: ['formaldehyde'],
  fragrances: ['fragrances'],
  grain: ['grain'],
  hexane: ['hexane'],
  hormones: ['hormones'],
  'hydrogenated oils': ['hydrogenated oils'],
  'kitniyos / kitniyot (legumes)': ['kitniyos / kitniyot (legumes)'],
  lactose: ['lactose'],
  latex: ['latex'],
  msg: ['msg'],
  'natural additives': ['natural additives'],
  'natural colors': ['natural colors'],
  'natural dyes': ['natural dyes'],
  'natural flavors': ['natural flavors', 'natural flavor'],
  'natural ingredients': ['natural ingredients'],
  'nitrates/nitrites': ['nitrates/nitrites'],
  'omega fatty acids': ['omega fatty acids', 'omega'],
  paba: ['paba'],
  'palm oil': ['palm oil'],
  parabens: ['parabens'],
  pesticides: ['pesticides'],
  'petro chemical': ['petro chemical'],
  petrolatum: ['petrolatum'],
  'petroleum byproducts': ['petroleum byproducts'],
  phosphates: ['phosphates'],
  phosphorus: ['phosphorus'],
  phthalates: ['phthalates'],
  pits: ['pits'],
  'rbgh/bst': ['rbgh/bst', 'bst', 'rbst'],
  rennet: ['rennet'],
  salicylates: ['salicylates'],
  'sea salt': ['sea salt'],
  'shells/ shell pieces': [
    'shells/ shell pieces',
    'shells',
    'shell pieces',
    'shell',
    'nut shell fragments',
  ],
  silicone: ['silicone'],
  'sles ( sodium laureth sulfate)': ['sles ( sodium laureth sulfate)'],
  'sls ( sodium lauryl sulfate )': ['sls ( sodium lauryl sulfate )'],
  stabilizers: ['stabilizers'],
  probiotics: ['probiotics', 'probiotic'],
  starch: ['starch'],
  sulfates: ['sulfates'],
  sulfides: ['sulfides'],
  'sulfites / sulphites': ['sulfites / sulphites'],
  'sulfur dioxide': ['sulfur dioxide'],
  'synthetic additives': ['synthetic additives'],
  'synthetic colors': ['synthetic colors'],
  'synthetic dyes': ['synthetic dyes'],
  'synthetic flavors': ['synthetic flavors'],
  'synthetic fragrance': ['synthetic fragrance'],
  'synthetic ingredients': ['synthetic ingredients'],
  synthetics: ['synthetics'],
  'thc / tetrahydrocannabinol': ['thc / tetrahydrocannabinol'],
  'toxic pesticides': ['toxic pesticides'],
  triclosan: ['triclosan'],
  'vegan ingredients': ['vegan ingredients'],
  'vegetarian ingredients': ['vegetarian ingredients'],
  yeast: ['yeast'],
  yolks: ['yolks'],
};
