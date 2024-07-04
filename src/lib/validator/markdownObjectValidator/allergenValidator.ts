import { toLower, toUpper } from 'lodash';

export const allergenValidate = async (modifiedProductDataPoints: any) => {
  await validateNoContainList(modifiedProductDataPoints);
  await validateContainList(modifiedProductDataPoints);
};

const validateNoContainList = async (modifiedProductDataPoints: any) => {
  const notContainList =
    modifiedProductDataPoints?.['allergens']?.[0]?.['notContainList'];

  console.log('notContainList', notContainList);

  if (!notContainList) return null;
  let validated_notContainList = [] as any;

  notContainList?.split(', ')?.forEach((notContainItem: any) => {
    ALLERGEN_LIST.forEach((allergenItem: any) => {
      const variants = allergenItem?.variants;
      const name = allergenItem?.name;

      const isValid = variants.find((variantItem: any) =>
        toLower(notContainItem)?.includes(variantItem)
      );

      if (isValid) {
        validated_notContainList.push(toUpper(name));
      }
    });
  });

  modifiedProductDataPoints['allergens'][0]['validated_notContainList'] =
    validated_notContainList;
};

const validateContainList = async (modifiedProductDataPoints: any) => {
  const containList =
    modifiedProductDataPoints?.['allergens']?.[0]?.['containList'];

  if (!containList) return null;
  let validated_containList = [] as any;

  containList?.split(', ')?.forEach((containItem: any) => {
    ALLERGEN_LIST.forEach((allergenItem: any) => {
      const variants = allergenItem?.variants;
      const name = allergenItem?.name;

      const isValid = variants.find((variantItem: any) =>
        toLower(containItem)?.includes(variantItem)
      );

      if (isValid) {
        validated_containList.push(toUpper(name));
      }
    });
  });

  modifiedProductDataPoints['allergens'][0]['validated_containList'] =
    validated_containList;
};

const ALLERGEN_LIST = [
  {
    name: 'corn',
    variants: ['corn'],
  },
  {
    name: 'crustacean shellfish',
    variants: ['crustacean shellfish'],
  },
  {
    name: 'dairy',
    variants: ['dairy'],
  },
  {
    name: 'egg',
    variants: ['egg', 'eggs'],
  },
  {
    name: 'fish',
    variants: ['fish'],
  },
  {
    name: 'milk',
    variants: ['milk'],
  },
  {
    name: 'oats',
    variants: ['oats', 'oat'],
  },
  {
    name: 'peanuts / peanut oil',
    variants: ['peanuts', 'peanut', 'peanut oil', 'peanuts oil'],
  },
  {
    name: 'phenylalanine',
    variants: ['phenylalanine'],
  },
  {
    name: 'peanuts / peanut oil',
    variants: ['peanuts', 'peanut', 'peanut oil', 'peanuts oil'],
  },
  {
    name: 'seeds',
    variants: ['seeds', 'seed'],
  },
  {
    name: 'sesame',
    variants: ['sesame'],
  },
  {
    name: 'soy / soybeans',
    variants: ['soy', 'soys', 'soybean', 'soybeans'],
  },
  {
    name: 'tree nuts',
    variants: ['tree nuts'],
  },
  {
    name: 'wheat',
    variants: ['wheat'],
  },
];
