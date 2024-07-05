export const sugarClaimValidate = async (modifiedProductDataPoints: any) => {
  const claim_list =
    modifiedProductDataPoints?.['attributes']?.['sugarClaims'] || [];

  await validate(
    [...claim_list],
    modifiedProductDataPoints,
    'validated_sugarClaims'
  );
};

const validate = async (
  analysisList: any[],
  modifiedProductDataPoints: any,
  dataPointKey: string
) => {
  for (const analysisItem of analysisList) {
    let valid = await check(analysisItem);

    if (valid === true) {
      const claimValue = analysisItem['claim'];

      const currentValues =
        modifiedProductDataPoints?.['attributes']?.[dataPointKey] || [];

      modifiedProductDataPoints['attributes'][dataPointKey] = [
        ...currentValues,
        SUGAR_CLAIMS_MAP?.[claimValue],
      ];
    }
  }
};

const check = async (analysisItem: any): Promise<boolean> => {
  const { claim, isClaimed, source } = analysisItem;

  if (!claim) return Promise.resolve(false);

  if (isClaimed === 'false' || isClaimed === 'unknown')
    return Promise.resolve(false);

  if (source === 'ingredient list' || source === 'nutrition fact') {
    return Promise.resolve(false);
  }

  if (!SUGAR_CLAIMS.includes(claim)) {
    return Promise.resolve(false);
  }

  return Promise.resolve(true);
};

const SUGAR_CLAIMS = [
  'contain acesulfame k',
  'no contain acesulfame potassium',
  'contain agave',
  'contain allulose',
  'contain artificial sweetener',
  'contain aspartame',
  'contain beet sugar',
  'contain cane sugar',
  'contain coconut/coconut palm sugar',
  'contain fruit juice',
  'contain high fructose corn syrup',
  'contain honey',
  'contain low sugar',
  'contain lower sugar',
  'contain monk fruit',
  'contain natural sweeteners',
  'no contain acesulfame k',
  'no contain added sugar',
  'no contain agave',
  'no contain allulose',
  'no contain artificial sweetener',
  'no contain aspartame',
  'no contain cane sugar',
  'no contain coconut/coconut palm sugar',
  'no contain coconut sugar',
  'no contain coconut palm sugar',
  'no contain corn syrup',
  'no contain high fructose corn syrup',
  'no contain refined sugars',
  'no contain saccharin',
  'no contain splenda/sucralose',
  'no contain sucralose',
  'no contain splenda',
  'no contain stevia',
  'no contain sugar',
  'no contain sugar added',
  'no contain sugar alcohol',
  'no contain tagatose',
  'no contain xylitol',
  'contain reduced sugar',
  'contain refined sugar',
  'contain saccharin',
  'contain splenda/sucralose',
  'contain stevia',
  'contain sugar alcohol',
  'contain sugar free',
  'contain sugars added',
  'contain tagatose',
  'contain unsweetened',
  'contain xylitol',
];

const SUGAR_CLAIMS_MAP = {
  'contain acesulfame k': 'acesulfame k',
  'no contain acesulfame potassium': 'no acesulfame potassium',
  'contain agave': 'agave',
  'contain allulose': 'allulose',
  'contain artificial sweetener': 'artificial sweetener',
  'contain aspartame': 'aspartame',
  'contain beet sugar': 'beet sugar',
  'contain cane sugar': 'cane sugar',
  'contain coconut/coconut palm sugar': 'coconut/coconut palm sugar',
  'contain fruit juice': 'fruit juice',
  'contain high fructose corn syrup': 'high fructose corn syrup',
  'contain honey': 'honey',
  'contain low sugar': 'low sugar',
  'contain lower sugar': 'lower sugar',
  'contain monk fruit': 'monk fruit',
  'contain natural sweeteners': 'natural sweeteners',
  'no contain acesulfame k': 'no acesulfame k',
  'no contain added sugar': 'no added sugar',
  'no contain agave': 'no agave',
  'no contain allulose': 'no allulose',
  'no contain artificial sweetener': 'no artificial sweetener',
  'no contain aspartame': 'no aspartame',
  'no contain cane sugar': 'no cane sugar',
  'no contain coconut/coconut palm sugar': 'no coconut/coconut palm sugar',
  'no contain coconut sugar': 'no coconut sugar',
  'no contain coconut palm sugar': 'no coconut palm sugar',
  'no contain corn syrup': 'no corn syrup',
  'no contain high fructose corn syrup': 'no high fructose corn syrup',
  'no contain refined sugars': 'no refined sugars',
  'no contain saccharin': 'no saccharin',
  'no contain splenda/sucralose': 'no splenda/sucralose',
  'no contain sucralose': 'no sucralose',
  'no contain splenda': 'no splenda',
  'no contain stevia': 'no stevia',
  'no contain sugar': 'no sugar',
  'no contain sugar added': 'no sugar added',
  'no contain sugar alcohol': 'no sugar alcohol',
  'no contain tagatose': 'no tagatose',
  'no contain xylitol': 'no xylitol',
  'contain reduced sugar': 'reduced sugar',
  'contain refined sugar': 'refined sugar',
  'contain saccharin': 'saccharin',
  'contain splenda/sucralose': 'splenda/sucralose',
  'contain stevia': 'stevia',
  'contain sugar alcohol': 'sugar alcohol',
  'contain sugar free': 'sugar free',
  'contain sugars added': 'sugars added',
  'contain tagatose': 'tagatose',
  'contain unsweetened': 'unsweetened',
  'contain xylitol': 'xylitol',
} as any;
