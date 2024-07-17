import { toLower } from 'lodash';
import { NON_CERTIFICATE_CLAIMS_MAP } from './nonCertifierClaimValidate';

export const containAndNotContainClaimValidate = async (
  modifiedProductDataPoints: any,
  ocrClaims: any
) => {
  const claim_list =
    modifiedProductDataPoints?.['attributes']?.['containAndNotContain'] || [];

  await validate(claim_list, modifiedProductDataPoints);

  console.log('finish validate contain and does not contain');
};

const validate = async (
  analysisList: any[],
  modifiedProductDataPoints: any
) => {
  for (const analysisItem of analysisList) {
    let valid = await check(analysisItem);

    // if (valid === 'from non-certificate claim') {
    //   const claimValue = analysisItem['claim'];

    //   const currentValues =
    //     modifiedProductDataPoints?.['attributes']?.[
    //       'validated_nonCertificateClaims'
    //     ] || [];

    //   modifiedProductDataPoints['attributes'][
    //     'validated_nonCertificateClaims'
    //   ] = Array.from(
    //     new Set([...currentValues, NON_CERTIFICATE_CLAIMS_MAP?.[claimValue]])
    //   );

    //   return;
    // }

    // if (valid === 'from sugar claim') {
    //   const claimValue = analysisItem['claim'];

    //   const currentValues =
    //     modifiedProductDataPoints?.['attributes']?.['validated_sugarClaims'] ||
    //     [];

    //   if (dataPointKey === 'validated_notContain') {
    //     modifiedProductDataPoints['attributes']['validated_sugarClaims'] = [
    //       ...currentValues,
    //       'no contain ' + claimValue,
    //     ];
    //     return;
    //   }

    //   if (dataPointKey === 'validated_contain') {
    //     modifiedProductDataPoints['attributes']['validated_sugarClaims'] = [
    //       ...currentValues,
    //       'contain ' + claimValue,
    //     ];
    //     return;
    //   }

    //   return;
    // }

    if (valid === true) {
      const { claim: claimValue, statement } = analysisItem;

      const dataPointKey = DATA_POINT_KEY_MAP['validated_contain'].includes(
        toLower(statement)
      )
        ? 'validated_contain'
        : DATA_POINT_KEY_MAP['validated_notContain'].includes(
            toLower(statement)
          )
        ? 'validated_notContain'
        : 'non_validated_containAndNotContain';

      const currentValues =
        modifiedProductDataPoints?.['attributes']?.[dataPointKey] || [];

      console.log('claim value', claimValue);
      console.log('statement', statement);
      console.log('datapointKey', dataPointKey);
      console.log(
        'search in map',
        CONTAIN_AND_NOT_CONTAIN_MAP?.[toLower(claimValue)]
      );

      modifiedProductDataPoints['attributes'][dataPointKey] = Array.from(
        new Set([
          ...currentValues,
          CONTAIN_AND_NOT_CONTAIN_MAP?.[toLower(claimValue)],
        ])
      );
    }
  }
};

// const validate_old = async (
//   analysisList: any[],
//   modifiedProductDataPoints: any,
//   dataPointKey: string,
//   ocrClaims: any
// ) => {
//   for (const analysisItem of analysisList) {
//     let valid = await check(analysisItem, ocrClaims);

//     if (valid === 'from non-certificate claim') {
//       const claimValue = analysisItem['claim'];

//       const currentValues =
//         modifiedProductDataPoints?.['attributes']?.[
//           'validated_nonCertificateClaims'
//         ] || [];

//       modifiedProductDataPoints['attributes'][
//         'validated_nonCertificateClaims'
//       ] = Array.from(
//         new Set([...currentValues, NON_CERTIFICATE_CLAIMS_MAP?.[claimValue]])
//       );

//       return;
//     }

//     if (valid === 'from sugar claim') {
//       const claimValue = analysisItem['claim'];

