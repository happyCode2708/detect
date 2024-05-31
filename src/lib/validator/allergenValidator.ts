import { lowerCase } from 'lodash';

export const allergenValidator = (modifiedProductDataPoints: any) => {
  const current_allergen_freeOf =
    modifiedProductDataPoints['allergen']['allergen_freeOf'] || [];

  const current_allergen_contain =
    modifiedProductDataPoints['allergen']['allergen_contain'] || [];

  const current_product_does_not_contain =
    modifiedProductDataPoints['contain_and_notContain'][
      'product_does_not_contain'
    ] || [];

  const current_product_contain =
    modifiedProductDataPoints['contain_and_notContain']['product_contain'] ||
    [];

  validateAllergenFreeOfOrContainOrContainOnEquipment(
    current_allergen_freeOf,
    current_product_does_not_contain,
    modifiedProductDataPoints,
    'validated_allergen_freeOf'
  );

  validateAllergenFreeOfOrContainOrContainOnEquipment(
    current_allergen_contain,
    current_product_contain,
    modifiedProductDataPoints,
    'validated_allergen_contain'
  );
};

const validateAllergenFreeOfOrContainOrContainOnEquipment = (
  allergenList: any,
  containList: any,
  modifiedProductDataPoints: any,
  dataPointKey: string
) => {
  let validated_allegen_field = [] as any;

  [...allergenList, ...containList].forEach((ingredientName) => {
    const lowercaseIngredientName = lowerCase(ingredientName);
    const matchedAllergens = checkMatchAllergen(lowercaseIngredientName);
    if (matchedAllergens?.length > 0) {
      validated_allegen_field = [
        ...validated_allegen_field,
        ...matchedAllergens,
      ];
    }
  });

  modifiedProductDataPoints['allergen'][dataPointKey] = [
    ...new Set(validated_allegen_field),
  ];
};

const checkMatchAllergen = (ingredientName: string) => {
  const ALLERGEN_MAPPING = {
    'crustacean shellfish': ['shellfish', 'crustacean shellfish'],
    corn: ['corn'],
    dairy: ['dairy'],
    egg: ['egg'],
    fish: ['fish'],
    milk: ['milk'],
    oats: ['oats'],
    'peanuts / peanut oil': [
      'peanuts / peanut oil',
      'peanuts',
      'peanut oil',
      'nuts',
      'tree nuts',
    ],
    phenylalanine: ['phenylalanine'],
    seeds: ['seeds'],
    sesame: ['seasame'],
    'soy / soybeans': ['soy / soybeans', 'soy', 'soybeans'],
    'tree nuts': ['tree nuts', 'nuts', 'nut'],
    wheat: ['wheat'],
  };

  let matchAllergens = [] as any;

  Object.entries(ALLERGEN_MAPPING).map((keyNvalue: any) => {
    const [allergenEnum, possibleValueList] = keyNvalue;

    possibleValueList.forEach((possibleValueItem: string) => {
      if (ingredientName.includes(possibleValueItem)) {
        matchAllergens.push(allergenEnum);
      }
    });
  });

  return matchAllergens;
};
