export const fatClaimValidate = async (modifiedProductDataPoints: any) => {
  const claim_list =
    modifiedProductDataPoints?.['attributes']?.['fatClaims'] || [];

  await validate(
    [...claim_list],
    modifiedProductDataPoints,
    'validated_fatClaims'
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

  if (!FAT_CLAIMS.includes(claim)) {
    return Promise.resolve(false);
  }

  return Promise.resolve(true);
};

const FAT_CLAIMS = [
  'fat free',
  'free of saturated fat',
  'low fat',
  'low in saturated fat',
  'no fat',
  'no trans fat',
  'reduced fat',
  'trans fat free',
  'zero grams trans fat per serving',
  'zero trans fat',
];
