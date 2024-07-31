import { toLower } from 'lodash';

export const instructionValidate = async (modifiedProductDataPoints: any) => {
  if (!modifiedProductDataPoints?.['instructions']) {
    console.log('finish validate storage instruction');
    return;
  }

  modifiedProductDataPoints['validated_instructions'] = {
    storageInstruction: [],
    cookingInstruction: [],
    usageInstruction: [],
    useOrFreezeBy: [],
  };

  const instructionsData = modifiedProductDataPoints?.['instructions'] || {};

  const {
    cookingInstruction,
    storageInstruction,
    usageInstruction,
    informationInstruction,
  } = instructionsData;

  // const allInstructions = [
  //   ...(storageInstruction || []),
  //   ...(usageInstruction || []),
  //   ...(cookingInstruction || []),
  // ];

  let mappedCookingInstruction = [] as any;
  let mappedUsageInstruction = [] as any;
  let mappedStorageInstruction = [] as any;
  let mappedInformationInstruction = [] as any;

  cookingInstruction?.forEach((cookingInstructionItem: any) => {
    const {
      'all other text or paragraph about cooking info': otherInfo,
      recipes,
    } = cookingInstructionItem;

    if (otherInfo && otherInfo?.length > 0) {
      mappedCookingInstruction = [...(otherInfo || [])];
    }

    recipes?.forEach((recipeItem: any) => {
      const {
        'recipe name': recipeName,
        'recipe ingredient list': recipeIngredients,
        'cooking steps': cookingSteps,
      } = recipeItem;

      if (recipeName) {
        mappedCookingInstruction?.push(recipeName);
      }
      if (recipeIngredients) {
        mappedCookingInstruction?.push(...recipeIngredients);
      }
      if (cookingSteps) {
        mappedCookingInstruction?.push(...cookingSteps);
      }
    });
  });

  mappedStorageInstruction = storageInstruction?.['storage instructions'];
  mappedUsageInstruction = usageInstruction?.['usage instructions'];
  mappedInformationInstruction =
    informationInstruction?.['information instructions'];

  const allMappedInstruction = {
    mappedCookingInstruction,
    mappedStorageInstruction,
    mappedUsageInstruction,
    mappedInformationInstruction,
  };

  await validateConsumerStorage(
    [
      ...(mappedStorageInstruction || []),
      ...(mappedUsageInstruction || []),
      ...(mappedInformationInstruction || []),
    ],
    modifiedProductDataPoints,
    'storageInstruction'
  );

  await validateUseOrFreezeBy(
    [
      ...(mappedStorageInstruction || []),
      ...(mappedUsageInstruction || []),
      ...(mappedInformationInstruction || []),
    ],
    modifiedProductDataPoints,
    'useOrFreezeBy'
  );

  await validateAllInstructions(
    modifiedProductDataPoints,
    allMappedInstruction
  );

  console.log('finish validate storage instruction');
};

const validateConsumerStorage = async (
  analysisList: any[],
  modifiedProductDataPoints: any,
  dataPointKey: string
) => {
  for (const analysisItem of analysisList) {
    let validEnumValues = await checkConsumerStorage(analysisItem);

    if (validEnumValues) {
      const currentValues =
        modifiedProductDataPoints?.['validated_instructions']?.[dataPointKey] ||
        [];

      modifiedProductDataPoints['validated_instructions'][dataPointKey] =
        Array.from(new Set([...currentValues, ...validEnumValues]));
    }
  }
};

const checkConsumerStorage = async (
  statement: any
): Promise<string[] | false> => {
  let validEnumValues = [] as any;

  // const [foundEnumValue] =
  // Object.entries(STORAGE_REASON)?.forEach(([key, words]) => {
  //   const isStatementMatchEnum = words.every((word: string) => {
  //     return toLower(statement).includes(word);
  //   });
  //   if (isStatementMatchEnum) {
  //     //* exceptional case
  //     if (key === 'DRY PLACE' && validEnumValues?.includes('COOL DRY PLACE')) {
  //       //* COOL DRY PLACE matched no need DRY PLACE
  //     } else {
  //       validEnumValues.push(key);
  //     }
  //   }
  // });

  // if (
  Object.entries(STORAGE_REASON)?.forEach(
    ([key, define]: [key: string, define: any]) => {
      const { variants: phraseList, excepts } = define;
      let isMatch = false;
      isMatch = phraseList
        ?.map((wordList: any) => {
          return wordList
            .map((word: any) => {
              if (toLower(statement)?.includes(word)) {
                return true;
              } else {
                return false;
              }
            })
            .every((result: any) => result === true);
        })
        .some((result: any) => result === true);

      if (isMatch) {
        const matchExcept = excepts?.find((exceptText: string) => {
          return toLower(statement)?.includes(exceptText);
        });

        if (!matchExcept) {
          validEnumValues.push(key);
        }
        // if (
        //   key === 'DRY PLACE' &&
        //   validEnumValues?.includes('COOL DRY PLACE')
        // ) {
        // } else {
        //   validEnumValues.push(key);
        // }
      }
    }
  );
  // .every((result: any) => result === false)
  // ) {
  // return Promise.resolve(false);
  // } else {
  //* exceptional cases
  // if (
  //   toLower(claim) === 'corn syrup' &&
  //   toLower(reason)?.includes('high fructose')
  // ) {
  //   //? it could be about 'HIGH FRUCTOSE CORN SYRUP' so must return false
  //   return Promise.resolve(false);
  // }
  // }

  if (validEnumValues?.length === 0) {
    return Promise.resolve(false);
  }

  return Promise.resolve(validEnumValues);
};