//       const currentValues =
//         modifiedProductDataPoints?.['attributes']?.['validated_sugarClaims'] ||
//         [];

//       if (dataPointKey === 'validated_notContain') {
//         modifiedProductDataPoints['attributes']['validated_sugarClaims'] = [
//           ...currentValues,
//           'no contain ' + claimValue,
//         ];
//         return;
//       }

//       if (dataPointKey === 'validated_contain') {
//         modifiedProductDataPoints['attributes']['validated_sugarClaims'] = [
//           ...currentValues,
//           'contain ' + claimValue,
//         ];
//         return;
//       }

//       return;
//     }

//     if (valid === true) {
//       const claimValue = analysisItem['claim'];

//       const currentValues =
//         modifiedProductDataPoints?.['attributes']?.[dataPointKey] || [];

//       modifiedProductDataPoints['attributes'][dataPointKey] = [
//         ...currentValues,
//         CONTAIN_AND_NOT_CONTAIN_MAP?.[claimValue],
//       ];
//     }
//   }
// };

const check = async (
  analysisItem: any
  // ocrClaims: any
): Promise<boolean | string> => {
  const { claim, mentioned, source, reason } = analysisItem;

  if (!claim) return Promise.resolve(false);

  if (mentioned === 'no' || mentioned === 'unknown') {
    return Promise.resolve(false);
  }

  //! temp remove ingredient list condition
  // if (
  //   (source?.includes('ingredient list') ||
  //     source?.includes('nutrition fact')) &&
  //   !source?.includes('marketing text on product')
  // ) {
  //   return Promise.resolve(false);
  // }
  //? replacement
  if (source?.includes('nutrition fact panel')) {
    return Promise.resolve(false);
  }

  // if (EXTRA_FROM_NON_CERTIFIED_CLAIM.includes(claim)) {
  //   return Promise.resolve('from non-certificate claim');
  // }

  // if (EXTRA_FROM_SUGAR_CLAIM.includes(claim)) {
  //   return Promise.resolve('from sugar claim');
  // }

  if (!CONTAIN_AND_NOT_CONTAIN_CLAIMS.includes(toLower(claim))) {
    return Promise.resolve(false);
  }

  if (
    CONTAIN_AND_NOT_CONTAIN_REASON?.[toLower(claim)]
      ?.map((word: string) => {
        if (toLower(reason)?.includes(word)) return true;

        return false;
      })
      .some((result: boolean) => result === false)
  ) {
    return Promise.resolve(false);
  } else {
    //* exceptional cases
    if (toLower(claim) === 'alcohol' && toLower(reason)?.includes('sugar')) {
      //? it could be about 'alcohol sugar' so must return false
      return Promise.resolve(false);
    }
  }

  //! temp remove ingredient list condition
  // if (source.includes('marketing text on product') && mentioned === 'yes') {
  //   return Promise.resolve(true);
  // }
  //? replacement
  if (mentioned === 'yes') {
    return Promise.resolve(true);
  }

  return Promise.resolve(false);
};

const DATA_POINT_KEY_MAP = {
  validated_contain: [
    'contain',
    'may contain',
    'other',
    'naturally flavored',
    'naturally',
  ],
  validated_notContain: [
    'free of',
    'free from',
    'no contain',
    'made without',
    'does not contain',
    'no',
    'free',
    'made without',
    'do not use',
  ],
};

