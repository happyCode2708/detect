export const acidityClaimsValidator = async (
  modifiedProductDataPoints: any
) => {
  const process = modifiedProductDataPoints['process'] || {};

  const { acidity_percent_statement } = process;

  console.log('acidity claim validator');

  if (!modifiedProductDataPoints?.['attributesAndCertifiers']) return;

  modifiedProductDataPoints['attributesAndCertifiers']['otherClaims'][
    'acidity'
  ] = [...new Set(acidity_percent_statement)];

  console.log('acidity claim validator -- finish');
};
