import { toLower } from 'lodash';

export const containAndNotContainClaimValidate = async (
  modifiedProductDataPoints: any,
  ocrClaims: any
) => {
  const claim_list =
    modifiedProductDataPoints?.['attributes']?.['containAndNotContain'] || [];

  await validate(claim_list, modifiedProductDataPoints);
  await validateNotContainFromLabel(modifiedProductDataPoints);

  console.log('finish validate contain and does not contain');
};

const validateNotContainFromLabel = async (modifiedProductDataPoints: any) => {
  //? possible does not contain attribute value from free from labeling
  const labelingFreeList =
    modifiedProductDataPoints?.['validated_labeling']?.['free'];

  if (labelingFreeList) {
    labelingFreeList?.forEach((notContainItem: any) => {
      CONTAIN_AND_NOT_CONTAIN_MAP_FOR_LABEL.some((containItem: any) => {
        const variants = containItem?.variants;
        const name = containItem?.name;
        const statement_not_include = containItem?.statement_not_include;
        const trimmedNotContainItem = notContainItem?.trim();

        let validVariant = variants.find((variantItem: any) => {
          return toLower(trimmedNotContainItem)?.includes(variantItem);
        });

        if (statement_not_include) {
          if (
            statement_not_include.some((expText: string) => {
              return toLower(trimmedNotContainItem)?.includes(expText);
            })
          ) {
            validVariant = false;
          }
        }

        if (validVariant) {
          const currentValue =
            modifiedProductDataPoints?.['attributes']?.[
              'validated_notContain'
            ] || [];

          modifiedProductDataPoints['attributes']['validated_notContain'] =
            Array.from(new Set([...currentValue, name]));
        }
      });
    });
  }
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

      // console.log('claim value', claimValue);
      // console.log('statement', statement);
      // console.log('datapointKey', dataPointKey);
      // console.log(
      //   'search in map',
      //   CONTAIN_AND_NOT_CONTAIN_MAP?.[toLower(claimValue)]
      // );

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

  // if (
  //   CONTAIN_AND_NOT_CONTAIN_REASON?.[toLower(claim)]
  //     ?.map((word: string) => {
  //       if (toLower(reason)?.includes(word)) return true;

  //       return false;
  //     })
  //     .some((result: boolean) => result === false)
  // ) {
  //   return Promise.resolve(false);
  // } else {
  //   //* exceptional cases
  //   if (toLower(claim) === 'alcohol' && toLower(reason)?.includes('sugar')) {
  //     //? it could be about 'alcohol sugar' so must return false
  //     return Promise.resolve(false);
  //   }
  // }

  if (
    CONTAIN_AND_NOT_CONTAIN_REASON?.[toLower(claim)]
      ?.map((wordList: any) => {
        return wordList
          .map((word: any) => {
            if (toLower(reason)?.includes(word)) {
              return true;
            } else {
              return false;
            }
          })
          .every((result: any) => result === true);
      })
      .every((result: any) => result === false)
  ) {
    return Promise.resolve(false);
  } else {
    //* exceptional cases
    if (toLower(claim) === 'alcohol' && toLower(reason)?.includes('sugar')) {
      //? it could be about 'alcohol sugar' so must return false
      return Promise.resolve(false);
    }
    //* exceptional cases
    // if (toLower(claim) === 'alcohol' && toLower(reason)?.includes('sugar')) {
    //   //? it could be about 'alcohol sugar' so must return false
    //   return Promise.resolve(false);
    // }
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
    'flavor with',
    'flavored with',
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
  '1,4-dioxane': [['1,4-dioxane']],
  'active yeast': [['active', 'yeast']],
  'added antibiotics': [['added', 'antibiotic']],
  'added colors': [['added', 'color']],
  'added dyes': [['added', 'dye']],
  'added flavors': [['added', 'flavor']],
  'added fragrances': [['added', 'fragrance']],
  'added hormones': [['added', 'hormone']],
  'added nitrates': [['added', 'nitrate']],
  'added nitrites': [['added', 'nitrite']],
  'added preservatives': [['added', 'preservative']],
  additives: [['additive']],
  alcohol: [['alcohol']],
  allergen: [['allergen']],
  aluminum: [['aluminum']],
  'amino acids': [['amino', 'acid']],
  ammonia: [['ammonia']],
  'animal by-products': [['animal', 'by-product']],
  'animal derivatives': [['animal', 'derivative']],
  'animal ingredients': [['animal', 'ingredient']],
  'animal products': [['animal', 'product']],
  'animal rennet': [['animal', 'rennet']],
  antibiotics: [['antibiotic']],
  'artificial additives': [['artificial', 'additive']],
  'artificial colors': [['artificial', 'color']],
  'artificial dyes': [['artificial', 'dye']],
  'artificial flavors': [['artificial', 'flavor']],
  'artificial fragrance': [['artificial', 'fragrance']],
  'artificial ingredients': [['artificial', 'ingredient']],
  'artificial preservatives': [['artificial', 'preservative']],
  'binders and/or fillers': [['binder', 'and/or', 'filler']],
  bleach: [['bleach']],
  'bpa (bisphenol-a)': [['bpa', 'bisphenol-a']],
  'butylene glycol': [['butylene', 'glycol']],
  'by-products': [['by-product']],
  caffeine: [['caffeine']],
  carrageenan: [['carrageenan']],
  casein: [['casein']],
  'cbd / cannabidiol': [['cbd', 'cannabidiol']],
  cbd: [['cbd']],
  cannabidiol: [['cannabidiol']],
  'chemical additives': [['chemical', 'additive']],
  'chemical colors': [['chemical', 'color']],
  'chemical dyes': [['chemical', 'dye']],
  'chemical flavors': [['chemical', 'flavor']],
  'chemical fragrances': [['chemical', 'fragrance']],
  'chemical ingredients': [['chemical', 'ingredient']],
  'chemical preservatives': [['chemical', 'preservative']],
  'chemical sunscreens': [['chemical', 'sunscreen']],
  chemicals: [['chemical']],
  chlorine: [['chlorine']],
  cholesterol: [['cholesterol']],
  coatings: [['coating']],
  'corn fillers': [['corn', 'filler']],
  'cottonseed oil': [['cottonseed', 'oil']],
  dyes: [['dye']],
  edta: [['edta']],
  emulsifiers: [['emulsifier']],
  erythorbates: [['erythorbate']],
  'expeller-pressed oils': [['expeller-pressed', 'oil']],
  fillers: [['filler']],
  fluoride: [['fluoride']],
  formaldehyde: [['formaldehyde']],
  fragrances: [['fragrance']],
  grain: [['grain']],
  hexane: [['hexane']],
  hormones: [['hormone']],
  'hydrogenated oils': [['hydrogenated', 'oil']],
  kitniyos: [['kitniyos']],
  kitniyot: [['kitniyot']],
  lactose: [['lactose']],
  latex: [['latex']],
  msg: [['msg']],
  'natural additives': [['natural', 'additive']],
  'natural colors': [['natural', 'color']],
  'natural dyes': [['natural', 'dye']],
  'natural flavors': [
    ['natural', 'flavor'],
    ['naturally', 'flavored'],
  ],
  'natural ingredients': [['natural', 'ingredient']],
  'natural preservatives': [['natural', 'preservative']],
  nitrates: [['nitrate']],
  nitrites: [['nitrite']],
  'omega fatty acids': [['omega']],
  paba: [['paba']],
  'palm oil': [['palm', 'oil']],
  parabens: [['paraben']],
  pesticides: [['pesticide']],
  'petro chemical': [['petro', 'chemical']],
  petrolatum: [['petrolatum']],
  'petroleum byproducts': [['petroleum', 'byproduct']],
  phosphates: [['phosphate']],
  phosphorus: [['phosphorus']],
  phthalates: [['phthalate']],
  pits: [['pit']],
  preservatives: [['preservative']],
  probiotics: [['probiotic']],
  rbgh: [['rbgh'], ['ibgh']],
  rbst: [['rbst'], ['ibst']],
  rennet: [['rennet']],
  salicylates: [['salicylate']],
  'sea salt': [['sea', 'salt']],
  'shells/ shell pieces': [['shell', 'shell piece'], ['nut shell']],
  silicone: [['silicone']],
  'sles (sodium laureth sulfate)': [['sles']],
  'sls (sodium lauryl sulfate)': [['sls']],
  stabilizers: [['stabilizer']],
  starch: [['starch']],
  sulfates: [['sulfate']],
  sulfides: [['sulfide']],
  sulfites: [['sulfite']],
  sulphites: [['sulphite']],
  'sulfur dioxide': [['sulfur', 'dioxide']],
  'synthetic additives': [['synthetic', 'additive']],
  'synthetic colors': [['synthetic', 'color']],
  'synthetic dyes': [['synthetic', 'dye']],
  'synthetic flavors': [['synthetic', 'flavor']],
  'synthetic fragrance': [['synthetic', 'fragrance']],
  'synthetic ingredients': [['synthetic', 'ingredient']],
  'synthetic preservatives': [['synthetic', 'preservative']],
  synthetics: [['synthetic']],
  thc: [['thc']],
  tetrahydrocannabinol: [['tetrahydrocannabinol']],
  'toxic pesticides': [['toxic', 'pesticide']],
  triclosan: [['triclosan']],
  'vegan ingredients': [['vegan', 'ingredient']],
  'vegetarian ingredients': [['vegetarian', 'ingredient']],
  yeast: [['yeast']],
  yolks: [['yolk']],
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

const CONTAIN_AND_NOT_CONTAIN_MAP_FOR_LABEL = [
  {
    name: '1,4-dioxane',
    variants: ['1,4-dioxane'],
  },
  {
    name: 'active yeast',
    variants: ['active yeast'],
  },
  {
    name: 'added antibiotics',
    variants: ['added antibiotics'],
  },
  {
    name: 'added colors',
    variants: ['added colors'],
  },
  {
    name: 'added dyes',
    variants: ['added dyes'],
  },
  {
    name: 'added flavors',
    variants: ['added flavors'],
  },
  {
    name: 'added fragrances',
    variants: ['added fragrances'],
  },
  {
    name: 'added hormones',
    variants: ['added hormones'],
  },
  {
    name: 'added nitrates',
    variants: ['added nitrates'],
  },
  {
    name: 'added nitrites',
    variants: ['added nitrites'],
  },
  {
    name: 'added preservatives',
    variants: ['added preservatives'],
  },
  {
    name: 'additives',
    variants: ['additives'],
  },
  {
    name: 'alcohol',
    variants: ['alcohol'],
  },
  {
    name: 'allergen',
    variants: ['allergen'],
  },
  {
    name: 'aluminum',
    variants: ['aluminum'],
  },
  {
    name: 'amino acids',
    variants: ['amino acids'],
  },
  {
    name: 'ammonia',
    variants: ['ammonia'],
  },
  {
    name: 'animal by-products',
    variants: ['animal by-products'],
  },
  {
    name: 'animal derivatives',
    variants: ['animal derivatives'],
  },
  {
    name: 'animal ingredients',
    variants: ['animal ingredients'],
  },
  {
    name: 'animal products',
    variants: ['animal products'],
  },
  {
    name: 'animal rennet',
    variants: ['animal rennet'],
  },
  {
    name: 'antibiotics',
    variants: ['antibiotics'],
  },
  {
    name: 'artificial additives',
    variants: ['artificial additives'],
  },
  {
    name: 'artificial colors',
    variants: ['artificial colors'],
  },
  {
    name: 'artificial dyes',
    variants: ['artificial dyes'],
  },
  {
    name: 'artificial flavors',
    variants: ['artificial flavors'],
  },
  {
    name: 'artificial fragrance',
    variants: ['artificial fragrance'],
  },
  {
    name: 'artificial ingredients',
    variants: ['artificial ingredients'],
  },
  {
    name: 'artificial preservatives',
    variants: ['artificial preservatives'],
  },
  {
    name: 'binders and/or fillers',
    variants: ['binders', 'fillers'],
  },
  {
    name: 'bleach',
    variants: ['bleach'],
  },
  {
    name: 'bpa (bisphenol-a)',
    variants: ['bpa', 'bisphenol-a'],
  },
  {
    name: 'butylene glycol',
    variants: ['butylene glycol'],
  },
  {
    name: 'by-products',
    variants: ['by-products'],
  },
  {
    name: 'caffeine',
    variants: ['caffeine'],
  },
  {
    name: 'carrageenan',
    variants: ['carrageenan'],
  },
  {
    name: 'casein',
    variants: ['casein'],
  },
  {
    name: 'cbd / cannabidiol',
    variants: ['cbd', 'cannabidiol'],
  },
  {
    name: 'cbd',
    variants: ['cbd', 'cannabidiol'],
  },
  {
    name: 'chemical additives',
    variants: ['chemical additives'],
  },
  {
    name: 'chemical colors',
    variants: ['chemical colors'],
  },
  {
    name: 'chemical dyes',
    variants: ['chemical dyes'],
  },
  {
    name: 'chemical flavors',
    variants: ['chemical flavors'],
  },
  {
    name: 'chemical fragrances',
    variants: ['chemical fragrances'],
  },
  {
    name: 'chemical ingredients',
    variants: ['chemical ingredients'],
  },
  {
    name: 'chemical preservatives',
    variants: ['chemical preservatives'],
  },
  {
    name: 'chemical sunscreens',
    variants: ['chemical sunscreens'],
  },
  {
    name: 'chemicals',
    variants: ['chemicals'],
  },
  {
    name: 'chlorine',
    variants: ['chlorine'],
  },
  {
    name: 'cholesterol',
    variants: ['cholesterol'],
  },
  {
    name: 'coatings',
    variants: ['coatings'],
  },
  {
    name: 'corn fillers',
    variants: ['corn fillers'],
  },
  {
    name: 'cottonseed oil',
    variants: ['cottonseed oil'],
  },
  {
    name: 'dyes',
    variants: ['dyes'],
  },
  {
    name: 'edta',
    variants: ['edta'],
  },
  {
    name: 'emulsifiers',
    variants: ['emulsifiers'],
  },
  {
    name: 'erythorbates',
    variants: ['erythorbates'],
  },
  {
    name: 'expeller-pressed oils',
    variants: ['expeller-pressed oils'],
  },
  {
    name: 'fillers',
    variants: ['fillers'],
  },
  {
    name: 'fluoride',
    variants: ['fluoride'],
  },
  {
    name: 'formaldehyde',
    variants: ['formaldehyde'],
  },
  {
    name: 'fragrances',
    variants: ['fragrances'],
  },
  {
    name: 'grain',
    variants: ['grain'],
  },
  {
    name: 'hexane',
    variants: ['hexane'],
  },
  {
    name: 'hormones',
    variants: ['hormones'],
  },
  {
    name: 'hydrogenated oils',
    variants: ['hydrogenated oils'],
  },
  {
    name: 'kitniyos / kitniyot (legumes)',
    variants: ['kitniyos', 'kitniyot', 'legumes'],
  },
  {
    name: 'lactose',
    variants: ['lactose'],
  },
  {
    name: 'latex',
    variants: ['latex'],
  },
  {
    name: 'msg',
    variants: ['msg'],
  },
  {
    name: 'natural additives',
    variants: ['natural additives'],
  },
  {
    name: 'natural colors',
    variants: ['natural colors'],
  },
  {
    name: 'natural dyes',
    variants: ['natural dyes'],
  },
  {
    name: 'natural flavors',
    variants: ['natural flavors', 'naturally flavored'],
  },
  {
    name: 'natural ingredients',
    variants: ['natural ingredients'],
  },
  {
    name: 'natural preservatives',
    variants: ['natural preservatives'],
  },
  {
    name: 'nitrates/nitrites',
    variants: ['nitrates', 'nitrites'],
  },
  {
    name: 'omega fatty acids',
    variants: ['omega fatty acids'],
  },
  {
    name: 'paba',
    variants: ['paba'],
  },
  {
    name: 'palm oil',
    variants: ['palm oil'],
  },
  {
    name: 'parabens',
    variants: ['parabens'],
  },
  {
    name: 'pesticides',
    variants: ['pesticides'],
  },
  {
    name: 'petro chemical',
    variants: ['petro chemical'],
  },
  {
    name: 'petrolatum',
    variants: ['petrolatum'],
  },
  {
    name: 'petroleum byproducts',
    variants: ['petroleum byproducts'],
  },
  {
    name: 'phosphates',
    variants: ['phosphates'],
  },
  {
    name: 'phosphorus',
    variants: ['phosphorus'],
  },
  {
    name: 'phthalates',
    variants: ['phthalates'],
  },
  {
    name: 'pits',
    variants: ['pits'],
  },
  {
    name: 'preservatives',
    variants: ['preservatives'],
  },
  {
    name: 'probiotics',
    variants: ['probiotics'],
  },
  {
    name: 'rbgh/bst',
    variants: ['rbgh', 'rbst', 'ibst', 'ibgh', 'tbst', 'tbgh'],
  },
  {
    name: 'rennet',
    variants: ['rennet'],
  },
  {
    name: 'salicylates',
    variants: ['salicylates'],
  },
  {
    name: 'sea salt',
    variants: ['sea salt'],
  },
  {
    name: 'shells/ shell pieces',
    variants: ['shells pieces', 'shell pieces'],
  },
  {
    name: 'silicone',
    variants: ['silicone'],
  },
  {
    name: 'sles (sodium laureth sulfate)',
    variants: ['sles', 'sodium laureth sulfate'],
  },
  {
    name: 'stabilizers',
    variants: ['stabilizers'],
  },
  {
    name: 'starch',
    variants: ['starch'],
  },
  {
    name: 'sulfates',
    variants: ['sulfates'],
  },
  {
    name: 'sulfides',
    variants: ['sulfides'],
  },
  {
    name: 'sulfites / sulphites',
    variants: ['sulfites', 'sulphites'],
  },
  {
    name: 'sulfur dioxide',
    variants: ['sulfur dioxide'],
  },
  {
    name: 'synthetic additives',
    variants: ['synthetic additives'],
  },
  {
    name: 'synthetic colors',
    variants: ['synthetic colors'],
  },
  {
    name: 'synthetic dyes',
    variants: ['synthetic dyes'],
  },
  {
    name: 'synthetic flavors',
    variants: ['synthetic flavors'],
  },
  {
    name: 'synthetic fragrance',
    variants: ['synthetic fragrance'],
  },
  {
    name: 'synthetic ingredients',
    variants: ['synthetic ingredients'],
  },
  {
    name: 'synthetic preservatives',
    variants: ['synthetic preservatives'],
  },
  {
    name: 'synthetics',
    variants: ['synthetics'],
  },
  {
    name: 'thc / tetrahydrocannabinol',
    variants: ['thc', 'tetrahydrocannabinol'],
  },
  {
    name: 'toxic pesticides',
    variants: ['toxic pesticides'],
  },
  {
    name: 'triclosan',
    variants: ['triclosan'],
  },
  {
    name: 'vegan ingredients',
    variants: ['vegan ingredients'],
  },
  {
    name: 'vegetarian ingredients',
    variants: ['vegetarian ingredients'],
  },
  {
    name: 'yeast',
    variants: ['yeast'],
  },
  {
    name: 'yolks',
    variants: ['yolks'],
  },
];
