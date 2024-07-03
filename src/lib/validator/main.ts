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
import { nutFactMarkdownValidator } from './markdownObjectValidator/nutFactMarkdownValidator';
import { containAndNotContainClaimValidate } from './markdownObjectValidator/containAndNotContainValidate';
import { fatClaimValidate } from './markdownObjectValidator/fatClaimValidate';
import { nonCertifierClaimValidate } from './markdownObjectValidator/nonCertifierClaimValidate';
import { saltClaimValidate } from './markdownObjectValidator/saltClaimValidate';
import { sugarClaimValidate } from './markdownObjectValidator/sugarClaimValidate';
import { calorieClaimValidate } from './markdownObjectValidator/calorieClaimValidate';
import { HeaderValidate } from './markdownObjectValidator/HeaderValidate';

export const responseValidator = async (response: any, ocrClaims: any) => {
  let validatedResponse = { ...response };

  console.log('start validator');

  // factPanelValidator(validatedResponse);
  nutFactMarkdownValidator(validatedResponse);
  HeaderValidate(validatedResponse);
  await validateProductDataPoints(validatedResponse, ocrClaims);

  console.log('finish');

  return validatedResponse;
};

const validateProductDataPoints = async (response: any, ocrClaims: any) => {
  const { factPanels, nutMark, allMark, ...productDataPoints } =
    response?.product || {};

  let modifiedProductDataPoints = { ...productDataPoints };

  await calorieClaimValidate(modifiedProductDataPoints);
  await containAndNotContainClaimValidate(modifiedProductDataPoints, ocrClaims);
  await fatClaimValidate(modifiedProductDataPoints);
  await nonCertifierClaimValidate(modifiedProductDataPoints);
  await saltClaimValidate(modifiedProductDataPoints);
  await sugarClaimValidate(modifiedProductDataPoints);

  // ingredientsValidator(modifiedProductDataPoints);
  // highRichExcellentClaimsValidator(modifiedProductDataPoints);
  // acidityClaimsValidator(modifiedProductDataPoints);
  // certifierAndClaimsValidator(modifiedProductDataPoints);
  // gradeClaimsValidator(modifiedProductDataPoints);
  // await allergenValidator(modifiedProductDataPoints);
  // await containValidatorOcr(modifiedProductDataPoints);
  // await containValidator(modifiedProductDataPoints);
  // await nonCertifierClaimValidator(modifiedProductDataPoints);
  // await nonCertifierOcrValidator(modifiedProductDataPoints);

  // await saltClaimValidator(modifiedProductDataPoints);
  // await saltOrSodiumValidatorOcr(modifiedProductDataPoints);
  // await sugarAndSweetClaimValidator(modifiedProductDataPoints);
  // await sugarAndSweetValidatorOcr(modifiedProductDataPoints);
  // await calorieClaimValidator(modifiedProductDataPoints);
  // await calorieClaimValidatorOcr(modifiedProductDataPoints);
  // await wholeGrainClaimValidator(modifiedProductDataPoints);
  // await fatContentClaimValidatordsa(modifiedProductDataPoints);
  // await fatClaimValidatorOcr(modifiedProductDataPoints);
  // validateContainAndDoesNotContain(productDataPoints); //* attribute

  response['product'] = { ...response.product, ...modifiedProductDataPoints };
};

//? note
//* juice percent
//* milk type

//! bug
//* synthetic color => deduced from "artificial color"