const CONTAIN_AND_NOT_CONTAIN_REASON = {
  '1,4-dioxane': ['1,4-dioxane'],
  'active yeast': ['active', 'yeast'],
  'added antibiotics': ['added', 'antibiotic'],
  'added colors': ['added', 'color'],
  'added dyes': ['added', 'dye'],
  'added flavors': ['added', 'flavor'],
  'added fragrances': ['added', 'fragrance'],
  'added hormones': ['added', 'hormone'],
  'added nitrates': ['added', 'nitrate'],
  'added nitrites': ['added', 'nitrite'],
  'added preservatives': ['added', 'preservative'],
  additives: ['additive'],
  alcohol: ['alcohol'],
  allergen: ['allergen'],
  aluminum: ['aluminum'],
  'amino acids': ['amino', 'acid'],
  ammonia: ['ammonia'],
  'animal by-products': ['animal', 'by-product'],
  'animal derivatives': ['animal', 'derivative'],
  'animal ingredients': ['animal', 'ingredient'],
  'animal products': ['animal', 'product'],
  'animal rennet': ['animal', 'rennet'],
  antibiotics: ['antibiotic'],
  'artificial additives': ['artificial', 'additive'],
  'artificial colors': ['artificial', 'color'],
  'artificial dyes': ['artificial', 'dye'],
  'artificial flavors': ['artificial', 'flavor'],
  'artificial fragrance': ['artificial', 'fragrance'],
  'artificial ingredients': ['artificial', 'ingredient'],
  'artificial preservatives': ['artificial', 'preservative'],
  'binders and/or fillers': ['binder', 'and/or', 'filler'],
  bleach: ['bleach'],
  'bpa (bisphenol-a)': ['bpa', 'bisphenol-a'],
  'butylene glycol': ['butylene', 'glycol'],
  'by-products': ['by-product'],
  caffeine: ['caffeine'],
  carrageenan: ['carrageenan'],
  casein: ['casein'],
  'cbd / cannabidiol': ['cbd', 'cannabidiol'],
  cbd: ['cbd'],
  cannabidiol: ['cannabidiol'],
  'chemical additives': ['chemical', 'additive'],
  'chemical colors': ['chemical', 'color'],
  'chemical dyes': ['chemical', 'dye'],
  'chemical flavors': ['chemical', 'flavor'],
  'chemical fragrances': ['chemical', 'fragrance'],
  'chemical ingredients': ['chemical', 'ingredient'],
  'chemical preservatives': ['chemical', 'preservative'],
  'chemical sunscreens': ['chemical', 'sunscreen'],
  chemicals: ['chemical'],
  chlorine: ['chlorine'],
  cholesterol: ['cholesterol'],
  coatings: ['coating'],
  'corn fillers': ['corn', 'filler'],
  'cottonseed oil': ['cottonseed', 'oil'],
  dyes: ['dye'],
  edta: ['edta'],
  emulsifiers: ['emulsifier'],
  erythorbates: ['erythorbate'],
  'expeller-pressed oils': ['expeller-pressed', 'oil'],
  fillers: ['filler'],
  fluoride: ['fluoride'],
  formaldehyde: ['formaldehyde'],
  fragrances: ['fragrance'],
  grain: ['grain'],
  hexane: ['hexane'],
  hormones: ['hormone'],
  'hydrogenated oils': ['hydrogenated', 'oil'],
  kitniyos: ['kitniyos'],
  kitniyot: ['kitniyot'],
  lactose: ['lactose'],
  latex: ['latex'],
  msg: ['msg'],
  'natural additives': ['natural', 'additive'],
  'natural colors': ['natural', 'color'],
  'natural dyes': ['natural', 'dye'],
  'natural flavors or naturally flavored': ['natural', 'flavor'],
  'natural flavors': ['natural', 'flavor'],
  'naturally flavored': ['natural', 'flavor'],
  'natural ingredients': ['natural', 'ingredient'],
  'natural preservatives': ['natural', 'preservative'],
  nitrates: ['nitrate'],
  nitrites: ['nitrite'],
  'omega fatty acids': ['omega'],
  paba: ['paba'],
  'palm oil': ['palm', 'oil'],
  parabens: ['paraben'],
  pesticides: ['pesticide'],
  'petro chemical': ['petro', 'chemical'],
  petrolatum: ['petrolatum'],
  'petroleum byproducts': ['petroleum', 'byproduct'],
  phosphates: ['phosphate'],
  phosphorus: ['phosphorus'],
  phthalates: ['phthalate'],
  pits: ['pit'],
  preservatives: ['preservative'],
  probiotics: ['probiotic'],
  rbgh: ['rbgh'],
  rbst: ['rbst'],
  rennet: ['rennet'],
  salicylates: ['salicylate'],
  'sea salt': ['sea', 'salt'],
  'shells/ shell pieces': ['shell', 'shell piece'],
  silicone: ['silicone'],
  'sles (sodium laureth sulfate)': ['sles'],
  'sls (sodium lauryl sulfate)': ['sls'],
  stabilizers: ['stabilizer'],
  starch: ['starch'],
  sulfates: ['sulfate'],
  sulfides: ['sulfide'],
  sulfites: ['sulfite'],
  sulphites: ['sulphite'],
  'sulfur dioxide': ['sulfur', 'dioxide'],
  'synthetic additives': ['synthetic', 'additive'],
  'synthetic colors': ['synthetic', 'color'],
  'synthetic dyes': ['synthetic', 'dye'],
  'synthetic flavors': ['synthetic', 'flavor'],
  'synthetic fragrance': ['synthetic', 'fragrance'],
  'synthetic ingredients': ['synthetic', 'ingredient'],
  'synthetic preservatives': ['synthetic', 'preservative'],
  synthetics: ['synthetic'],
  thc: ['thc'],
  tetrahydrocannabinol: ['tetrahydrocannabinol'],
  'toxic pesticides': ['toxic', 'pesticide'],
  triclosan: ['triclosan'],
  'vegan ingredients': ['vegan', 'ingredient'],
  'vegetarian ingredients': ['vegetarian', 'ingredient'],
  yeast: ['yeast'],
  yolks: ['yolk'],
} as any;

