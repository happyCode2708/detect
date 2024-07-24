import { contains } from 'cheerio/lib/static';
import { toLower, toUpper } from 'lodash';

export const allergenValidate = async (modifiedProductDataPoints: any) => {
  await validateNoContainList(modifiedProductDataPoints);
  await validateContainList(modifiedProductDataPoints);
  await validateContainOnEquipmentList(modifiedProductDataPoints);
  await mapToValidatedAllergenObject(modifiedProductDataPoints);
};

const validateNoContainList = async (modifiedProductDataPoints: any) => {
  modifiedProductDataPoints?.['allergens']?.forEach(
    (allergenItem: any, idx: number) => {
      const notContainList =
        modifiedProductDataPoints?.['allergens']?.[idx]?.['notContainList'];
      const notContainStatement =
        modifiedProductDataPoints?.['allergens']?.[idx]?.[
          'notContainStatement'
        ];

      let validated_notContainList = [] as any;
      if (notContainList) {
        notContainList?.split(/\/|and/)?.forEach((notContainItem: any) => {
          ALLERGEN_LIST.forEach((allergenItem: any) => {
            const variants = allergenItem?.variants;
            const name = allergenItem?.name;
            const statement_not_include = allergenItem?.statement_not_include;
            const trimmedNotContainItem = notContainItem?.trim();

            let validVariant = variants.find((variantItem: any) => {
              return toLower(trimmedNotContainItem)?.includes(variantItem);
            });

            if (statement_not_include) {
              if (
                statement_not_include.some((expText: string) => {
                  return toLower(trimmedNotContainItem)?.includes(expText);
                })
              ) {
                validVariant = false;
              }
            }

            if (validVariant) {
              validated_notContainList = Array.from(
                new Set([...validated_notContainList, toUpper(name)])
              );
              return true;
            }

            return false;
          });
        });

        modifiedProductDataPoints['allergens'][idx][
          'validated_notContainList'
        ] = validated_notContainList;
      } else {
        //* notContainList empty but must check notContainStatemet
        if (notContainStatement) {
          ALLERGEN_LIST.some((allergenItem: any) => {
            const variants = allergenItem?.variants;
            const name = allergenItem?.name;
            const statement_not_include = allergenItem?.statement_not_include;
            // const trimContainItem = notContainItem?.trim();

            let isValid = variants.find((variantItem: any) =>
              toLower(notContainStatement)?.split(' ')?.includes(variantItem)
            );

            // if (statement_not_include) {
            //   let statement = containStatement;
            //   if (
            //     statement_not_include.some((expText: string) => {
            //       return toLower(statement)?.includes(expText);
            //     })
            //   ) {
            //     isValid = false;
            //   }
            // }

            if (isValid) {
              validated_notContainList = Array.from(
                new Set([...validated_notContainList, toUpper(name)])
              );
            }
          });

          modifiedProductDataPoints['allergens'][idx][
            'validated_notContainList'
          ] = validated_notContainList;
        }
      }
    }
  );
};

const validateContainList = async (modifiedProductDataPoints: any) => {
  modifiedProductDataPoints?.['allergens']?.forEach(
    (allergenItem: any, idx: number) => {
      const containList =
        modifiedProductDataPoints?.['allergens']?.[idx]?.['containList'];
      const containStatement =
        modifiedProductDataPoints?.['allergens']?.[idx]?.['containStatement'];

      if (!containList) return null;
      let validated_containList = [] as any;

      containList?.split(/\/|and/)?.forEach((containItem: any) => {
        ALLERGEN_LIST.some((allergenItem: any) => {
          const variants = allergenItem?.variants;
          const name = allergenItem?.name;
          const statement_not_include = allergenItem?.statement_not_include;
          const trimmedContainItem = containItem?.trim();

          let validVariant = variants.find((variantItem: any) =>
            toLower(trimmedContainItem)?.includes(variantItem)
          );

          if (statement_not_include) {
            if (
              statement_not_include.some((expText: string) => {
                return toLower(trimmedContainItem)?.includes(expText);
              })
            ) {
              validVariant = false;
            }
          }

          if (validVariant) {
            validated_containList = Array.from(
              new Set([...validated_containList, toUpper(name)])
            );
            return true;
          }

          return false;
        });
      });

      modifiedProductDataPoints['allergens'][idx]['validated_containList'] =
        validated_containList;
    }
  );
};

