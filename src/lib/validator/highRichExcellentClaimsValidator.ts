import { toLower } from 'lodash';

export const highRichExcellentClaimsValidator = async (
  modifiedProductDataPoints: any
) => {
  const process = modifiedProductDataPoints['process'] || {};

  const { high_in_full_statement, rich_in_full_statement } = process;

  console.log('start High/Rich In/Excellent Source claim validator');

  const all_rich_statement =
    [...rich_in_full_statement, ...high_in_full_statement] || [];

  modifiedProductDataPoints['attributesAndCertifiers']['otherClaims'][
    'High/Rich In/Excellent Source'
  ] = [...new Set(all_rich_statement)];

  console.log('High/Rich In/Excellent Source validator -- finish');
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
