import { toLower } from 'lodash';

export const instructionValidate = async (modifiedProductDataPoints: any) => {
  if (!modifiedProductDataPoints?.['instructions']) {
    console.log('finish validate storage instruction');

    return;
  }

  const allInstructions =
    modifiedProductDataPoints?.['instructions']?.[0] || {};

  const { storageInstruction, usageInstruction } = allInstructions;

  await validateConsumerStorage(
    [...(storageInstruction || []), ...(usageInstruction || [])],
    modifiedProductDataPoints,
    'validated_storageInstruction'
  );

  await validateUseOrFreezeBy(
    [...(storageInstruction || [])],
    modifiedProductDataPoints,
    'validated_useOrFreezeBy'
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
        modifiedProductDataPoints?.['instructions']?.[0]?.[dataPointKey] || [];

      modifiedProductDataPoints['instructions'][0][dataPointKey] = Array.from(
        new Set([...currentValues, ...validEnumValues])
      );
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
        modifiedProductDataPoints?.['instructions']?.[0]?.[dataPointKey] || [];

      modifiedProductDataPoints['instructions'][0][dataPointKey] = Array.from(
        new Set([...currentValues, validStatement])
      );
    }
  }
};

const checkUserOfFreezeBy = async (statement: string) => {
  let validInstructionStatement = '';

  Object.entries(USE_OR_FREEZE_BY_MAPPING)?.forEach(([key, phraseList]) => {
    const isStatementMatchPhrase = phraseList.find((phrase) => {
      return toLower(statement).includes(phrase);
    });

    if (isStatementMatchPhrase) {
      validInstructionStatement = statement;
    }
  });

  console.log(validInstructionStatement);

  if (!validInstructionStatement) {
    return Promise.resolve(false);
  }

  return Promise.resolve(validInstructionStatement);
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
  'WITH IN': ['consume within', 'use within', 'free', 'enjoy within'],
};
