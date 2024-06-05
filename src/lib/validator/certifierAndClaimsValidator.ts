export const certifierAndClaimsValidator = async (
  modifiedProductDataPoints: any
) => {
  const certifierAndClaims =
    modifiedProductDataPoints?.['attributesAndCertifiers']?.['claims'] || [];

  let validated_certifier_and_claims: any = {};

  console.log('start certifier claim validator');

  Object.entries(certifierAndClaims).forEach((certifierItemInfo: any) => {
    const [certKey, certObjValue] = certifierItemInfo;
    validated_certifier_and_claims[certKey] = {};
    Object.entries(certObjValue).forEach((certInfoField: any) => {
      const [fieldKey, fieldValue] = certInfoField;
      if (fieldKey.includes('__Certifier')) {
        validated_certifier_and_claims[certKey][`predict_${fieldKey}`] =
          fieldValue;
        return;
      }
      validated_certifier_and_claims[certKey][fieldKey] = fieldValue;
    });
  });

  modifiedProductDataPoints['attributesAndCertifiers']['claims'] =
    validated_certifier_and_claims;

  console.log('certifier claim validator -- finish');
};
