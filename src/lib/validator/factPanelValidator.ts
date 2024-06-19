import { toLower } from 'lodash';

export const factPanelValidator = (response: any) => {
  let modifiedFactPanels = response['product']['factPanels'] || [];

  modifiedFactPanels = transformFactPanels(modifiedFactPanels);

  response['product']['factPanels'] = modifiedFactPanels;
};

const transformFactPanels = (factPanels: any) => {
  if (!factPanels) return factPanels;

  let cloneFactPanels = [...factPanels];

  cloneFactPanels = cloneFactPanels.map((factPanelItem: any) => {
    return transformOneFactPanel(factPanelItem);
  });

  return cloneFactPanels;
};

const transformOneFactPanel = (factPanelItem: any) => {
  let cloneFactPanelItem = { ...factPanelItem };

  cloneFactPanelItem.nutrients = cloneFactPanelItem.nutrients.map(
    (nutrientItem: any) => {
      let modifiedNutrient = { ...nutrientItem };

      validateNutrientName(modifiedNutrient);
      validateSubIngredient(modifiedNutrient);

      return modifiedNutrient;
    }
  );

  return cloneFactPanelItem;
};

const getDescriptor = (nutrientName: string) => {
  const pattern = /(\s*\([^()]*\))+$/;
  const match = nutrientName.match(pattern);
  return match ? match[0] : null;
};

const validateNutrientName = (modifiedNutrient: any) => {
  const logicExtractedDescriptor = getDescriptor(modifiedNutrient?.name);
  if (logicExtractedDescriptor && !modifiedNutrient?.['descriptor']) {
    modifiedNutrient['descriptor'] = logicExtractedDescriptor;
    modifiedNutrient['name'] = modifiedNutrient['name']?.split(
      logicExtractedDescriptor
    )?.[0];
  }
};

const validateSubIngredient = (modifiedNutrient: any) => {
  const lowerNutrientName = toLower(modifiedNutrient?.name);
  console.log(lowerNutrientName);

  if (['total sugar', 'total sugars'].includes(lowerNutrientName)) {
    let contain_sub_ingredients =
      modifiedNutrient?.['contain_sub_ingredients'] || [];

    const foundAddedSugarIdx = contain_sub_ingredients?.findIndex(
      (subIngredientItem: any) => {
        return toLower(subIngredientItem?.['full_name']).includes(
          'added sugars'
        );
      }
    );

    if (foundAddedSugarIdx !== -1) {
      contain_sub_ingredients.splice(foundAddedSugarIdx, 1);
      modifiedNutrient['contain_sub_ingredients'] = contain_sub_ingredients;
    }
  }
};
