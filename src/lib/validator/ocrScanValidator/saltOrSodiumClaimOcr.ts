export const saltOrSodiumValidatorOcr = async (
  modifiedProductDataPoints: any
) => {
  const claim_list =
    modifiedProductDataPoints?.['analysis_detected_claims']?.[
      'salt_or_sodium_claim'
    ] || [];

  await validate(
    [...claim_list],
    modifiedProductDataPoints,
    'validated_salt_or_sodium_claim'
  );

  console.log('salt or sodium claim ocr validator -- finish');
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
  const { claim, does_claim_correct_with_info_provided_on_image } =
    analysisItem;

  if (!claim) return Promise.resolve(false);

  if (!does_claim_correct_with_info_provided_on_image)
    return Promise.resolve(false);

  return Promise.resolve(true);
};
