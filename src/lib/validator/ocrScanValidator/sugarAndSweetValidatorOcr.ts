export const sugarAndSweetValidatorOcr = async (
  modifiedProductDataPoints: any
) => {
  const analysis_list =
    modifiedProductDataPoints?.['analysis_detected_claims']?.[
      'sugar_and_sweet_claim'
    ] || [];

  await validate(
    [...analysis_list],
    modifiedProductDataPoints,
    'validated_sugar_and_sweet_claims'
  );

  console.log('sugar and sweet ocr -- finish');
};

const validate = async (
  analysisList: any[],
  modifiedProductDataPoints: any,
  dataPointKey: string
) => {
  for (const analysisItem of analysisList) {
    // let valid = await check(analysisItem);
    let valid = await check_with_contrast_dic(analysisItem);

    if (valid === true) {
      const claimValue = analysisItem['claim'];

      let currentValues =
        modifiedProductDataPoints?.['attributesAndCertifiers']?.[
          'otherClaims'
        ]?.[dataPointKey] || [];

      modifiedProductDataPoints['attributesAndCertifiers']['otherClaims'][
        dataPointKey
      ] = [...currentValues, claimValue];
    }

    if (typeof valid === 'string') {
      const claimValue = valid;

      let currentValues =
        modifiedProductDataPoints?.['attributesAndCertifiers']?.[
          'otherClaims'
        ]?.[dataPointKey] || [];

      modifiedProductDataPoints['attributesAndCertifiers']['otherClaims'][
        dataPointKey
      ] = [...currentValues, claimValue];
    }
  }
};

const check = async (analysisItem: any): Promise<boolean> => {
  const { claim, product_contain_sweet_source_from_claim } = analysisItem;

  if (!claim) return Promise.resolve(false);

  if (
    product_contain_sweet_source_from_claim === true &&
    (claim as string).startsWith('no ')
  ) {
    return Promise.resolve(false);
  }

  if (
    product_contain_sweet_source_from_claim === false &&
    !(claim as string).startsWith('no ') &&
    claim !== 'unsweetened' &&
    claim !== 'sugar free'
  ) {
    return Promise.resolve(false);
  }

  return Promise.resolve(true);
};

const check_with_contrast_dic = async (
  analysisItem: any
): Promise<boolean | string> => {
  const { claim, product_contain_sweet_source_above } = analysisItem;

  if (!claim) return Promise.resolve(false);

  if (product_contain_sweet_source_above === true) {
    return Promise.resolve(true);
  }

  if (product_contain_sweet_source_above === false) {
    const found_contrast_enum =
      SUGAR_AND_SWEET_CLAIMS_EXPERIMENTAL_CONTRAST_DIC?.[claim];

    if (found_contrast_enum) {
      return Promise.resolve(found_contrast_enum);
    } else {
      return Promise.resolve(false);
    }
  }

  return Promise.resolve(true);
};

const SUGAR_AND_SWEET_CLAIMS_EXPERIMENTAL_CONTRAST_DIC: Record<string, string> =
  {
    'acesulfame k': 'no acesulfame k',
    // 'no acesulfame k': ['acesulfame k', 'acesulfame'],
    // agave: ['agave'],
    agave: 'no agave',
    // allulose: ['allulose'],
    allulose: 'no allulose',
    // 'artificial sweetener': ['artificial sweetener', 'artificial sweetener'],
    'artificial sweetener': 'no artificial sweetener',
    // aspartame: ['aspartame'],
    aspartame: 'no aspartame',
    // 'beet sugar': ['beet sugar'],
    // 'cane sugar': ['cane sugar'],
    'cane sugar': 'no cane sugar',
    // 'coconut/coconut palm sugar': [
    //   'coconut/coconut palm sugar',
    //   'coconut sugar',
    //   'coconut palm sugar',
    // ],
    'coconut/coconut palm sugar': 'no coconut/coconut palm sugar',
    // 'fruit juice': ['fruit juice'],
    // 'high fructose corn syrup': ['high fructose corn syrup'],
    'high fructose corn syrup': 'no high fructose corn syrup',
    // honey: ['honey'],
    // 'low sugar': ['low sugar'],
    // 'lower sugar': ['lower sugar'],
    // 'monk fruit': ['monk fruit'],
    // 'natural sweeteners': ['natural sweeteners'],
    // 'added sugar': ['added sugar'], //? fake
    'added sugar': 'no added sugar',
    // 'corn syrup': ['corn syrup'], //? fake
    'corn syrup': 'no corn syrup',

    // 'refined sugar': ['refined sugar'],
    'refined sugars': 'no refined sugars',
    // saccharin: ['saccharin'],
    saccharin: 'no saccharin',
    // 'splenda/sucralose': ['splenda/sucralose', 'splenda', 'sucralose'],
    'splenda/sucralose': 'no splenda/sucralose',
    // stevia: ['stevia'],
    'no stevia': 'no stevia',
    // sugar: ['no sugar', 'sugar'], //? fake
    sugar: 'no sugar',
    // 'sugars added': ['sugars added'],
    'sugar added': 'no sugar added',
    // 'sugar alcohol': ['sugar alcohol'],
    'sugar alcohol': 'no sugar alcohol',
    // tagatose: ['tagatose'],
    tagatose: 'no tagatose',
    // xylitol: ['xylitol'],
    xylitol: 'no xylitol',
    // 'reduced sugar': ['reduced sugar'],
    // 'sugar free': ['sugar free', 'sugar-free'],
    // unsweetened: ['unsweetened'],
  };