const CONTAIN_AND_NOT_CONTAIN_CLAIMS = [
  '1,4-dioxane',
  'active yeast',
  'added antibiotics',
  'added colors',
  'added dyes',
  'added flavors',
  'added fragrances',
  'added hormones',
  'added nitrates',
  'added nitrites',
  'added preservatives',
  'additives',
  'alcohol',
  'allergen',
  'aluminum',
  'amino acids',
  'ammonia',
  'animal by-products',
  'animal derivatives',
  'animal ingredients',
  'animal products',
  'animal rennet',
  'antibiotics',
  'artificial additives',
  'artificial colors',
  'artificial dyes',
  'artificial flavors',
  'artificial fragrance',
  'artificial ingredients',
  'artificial preservatives',
  'binders and/or fillers',
  'bleach',
  'bpa (bisphenol-a)',
  'butylene glycol',
  'by-products',
  'caffeine',
  'carrageenan',
  'casein',
  'cbd / cannabidiol',
  'cbd ',
  'cannabidiol',
  'chemical additives',
  'chemical colors',
  'chemical dyes',
  'chemical flavors',
  'chemical fragrances',
  'chemical ingredients',
  'chemical preservatives',
  'chemical sunscreens',
  'chemicals',
  'chlorine',
  'cholesterol',
  'coatings',
  'corn fillers',
  'cottonseed oil',
  'dyes',
  'edta',
  'emulsifiers',
  'erythorbates',
  'expeller-pressed oils',
  'fillers',
  'fluoride',
  'formaldehyde',
  'fragrances',
  'grain',
  'hexane',
  'hormones',
  'hydrogenated oils',
  'kitniyos / kitniyot (legumes)',
  'kitniyos',
  'kitniyot',
  'lactose',
  'latex',
  'msg',
  'natural additives',
  'natural colors',
  'natural dyes',
  'natural flavors or naturally flavored',
  'natural flavors',
  'naturally flavored',
  'natural ingredients',
  'natural preservatives',
  'nitrates/nitrites',
  'nitrates',
  'nitrites',
  'omega fatty acids',
  'paba',
  'palm oil',
  'parabens',
  'pesticides',
  'petro chemical',
  'petrolatum',
  'petroleum byproducts',
  'phosphates',
  'phosphorus',
  'phthalates',
  'pits',
  'preservatives',
  'probiotics',
  'rbgh/bst',
  'rbgh',
  'rbst',
  'rennet',
  'salicylates',
  'sea salt',
  'shells/ shell pieces',
  'shells pieces',
  'shell pieces',
  'silicone',
  'sles (sodium laureth sulfate)',
  'sls (sodium lauryl sulfate)',
  'stabilizers',
  'starch',
  'sulfates',
  'sulfides',
  'sulfites / sulphites',
  'sulfites',
  'sulphites',
  'sulfur dioxide',
  'synthetic additives',
  'synthetic colors',
  'synthetic dyes',
  'synthetic flavors',
  'synthetic fragrance',
  'synthetic ingredients',
  'synthetic preservatives',
  'synthetics',
  'thc / tetrahydrocannabinol',
  'thc',
  'tetrahydrocannabinol',
  'toxic pesticides',
  'triclosan',
  'vegan ingredients',
  'vegetarian ingredients',
  'yeast',
  'yolks',
  //? extra
  'synthetic flavoring',
  'synthetic coloring',
];

