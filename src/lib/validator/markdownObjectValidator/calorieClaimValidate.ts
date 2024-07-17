export const calorieClaimValidate = async (modifiedProductDataPoints: any) => {
  const claim_list =
    modifiedProductDataPoints?.['attributes']?.['calorieClaims'] || [];

  await validate(
    [...claim_list],
    modifiedProductDataPoints,
    'validated_calorieClaim'
  );

  console.log('finish validate calorie');
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

  if (source === 'ingredient list' || source === 'nutrition fact panel') {
    return Promise.resolve(false);
  }

  if (!CALORIE_CLAIMS.includes(claim)) {
    return Promise.resolve(false);
  }

  return Promise.resolve(true);
};

const CALORIE_CLAIMS = ['low calorie', 'reduced calorie', 'zero calorie'];
