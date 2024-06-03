import { toLower } from 'lodash';

export const containValidator = (modifiedProductDataPoints: any) => {
  const current_allergen_freeOf =
    modifiedProductDataPoints['allergen']['allergen_freeOf'] || [];

  const current_allergen_contain =
    modifiedProductDataPoints['allergen']['allergen_contain'] || [];

  const current_product_does_not_contain =
    modifiedProductDataPoints['contain_and_notContain'][
      'product_does_not_contain'
    ] || [];

  const current_product_contain =
    modifiedProductDataPoints['contain_and_notContain']['product_contain'] ||
    [];

  validateContainOrDoesNotContain(
    [...current_allergen_freeOf, ...current_product_does_not_contain],
    modifiedProductDataPoints,
    'validated_product_does_not_contain'
  );

  validateContainOrDoesNotContain(
    [...current_allergen_contain, ...current_product_contain],
    modifiedProductDataPoints,
    'validated_product_contain'
  );
};

const validateContainOrDoesNotContain = (
  ingredientList: any,
  modifiedProductDataPoints: any,
  dataPointKey: string
) => {
  let validated_contain_field = [] as any;

  ingredientList.forEach((ingredientName: string) => {
    const lowercaseIngredientName = toLower(ingredientName);
    const matchedAllergens = checkMatchContain(lowercaseIngredientName);
    if (matchedAllergens?.length > 0) {
      validated_contain_field = [
        ...validated_contain_field,
        ...matchedAllergens,
      ];
    }
  });

  modifiedProductDataPoints['contain_and_notContain'][dataPointKey] = [
    ...new Set(validated_contain_field),
  ];
};

const checkMatchContain = (ingredientName: string) => {
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
    'artificial preservatives': ['artificial preservatives'],
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
    'chemical preservatives': ['chemical preservatives'],
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
    'natural flavors': ['natural flavors'],
    'natural ingredients': ['natural ingredients'],
    'natural preservatives': ['natural preservatives'],
    'nitrates/nitrites': ['nitrates/nitrites'],
    'omega fatty acids': ['omega fatty acids'],
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
    preservatives: ['preservatives'],
    'rbgh/bst': ['rbgh/bst'],
    rennet: ['rennet'],
    salicylates: ['salicylates'],
    'sea salt': ['sea salt'],
    'shells/ shell pieces': ['shells/ shell pieces'],
    silicone: ['silicone'],
    'sles ( sodium laureth sulfate)': ['sles ( sodium laureth sulfate)'],
    'sls ( sodium lauryl sulfate )': ['sls ( sodium lauryl sulfate )'],
    stabilizers: ['stabilizers'],
    probiotics: ['probiotics'],
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
    'synthetic preservatives': ['synthetic preservatives'],
    synthetics: ['synthetics'],
    'thc / tetrahydrocannabinol': ['thc / tetrahydrocannabinol'],
    'toxic pesticides': ['toxic pesticides'],
    triclosan: ['triclosan'],
    'vegan ingredients': ['vegan ingredients'],
    'vegetarian ingredients': ['vegetarian ingredients'],
    yeast: ['yeast'],
    yolks: ['yolks'],
  };

  let matchContains = [] as any;

  Object.entries(CONTAIN_MAPPING).map((keyNvalue: any) => {
    const [containEnum, possibleValueList] = keyNvalue;

    possibleValueList.forEach((possibleValueItem: string) => {
      if (ingredientName.includes(possibleValueItem)) {
        matchContains.push(containEnum);
      }
    });
  });

  return matchContains;
};