const CONTAIN_AND_NOT_CONTAIN_MAP = {
  '1,4-dioxane': '1,4-dioxane',
  'active yeast': 'active yeast',
  'added antibiotics': 'added antibiotics',
  'added colors': 'added colors',
  'added dyes': 'added dyes',
  'added flavors': 'added flavors',
  'added fragrances': 'added fragrances',
  'added hormones': 'added hormones',
  'added nitrates': 'added nitrates',
  'added nitrites': 'added nitrites',
  'added preservatives': 'added preservatives',
  additives: 'additives',
  alcohol: 'alcohol',
  allergen: 'allergen',
  aluminum: 'aluminum',
  'amino acids': 'amino acids',
  ammonia: 'ammonia',
  'animal by-products': 'animal by-products',
  'animal derivatives': 'animal derivatives',
  'animal ingredients': 'animal ingredients',
  'animal products': 'animal products',
  'animal rennet': 'animal rennet',
  antibiotics: 'antibiotics',
  'artificial additives': 'artificial additives',
  'artificial colors': 'artificial colors',
  'artificial dyes': 'artificial dyes',
  'artificial flavors': 'artificial flavors',
  'artificial fragrance': 'artificial fragrance',
  'artificial ingredients': 'artificial ingredients',
  'artificial preservatives': 'artificial preservatives',
  'binders and/or fillers': 'binders and/or fillers',
  bleach: 'bleach',
  'bpa (bisphenol-a)': 'bpa (bisphenol-a)',
  'butylene glycol': 'butylene glycol',
  'by-products': 'by-products',
  caffeine: 'caffeine',
  carrageenan: 'carrageenan',
  casein: 'casein',
  'cbd / cannabidiol': 'cbd / cannabidiol',
  cbd: 'cbd / cannabidiol',
  cannabidiol: 'cbd / cannabidiol',
  'chemical additives': 'chemical additives',
  'chemical colors': 'chemical colors',
  'chemical dyes': 'chemical dyes',
  'chemical flavors': 'chemical flavors',
  'chemical fragrances': 'chemical fragrances',
  'chemical ingredients': 'chemical ingredients',
  'chemical preservatives': 'chemical preservatives',
  'chemical sunscreens': 'chemical sunscreens',
  chemicals: 'chemicals',
  chlorine: 'chlorine',
  cholesterol: 'cholesterol',
  coatings: 'coatings',
  'corn fillers': 'corn fillers',
  'cottonseed oil': 'cottonseed oil',
  dyes: 'dyes',
  edta: 'edta',
  emulsifiers: 'emulsifiers',
  erythorbates: 'erythorbates',
  'expeller-pressed oils': 'expeller-pressed oils',
  fillers: 'fillers',
  fluoride: 'fluoride',
  formaldehyde: 'formaldehyde',
  fragrances: 'fragrances',
  grain: 'grain',
  hexane: 'hexane',
  hormones: 'hormones',
  'hydrogenated oils': 'hydrogenated oils',
  'kitniyos / kitniyot (legumes)': 'kitniyos / kitniyot (legumes)',
  kitniyos: 'kitniyos / kitniyot (legumes)',
  kitniyot: 'kitniyos / kitniyot (legumes)',
  lactose: 'lactose',
  latex: 'latex',
  msg: 'msg',
  'natural additives': 'natural additives',
  'natural colors': 'natural colors',
  'natural dyes': 'natural dyes',
  //? natural flavors
  'natural flavors or naturally flavored': 'natural flavors',
  'natural flavors': 'natural flavors',
  'naturally flavored': 'natural flavors',
  'natural ingredients': 'natural ingredients',
  'natural preservatives': 'natural preservatives',
  'nitrates/nitrites': 'nitrates/nitrites',
  nitrates: 'nitrates/nitrites',
  nitrites: 'nitrates/nitrites',
  'omega fatty acids': 'omega fatty acids',
  paba: 'paba',
  'palm oil': 'palm oil',
  parabens: 'parabens',
  pesticides: 'pesticides',
  'petro chemical': 'petro chemical',
  petrolatum: 'petrolatum',
  'petroleum byproducts': 'petroleum byproducts',
  phosphates: 'phosphates',
  phosphorus: 'phosphorus',
  phthalates: 'phthalates',
  pits: 'pits',
  preservatives: 'preservatives',
  probiotics: 'probiotics',
  'rbgh/bst': 'rbgh/bst',
  rbgh: 'rbgh/bst',
  rbst: 'rbgh/bst',
  rennet: 'rennet',
  salicylates: 'salicylates',
  'sea salt': 'sea salt',
  'shells/ shell pieces': 'shells/ shell pieces',
  'shells pieces': 'shells/ shell pieces',
  'shell pieces': 'shells/ shell pieces',
  silicone: 'silicone',
  'sles (sodium laureth sulfate)': 'sles (sodium laureth sulfate)',
  'sls (sodium lauryl sulfate)': 'sls (sodium lauryl sulfate)',
  stabilizers: 'stabilizers',
  starch: 'starch',
  sulfates: 'sulfates',
  sulfides: 'sulfides',
  'sulfites / sulphites': 'sulfites / sulphites',
  sulfites: 'sulfites / sulphites',
  sulphites: 'sulfites / sulphites',
  'sulfur dioxide': 'sulfur dioxide',
  'synthetic additives': 'synthetic additives',
  'synthetic colors': 'synthetic colors',
  'synthetic dyes': 'synthetic dyes',
  'synthetic flavors': 'synthetic flavors',
  'synthetic fragrance': 'synthetic fragrance',
  'synthetic ingredients': 'synthetic ingredients',
  'synthetic preservatives': 'synthetic preservatives',
  synthetics: 'synthetics',
  'thc / tetrahydrocannabinol': 'thc / tetrahydrocannabinol',
  thc: 'thc / tetrahydrocannabinol',
  tetrahydrocannabinol: 'thc / tetrahydrocannabinol',
  'toxic pesticides': 'toxic pesticides',
  triclosan: 'triclosan',
  'vegan ingredients': 'vegan ingredients',
  'vegetarian ingredients': 'vegetarian ingredients',
  yeast: 'yeast',
  yolks: 'yolks',
} as any;

const EXTRA_FROM_NON_CERTIFIED_CLAIM = [
  'low carbohydrate or low-carb',
  'low - carb',
  'low-carb',
];

const EXTRA_FROM_SUGAR_CLAIM = [
  'artificial sweeteners',
  'artificial sweetener',
];
