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
        claimValue,
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
