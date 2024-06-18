import { lowerCase, toLower, isEmpty } from 'lodash';

export const sugarAndSweetClaimValidator = async (
  modifiedProductDataPoints: any
) => {
  if (isEmpty(modifiedProductDataPoints)) return;

  const current_allergen_freeOf =
    modifiedProductDataPoints['allergen']['allergen_freeOf'][
      'allergen_freeOf_list'
    ] || [];

  const current_allergen_contain =
    modifiedProductDataPoints['allergen']['allergen_contain'][
      'allergen_contain_list'
    ] || [];

  const current_allergen_containOnEquipment =
    modifiedProductDataPoints['allergen']['allergen_containOnEquipment'][
      'allergen_containOnEquipment_list'
    ] || [];

  const current_product_does_not_contain =
    modifiedProductDataPoints['contain_and_notContain'][
      'product_does_not_contain'
    ] || [];

  const current_product_contain =
    modifiedProductDataPoints['contain_and_notContain']['product_contain'] ||
    [];

  const process = modifiedProductDataPoints['process'] || {};

  const {
    do_not_do,
    '100_percent_or_all': oneHundredPercentOrAll,
    low,
    lower,
    no,
  } = process;

  // console.log('oneHundredPercentOrAll', oneHundredPercentOrAll);

  console.log('start sugar claim validator');

  await validate(
    [...current_product_does_not_contain, ...no],
    modifiedProductDataPoints,
    'validated_sugar_and_sweet_claims',
    SUGAR_AND_SWEET_CLAIMS_1
  );

  console.log('sugar claim -- 1');

  await validate(
    [...(lower || [])],
    modifiedProductDataPoints,
    'validated_sugar_and_sweet_claims',
    SUGAR_AND_SWEET_CLAIMS_2
  );

  console.log('sugar claim -- 2');

  // await validate(
  //   [...(lower || [])],
  //   modifiedProductDataPoints,
  //   'sugarAndSweetClaims',
  //   SUGAR_AND_SWEET_CLAIMS_2
  // );

  // console.log('sugar claim -- 3');

  console.log('sugar claim validator -- finish');
};

const validate = async (
  ingredientList: string[],
  modifiedProductDataPoints: any,
  dataPointKey: string,
  enumValue: any
) => {
  let validated_fields = [] as any;

  for (const ingredientName of ingredientList) {
    const lowercaseIngredientName = toLower(ingredientName);
    const matchedAllergens = await checkMatch(
      lowercaseIngredientName,
      enumValue
    );

    if (matchedAllergens?.length > 0) {
      validated_fields = [...validated_fields, ...matchedAllergens];
    }
  }

  let currentValues =
    modifiedProductDataPoints?.['attributesAndCertifiers']?.['otherClaims']?.[
      dataPointKey
    ] || [];

  modifiedProductDataPoints['attributesAndCertifiers']['otherClaims'][
    dataPointKey
  ] = [...currentValues, ...new Set(validated_fields)];
};

const checkMatch = async (ingredientName: string, enumValue: any) => {
  let matchContains = [] as any;

  for (const keyNvalue of Object.entries(enumValue)) {
    const foundMatchs = await promiseCheckEachEnum(keyNvalue, ingredientName);
    matchContains = [...matchContains, ...foundMatchs];
  }

  console.log('matchContains', matchContains);

  return Promise.resolve(matchContains);
};

const promiseCheckEachEnum = async (keyNvalue: any, ingredientName: string) => {
  const [containEnum, possibleValueList] = keyNvalue;
  let foundMatches = [] as any;

  possibleValueList.forEach((possibleValueItem: string) => {
    console.log('coup', `${ingredientName}-${possibleValueItem}`);
    if (ingredientName.includes(possibleValueItem)) {
      console.log('found in enums');
      if (
        [
          'no cane sugar',
          'no sugar added',
          'no added sugar',
          'no sugar',
          'no sugar alcohol',
        ].includes(containEnum)
      ) {
        if (!possibleValueItem.includes(ingredientName)) {
          return;
        }
      }
      foundMatches.push(containEnum);
      return;
    }
  });

  return Promise.resolve(foundMatches);
};

