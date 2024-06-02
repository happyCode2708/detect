import { lowerCase, toLower } from 'lodash';

export const allergenValidator = async (modifiedProductDataPoints: any) => {
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

  await validateAllergenFreeOfOrContainOrContainOnEquipment(
    [...current_allergen_freeOf, ...current_product_does_not_contain],
    modifiedProductDataPoints,
    'validated_allergen_freeOf'
  );

  console.log('allergen -- 1');

  await validateAllergenFreeOfOrContainOrContainOnEquipment(
    [...current_allergen_contain, ...current_product_contain],
    modifiedProductDataPoints,
    'validated_allergen_contain'
  );

  console.log('allergen -- 2');

  await validateAllergenFreeOfOrContainOrContainOnEquipment(
    current_allergen_containOnEquipment,
    modifiedProductDataPoints,
    'validated_allergen_containOnEquipment'
  );

  console.log('allergen -- 3');

  console.log('allergen validator -- finish');
};

const validateAllergenFreeOfOrContainOrContainOnEquipment = async (
  ingredientList: string[],
  modifiedProductDataPoints: any,
  dataPointKey: string
) => {
  let validated_allegen_field = [] as any;

  // ingredientList.forEach((ingredientName) => {
  //   const lowercaseIngredientName = lowerCase(ingredientName);
  //   const matchedAllergens = await checkMatchAllergen(lowercaseIngredientName);
  //   if (matchedAllergens?.length > 0) {
  //     validated_allegen_field = [
  //       ...validated_allegen_field,
  //       ...matchedAllergens,
  //     ];
  //   }
  // });

  for (const ingredientName of ingredientList) {
    const lowercaseIngredientName = toLower(ingredientName);
    const matchedAllergens = await checkMatchAllergen(lowercaseIngredientName);
    if (matchedAllergens?.length > 0) {
      validated_allegen_field = [
        ...validated_allegen_field,
        ...matchedAllergens,
      ];
    }
  }

  modifiedProductDataPoints['allergen'][dataPointKey] = [
    ...new Set(validated_allegen_field),
  ];
};

const checkMatchAllergen = async (ingredientName: string) => {
  let matchAllergens = [] as any;

  // Object.entries(ALLERGEN_MAPPING).forEach((keyNvalue: any) => {
  //   const [allergenEnum, possibleValueList] = keyNvalue;

  //   possibleValueList.forEach((possibleValueItem: string) => {
  //     if (ingredientName.includes(possibleValueItem)) {
  //       if (allergenEnum === 'tree nuts') {
  //         if (!possibleValueList.includes(ingredientName)) {
  //           return;
  //         }
  //       }

  //       matchAllergens.push(allergenEnum);
  //       return;
  //     }
  //   });
  // });

  for (const keyNvalue of Object.entries(ALLERGEN_MAPPING)) {
    await promiseCheckEachEnum(keyNvalue, ingredientName, matchAllergens);
  }

  return Promise.resolve(matchAllergens);
};

const promiseCheckEachEnum = async (
  keyNvalue: any,
  ingredientName: string,
  finalMatch: any
) => {
  const [allergenEnum, possibleValueList] = keyNvalue;

  possibleValueList.forEach((possibleValueItem: string) => {
    if (ingredientName.includes(possibleValueItem)) {
      if (allergenEnum === 'tree nuts') {
        if (!possibleValueList.includes(ingredientName)) {
          return;
        }
      }

      finalMatch.push(allergenEnum);
      return;
    }
  });

  return Promise.resolve(true);
};

const ALLERGEN_MAPPING = {
  'crustacean shellfish': ['shellfish', 'crustacean shellfish'],
  corn: ['corn'],
  dairy: ['dairy'],
  egg: ['egg'],
  fish: ['fish'],
  milk: ['milk'],
  oats: ['oats'],
  'peanuts / peanut oil': ['peanut', 'peanuts', 'peanut oil'],
  phenylalanine: ['phenylalanine'],
  seeds: ['seeds'],
  sesame: ['seasame'],
  'soy / soybeans': ['soy', 'soybeans'],
  'tree nuts': ['tree nuts', 'nuts', 'nut'],
  wheat: ['wheat'],
};

// const ALLERGEN_MAPPING_CONTAIN = {
//   'crustacean shellfish': ['shellfish', 'crustacean shellfish'],
//   corn: ['corn'],
//   dairy: ['dairy'],
//   egg: ['egg'],
//   fish: ['fish'],
//   milk: ['milk'],
//   oats: ['oats'],
//   'peanuts / peanut oil': [
//     'peanuts / peanut oil',
//     'peanuts',
//     'peanut oil',
//     'tree nuts',
//   ],
//   phenylalanine: ['phenylalanine'],
//   seeds: ['seeds'],
//   sesame: ['seasame'],
//   'soy / soybeans': ['soy / soybeans', 'soy', 'soybeans'],
//   'tree nuts': ['tree nuts', 'nuts', 'nut'],
//   wheat: ['wheat'],
// };
