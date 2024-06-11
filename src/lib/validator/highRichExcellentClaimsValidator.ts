export const highRichExcellentClaimsValidator = async (
  modifiedProductDataPoints: any
) => {
  const process = modifiedProductDataPoints['process'] || {};

  const { high_in_full_statement, rich_in_full_statement } = process;

  console.log('start High/Rich In/Excellent Source claim validator');

  const all_rich_statement = [
    ...(rich_in_full_statement || []),
    ...(high_in_full_statement || []),
  ];

  if (!modifiedProductDataPoints?.['attributesAndCertifiers']) return;

  modifiedProductDataPoints['attributesAndCertifiers']['otherClaims'][
    'High/Rich In/Excellent Source'
  ] = [...new Set(all_rich_statement)];

  console.log('High/Rich In/Excellent Source validator -- finish');
};
