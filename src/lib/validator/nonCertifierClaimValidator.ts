import { lowerCase, toLower } from 'lodash';

export const nonCertifierClaimValidator = async (
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
    raw,
    un_prefix,
    natural,
  } = process;

  console.log('oneHundredPercentOrAll', oneHundredPercentOrAll);

  console.log('start non certifier claim validator');

  await validate(
    [
      ...current_allergen_freeOf,
      ...current_product_does_not_contain,
      ...do_not_do,
    ],
    modifiedProductDataPoints,
    'nonCertifierClaims',
    NON_CERTIFIED_MAPPING_1
  );

  console.log('non Certifier claim -- 1');

  await validate(
    [
      ...current_allergen_contain,
      ...current_product_contain,
      ...(oneHundredPercentOrAll || []),
      ...(raw || []),
    ],
    modifiedProductDataPoints,
    'nonCertifierClaims',
    NON_CERTIFIED_MAPPING_2
  );

  console.log('non Certifier claim -- 2');

  await validate(
    [...(low || [])],
    modifiedProductDataPoints,
    'nonCertifierClaims',
    NON_CERTIFIED_MAPPING_3
  );

  console.log('non Certifier claim -- 3');

  await validate(
    [...(un_prefix || [])],
    modifiedProductDataPoints,
    'nonCertifierClaims',
    NON_CERTIFIED_MAPPING_4
  );

  console.log('non Certifier claim -- 4');

  await validate(
    [...(natural || [])],
    modifiedProductDataPoints,
    'nonCertifierClaims',
    NON_CERTIFIED_MAPPING_5
  );

  console.log('non Certifier claim -- 5');

  console.log('non certifier claim validator -- finish');
};

const validate = async (
  ingredientList: string[],
  modifiedProductDataPoints: any,
  dataPointKey: string,
  enumValue: any
) => {
  let validated_allegen_field = [] as any;

  for (const ingredientName of ingredientList) {
    const lowercaseIngredientName = toLower(ingredientName);
    const matchedAllergens = await checkMatch(
      lowercaseIngredientName,
      enumValue
    );

    if (matchedAllergens?.length > 0) {
      validated_allegen_field = [
        ...validated_allegen_field,
        ...matchedAllergens,
      ];
    }
  }

  let currentValues =
    modifiedProductDataPoints['attributesAndCertifiers']['otherClaims'][
      dataPointKey
    ] || [];

  modifiedProductDataPoints['attributesAndCertifiers']['otherClaims'][
    dataPointKey
  ] = [...currentValues, ...new Set(validated_allegen_field)];
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
      if (containEnum === 'natural') {
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

const NON_CERTIFIED_MAPPING_1 = {
  'acid free': ['acid free', 'acid'],
  'free range': ['free range', 'range'],
  'no animal testing': ['no animal testing', 'animal testing'],
  'no sulfites added': ['no sulfites added', 'sulfites'],
  'non gebrokts': ['non gebrokts', 'gebrokts'],
  'non-alcoholic': ['non-alcoholic', 'alcoholic'],
  'non-irradiated': ['non-irradiated'],
  'non-toxic': ['non-toxic', 'toxic'],
  'not fried': ['not fried', 'fried'],
  'not from concentrate': ['not from concentrate'],
};

const NON_CERTIFIED_MAPPING_2 = {
  '100% natural': ['100% natural'],
  '100% natural ingredients': ['100% natural ingredients'],
  '100% pure': ['100% pure'],
  'aeroponic grown': ['aeroponic grown'],
  'all natural': ['all natural'],
  'all natural ingredients': ['all natural ingredients'],
  'aquaponic/aquaculture grown': ['aquaponic/aquaculture grown'],
  baked: ['baked'],
  biodegradable: ['biodegradable'],
  'cage free': ['cage free'],
  'cold-pressed': ['cold-pressed'],
  'direct trade': ['direct trade'],
  'dolphin safe': ['dolphin safe'],
  'dry roasted': ['dry roasted'],
  'eco-friendly': ['eco-friendly'],
  'farm raised': ['farm raised'],
  filtered: ['filtered'],
  'freeze-dried': ['freeze-dried'],
  'from concentrate': ['from concentrate'],
  'grade a': ['grade a'],
  'greenhouse grown': ['greenhouse grown'],
  'heat treated': ['heat treated'],
  heirloom: ['heirloom'],
  homeopathic: ['homeopathic'],
  homogenized: ['homogenized'],
  'hydroponic grown': ['hydroponic grown'],
  'hypo-allergenic': ['hypo-allergenic'],
  irradiated: ['irradiated'],
  'live food': ['live food'],
  macrobiotic: ['macrobiotic'],
  'minimally processed': ['minimally processed'],
  pasteurized: ['pasteurized'],
  'pasture raised': ['pasture raised'],
  'prairie raised': ['prairie raised'],
  raw: ['raw'],
  'responsibly sourced palm oil': ['responsibly sourced palm oil'],
  sprouted: ['sprouted'],
  'vegetarian or vegan diet/feed': ['vegetarian or vegan diet/feed'],
  wild: ['wild'],
  'wild caught': ['wild caught'],
};

const NON_CERTIFIED_MAPPING_3 = {
  'low acid': ['low acid', 'acid'],
  'low carbohydrate': ['low carbohydrate', 'carbohydrate'],
  'low cholesterol': ['low cholesterol', 'cholesterol'],
};

const NON_CERTIFIED_MAPPING_4 = {
  'un-filtered': ['un-filtered', 'unfiltered'],
  'un-pasteurized': ['un-pasteurized', 'unpasteurized'],
  unscented: ['unscented'],
};

const NON_CERTIFIED_MAPPING_5 = {
  natural: ['natural'],
  'natural botanicals': ['natural botanicals'],
  'natural fragrances': ['natural fragrances'],
  'natural ingredients': ['natural ingredients'],
};
