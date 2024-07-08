import { toLower, toUpper } from 'lodash';

export const nutFactMarkdownValidator = (response: any) => {
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

  cloneFactPanelItem.nutritionFacts = cloneFactPanelItem.nutritionFacts
    .map((nutrientItem: any) => {
      let modifiedNutrient = { ...nutrientItem };

      // validateNutrientName(modifiedNutrient);
      // validateSubIngredient(modifiedNutrient);
      validateNutrientName(modifiedNutrient);
      validateAmount(modifiedNutrient);
      validateBlendIngredients(modifiedNutrient);
      validatePercentDailyValue(modifiedNutrient);

      return modifiedNutrient;
    })
    .filter((nutrient: any) => nutrient?.nutrientName !== '##');

  return cloneFactPanelItem;
};

const validateBlendIngredients = (modifiedNutrient: any) => {
  let blendIngredients = modifiedNutrient?.blendIngredients;
  if (!blendIngredients) return;

  modifiedNutrient['blendIngredients'] = blendIngredients.replace(
    /<br>/g,
    '\n'
  );
};

const validateNutrientName = (modifiedNutrient: any) => {
  const nutrientName = toLower(modifiedNutrient?.nutrientName?.trim());

  const shortFormMap = {
    'vit. a': 'VITAMIN A',
    'vit. b1': 'VITAMIN B1',
    'vit. b2': 'VITAMIN B2',
    'vit. b3': 'VITAMIN B3',
    'vit. b5': 'VITAMIN B5',
    'vit. b6': 'VITAMIN B6',
    'vit. b7': 'VITAMIN B7',
    'vit. b9': 'VITAMIN B9',
    'vit. b12': 'VITAMIN B12',
    'vit. c': 'VITAMIN C',
    'vit. d': 'VITAMIN D',
    'vit. e': 'VITAMIN E',
    'vit. k': 'VITAMIN K',
    'vit.': 'VITAMIN',
    ca: 'CALCIUM',
    fe: 'IRON',
    mg: 'MAGNESIUM',
    zn: 'ZINC',
    na: 'SODIUM',
    k: 'POTASSIUM',
    p: 'PHOSPHORUS',
    cu: 'COPPER',
    mn: 'MANGANESE',
    se: 'SELENIUM',
    i: 'IODINE',
    cr: 'CHROMIUM',
    mo: 'MOLYBDENUM',
    pro: 'PROTEIN',
    carbs: 'CARBOHYDRATES',
    fat: 'FAT',
    'sat. fat': 'SATURATED FAT',
    'trans. fat': 'TRANS FAT',
    chol: 'CHOLESTEROL',
    sug: 'SUGARS',
    fib: 'FIBER',
    'omega-3': 'OMEGA-3 FATTY ACIDS',
    'omega-6': 'OMEGA-6 FATTY ACIDS',
    ala: 'ALPHA-LINOLENIC ACID',
    dha: 'DOCOSAHEXAENOIC ACID',
    epa: 'EICOSAPENTAENOIC ACID',
    bcaas: 'BRANCHED-CHAIN AMINO ACIDS',
    cal: 'CALORIES',
    kcal: 'KILOCALORIES',
    'potas.': 'POTASSIUM',
    'added sugars': 'ADDED SUGAR',
    //   iu: 'INTERNATIONAL UNITS',
    'total carbohydrate': 'TOTAL CARBOHYDRATES',
    fiber: 'DIETARY FIBER',
    'total carb.': 'TOTAL CARBOHYDRATES',
  } as any;

  const mappedNutrientName =
    shortFormMap?.[nutrientName] || toUpper(nutrientName);

  modifiedNutrient['validated_nutrientName'] = mappedNutrientName;
};

const validateAmount = (modifiedNutrient: any) => {
  let amountPerServing = modifiedNutrient?.amountPerServing?.trim();

  if (!amountPerServing) return;

  const amountMatch = amountPerServing.match(/\d+(\.\d+)?/);
  const uomMatch = amountPerServing.match(/[a-zA-Z]+/);

  const uomMap = {
    g: 'GRAM',
    mg: 'MILLIGRAM',
    kg: 'KILOGRAM',
    mcg: 'MICROGRAM',
    oz: 'OUNCE',
    lb: 'POUND',
  } as any;

  const uom = uomMatch ? uomMatch[0].toLowerCase() : null;
  const fullUOM = uom ? uomMap?.[uom] : null;

  modifiedNutrient['amount'] = amountMatch ? parseFloat(amountMatch[0]) : null;

  modifiedNutrient['uom'] = uom ? fullUOM : null;
};

const validatePercentDailyValue = (modifiedNutrient: any) => {
  let dailyValue = modifiedNutrient?.dailyValue?.trim();

  if (!dailyValue) return;

  const numberMatch = dailyValue.match(/\d+/);
  const indicatorMatch = dailyValue.match(/[*+†¥‡]+/g);

  modifiedNutrient['percent'] = numberMatch ? numberMatch[0] : null;
  modifiedNutrient['indicator'] = indicatorMatch ? indicatorMatch[0] : null;
};

//* in-progress
const validateFootnote = (modifiedNutrient: any) => {
  // if (!symbol && dailyValue && symbolList.find(dailyValue === '')) {
  //   modifiedNutrient['symbol'] = dailyValue;
  // }
};

// const getDescriptor = (nutrientName: string) => {
//   const pattern = /(\s*\([^()]*\))+$/;
//   const match = nutrientName.match(pattern);
//   return match ? match[0] : null;
// };

// const validateNutrientName = (modifiedNutrient: any) => {
//   const logicExtractedDescriptor = getDescriptor(modifiedNutrient?.name);
//   if (logicExtractedDescriptor && !modifiedNutrient?.['descriptor']) {
//     modifiedNutrient['descriptor'] = logicExtractedDescriptor;
//     modifiedNutrient['name'] = modifiedNutrient['name']?.split(
//       logicExtractedDescriptor
//     )?.[0];
//   }
// };

// const validateSubIngredient = (modifiedNutrient: any) => {
//   const lowerNutrientName = toLower(modifiedNutrient?.name);
//   console.log(lowerNutrientName);

//   if (['total sugar', 'total sugars'].includes(lowerNutrientName)) {
//     let contain_sub_ingredients =
//       modifiedNutrient?.['contain_sub_ingredients'] || [];

//     const foundAddedSugarIdx = contain_sub_ingredients?.findIndex(
//       (subIngredientItem: any) => {
//         return toLower(subIngredientItem?.['full_name']).includes(
//           'added sugars'
//         );
//       }
//     );

//     if (foundAddedSugarIdx !== -1) {
//       contain_sub_ingredients.splice(foundAddedSugarIdx, 1);
//       modifiedNutrient['contain_sub_ingredients'] = contain_sub_ingredients;
//     }
//   }
// };
