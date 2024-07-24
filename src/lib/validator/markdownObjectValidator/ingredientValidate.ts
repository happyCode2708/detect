import { toLower, toUpper } from 'lodash';

export const ingredientValidate = async (modifiedProductDataPoints: any) => {
  let modifiedIngredients = [
    ...(modifiedProductDataPoints?.['ingredients'] || []),
  ];
  await validateIngredient(modifiedIngredients);
  await validateLiveAndActiveCultures(modifiedIngredients);

  modifiedProductDataPoints['ingredients'] = modifiedIngredients;
  // await validateCountryOfOrigin(modifiedProductDataPoints);
};

const validateIngredient = async (modifiedIngredients: any) => {
  modifiedIngredients?.forEach((ingredientItem: any, idx: number) => {
    if (ingredientItem?.['ingredientStatement']) {
      modifiedIngredients[idx]['validated_ingredients'] = {};
      modifiedIngredients[idx]['validated_ingredients']['ingredientStatement'] =
        ingredientItem?.['ingredientStatement'];
    }
    if (ingredientItem?.['ingredientBreakdown']) {
      modifiedIngredients[idx]['validated_ingredients']['ingredientBreakdown'] =
        ingredientItem?.['ingredientBreakdown']?.split('/');
    }
  });
};

const validateLiveAndActiveCultures = async (modifiedIngredients: any) => {
  modifiedIngredients?.forEach((ingredientItem: any, idx: number) => {
    if (ingredientItem?.['liveAndActiveCulturesStatement']) {
      if (!modifiedIngredients[idx]?.['validated_ingredients']) {
        modifiedIngredients[idx]['validated_ingredients'] = {};
      }
      modifiedIngredients[idx]['validated_ingredients'][
        'liveAndActiveCulturesStatement'
      ] = ingredientItem?.['liveAndActiveCulturesStatement'];
    }
    if (ingredientItem?.['liveAndActiveCulturesStatement']) {
      modifiedIngredients[idx]['validated_ingredients'][
        'liveAndActiveCulturesBreakdown'
      ] = ingredientItem?.['liveAndActiveCulturesBreakdown']?.split('/');
    }
  });
};
