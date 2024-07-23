export const labelingInfoValidate = async (modifiedProductDataPoints: any) => {
  await validateFree(modifiedProductDataPoints);
  await validateContain(modifiedProductDataPoints);
};

const validateFree = async (modifiedProductDataPoints: any) => {
  let labeling = modifiedProductDataPoints?.['labeling']?.[0];
  const { free } = labeling;

  let validatedFreeLabeling = free
    ?.split('/')
    ?.map((item: string) => item?.trim());

  if (!validatedFreeLabeling) return;

  modifiedProductDataPoints['labeling'][0]['validated_free'] =
    validatedFreeLabeling;
};

const validateContain = async (modifiedProductDataPoints: any) => {
  let labeling = modifiedProductDataPoints?.['labeling']?.[0];
  const { contain } = labeling;

  let validatedContainLabeling = contain
    ?.split('/')
    ?.map((item: string) => item?.trim());

  if (!validatedContainLabeling) return;

  modifiedProductDataPoints['labeling'][0]['validated_contain'] =
    validatedContainLabeling;
};