const SUGAR_AND_SWEET_CLAIMS_1 = {
  'no acesulfame k': ['no acesulfame k', 'acesulfame k', 'acesulfame'],
  'no agave': ['no agave', 'agave'],
  'no allulose': ['no allulose', 'allulose'],
  'no artificial sweetener': [
    'no artificial sweetener',
    'artificial sweetener',
  ],
  'no aspartame': ['no aspartame', 'aspartame'],
  'no coconut/coconut palm sugar': [
    'no coconut/coconut palm sugar',
    'coconut palm sugar',
    'coconut sugar',
  ],
  'no corn syrup': ['no corn syrup', 'corn syrup'],
  'no high fructose corn syrup': [
    'no high fructose corn syrup',
    'high fructose corn syrup',
  ],
  'no refined sugars': ['no refined sugars', 'refined sugars'],
  'no saccharin': ['no saccharin', 'saccharin'],
  'no splenda/sucralose': ['no splenda/sucralose', 'splenda/sucralose'],
  'no stevia': ['no stevia', 'stevia'],
  'no added sugar': ['no added sugar', 'added sugar'], //! sugar
  'no sugar added': ['no sugar added', 'sugar added'], //! sugar
  'no cane sugar': ['no cane sugar', 'cane sugar'], //! sugar
  'no sugar alcohol': ['no sugar alcohol', 'sugar alcohol'], //! sugar
  'no sugar': ['no sugar', 'sugar'], //! sugar
  'no tagatose': ['no tagatose', 'tagatose'],
  'no xylitol': ['no xylitol', 'xylitol'],
  unsweetened: ['unsweetened'],
};

const SUGAR_AND_SWEET_CLAIMS_2 = {
  'lower sugar': ['lower sugar', 'sugar'],
};

const SUGAR_AND_SWEET_CLAIMS_3 = {
  'acesulfame k': ['acesulfame k'],
  agave: ['agave'],
  allulose: ['allulose'],
  'artificial sweetener': ['artificial sweetener'],
  aspartame: ['aspartame'],
  'beet sugar': ['beet sugar'],
  'cane sugar': ['cane sugar'],
  'coconut/coconut palm sugar': ['coconut/coconut palm sugar'],
  'fruit juice': ['fruit juice'],
  'high fructose corn syrup': ['high fructose corn syrup'],
  honey: ['honey'],
  'monk fruit': ['monk fruit'],
  'natural sweeteners': ['natural sweeteners'],
  'reduced sugar': ['reduced sugar'],
  'refined sugar': ['refined sugar'],
  saccharin: ['saccharin'],
  'splenda/sucralose': ['splenda/sucralose'],
  stevia: ['stevia'],
  'sugar alcohol': ['sugar alcohol'],
  'sugars added': ['sugars added'],
  tagatose: ['tagatose'],
  xylitol: ['xylitol'],
};

const SUGAR_AND_SWEET_CLAIMS_ORIGIN = {
  'acesulfame k': ['acesulfame k'],
  agave: ['agave'],
  allulose: ['allulose'],
  'artificial sweetener': ['artificial sweetener'],
  aspartame: ['aspartame'],
  'beet sugar': ['beet sugar'],
  'cane sugar': ['cane sugar'],
  'coconut/coconut palm sugar': ['coconut/coconut palm sugar'],
  'fruit juice': ['fruit juice'],
  'high fructose corn syrup': ['high fructose corn syrup'],
  honey: ['honey'],
  'low sugar': ['low sugar'],
  'lower sugar': ['lower sugar'],
  'monk fruit': ['monk fruit'],
  'natural sweeteners': ['natural sweeteners'],
  'no acesulfame k': ['no acesulfame k'],
  'no added sugar': ['no added sugar'],
  'no agave': ['no agave'],
  'no allulose': ['no allulose'],
  'no artificial sweetener': ['no artificial sweetener'],
  'no aspartame': ['no aspartame'],
  'no cane sugar': ['no cane sugar'],
  'no coconut/coconut palm sugar': ['no coconut/coconut palm sugar'],
  'no corn syrup': ['no corn syrup'],
  'no high fructose corn syrup': ['no high fructose corn syrup'],
  'no refined sugars': ['no refined sugars'],
  'no saccharin': ['no saccharin'],
  'no splenda/sucralose': ['no splenda/sucralose'],
  'no stevia': ['no stevia'],
  'no sugar': ['no sugar'],
  'no sugar added': ['no sugar added'],
  'no sugar alcohol': ['no sugar alcohol', 'sugar alcohol'],
  'no tagatose': ['no tagatose'],
  'no xylitol': ['no xylitol'],
  'reduced sugar': ['reduced sugar'],
  'refined sugar': ['refined sugar'],
  saccharin: ['saccharin'],
  'splenda/sucralose': ['splenda/sucralose'],
  stevia: ['stevia'],
  'sugar alcohol': ['sugar alcohol'],
  'sugar free': ['sugar free'],
  'sugars added': ['sugars added'],
  tagatose: ['tagatose'],
  unsweetened: ['unsweetened'],
  xylitol: ['xylitol'],
};
