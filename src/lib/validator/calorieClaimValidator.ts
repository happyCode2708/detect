import { lowerCase, toLower } from 'lodash';

export const calorieClaimValidator = async (modifiedProductDataPoints: any) => {
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
    no,
    reduced,
  } = process;

  // console.log('oneHundredPercentOrAll', oneHundredPercentOrAll);

  console.log('start calorie claim validator');

  await validate(
    [...(low || [])],
    modifiedProductDataPoints,
    'calorieClaims',
    CALORIE_CLAIM_1
  );

  console.log('calorie claim -- 1');

  await validate(
    [...(reduced || [])],
    modifiedProductDataPoints,
    'calorieClaims',
    CALORIE_CLAIM_2
  );

  console.log('calorie claim -- 2');

  console.log('calorie claim validator -- finish');
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
    modifiedProductDataPoints?.['attributesAndCertifiers']?.['otherClaims'][
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
      console.log('found in enums -- calorie');
      if (containEnum === 'natural') {
        if (!possibleValueItem.includes(ingredientName)) {
          //   return;
        }
      }
      foundMatches.push(containEnum);
      return;
    }
  });

  return Promise.resolve(foundMatches);
};

const CALORIE_CLAIM_1 = {
  'low calorie': ['low calorie', 'calorie', 'low in calorie'],
};

const CALORIE_CLAIM_2 = {
  'reduced calorie': ['reduced calorie', 'calorie'],
};

const CALORIE_CLAIM_3 = {
  zero: ['zero calorie', 'calorie'],
};
