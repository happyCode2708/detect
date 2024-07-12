export const physicalValidate = async (modifiedProductDataPoints: any) => {
  let modifiedPhysical = modifiedProductDataPoints?.['physical']?.[0];

  if (!modifiedPhysical) return;

  validateUpc(modifiedPhysical);

  modifiedProductDataPoints['physical'][0] = modifiedPhysical;
};

const validateUpc = (modifiedPhysical: any) => {
  const { upc, lotNumber } = modifiedPhysical;

  if (upc && upc?.length === 12) {
    modifiedPhysical['validated_upc12'] = upc;
  } else if (
    lotNumber &&
    upc &&
    upc?.length === 11 &&
    lotNumber?.length === 1
  ) {
    modifiedPhysical['validated_upc12'] = `${lotNumber}${upc}`;
  }
};
