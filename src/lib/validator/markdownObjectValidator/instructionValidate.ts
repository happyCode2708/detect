import { toLower } from 'lodash';

export const instructionValidate = async (modifiedProductDataPoints: any) => {
  if (!modifiedProductDataPoints?.['instructions']) {
    console.log('finish validate storage instruction');

    return;
  }

  const allInstructions =
    modifiedProductDataPoints?.['instructions']?.[0] || {};

  const { storageInstruction } = allInstructions;

  await validate(
    [...storageInstruction],
    modifiedProductDataPoints,
    'validated_storageInstruction'
  );

  console.log('finish validate storage instruction');
};

const validate = async (
  analysisList: any[],
  modifiedProductDataPoints: any,
  dataPointKey: string
) => {
  for (const analysisItem of analysisList) {
    let validEnumValues = await check(analysisItem);

    if (validEnumValues) {
      const currentValues =
        modifiedProductDataPoints?.['instructions']?.[0]?.[dataPointKey] || [];

      modifiedProductDataPoints['instructions'][0][dataPointKey] = Array.from(
        new Set([...currentValues, ...validEnumValues])
      );
    }
  }
};

const check = async (statement: any): Promise<string[] | false> => {
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
