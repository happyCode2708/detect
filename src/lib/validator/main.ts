import { allergenValidator } from './allergenValidator';
import { containValidator } from './containValidator';
import { factPanelValidator } from './factPanelValidator';

export const responseValidator = (response: any) => {
  let validatedResponse = { ...response };

  factPanelValidator(response);
  validateProductDataPoints(response);

  return validatedResponse;
};

const validateProductDataPoints = (response: any) => {
  const { factPanels, ...productDataPoints } = response?.product || {};

  let modifiedProductDataPoints = { ...productDataPoints };

  allergenValidator(modifiedProductDataPoints);
  containValidator(modifiedProductDataPoints);

  // validateContainAndDoesNotContain(productDataPoints); //* attribute

  response['product'] = { ...response.product, ...modifiedProductDataPoints };
};
