const { toLower, toUpper } = require('lodash');

const run = (notContainList) => {
  let validated_notContainList = [];

  notContainList?.split(/\/|and/)?.forEach((notContainItem) => {
    ALLERGEN_LIST.forEach((allergenItem) => {
      const variants = allergenItem?.variants;
      const name = allergenItem?.name;
      const statement_not_include = allergenItem?.statement_not_include;
      const trimmedNotContainItem = notContainItem?.trim();

      let validVariant = variants.find((variantItem) => {
        return toLower(trimmedNotContainItem)?.includes(variantItem);
      });

      // console.log('statement not include', statement_not_include);

      if (statement_not_include) {
        if (
          statement_not_include.some((expText) => {
            return toLower(trimmedNotContainItem)?.includes(expText);
          })
        ) {
          validVariant = false;
        }
      }
      console.log('valid variant --', validVariant);

      if (validVariant) {
        validated_notContainList = Array.from(
          new Set([...validated_notContainList, toUpper(name)])
        );
        return true;
      }

      return false;
    });
  });

  console.log(validated_notContainList);
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
    statement_not_include: ['seed oil', 'seed oil', 'seed oils'],
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
      'nuts',
      'nut',
      'tree nuts',
      'tree nut',
      'almonds',
      'almond',
      'walnut',
      'walnuts',
      'cashews',
      'cashew',
      'hazelnuts',
      'pecans',
      'pecan',
      'pistachios',
      'pistchio',
      'macadamia nuts',
      'coconut',
    ],
    statement_not_include: ['peanut'],
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

run('peanut');
