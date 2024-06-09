export const nonCertifierOcrValidator = async (
  modifiedProductDataPoints: any
) => {
  const non_certifier_claim_predict_analysis =
    modifiedProductDataPoints?.['analysis_detected_claims']?.[
      'non_certified_claim'
    ] || [];

  console.log(
    'non_certified_claim_predict_analysis',
    JSON.stringify(non_certifier_claim_predict_analysis)
  );

  await validate(
    [...non_certifier_claim_predict_analysis],
    modifiedProductDataPoints,
    'validated_non_certifier_claims'
  );

  console.log('non certifier ocr -- 1');

  console.log('non certifier ocr validator -- finish');
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
