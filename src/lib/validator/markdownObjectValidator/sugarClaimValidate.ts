import logger from '../../../lib/logger';
import { toLower } from 'lodash';

export const sugarClaimValidate = async (modifiedProductDataPoints: any) => {
  const claim_list =
    modifiedProductDataPoints?.['attributes']?.['sugarClaims'] || [];

  await validate(
    [...claim_list],
    modifiedProductDataPoints,
    'validated_sugarClaims'
  );

  console.log('finish validate sugar claim');
};

const validate = async (
  analysisList: any[],
  modifiedProductDataPoints: any,
  dataPointKey: string
) => {
  for (const analysisItem of analysisList) {
    let valid = await check(analysisItem);

    if (valid === true) {
      const { claim, statement } = analysisItem;

      const currentValues =
        modifiedProductDataPoints?.['attributes']?.[dataPointKey] || [];

      console.log(`why sugar --- ${statement} --- ${claim}`);

      if (SUGAR_CLAIMS_MAP?.[toLower(statement)]?.[claim] === false) {
        //* false mean not a valid claim in defined claim list
      } else {
        modifiedProductDataPoints['attributes'][dataPointKey] = Array.from(
          new Set([
            ...currentValues,
            SUGAR_CLAIMS_MAP?.[toLower(statement)]?.[claim]
              ? SUGAR_CLAIMS_MAP?.[toLower(statement)]?.[claim]
              : `unsure-${claim}`,
          ])
        );
      }
    }
  }
};

const check = async (analysisItem: any): Promise<boolean> => {
  const { claim, isClaimed, statement, source, reason } = analysisItem;

  if (!claim) return Promise.resolve(false);

  if (isClaimed === 'no' || isClaimed === 'unknown') {
    return Promise.resolve(false);
  }

  //
  // if (!source.includes('marketing text on product')) {
  //   return Promise.resolve(false);
  // }

  //? temp change
  if (source?.includes('nutrition fact panel')) {
    return Promise.resolve(false);
  }

  if (!SUGAR_ITEMS.includes(claim)) {
    return Promise.resolve(false);
  }

  if (statement === 'other') {
    logger.error(`sugar claim -- ${claim}`);
    return Promise.resolve(false);
  }

  // if (
  //   SUGAR_ITEMS_REASON?.[toLower(claim)]
  //     ? SUGAR_ITEMS_REASON?.[toLower(claim)]
  //         ?.map((word: string) => {
  //           if (toLower(reason)?.includes(word)) return true;

  //           return false;
  //         })
  //         .some((result: boolean) => result === false)
  //     : false
  // ) {
  //   return Promise.resolve(false);
  // }

  const sugarClaim = SUGAR_CLAIMS_MAP?.[toLower(statement)]?.[claim];

  if (
    SUGAR_ITEMS_REASON?.[toLower(sugarClaim)]
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
    if (
      toLower(claim) === 'corn syrup' &&
      toLower(reason)?.includes('high fructose')
    ) {
      //? it could be about 'HIGH FRUCTOSE CORN SYRUP' so must return false
      return Promise.resolve(false);
    }
  }

  //! teno hide
  // if (source?.includes('marketing text on product') && isClaimed === 'yes') {
  //   return Promise.resolve(true);
  // }
  //? temp change
  if (isClaimed === 'yes') {
    return Promise.resolve(true);
  }

  return Promise.resolve(false);
};

const SUGAR_ITEMS_REASON = {
  'lower sugar': [['lower', 'sugar']],
  'low sugar': [['low', 'sugar']],
  'reduced sugar': [['reduced', 'sugar']],
  'sugar free': [['sugar', 'free']],
  'cane sugar': [['cane', 'sugar']],
  'no artificial sweetener': [
    ['not contain', 'artificial', 'sweetener'],
    ['free from', 'artificial', 'sweetener'],
  ],
  unsweetened: [['unsweetened']],
} as any;

