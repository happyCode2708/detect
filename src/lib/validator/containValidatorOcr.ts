export const containValidatorOcr = async (modifiedProductDataPoints: any) => {
  const contain_claim_predict_analysis =
    modifiedProductDataPoints?.['detected_claims_by_ocr']?.['analysis']?.[
      'contain_claim_predict'
    ] || [];

  await validate(
    [...contain_claim_predict_analysis],
    modifiedProductDataPoints
  );

  console.log('contain ocr -- 1');

  console.log('contain ocr validator -- finish');
};

const validate = async (
  analysisList: any[],
  modifiedProductDataPoints: any
) => {
  for (const analysisItem of analysisList) {
    let valid = await check(analysisItem);

    if (valid === true) {
      const dataPointKey =
        analysisItem?.['does_product_contain_thing_in_claim'] === true
          ? 'validated_product_contain'
          : analysisItem?.['does_product_contain_thing_in_claim'] === false
          ? 'validated_product_does_not_contain'
          : '';

      if (!dataPointKey) return;

      let currentValues =
        modifiedProductDataPoints['contain_and_notContain']?.[dataPointKey] ||
        [];

      modifiedProductDataPoints['contain_and_notContain'][dataPointKey] = [
        ...currentValues,
        analysisItem['claim'],
      ];
    }
  }
};

const check = async (analysisItem: any): Promise<boolean> => {
  const {
    claim_or_thing,
    found_claim_or_thing_on_product_image,
    type_of_claim,
    product_contain_thing,
    does_not_contain_thing,
  } = analysisItem;

  if (!claim_or_thing) return Promise.resolve(false);

  if (found_claim_or_thing_on_product_image !== true)
    return Promise.resolve(false);

  return Promise.resolve(true);
};
