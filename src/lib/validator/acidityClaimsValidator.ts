export const acidityClaimsValidator = async (
  modifiedProductDataPoints: any
) => {
  const process = modifiedProductDataPoints['process'] || {};

  const { acidity_percent_statement } = process;

  console.log('acidity claim validator');

  modifiedProductDataPoints['attributesAndCertifiers']['otherClaims'][
    'acidity'
  ] = [...new Set(acidity_percent_statement)];

  console.log('High/Rich In/Excellent Source validator -- finish');
};