const SUGAR_ITEMS = [
  'acesulfame k',
  'acesulfame potassium',
  'agave',
  'allulose',
  'artificial sweetener',
  'aspartame',
  'beet sugar',
  'cane sugar',
  'coconut sugar',
  'coconut palm sugar',
  'fruit juice',
  'corn syrup',
  'high fructose corn syrup',
  'honey',
  'low sugar',
  'lower sugar',
  'monk fruit',
  'natural sweeteners',
  'added sugar',
  'refined sugars',
  'saccharin',
  'splenda/sucralose',
  'splenda',
  'sucralose',
  'stevia',
  'sugar',
  'sugar added',
  'sugar alcohol',
  'tagatose',
  'xylitol',
  'reduced sugar',
  'sugar free',
  'unsweetened',
  'xylitol',
];

const SUGAR_CLAIMS = [
  'acesulfame k',
  'agave',
  'allulose',
  'artificial sweetener',
  'aspartame',
  'beet sugar',
  'cane sugar',
  'coconut sugar',
  'coconut palm sugar',
  'fruit juice',
  'high fructose corn syrup',
  'honey',
  'low sugar',
  'lower sugar',
  'monk fruit',
  'natural sweeteners',
  'no acesulfame k',
  'no added sugar',
  'no agave',
  'no allulose',
  'no artificial sweetener',
  'no aspartame',
  'no cane sugar',
  'no coconut sugar',
  'no coconut palm sugar',
  'no corn syrup',
  'no high fructose corn syrup',
  'no refined sugars',
  'no saccharin',
  'no splenda',
  'no sucralose',
  'no stevia',
  'no sugar',
  'no sugar added',
  'no sugar alcohol',
  'no tagatose',
  'no xylitol',
  'reduced sugar',
  'refined sugar',
  'saccharin',
  'splenda',
  'sucralose',
  'stevia',
  'sugar alcohol',
  'sugar free',
  'sugars added',
  'tagatose',
  'unsweetened',
  'xylitol',
];

