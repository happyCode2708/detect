export const saltClaimValidate = async (modifiedProductDataPoints: any) => {
  const claim_list =
    modifiedProductDataPoints?.['attributes']?.['saltClaims'] || [];

  await validate(
    [...claim_list],
    modifiedProductDataPoints,
    'validated_saltClaims'
  );

  console.log('finish validate salt claim');
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
        new Set([...currentValues, claimValue])
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

  if (!SALT_CLAIMS.includes(claim)) {
    return Promise.resolve(false);
  }

  return Promise.resolve(true);
};

const SALT_CLAIMS = [
  'lightly salted',
  'low sodium',
  'no salt',
  'no salt added',
  'reduced sodium',
  'salt free',
  'sodium free',
  'unsalted',
  'very low sodium',
];
