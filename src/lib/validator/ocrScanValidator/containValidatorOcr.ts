export const containValidatorOcr = async (modifiedProductDataPoints: any) => {
  const contain_claim_predict_analysis =
    modifiedProductDataPoints?.['analysis_detected_claims']?.[
      'contain_claim'
    ] || [];

  console.log(
    'contain_claim_predict_analysis',
    JSON.stringify(contain_claim_predict_analysis)
  );

  await validate(
    [...contain_claim_predict_analysis],
    modifiedProductDataPoints
    // 'validated_product_does_not_contain'
  );

  console.log('contain ocr -- 1');

  console.log('contain ocr validator -- finish');
};

const validate = async (
  analysisList: any[],
  modifiedProductDataPoints: any
  // dataPointKey: string
) => {
  let validated_fields = [] as any;

  for (const analysisItem of analysisList) {
    let valid = await check(analysisItem);

    if (valid === true) {
      const claimValue = analysisItem['claim'];

      const dataPointKey =
        analysisItem?.['does_product_contain_thing_in_claim'] === true
          ? 'validated_product_contain'
          : 'validated_product_does_not_contain';

      let currentValues =
        modifiedProductDataPoints['contain_and_notContain']?.[dataPointKey] ||
        [];
      modifiedProductDataPoints['contain_and_notContain'][dataPointKey] = [
        ...currentValues,
        claimValue,
      ];
    }
  }
};

const check = async (analysisItem: any): Promise<boolean> => {
  const { claim, does_product_info_talk_about_thing_in_claim } = analysisItem;

  if (!claim) return Promise.resolve(false);

  if (!does_product_info_talk_about_thing_in_claim)
    return Promise.resolve(false);

  return Promise.resolve(true);
};
