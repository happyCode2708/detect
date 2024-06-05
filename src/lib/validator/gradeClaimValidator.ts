export const gradeClaimsValidator = async (modifiedProductDataPoints: any) => {
  const process = modifiedProductDataPoints['process'] || {};

  const { grade } = process;

  console.log('grade claim validator');

  modifiedProductDataPoints['attributesAndCertifiers']['otherClaims']['grade'] =
    [...new Set(grade)];

  console.log('grade claim validator -- finish');
};
