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

  const instructionsData =
    modifiedProductDataPoints?.['instructions']?.[0] || {};

  const {
    storageInstruction,
    usageInstruction,
    cookingInstruction,
    otherInstruction,
  } = instructionsData;

  const allInstructions = [
    ...(storageInstruction || []),
    ...(usageInstruction || []),
    ...(cookingInstruction || []),
  ];

  await validateConsumerStorage(
    [
      ...(storageInstruction || []),
      ...(usageInstruction || []),
      ...(otherInstruction || []),
    ],
    modifiedProductDataPoints,
    'storageInstruction'
  );

  await validateUseOrFreezeBy(
    [
      ...(storageInstruction || []),
      ...(usageInstruction || []),
      ...(otherInstruction || []),
    ],
    modifiedProductDataPoints,
    'useOrFreezeBy'
  );

  await validateAllInstructions(modifiedProductDataPoints, allInstructions);

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
  Object.entries(STORAGE_MAPPING)?.forEach(([key, words]) => {
    const isStatementMatchEnum = words.every((word: string) => {
      return toLower(statement).includes(word);
    });
    if (isStatementMatchEnum) {
      validEnumValues.push(key);
    }
  });

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
  allInstructions: any
) => {
  const instructionsData =
    modifiedProductDataPoints?.['instructions']?.[0] || {};
  const validatedInstructionData =
    modifiedProductDataPoints?.['validated_instructions'];

  const { storageInstruction, usageInstruction, cookingInstruction } =
    instructionsData;

  const { usageInstruction: validated_usageInstruction, useOrFreezeBy } =
    validatedInstructionData;

  if (usageInstruction) {
    let validUsageInstructions = [] as any;
    usageInstruction?.forEach((instructionItem: any) => {
      if (
        !useOrFreezeBy?.find((useBy: string) => {
          toLower(useBy) === instructionItem;
        })
      ) {
        validUsageInstructions.push(instructionItem);
      }
    });

    modifiedProductDataPoints['validated_instructions']['usageInstructions'] =
      validUsageInstructions;
  }

  //* temp cooking instruction validate
  modifiedProductDataPoints['validated_instructions']['cookingInstruction'] =
    cookingInstruction;
};

const STORAGE_MAPPING = {
  'COOL DARK PLACE': ['cool', 'dark', 'place'],
  'COOL DRY PLACE': ['cool', 'dry', 'place'],
  'DO NOT FREEZE': ['not', 'freeze'],
  'DO NOT REFRIGERATE': ['not', 'refrigerate'],
  'DRY PLACE': ['dry', 'place'],
  'KEEP FROZEN': ['keep', 'frozen'],
  'KEEP REFRIGERATED': ['keep', 'refrigerated'],
  'REFRIGERATE AFTER OPENING': ['refrigerate', 'after', 'open'],
  'SEAL FOR FRESHNESS': ['seal', 'freshness'],
  'STORE AT ROOM TEMPERATURE': ['at', 'room temperature'],
};

const USE_OR_FREEZE_BY_MAPPING = {
  'WITH IN': [
    ['consume', ' within'],
    ['use', 'within'],
    ['enjoy', 'within'],
  ],
};
