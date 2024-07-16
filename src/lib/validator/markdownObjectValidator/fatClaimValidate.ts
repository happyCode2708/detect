export const fatClaimValidate = async (modifiedProductDataPoints: any) => {
  const claim_list =
    modifiedProductDataPoints?.['attributes']?.['fatClaims'] || [];

  await validate(
    [...claim_list],
    modifiedProductDataPoints,
    'validated_fatClaims'
  );

  console.log('finish validate fat claim');
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

      modifiedProductDataPoints['attributes'][dataPointKey] = Array.from(
        new Set([...currentValues, FAT_CLAIMS_MAP?.[claimValue]])
      );
    }
  }
};

const check = async (analysisItem: any): Promise<boolean> => {
  const { claim, isClaimed, source } = analysisItem;

  if (!claim) return Promise.resolve(false);

  if (isClaimed === 'no' || isClaimed === 'unknown')
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
  'is fat free',
  'is free of saturated fat',
  'is low fat',
  'is low in saturated fat',
  'have no fat',
  'have no trans fat',
  'is reduced fat',
  'is trans fat free',
  'have zero grams trans fat per serving',
  'have zero trans fat',
];

const FAT_CLAIMS_MAP = {
  'is fat free': 'fat free',
  'is free of saturated fat': 'free of saturated fat',
  'is low fat': 'low fat',
  'is low in saturated fat': 'low in saturated fat',
  'have no fat': 'no fat',
  'have no trans fat': 'no trans fat',
  'is reduced fat': 'reduced fat',
  'is trans fat free': 'trans fat free',
  'have zero grams trans fat per serving': 'zero grams trans fat per serving',
  'have zero trans fat': 'zero trans fat',
} as any;
