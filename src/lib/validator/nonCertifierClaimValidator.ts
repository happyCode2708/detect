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
    DOES_NOT_CONTAIN_MAPPING
  );

  console.log('non Certifier claim -- 1');

  await validate(
    [
      ...current_allergen_contain,
      ...current_product_contain,
      ...oneHundredPercentOrAll,
    ],
    modifiedProductDataPoints,
    'nonCertifierClaims',
    CONTAIN_MAPPING
  );

  console.log('non Certifier claim -- 2');

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
  let foundMatchs = [] as any;

  possibleValueList.forEach((possibleValueItem: string) => {
    console.log('coup', `${ingredientName}-${possibleValueItem}`);
    if (ingredientName.includes(possibleValueItem)) {
      console.log('found in enums');
      if (containEnum === 'natural') {
        if (!possibleValueItem.includes(ingredientName)) {
          return;
        }
      }
      foundMatchs.push(containEnum);
      return;
    }
  });

  return Promise.resolve(foundMatchs);
};

const DOES_NOT_CONTAIN_MAPPING = {
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

const LOW_MAPPING = {
  'low acid': ['low acid'],
  'low carbohydrate': ['low carbohydrate'],
  'low cholesterol': ['low cholesterol'],
};
const CONTAIN_MAPPING = {
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
  natural: ['natural'],
  'natural botanicals': ['natural botanicals'],
  'natural fragrances': ['natural fragrances'],
  'natural ingredients': ['natural ingredients'],
  pasteurized: ['pasteurized'],
  'pasture raised': ['pasture raised'],
  'prairie raised': ['prairie raised'],
  raw: ['raw'],
  'responsibly sourced palm oil': ['responsibly sourced palm oil'],
  sprouted: ['sprouted'],
  'un-filtered': ['un-filtered'],
  'un-pasteurized': ['un-pasteurized'],
  unscented: ['unscented'],
  'vegetarian or vegan diet/feed': ['vegetarian or vegan diet/feed'],
  wild: ['wild'],
  'wild caught': ['wild caught'],
};

// "GMOs",
// "Synthetics",
// "Additives",
// "Adulterants",
// "Animal Testing"

const SODILUM_CLAIMS = {
  'lightly salted': ['lightly salted'],
  'low sodium': ['low sodium'],
  'no salt': ['no salt'],
  'no salt added': ['no salt added'],
  'reduced sodium': ['reduced sodium'],
  'salt free': ['salt free'],
  'sodium free': ['sodium free'],
  unsalted: ['unsalted'],
  'very low sodium': ['very low sodium'],
};
