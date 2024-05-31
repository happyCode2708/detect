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
