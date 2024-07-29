import { contains } from 'cheerio/lib/static';
import { toLower, toUpper } from 'lodash';

export const allergenValidate = async (modifiedProductDataPoints: any) => {
  if (!modifiedProductDataPoints?.['allergens']) return;

  modifiedProductDataPoints['validated_allergens'] = {};
  modifiedProductDataPoints['validated_allergens'] = {
    notContainList: [],
    containList: [],
    containOnEquipmentList: [],
  };

  await validateNoContain(modifiedProductDataPoints);
  await validateContain(modifiedProductDataPoints);
  await validateContainOnEquipment(modifiedProductDataPoints);
  // await mapToValidatedAllergenObject(modifiedProductDataPoints);
};

const validateNoContain = async (modifiedProductDataPoints: any) => {
  modifiedProductDataPoints?.['allergens']?.[
    'allergens product info state not contain'
  ]?.forEach((allergenItem: any, idx: number) => {
    const notContainList =
      modifiedProductDataPoints?.['allergens']?.[
        'allergens product info state not contain'
      ]?.[idx]?.['allergens product does not contain break-down list'];
    const notContainStatement =
      modifiedProductDataPoints?.['allergens']?.[
        'allergens product info state not contain'
      ]?.[idx]?.[
        'exact text on images about allergens that product does not contain'
      ];

    let validated_notContainList = [] as any;
    if (notContainList) {
      notContainList?.forEach((notContainItem: any) => {
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

      const currentValue =
        modifiedProductDataPoints?.['validated_allergens']?.[
          'notContainList'
        ] || [];

      modifiedProductDataPoints['validated_allergens']['notContainList'] =
        Array.from(new Set([...currentValue, ...validated_notContainList]));
    } else {
      //* notContainList empty but must check notContainStatement
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

        const currentValue =
          modifiedProductDataPoints?.['validated_allergens']?.[
            'notContainList'
          ] || [];

        modifiedProductDataPoints['validated_allergens']['notContainList'] =
          Array.from(new Set([...currentValue, ...validated_notContainList]));
      }
    }
  });
};

const validateContain = async (modifiedProductDataPoints: any) => {
  modifiedProductDataPoints?.['allergens']?.['allergens contain']?.forEach(
    (allergenItem: any, idx: number) => {
      const containList =
        modifiedProductDataPoints?.['allergens']?.['allergens contain']?.[
          idx
        ]?.['allergens contain statement break-down list'];
      const containStatement =
        modifiedProductDataPoints?.['allergens']?.['allergens contain']?.[
          idx
        ]?.['allergen contain statement'];

      if (!containList) return null;
      let validated_containList = [] as any;

      containList?.forEach((containItem: any) => {
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

      const currentValueList =
        modifiedProductDataPoints?.['validated_allergens']?.['containList'] ||
        [];

      modifiedProductDataPoints['validated_allergens']['containList'] =
        Array.from(new Set([...currentValueList, ...validated_containList]));

      const currentValueStatement =
        modifiedProductDataPoints?.['validated_allergens']?.[
          'containStatement'
        ] || [];

      modifiedProductDataPoints['validated_allergens']['containStatement'] =
        Array.from(new Set([...currentValueStatement, containStatement]));

      // modifiedProductDataPoints['allergens'][idx]['validated_containList'] =
      //   validated_containList;
    }
  );
};

const validateContainOnEquipment = async (modifiedProductDataPoints: any) => {
  modifiedProductDataPoints?.['allergens']?.[
    'allergens on equipments or in facility'
  ]?.forEach((allergenItem: any, idx: number) => {
    const containOnEquipmentList =
      modifiedProductDataPoints?.['allergens']?.[
        'allergens on equipments or in facility'
      ]?.[idx]?.[
        'allergens list from manufacturing equipments or from facility'
      ];

    const containOnEquipmentStatement =
      modifiedProductDataPoints?.['allergens']?.[idx]?.[
        'statement about allergens on manufacturing equipments or from facility'
      ];

    // if (!containOnEquipmentList) return null;

    let validated_containOnEquipmentList = [] as any;

    containOnEquipmentList?.forEach((containItem: any) => {
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

    // processedManufacturedInFacilityStatement: [],
    // inFacilityOnEquipmentStatement: [],

    //? validate the statement of allergen on equipments
    if (containOnEquipmentStatement) {
      const isValidForAllergenEquipment = ALLERGEN_ON_EQUIPMENT_PHRASE?.find(
        (words: any) => {
          if (
            words?.every((word: string) => {
              return toLower(containOnEquipmentStatement)?.includes(
                toLower(word)
              );
            })
          ) {
            return true;
          }

          return false;
        }
      );

      const isValidForAllergenContain = ALLERGEN_CONTAIN_PHRASE?.find(
        (words: any) => {
          if (
            words?.every((word: string) => {
              return toLower(containOnEquipmentStatement)?.includes(
                toLower(word)
              );
            })
          ) {
            return true;
          }

          return false;
        }
      );

      if (isValidForAllergenEquipment) {
        const currentValueStatement =
          modifiedProductDataPoints?.['validated_allergens']?.[
            'processedManufacturedInFacilityStatement'
          ] || [];

        modifiedProductDataPoints['validated_allergens'][
          'processedManufacturedInFacilityStatement'
        ] = Array.from(
          new Set([...currentValueStatement, containOnEquipmentStatement])
        );

        modifiedProductDataPoints['validated_allergens'][
          'processedManufacturedInFacilityStatement'
        ] = Array.from(
          new Set([...currentValueStatement, containOnEquipmentStatement])
        );

        //? allergen on equipment list
        const currentValue =
          modifiedProductDataPoints?.['validated_allergens']?.[
            'processedOnEquipment'
          ] || [];

        modifiedProductDataPoints['validated_allergens'][
          'processedOnEquipment'
        ] = Array.from(
          new Set([...currentValue, ...validated_containOnEquipmentList])
        );

        modifiedProductDataPoints['validated_allergens'][
          'inFacilityOnEquipmentIncluding'
        ] = Array.from(
          new Set([...currentValue, ...validated_containOnEquipmentList])
        );
      } else if (isValidForAllergenContain) {
        const currentValueStatement =
          modifiedProductDataPoints?.['validated_allergens']?.[
            'containStatement'
          ] || [];

        modifiedProductDataPoints['validated_allergens']['containStatement'] =
          Array.from(
            new Set([...currentValueStatement, containOnEquipmentStatement])
          );

        modifiedProductDataPoints['validated_allergens']['containStatement'] =
          Array.from(
            new Set([...currentValueStatement, containOnEquipmentStatement])
          );

        //? allergen contain
        const currentValue =
          modifiedProductDataPoints?.['validated_allergens']?.['containList'] ||
          [];

        modifiedProductDataPoints['validated_allergens']['containList'] =
          Array.from(
            new Set([...currentValue, ...validated_containOnEquipmentList])
          );
      }
    }

    // modifiedProductDataPoints['allergens'][idx][
    //   'validated_containOnEquipmentList'
    // ] = validated_containOnEquipmentList;
  });
};

const mapToValidatedAllergenObject = async (modifiedProductDataPoints: any) => {
  const validatedAllergenList = modifiedProductDataPoints?.['allergens'];

  // if (validatedAllergenList?.length <= 0) return;

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

const ALLERGEN_ON_EQUIPMENT_PHRASE = [['equipments'], ['facility']];

const ALLERGEN_CONTAIN_PHRASE = [['contain'], ['may contain']];

const ALLERGEN_LIST = [
  {
    name: 'corn',
    variants: ['corn', 'maize', 'cornmeal', 'cornstarch'],
    statement_not_include: ['corn syrup'],
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
