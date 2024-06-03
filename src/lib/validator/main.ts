import { allergenValidator } from './allergenValidator';
import { containValidator } from './containValidator';
import { factPanelValidator } from './factPanelValidator';
import { nonCertifierClaimValidator } from './nonCertifierClaimValidator';
import { saltClaimValidator } from './saltClaimValidator';
import { sugarAndSweetClaimValidator } from './sugarAndSweetClaimValidator copy';

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

  await allergenValidator(modifiedProductDataPoints);
  await containValidator(modifiedProductDataPoints);
  await nonCertifierClaimValidator(modifiedProductDataPoints);
  await saltClaimValidator(modifiedProductDataPoints);
  await sugarAndSweetClaimValidator(modifiedProductDataPoints);

  // validateContainAndDoesNotContain(productDataPoints); //* attribute

  // console.log('test', modifiedProductDataPoints);

  response['product'] = { ...response.product, ...modifiedProductDataPoints };
};
