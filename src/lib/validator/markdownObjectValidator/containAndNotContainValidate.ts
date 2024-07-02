export const containAndNotContainClaimValidate = async (
  modifiedProductDataPoints: any,
  ocrClaims: any
) => {
  const claim_list =
    modifiedProductDataPoints?.['attributes']?.['containAndNotContain'] || [];

  await validate(
    [
      ...claim_list.filter(
        (item: any) => item?.contain === 'yes' || item?.contain === 'true'
      ),
    ],
    modifiedProductDataPoints,
    'validated_contain',
    ocrClaims
  );

  await validate(
    [
      ...claim_list.filter(
        (item: any) => item?.notContain === 'yes' || item?.notContain === 'true'
      ),
    ],
    modifiedProductDataPoints,
    'validated_notContain',
    ocrClaims
  );
};

const validate = async (
  analysisList: any[],
  modifiedProductDataPoints: any,
  dataPointKey: string,
  ocrClaims: any
) => {
  for (const analysisItem of analysisList) {
    let valid = await check(analysisItem, ocrClaims);

    if (valid === 'from non-certificate claim') {
      const claimValue = analysisItem['claim'];

      const currentValues =
        modifiedProductDataPoints?.['attributes']?.[
          'validated_nonCertificateClaims'
        ] || [];

      modifiedProductDataPoints['attributes'][
        'validated_nonCertificateClaims'
      ] = [...currentValues, claimValue];

      return;
    }

    if (valid === 'from sugar claim') {
      const claimValue = analysisItem['claim'];

      const currentValues =
        modifiedProductDataPoints?.['attributes']?.['validated_sugarClaims'] ||
        [];

      if (dataPointKey === 'validated_notContain') {
        modifiedProductDataPoints['attributes']['validated_sugarClaims'] = [
          ...currentValues,
          'no contain ' + claimValue,
        ];
        return;
      }

      if (dataPointKey === 'validated_contain') {
        modifiedProductDataPoints['attributes']['validated_sugarClaims'] = [
          ...currentValues,
          'contain ' + claimValue,
        ];
        return;
      }

      return;
    }

    if (valid === true) {
      const claimValue = analysisItem['claim'];

      const currentValues =
        modifiedProductDataPoints?.['attributes']?.[dataPointKey] || [];

      modifiedProductDataPoints['attributes'][dataPointKey] = [
        ...currentValues,
        claimValue,
      ];
    }
  }
};

const check = async (
  analysisItem: any,
  ocrClaims: any
): Promise<boolean | string> => {
  const { claim, mentioned, source } = analysisItem;

  if (!claim) return Promise.resolve(false);

  if (mentioned === 'false' || mentioned === 'unknown' || mentioned === 'no')
    return Promise.resolve(false);

  if (source === 'ingredient list' || source === 'nutrition fact') {
    return Promise.resolve(false);
  }

  if (EXTRA_FROM_NON_CERTIFIED_CLAIM.includes(claim)) {
    return Promise.resolve('from non-certificate claim');
  }

  if (EXTRA_FROM_SUGAR_CLAIM.includes(claim)) {
    return Promise.resolve('from sugar claim');
  }

  if (!CONTAIN_AND_NOT_CONTAIN_CLAIMS.includes(claim)) {
    return Promise.resolve(false);
  }

  return Promise.resolve(true);
};

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
  'rennet',
  'salicylates',
  'sea salt',
  'shells/ shell pieces',
  'silicone',
  'sles (sodium laureth sulfate)',
  'sls (sodium lauryl sulfate)',
  'stabilizers',
  'starch',
  'sulfates',
  'sulfides',
  'sulfites / sulphites',
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
  'toxic pesticides',
  'triclosan',
  'vegan ingredients',
  'vegetarian ingredients',
  'yeast',
  'yolks',
];

const EXTRA_FROM_NON_CERTIFIED_CLAIM = [
  'low carbohydrate or low-carb',
  'low - carb',
  'low-carb',
];

const EXTRA_FROM_SUGAR_CLAIM = [
  'artificial sweeteners',
  'artificial sweetener',
];
