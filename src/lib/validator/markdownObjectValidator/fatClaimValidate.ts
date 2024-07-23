import { toLower } from 'lodash';

export const fatClaimValidate = async (modifiedProductDataPoints: any) => {
  const claim_list =
    modifiedProductDataPoints?.['attributes']?.['fatClaims'] || [];

  await validate(
    [...claim_list],
    modifiedProductDataPoints,
    'validated_fatClaims'
  );

  console.log('finish validate fat claim');
};

const validate = async (
  analysisList: any[],
  modifiedProductDataPoints: any,
  dataPointKey: string
) => {
  for (const analysisItem of analysisList) {
    let valid = await check(analysisItem);

    if (valid === true) {
      const claimValue = analysisItem['claim'];

      const currentValues =
        modifiedProductDataPoints?.['attributes']?.[dataPointKey] || [];

      modifiedProductDataPoints['attributes'][dataPointKey] = Array.from(
        new Set([...currentValues, FAT_CLAIMS_MAP?.[claimValue]])
      );
    }
  }
};

const check = async (analysisItem: any): Promise<boolean> => {
  const { claim, isClaimed, source, reason } = analysisItem;

  if (!claim) return Promise.resolve(false);

  if (isClaimed === 'no' || isClaimed === 'unknown')
    return Promise.resolve(false);

  //! temp hide
  // if (source === 'ingredient list' || source === 'nutrition fact panel') {
  //   return Promise.resolve(false);
  // }
  //? temp replace
  if (source?.includes('nutrition fact panel')) {
    return Promise.resolve(false);
  }

  if (!FAT_CLAIMS.includes(claim)) {
    return Promise.resolve(false);
  }

  if (
    FAT_CLAIMS_REASON?.[toLower(claim)]
      ?.map((wordList: any) => {
        return wordList
          .map((word: any) => {
            if (toLower(reason)?.includes(word)) {
              return true;
            } else {
              return false;
            }
          })
          .every((result: any) => result === true);
      })
      .every((result: any) => result === false)
  ) {
    return Promise.resolve(false);
  } else {
    //* exceptional cases
    // if (toLower(claim) === 'alcohol' && toLower(reason)?.includes('sugar')) {
    //   //? it could be about 'alcohol sugar' so must return false
    //   return Promise.resolve(false);
    // }
  }

  return Promise.resolve(true);
};

const FAT_CLAIMS_REASON = {
  'low fat': [['low', 'fat']],
  'fat free': [['fat', 'free']],
  'free of saturated fat': [['free', 'saturated', 'fat']],
  'low in saturated fat': [['low', 'saturated', 'fat']],
  'no fat': [['no', 'fat']],
  'no trans fat': [['no', 'trans', 'fat']],
  'reduced fat': [['reduced', 'fat']],
  'trans fat free': [['trans', 'fat', 'free']],
  'zero grams trans fat per serving': [
    ['0', 'g', 'trans', 'fat', 'per serving'],
    ['zero', 'gram', 'trans', 'fat', 'per serving'],
  ],
  'zero trans fat': [['zero', 'trans', 'fat']],
} as any;

const FAT_CLAIMS = [
  'is fat free',
  'is free of saturated fat',
  'is low fat',
  'is low in saturated fat',
  'have no fat',
  'have no trans fat',
  'is reduced fat',
  'is trans fat free',
  'have zero grams trans fat per serving',
  'have zero trans fat',
];

const FAT_CLAIMS_MAP = {
  'is fat free': 'fat free',
  'is free of saturated fat': 'free of saturated fat',
  'is low fat': 'low fat',
  'is low in saturated fat': 'low in saturated fat',
  'have no fat': 'no fat',
  'have no trans fat': 'no trans fat',
  'is reduced fat': 'reduced fat',
  'is trans fat free': 'trans fat free',
  'have zero grams trans fat per serving': 'zero grams trans fat per serving',
  'have zero trans fat': 'zero trans fat',
} as any;
