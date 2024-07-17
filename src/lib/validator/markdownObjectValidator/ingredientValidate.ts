import { toLower, toUpper } from 'lodash';

export const ingredientValidate = async (modifiedProductDataPoints: any) => {
  let modifiedIngredients = [
    ...(modifiedProductDataPoints?.['ingredients'] || []),
  ];
  await validateIngredientBreakdown(modifiedIngredients);
  await validateLiveAndActiveCultures(modifiedIngredients);

  modifiedProductDataPoints['ingredients'] = modifiedIngredients;
  // await validateCountryOfOrigin(modifiedProductDataPoints);
};

const validateIngredientBreakdown = async (modifiedIngredients: any) => {
  modifiedIngredients?.forEach((ingredientItem: any, idx: number) => {
    if (ingredientItem?.['ingredientBreakdown']) {
      modifiedIngredients[idx]['validated_ingredientBreakdown'] =
        ingredientItem?.['ingredientBreakdown']?.split('/');
    }
  });
};

const validateLiveAndActiveCultures = async (modifiedIngredients: any) => {
  modifiedIngredients?.forEach((ingredientItem: any, idx: number) => {
    if (ingredientItem?.['liveAndActiveCulturesStatement']) {
      modifiedIngredients[idx]['validated_liveAndActiveCulturesBreakdown'] =
        ingredientItem?.['liveAndActiveCulturesBreakdown']?.split('/');
    }
  });
};
