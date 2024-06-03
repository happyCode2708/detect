import { allergenValidator } from './allergenValidator';
import { containValidator } from './containValidator';
import { factPanelValidator } from './factPanelValidator';
import { nonCertifierClaimValidator } from './nonCertifierClaimValidator';

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

  // validateContainAndDoesNotContain(productDataPoints); //* attribute

  // console.log('test', modifiedProductDataPoints);

  response['product'] = { ...response.product, ...modifiedProductDataPoints };
};
