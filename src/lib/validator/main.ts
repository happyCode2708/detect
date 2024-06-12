import { acidityClaimsValidator } from './acidityClaimsValidator';
import { allergenValidator } from './allergenValidator';
import { calorieClaimValidator } from './calorieClaimValidator';
import { certifierAndClaimsValidator } from './certifierAndClaimsValidator';
import { containValidator } from './containValidator';
import { factPanelValidator } from './factPanelValidator';
import { fatContentClaimValidator } from './fatContentClaimsValidator';
import { gradeClaimsValidator } from './gradeClaimValidator';
import { highRichExcellentClaimsValidator } from './highRichExcellentClaimsValidator';
import { ingredientsValidator } from './ingredientsValidator';
// import { nonCertifierClaimValidator } from './nonCertifierClaimValidator';
import { saltClaimValidator } from './saltClaimValidator';
import { sugarAndSweetClaimValidator } from './sugarAndSweetClaimValidator';
import { wholeGrainClaimValidator } from './wholeGrainClaim';
import { containValidatorOcr } from './ocrScanValidator/containValidatorOcr';
import { nonCertifierOcrValidator } from './ocrScanValidator/nonCertifierOcrValidator';
import { sugarAndSweetValidatorOcr } from './ocrScanValidator/sugarAndSweetValidatorOcr';
import { saltOrSodiumValidatorOcr } from './ocrScanValidator/saltOrSodiumClaimOcr';
import { calorieClaimValidatorOcr } from './ocrScanValidator/calorieClaimValidatorOcr';
import { fatClaimValidatorOcr } from './ocrScanValidator/fatClaimValidatorOcr';

export const responseValidator = async (response: any, ocrClaims: any) => {
  let validatedResponse = { ...response };

  console.log('start validator');

  factPanelValidator(validatedResponse);
  await validateProductDataPoints(validatedResponse, ocrClaims);

  console.log('finish');

  return validatedResponse;
};

const validateProductDataPoints = async (response: any, ocrClaims: any) => {
  const { factPanels, ...productDataPoints } = response?.product || {};

  let modifiedProductDataPoints = { ...productDataPoints };

  ingredientsValidator(modifiedProductDataPoints);
  highRichExcellentClaimsValidator(modifiedProductDataPoints);
  acidityClaimsValidator(modifiedProductDataPoints);
  certifierAndClaimsValidator(modifiedProductDataPoints);
  gradeClaimsValidator(modifiedProductDataPoints);
  await allergenValidator(modifiedProductDataPoints);
  await containValidatorOcr(modifiedProductDataPoints);
  await containValidator(modifiedProductDataPoints);
  // await nonCertifierClaimValidator(modifiedProductDataPoints);
  await nonCertifierOcrValidator(modifiedProductDataPoints);

  // await saltClaimValidator(modifiedProductDataPoints);
  await saltOrSodiumValidatorOcr(modifiedProductDataPoints);
  await sugarAndSweetClaimValidator(modifiedProductDataPoints);
  await sugarAndSweetValidatorOcr(modifiedProductDataPoints);
  // await calorieClaimValidator(modifiedProductDataPoints);
  await calorieClaimValidatorOcr(modifiedProductDataPoints);
  // await wholeGrainClaimValidator(modifiedProductDataPoints);
  // await fatContentClaimValidatordsa(modifiedProductDataPoints);
  await fatClaimValidatorOcr(modifiedProductDataPoints);

  // validateContainAndDoesNotContain(productDataPoints); //* attribute

  // console.log('test', modifiedProductDataPoints);

  // console.log(
  //   'last modified',
  //   JSON.stringify(modifiedProductDataPoints['ingredients_group'])
  // );

  response['product'] = { ...response.product, ...modifiedProductDataPoints };

  // console.log('response', JSON.stringify(response));
};

//? note
//* juice percent
//* milk type

//! bug
//* synthetic color => deduced from "artificial color"
