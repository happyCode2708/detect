import { toLower, toUpper } from 'lodash';

export const allergenValidate = async (modifiedProductDataPoints: any) => {
  await validateNoContainList(modifiedProductDataPoints);
  await validateContainList(modifiedProductDataPoints);
  await validateContainOnEquipmentList(modifiedProductDataPoints);
};

const validateNoContainList = async (modifiedProductDataPoints: any) => {
  const notContainList =
    modifiedProductDataPoints?.['allergens']?.[0]?.['notContainList'];

  if (!notContainList) return null;
  let validated_notContainList = [] as any;

  notContainList?.split(', ')?.forEach((notContainItem: any) => {
    ALLERGEN_LIST.some((allergenItem: any) => {
      const variants = allergenItem?.variants;
      const name = allergenItem?.name;

      const isValid = variants.find((variantItem: any) =>
        toLower(notContainItem)?.includes(variantItem)
      );

      if (isValid) {
        validated_notContainList = Array.from(
          new Set([...validated_notContainList, toUpper(name)])
        );
        return true;
      }

      return false;
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
    ALLERGEN_LIST.some((allergenItem: any) => {
      const variants = allergenItem?.variants;
      const name = allergenItem?.name;

      const isValid = variants.find((variantItem: any) =>
        toLower(containItem)?.includes(variantItem)
      );

      if (isValid) {
        validated_containList = Array.from(
          new Set([...validated_containList, toUpper(name)])
        );
        return true;
      }

      return false;
    });
  });

  modifiedProductDataPoints['allergens'][0]['validated_containList'] =
    validated_containList;
};

const validateContainOnEquipmentList = async (
  modifiedProductDataPoints: any
) => {
  const containOnEquipmentList =
    modifiedProductDataPoints?.['allergens']?.[0]?.['containOnEquipmentList'];

  if (!containOnEquipmentList) return null;
  let validated_containOnEquipmentList = [] as any;

  containOnEquipmentList?.split(', ')?.forEach((containItem: any) => {
    ALLERGEN_LIST.some((allergenItem: any) => {
      const variants = allergenItem?.variants;
      const name = allergenItem?.name;

      const isValid = variants.find((variantItem: any) =>
        toLower(containItem)?.includes(variantItem)
      );

      if (isValid) {
        validated_containOnEquipmentList = Array.from(
          new Set([...validated_containOnEquipmentList, toUpper(name)])
        );
        return true;
      }

      return false;
    });
  });

  modifiedProductDataPoints['allergens'][0][
    'validated_containOnEquipmentList'
  ] = validated_containOnEquipmentList;
};

const ALLERGEN_LIST = [
  {
    name: 'corn',
    variants: [
      'corn',
      'maize',
      'cornmeal',
      'cornstarch',
      'high fructose corn syrup',
    ],
  },
  {
    name: 'crustacean shellfish',
    variants: [
      'crustacean shellfish',
      'shellfish',
      'shrimp',
      'crab',
      'lobster',
      'prawn',
      'krill',
    ],
  },
  {
    name: 'dairy',
    variants: [
      'dairy',
      // 'milk',
      'cheese',
      'butter',
      'cream',
      'yogurt',
      'whey',
      'casein',
      'lactose',
    ],
  },
  {
    name: 'egg',
    variants: ['egg', 'eggs', 'albumin', 'egg white', 'egg yolk', 'lysozyme'],
  },
  {
    name: 'fish',
    variants: ['fish', 'salmon', 'tuna', 'cod', 'trout', 'bass', 'anchovy'],
  },
  {
    name: 'milk',
    variants: [
      'milk',
      'whole milk',
      'skim milk',
      'milk powder',
      'condensed milk',
    ],
  },
  {
    name: 'oats',
    variants: [
      'oats',
      'oat',
      'oatmeal',
      'rolled oats',
      'oat bran',
      'oat flour',
    ],
  },
  {
    name: 'peanuts / peanut oil',
    variants: [
      'peanuts',
      'peanut',
      'peanut oil',
      'peanuts oil',
      'groundnut',
      'groundnut oil',
    ],
  },
  {
    name: 'phenylalanine',
    variants: ['phenylalanine', 'aspartame', 'NutraSweet'],
  },
  {
    name: 'seeds',
    variants: [
      'seeds',
      'seed',
      'sunflower seeds',
      'pumpkin seeds',
      'flaxseeds',
      'chia seeds',
    ],
  },
  {
    name: 'sesame',
    variants: ['sesame', 'sesame seeds', 'sesame oil', 'tahini'],
  },
  {
    name: 'soy / soybeans',
    variants: [
      'soy',
      'soys',
      'soybean',
      'soybeans',
      'tofu',
      'tempeh',
      'soy milk',
      'edamame',
      'soy sauce',
      'miso',
    ],
  },
  {
    name: 'tree nuts',
    variants: [
      'tree nuts',
      'tree nut',
      'almonds',
      'walnuts',
      'cashews',
      'hazelnuts',
      'pecans',
      'pistachios',
      'macadamia nuts',
      'coconut',
    ],
  },
  {
    name: 'wheat',
    variants: [
      'wheat',
      'whole wheat',
      'wheat flour',
      'durum',
      'semolina',
      'spelt',
      'farro',
      'bulgur',
      'couscous',
    ],
  },
];
