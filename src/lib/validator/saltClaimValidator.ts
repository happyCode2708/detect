import { lowerCase, toLower } from 'lodash';

export const saltClaimValidator = async (modifiedProductDataPoints: any) => {
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
  } = process;

  // console.log('oneHundredPercentOrAll', oneHundredPercentOrAll);

  console.log('start salt claim validator');

  await validate(
    [...(low || [])],
    modifiedProductDataPoints,
    'saltOrSodiumClaim',
    SODIUM_CLAIMS_1
  );

  console.log('salt claim -- 1');

  console.log('salt claim validator -- finish');
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
    console.log('coup - ', `${ingredientName}-${possibleValueItem}`);
    if (ingredientName.includes(possibleValueItem)) {
      console.log('found in enums');
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

// "GMOs",
// "Synthetics",
// "Additives",
// "Adulterants",
// "Animal Testing"

const SODIUM_CLAIMS_1 = {
  // 'lightly salted': ['lightly salted'],
  'low sodium': ['low sodium', 'sodium'],
  // 'no salt': ['no salt'],
  // 'no salt added': ['no salt added'],
  // 'reduced sodium': ['reduced sodium'],
  // 'salt free': ['salt free'],
  // 'sodium free': ['sodium free'],
  // unsalted: ['unsalted'],
  // 'very low sodium': ['very low sodium'],
};

const SODIUM_CLAIMS_2 = {
  // 'lightly salted': ['lightly salted'],
  // 'low sodium': ['low sodium'],
  // 'no salt': ['no salt'],
  // 'no salt added': ['no salt added'],
  // 'reduced sodium': ['reduced sodium'],
  // 'salt free': ['salt free'],
  // 'sodium free': ['sodium free', 'sodium'],
  // unsalted: ['unsalted'],
  'very low sodium': ['very low sodium'],
};
