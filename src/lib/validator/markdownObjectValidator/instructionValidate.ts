import { toLower } from 'lodash';

export const instructionValidate = async (modifiedProductDataPoints: any) => {
  const allInstructions =
    modifiedProductDataPoints?.['instructions']?.[0] || {};

  const { storageInstruction } = allInstructions;

  await validate(
    [...storageInstruction],
    modifiedProductDataPoints,
    'validated_storageInstruction'
  );
};

const validate = async (
  analysisList: any[],
  modifiedProductDataPoints: any,
  dataPointKey: string
) => {
  for (const analysisItem of analysisList) {
    let validEnumValue = await check(analysisItem);

    if (validEnumValue) {
      const currentValues =
        modifiedProductDataPoints?.['instructions']?.[0]?.[dataPointKey] || [];

      modifiedProductDataPoints['instructions'][0][dataPointKey] = Array.from(
        new Set([...currentValues, validEnumValue])
      );
    }
  }
};

const check = async (statement: any): Promise<string | false> => {
  const [foundEnumValue] =
    Object.entries(STORAGE_MAPPING)?.find(([key, words]) => {
      return words.every((word: string) => {
        return toLower(statement).includes(word);
      });
    }) || [];

  if (!foundEnumValue) {
    return Promise.resolve(false);
  }

  return Promise.resolve(foundEnumValue);
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
