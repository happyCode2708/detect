export const nonCertifierClaimValidate = async (
  modifiedProductDataPoints: any
) => {
  const claim_list =
    modifiedProductDataPoints?.['attributes']?.['nonCertificateClaims'] || [];

  await validate(
    [...claim_list],
    modifiedProductDataPoints,
    'validated_nonCertificateClaims'
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

  if (!NON_CERTIFICATE_CLAIMS.includes(claim)) {
    return Promise.resolve(false);
  }

  return Promise.resolve(true);
};

const NON_CERTIFICATE_CLAIMS = [
  '100% natural',
  '100% natural ingredients',
  '100% pure',
  'acid free',
  'aeroponic grown',
  'all natural',
  'all natural ingredients',
  'aquaponic/aquaculture grown',
  'baked',
  'biodegradable',
  'cage free',
  'cold-pressed',
  'direct trade',
  'dolphin safe',
  'dry roasted',
  'eco-friendly',
  'farm raised',
  'filtered',
  'free range',
  'freeze-dried',
  'from concentrate',
  'grade a',
  'greenhouse grown',
  'heat treated',
  'heirloom',
  'homeopathic',
  'homogenized',
  'hydroponic grown',
  'hypo-allergenic',
  'irradiated',
  'live food',
  'low acid',
  'low carbohydrate',
  'low carbohydrate or low-carb',
  'low carbohydrate',
  'low-carb',
  'low cholesterol',
  'macrobiotic',
  'minimally processed',
  'natural',
  'natural botanicals',
  'natural fragrances',
  'natural ingredients',
  'no animal testing',
  'no sulfites added',
  'non gebrokts',
  'non-alcoholic',
  'non-irradiated',
  'non-toxic',
  'not fried',
  'not from concentrate',
  'pasteurized',
  'pasture raised',
  'prairie raised',
  'raw',
  'responsibly sourced palm oil',
  'sprouted',
  'un-filtered',
  'un-pasteurized',
  'unscented',
  'vegetarian or vegan diet/feed',
  'wild',
  'wild caught',
];
