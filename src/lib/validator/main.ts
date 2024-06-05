import { acidityClaimsValidator } from './acidityClaimsValidator';
import { allergenValidator } from './allergenValidator';
import { calorieClaimValidator } from './calorieClaimValidator';
import { certifierAndClaimsValidator } from './certifierAndClaimsValidator';
import { containValidator } from './containValidator';
import { factPanelValidator } from './factPanelValidator';
import { fatContentClaimValidator } from './fatContentClaimsValidator';
import { highRichExcellentClaimsValidator } from './highRichExcellentClaimsValidator';
import { nonCertifierClaimValidator } from './nonCertifierClaimValidator';
import { saltClaimValidator } from './saltClaimValidator';
import { sugarAndSweetClaimValidator } from './sugarAndSweetClaimValidator';
import { wholeGrainClaimValidator } from './wholeGrainClaim';

export const responseValidator = async (response: any) => {
  let validatedResponse = { ...response };

  console.log('start validator');

  factPanelValidator(response);
  await validateProductDataPoints(response);

  console.log('finish');

  return validatedResponse;
};

const validateProductDataPoints = async (response: any) => {
  const { factPanels, ...productDataPoints } = response?.product || {};

  let modifiedProductDataPoints = { ...productDataPoints };

  highRichExcellentClaimsValidator(modifiedProductDataPoints);
  acidityClaimsValidator(modifiedProductDataPoints);
  certifierAndClaimsValidator(modifiedProductDataPoints);
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

  response['product'] = { ...response.product, ...modifiedProductDataPoints };
};