const SUGAR_CLAIMS_MAP = {
  low: {
    'low sugar': 'low sugar',
  },
  lower: {
    'lower sugar': 'lower sugar',
  },
  unsweetened: {
    unsweetened: 'unsweetened',
  },
  sweetened: {
    xylitol: 'xylitol',
  },
  reduced: {
    'reduced sugar': 'reduced sugar',
  },
  'sugar free': {
    'sugar free': 'sugar free',
  },
  no: {
    'acesulfame k': 'no acesulfame k',
    'acesulfame potassium': 'no acesulfame k',
    'added sugar': 'no added sugar',
    agave: 'no agave',
    allulose: 'no allulose',
    'artificial sweetener': 'no artificial sweetener',
    aspartame: 'no aspartame',
    'cane sugar': 'no cane sugar',
    'coconut/coconut palm sugar': 'no coconut/coconut palm sugar',
    'coconut sugar': 'no coconut/coconut palm sugar',
    'coconut palm sugar': 'no coconut/coconut palm sugar',
    'corn syrup': 'no corn syrup',
    'high fructose corn syrup': 'no high fructose corn syrup',
    'refined sugars': 'no refined sugars',
    saccharin: 'no saccharin',
    'splenda/sucralose': 'no splenda/sucralose',
    slpenda: 'no splenda/sucralose',
    sucralose: 'no splenda/sucralose',
    stevia: 'no stevia',
    sugar: 'no sugar',
    'sugar added': 'no sugar added',
    'sugar alcohol': 'no sugar alcohol',
    tagatose: 'no tagatose',
    xylitol: 'no xylitol',
  },
  'no contain': {
    'acesulfame k': 'no acesulfame k',
    'acesulfame potassium': 'no acesulfame k',
    'added sugar': 'no added sugar',
    agave: 'no agave',
    allulose: 'no allulose',
    'artificial sweetener': 'no artificial sweetener',
    aspartame: 'no aspartame',
    'cane sugar': 'no cane sugar',
    'coconut/coconut palm sugar': 'no coconut/coconut palm sugar',
    'coconut sugar': 'no coconut/coconut palm sugar',
    'coconut palm sugar': 'no coconut/coconut palm sugar',
    'corn syrup': 'no corn syrup',
    'high fructose corn syrup': 'no high fructose corn syrup',
    'refined sugars': 'no refined sugars',
    saccharin: 'no saccharin',
    'splenda/sucralose': 'no splenda/sucralose',
    slpenda: 'no splenda/sucralose',
    sucralose: 'no splenda/sucralose',
    stevia: 'no stevia',
    sugar: 'no sugar',
    'sugar added': 'no sugar added',
    'sugar alcohol': 'no sugar alcohol',
    tagatose: 'no tagatose',
    xylitol: 'no xylitol',
  },
  free: {
    'acesulfame k': 'no acesulfame k',
    'acesulfame potassium': 'no acesulfame k',
    'added sugar': 'no added sugar',
    agave: 'no agave',
    allulose: 'no allulose',
    'artificial sweetener': 'no artificial sweetener',
    aspartame: 'no aspartame',
    'cane sugar': 'no cane sugar',
    'coconut/coconut palm sugar': 'no coconut/coconut palm sugar',
    'coconut sugar': 'no coconut/coconut palm sugar',
    'coconut palm sugar': 'no coconut/coconut palm sugar',
    'corn syrup': 'no corn syrup',
    'high fructose corn syrup': 'no high fructose corn syrup',
    'refined sugars': 'no refined sugars',
    saccharin: 'no saccharin',
    'splenda/sucralose': 'no splenda/sucralose',
    slpenda: 'no splenda/sucralose',
    sucralose: 'no splenda/sucralose',
    stevia: 'no stevia',
    // sugar: 'no sugar',
    sugar: 'sugar free',
    'sugar added': 'no sugar added',
    'sugar alcohol': 'no sugar alcohol',
    tagatose: 'no tagatose',
    xylitol: 'no xylitol',
    'sugar free': 'sugar free',
  },
  'free from': {
    'acesulfame k': 'no acesulfame k',
    'acesulfame potassium': 'no acesulfame k',
    'added sugar': 'no added sugar',
    agave: 'no agave',
    allulose: 'no allulose',
    'artificial sweetener': 'no artificial sweetener',
    aspartame: 'no aspartame',
    'cane sugar': 'no cane sugar',
    'coconut/coconut palm sugar': 'no coconut/coconut palm sugar',
    'coconut sugar': 'no coconut/coconut palm sugar',
    'coconut palm sugar': 'no coconut/coconut palm sugar',
    'corn syrup': 'no corn syrup',
    'high fructose corn syrup': 'no high fructose corn syrup',
    'refined sugars': 'no refined sugars',
    saccharin: 'no saccharin',
    'splenda/sucralose': 'no splenda/sucralose',
    slpenda: 'no splenda/sucralose',
    sucralose: 'no splenda/sucralose',
    stevia: 'no stevia',
    'sugar added': 'no sugar added',
    'sugar alcohol': 'no sugar alcohol',
    tagatose: 'no tagatose',
    xylitol: 'no xylitol',
    'sugar free': 'sugar free',
    unsweetened: 'unsweetened',
  },
  '0g': {
    'acesulfame k': 'no acesulfame k',
    'acesulfame potassium': 'no acesulfame k',
    'added sugar': 'no added sugar',
    agave: 'no agave',
    allulose: 'no allulose',
    'artificial sweetener': 'no artificial sweetener',
    aspartame: 'no aspartame',
    'cane sugar': 'no cane sugar',
    'coconut/coconut palm sugar': 'no coconut/coconut palm sugar',
    'coconut sugar': 'no coconut/coconut palm sugar',
    'coconut palm sugar': 'no coconut/coconut palm sugar',
    'corn syrup': 'no corn syrup',
    'high fructose corn syrup': 'no high fructose corn syrup',
    'refined sugars': 'no refined sugars',
    saccharin: 'no saccharin',
    'splenda/sucralose': 'no splenda/sucralose',
    slpenda: 'no splenda/sucralose',
    sucralose: 'no splenda/sucralose',
    stevia: 'no stevia',
    sugar: 'no sugar',
    'sugar added': 'no sugar added',
    'sugar alcohol': 'no sugar alcohol',
    tagatose: 'no tagatose',
    xylitol: 'no xylitol',
  },
  'free of': {
    'acesulfame k': 'no acesulfame k',
    'acesulfame potassium': 'no acesulfame k',
    'added sugar': 'no added sugar',
    agave: 'no agave',
    allulose: 'no allulose',
    'artificial sweetener': 'no artificial sweetener',
    aspartame: 'no aspartame',
    'cane sugar': 'no cane sugar',
    'coconut/coconut palm sugar': 'no coconut/coconut palm sugar',
    'coconut sugar': 'no coconut/coconut palm sugar',
    'coconut palm sugar': 'no coconut/coconut palm sugar',
    'corn syrup': 'no corn syrup',
    'high fructose corn syrup': 'no high fructose corn syrup',
    'refined sugars': 'no refined sugars',
    saccharin: 'no saccharin',
    'splenda/sucralose': 'no splenda/sucralose',
    slpenda: 'no splenda/sucralose',
    sucralose: 'no splenda/sucralose',
    stevia: 'no stevia',
    'sugar added': 'no sugar added',
    'sugar alcohol': 'no sugar alcohol',
    tagatose: 'no tagatose',
    xylitol: 'no xylitol',
    'sugar free': 'sugar free',
  },
  'does not contain': {
    'acesulfame k': 'no acesulfame k',
    'acesulfame potassium': 'no acesulfame k',
    'added sugar': 'no added sugar',
    agave: 'no agave',
    allulose: 'no allulose',
    'artificial sweetener': 'no artificial sweetener',
    aspartame: 'no aspartame',
    'cane sugar': 'no cane sugar',
    'coconut/coconut palm sugar': 'no coconut/coconut palm sugar',
    'coconut sugar': 'no coconut/coconut palm sugar',
    'coconut palm sugar': 'no coconut/coconut palm sugar',
    'corn syrup': 'no corn syrup',
    'high fructose corn syrup': 'no high fructose corn syrup',
    'refined sugars': 'no refined sugars',
    saccharin: 'no saccharin',
    'splenda/sucralose': 'no splenda/sucralose',
    slpenda: 'no splenda/sucralose',
    sucralose: 'no splenda/sucralose',
    stevia: 'no stevia',
    sugar: 'no sugar',
    'sugar added': 'no sugar added',
    'sugar alcohol': 'no sugar alcohol',
    tagatose: 'no tagatose',
    xylitol: 'no xylitol',
  },
  'made without': {
    'acesulfame k': 'no acesulfame k',
    'acesulfame potassium': 'no acesulfame k',
    'added sugar': 'no added sugar',
    agave: 'no agave',
    allulose: 'no allulose',
    'artificial sweetener': 'no artificial sweetener',
    aspartame: 'no aspartame',
    'cane sugar': 'no cane sugar',
    'coconut/coconut palm sugar': 'no coconut/coconut palm sugar',
    'coconut sugar': 'no coconut/coconut palm sugar',
    'coconut palm sugar': 'no coconut/coconut palm sugar',
    'corn syrup': 'no corn syrup',
    'high fructose corn syrup': 'no high fructose corn syrup',
    'refined sugars': 'no refined sugars',
    saccharin: 'no saccharin',
    'splenda/sucralose': 'no splenda/sucralose',
    slpenda: 'no splenda/sucralose',
    sucralose: 'no splenda/sucralose',
    stevia: 'no stevia',
    sugar: 'no sugar',
    'sugar added': 'no sugar added',
    'sugar alcohol': 'no sugar alcohol',
    tagatose: 'no tagatose',
    xylitol: 'no xylitol',
  },
  contain: {
    sugar: false,
    'reduced sugar': 'reduced sugar',
    'refined sugar': 'refined sugar',
    saccharin: 'saccharin',
    'splenda/sucralose': 'splenda/sucralose',
    stevia: 'stevia',
    'sugar alcohol': 'sugar alcohol',
    'sugar free': 'sugar free',
    'sugars added': 'sugars added',
    tagatose: 'tagatose',
    unsweetened: 'unsweetened',
    xylitol: 'xylitol',
    'acesulfame k': 'acesulfame k',
    agave: 'agave',
    allulose: 'allulose',
    'artificial sweetener': 'artificial sweetener',
    aspartame: 'aspartame',
    'beet sugar': 'beet sugar',
    'cane sugar': 'cane sugar',
    'coconut/coconut palm sugar': 'coconut/coconut palm sugar',
    'coconut sugar': 'coconut/coconut palm sugar',
    'coconut palm sugar': 'coconut/coconut palm sugar',
    'fruit juice': 'fruit juice',
    'high fructose corn syrup': 'high fructose corn syrup',
    'corn syrup': 'no corn syrup',
    honey: 'honey',
    'low sugar': 'low sugar',
    'lower sugar': 'lower sugar',
    'monk fruit': 'monk fruit',
    'natural sweeteners': 'natural sweeteners',
  },
} as any;
