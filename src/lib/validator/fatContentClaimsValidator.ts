import { toLower } from 'lodash';

export const fatContentClaimValidator = async (
  modifiedProductDataPoints: any
) => {
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
  } = process;

  // console.log('oneHundredPercentOrAll', oneHundredPercentOrAll);

  console.log('start fat content claim validator');

  await validate(
    [...(low || [])],
    modifiedProductDataPoints,
    'fatContentClaims',
    FAT_CONTAIN_CLAIM_1
  );

  console.log('fat content claim -- 1');

  console.log('fat content claim validator -- finish');
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
    modifiedProductDataPoints['attributesAndCertifiers']['otherClaims'][
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

const FAT_CONTAIN_CLAIM_1 = {
  'low fat': ['low fat'],
  'low in saturated fat': ['low in saturated fat'],
};

const FAT_CONTAIN_CLAIM_ORIGIN = {
  'fat free': ['fat free'],
  'free of saturated fat': ['free of saturated fat'],
  'low fat': ['low fat'],
  'low in saturated fat': ['low in saturated fat'],
  'no fat': ['no fat'],
  'no trans fat': ['no trans fat'],
  'reduced fat': ['reduced fat'],
  'trans fat free': ['trans fat free'],
  'zero grams trans fat per serving': ['zero grams trans fat per serving'],
  'zero trans fat': ['zero trans fat'],
};
