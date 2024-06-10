export const sugarAndSweetValidatorOcr = async (
  modifiedProductDataPoints: any
) => {
  const analysis_list =
    modifiedProductDataPoints?.['analysis_detected_claims']?.[
      'sugar_and_sweet_claim'
    ] || [];

  await validate(
    [...analysis_list],
    modifiedProductDataPoints,
    'validated_sugar_and_sweet_claims'
  );

  console.log('sugar and sweet ocr -- finish');
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

      let currentValues =
        modifiedProductDataPoints?.['attributesAndCertifiers']?.[
          'otherClaims'
        ]?.[dataPointKey] || [];

      modifiedProductDataPoints['attributesAndCertifiers']['otherClaims'][
        dataPointKey
      ] = [...currentValues, claimValue];
    }
  }
};

const check = async (analysisItem: any): Promise<boolean> => {
  const { claim, product_contain_sweet_source_from_claim } = analysisItem;

  if (!claim) return Promise.resolve(false);

  if (
    product_contain_sweet_source_from_claim === true &&
    (claim as string).startsWith('no ')
  ) {
    return Promise.resolve(false);
  }

  if (
    product_contain_sweet_source_from_claim === false &&
    !(claim as string).startsWith('no ')
  ) {
    return Promise.resolve(false);
  }

  return Promise.resolve(true);
};