const validateUseOrFreezeBy = async (
  analysisList: any[],
  modifiedProductDataPoints: any,
  dataPointKey: any
) => {
  for (const analysisItem of analysisList) {
    let validStatement = await checkUserOfFreezeBy(analysisItem);

    if (validStatement) {
      const currentValues =
        modifiedProductDataPoints?.['validated_instructions']?.[dataPointKey] ||
        [];

      modifiedProductDataPoints['validated_instructions'][dataPointKey] =
        Array.from(new Set([...currentValues, validStatement]));
    }
  }
};

const checkUserOfFreezeBy = async (statement: string) => {
  let validInstructionStatement = '';

  Object.entries(USE_OR_FREEZE_BY_MAPPING)?.forEach(
    ([key, phraseWorldList]) => {
      if (
        phraseWorldList
          ?.map((wordList: any) => {
            return wordList
              .map((word: any) => {
                if (toLower(statement)?.includes(word)) {
                  return true;
                } else {
                  return false;
                }
              })
              .every((result: any) => result === true);
          })
          .some((result: any) => result === true)
      ) {
        validInstructionStatement = statement;
      }
    }
  );

  if (!validInstructionStatement) {
    return Promise.resolve(false);
  }

  return Promise.resolve(validInstructionStatement);
};

const validateAllInstructions = async (
  modifiedProductDataPoints: any,
  allMappedInstruction: any
) => {
  // const instructionsData =
  //   modifiedProductDataPoints?.['instructions']?.[0] || {};
  const validatedInstructionData =
    modifiedProductDataPoints?.['validated_instructions'];

  const { mappedCookingInstruction } = allMappedInstruction;

  // const { storageInstruction, usageInstruction, cookingInstruction } =
  //   instructionsData;

  // const { usageInstruction: validated_usageInstruction, useOrFreezeBy } =
  //   validatedInstructionData;

  // if (usageInstruction) {
  //   let validUsageInstructions = [] as any;
  //   usageInstruction?.forEach((instructionItem: any) => {
  //     if (
  //       !useOrFreezeBy?.find((useBy: string) => {
  //         toLower(useBy) === instructionItem;
  //       })
  //     ) {
  //       validUsageInstructions.push(instructionItem);
  //     }
  //   });

  //   modifiedProductDataPoints['validated_instructions']['usageInstructions'] =
  //     validUsageInstructions;
  // }

  //* temp cooking instruction validate
  modifiedProductDataPoints['validated_instructions']['cookingInstruction'] =
    mappedCookingInstruction;
};

const STORAGE_REASON = {
  'COOL DARK PLACE': {
    variants: [['cool', 'dark', 'place']],
  },
  'COOL DRY PLACE': {
    variants: [['cool', 'dry', 'place']],
  },
  'DRY PLACE': {
    variants: [['dry', 'place']],
    excepts: ['cool'],
  },
  'DO NOT FREEZE': {
    variants: [['not', 'freeze']],
  },
  'DO NOT REFRIGERATE': {
    variants: [['not', 'refrigerate']],
  },
  'KEEP FROZEN': {
    variants: [
      ['keep', 'frozen'],
      ['store', 'in', 'freezer'],
      ['freeze', 'for', 'freshness'],
    ],
    excepts: ['once opened', 'after opening'],
  },
  'REFRIGERATE AFTER OPENING': {
    variants: [
      ['refrigerate', 'once', 'open'],
      ['refrigerate', 'after', 'open'],
      ['open', 'keep', 'refrigerate'],
    ],
  },
  'KEEP REFRIGERATED': {
    variants: [
      ['keep', 'refrigerated'],
      ['store', 'in', 'fridge'],
    ],
    excepts: ['once opened', 'after opening'],
  },
  'SEAL FOR FRESHNESS': { variants: [['seal', 'freshness']] },
  'STORE AT ROOM TEMPERATURE': { variants: [['at', 'room temperature']] },
} as any;

const USE_OR_FREEZE_BY_MAPPING = {
  'WITH IN': [
    ['consume', ' within'],
    ['use', 'within'],
    ['enjoy', 'within'],
  ],
  'FOR A TIME': [['take on the go for']],
};
