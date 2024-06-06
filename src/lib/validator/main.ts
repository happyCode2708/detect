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
import { nonCertifierClaimValidator } from './nonCertifierClaimValidator';
import { saltClaimValidator } from './saltClaimValidator';
import { sugarAndSweetClaimValidator } from './sugarAndSweetClaimValidator';
import { wholeGrainClaimValidator } from './wholeGrainClaim';

export const responseValidator = async (response: any) => {
  let validatedResponse = { ...response };

  console.log('start validator');

  factPanelValidator(validatedResponse);
  await validateProductDataPoints(validatedResponse);

  console.log('finish');

  return validatedResponse;
};

const validateProductDataPoints = async (response: any) => {
  const { factPanels, ...productDataPoints } = response?.product || {};

  let modifiedProductDataPoints = { ...productDataPoints };

  ingredientsValidator(modifiedProductDataPoints);
  highRichExcellentClaimsValidator(modifiedProductDataPoints);
  acidityClaimsValidator(modifiedProductDataPoints);
  certifierAndClaimsValidator(modifiedProductDataPoints);
  gradeClaimsValidator(modifiedProductDataPoints);
  await allergenValidator(modifiedProductDataPoints);
  await containValidator(modifiedProductDataPoints);
  await nonCertifierClaimValidator(modifiedProductDataPoints);
  await saltClaimValidator(modifiedProductDataPoints);
  await sugarAndSweetClaimValidator(modifiedProductDataPoints);
  await calorieClaimValidator(modifiedProductDataPoints);
  await wholeGrainClaimValidator(modifiedProductDataPoints);
  await fatContentClaimValidator(modifiedProductDataPoints);

  // validateContainAndDoesNotContain(productDataPoints); //* attribute

  // console.log('test', modifiedProductDataPoints);

  console.log(
    'last modified',
    JSON.stringify(modifiedProductDataPoints['ingredients_group'])
  );

  response['product'] = { ...response.product, ...modifiedProductDataPoints };

  console.log('response', JSON.stringify(response));
};