const validateContainOnEquipmentList = async (
  modifiedProductDataPoints: any
) => {
  modifiedProductDataPoints?.['allergens']?.forEach(
    (allergenItem: any, idx: number) => {
      const containOnEquipmentList =
        modifiedProductDataPoints?.['allergens']?.[idx]?.[
          'containOnEquipmentList'
        ];

      const containStatement =
        modifiedProductDataPoints?.['allergens']?.[idx]?.[
          'containOnEquipmentStatement'
        ];

      if (!containOnEquipmentList) return null;
      let validated_containOnEquipmentList = [] as any;

      containOnEquipmentList?.split(/\/|and/)?.forEach((containItem: any) => {
        ALLERGEN_LIST.some((allergenItem: any) => {
          const variants = allergenItem?.variants;
          const name = allergenItem?.name;
          const statement_not_include = allergenItem?.statement_not_include;
          const trimContainItem = containItem?.trim();

          let validVariant = variants.find((variantItem: any) =>
            toLower(trimContainItem)?.includes(variantItem)
          );

          if (statement_not_include) {
            if (
              statement_not_include.some((expText: string) => {
                return toLower(trimContainItem)?.includes(expText);
              })
            ) {
              validVariant = false;
            }
          }

          if (validVariant) {
            validated_containOnEquipmentList = Array.from(
              new Set([...validated_containOnEquipmentList, toUpper(name)])
            );
            return true;
          }

          return false;
        });
      });

      modifiedProductDataPoints['allergens'][idx][
        'validated_containOnEquipmentList'
      ] = validated_containOnEquipmentList;
    }
  );
};

const mapToValidatedAllergenObject = async (modifiedProductDataPoints: any) => {
  const validatedAllergenList = modifiedProductDataPoints?.['allergens'];

  if (validatedAllergenList?.length <= 0) return;

  modifiedProductDataPoints['validated_allergens'] = {
    allergensAncillary: [],
    allergens: [],
    processedOnEquipment: [],
    inFacilityOnEquipmentIncluding: [],
    processedManufacturedInFacilityStatement: [],
    inFacilityOnEquipmentStatement: [],
    freeOf: [],
  };

  validatedAllergenList?.forEach((validatedAllergenItem: any) => {
    const {
      containStatement,
      notContainStatement,
      containOnEquipmentStatement,
      validated_containList,
      validated_containOnEquipmentList,
      validated_notContainList,
    } = validatedAllergenItem;

    if (containStatement && validated_containList) {
      const currentValue =
        modifiedProductDataPoints?.['validated_allergens']?.[
          'allergensAncillary'
        ];

      modifiedProductDataPoints['validated_allergens']['allergensAncillary'] = [
        ...currentValue,
        containStatement,
      ];
    }

    // if (notContainStatement && validated_notContainList) {
    //   const currentValue =
    //     modifiedProductDataPoints?.['validated_allergens']?.[
    //       'allergensAncillary'
    //     ];

    //   modifiedProductDataPoints['validated_allergens']['allergensAncillary'] = [
    //     ...currentValue,
    //     notContainStatement,
    //   ];
    // }

    if (containOnEquipmentStatement) {
      const currentValue =
        modifiedProductDataPoints?.['validated_allergens']?.[
          'processedManufacturedInFacilityStatement'
        ];

      modifiedProductDataPoints['validated_allergens'][
        'processedManufacturedInFacilityStatement'
      ] = [...currentValue, containOnEquipmentStatement];

      modifiedProductDataPoints['validated_allergens'][
        'inFacilityOnEquipmentStatement'
      ] = [...currentValue, containOnEquipmentStatement];
    }

    if (validated_containList) {
      const currentValue =
        modifiedProductDataPoints?.['validated_allergens']?.['allergens'];

      modifiedProductDataPoints['validated_allergens']['allergens'] =
        Array.from(new Set([...currentValue, ...validated_containList]));
    }

    if (validated_notContainList) {
      const currentValue =
        modifiedProductDataPoints?.['validated_allergens']?.['freeOf'];

      modifiedProductDataPoints['validated_allergens']['freeOf'] = Array.from(
        new Set([...currentValue, ...validated_notContainList])
      );
    }

    if (validated_containOnEquipmentList) {
      const currentValue =
        modifiedProductDataPoints?.['validated_allergens']?.[
          'processedOnEquipment'
        ];

      modifiedProductDataPoints['validated_allergens']['processedOnEquipment'] =
        [...currentValue, ...validated_containOnEquipmentList];

      modifiedProductDataPoints['validated_allergens'][
        'inFacilityOnEquipmentIncluding'
      ] = Array.from(
        new Set([...currentValue, ...validated_containOnEquipmentList])
      );
    }
  });

  //? possible allergen free from labeling
  const labelingFreeList =
    modifiedProductDataPoints?.['validated_labeling']?.['free'];

  if (labelingFreeList) {
    labelingFreeList?.forEach((notContainItem: any) => {
      ALLERGEN_LIST.some((allergenItem: any) => {
        const variants = allergenItem?.variants;
        const name = allergenItem?.name;
        const statement_not_include = allergenItem?.statement_not_include;
        const trimmedNotContainItem = notContainItem?.trim();

        let validVariant = variants.find((variantItem: any) => {
          return toLower(trimmedNotContainItem)?.includes(variantItem);
        });

        if (statement_not_include) {
          if (
            statement_not_include.some((expText: string) => {
              return toLower(trimmedNotContainItem)?.includes(expText);
            })
          ) {
            validVariant = false;
          }
        }

        if (validVariant) {
          const currentValue =
            modifiedProductDataPoints?.['validated_allergens']?.['freeOf'];

          modifiedProductDataPoints['validated_allergens']['freeOf'] =
            Array.from(new Set([...currentValue, toUpper(name)]));
        }
      });
    });
  }
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
