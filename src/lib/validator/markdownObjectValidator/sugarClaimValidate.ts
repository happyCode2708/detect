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
};

const validate = async (
  analysisList: any[],
  modifiedProductDataPoints: any,
  dataPointKey: string
) => {
  for (const analysisItem of analysisList) {
    let valid = await check(analysisItem);

    if (valid === true) {
      // const claimValue = analysisItem['claim'];
      const { claim, statement } = analysisItem;
      console.log(`sugar ---- ${claim} ${statement}`);

      const currentValues =
        modifiedProductDataPoints?.['attributes']?.[dataPointKey] || [];

      modifiedProductDataPoints['attributes'][dataPointKey] = Array.from(
        new Set([
          ...currentValues,
          SUGAR_CLAIMS_MAP?.[toLower(statement)]?.[claim],
        ])
      );
    }
  }
};

const check = async (analysisItem: any): Promise<boolean> => {
  const { claim, isClaimed, statement, source } = analysisItem;

  console.log(`sugar ---- ${claim} ${statement}`);

  if (!claim) return Promise.resolve(false);

  if (isClaimed === 'no' || isClaimed === 'unknown') {
    return Promise.resolve(false);
  }

  if (!source.includes('marketing text on product')) {
    return Promise.resolve(false);
  }

  if (!SUGAR_ITEMS.includes(claim)) {
    return Promise.resolve(false);
  }

  if (statement === 'other') {
    logger.error(`sugar claim -- ${claim}`);
    return Promise.resolve(false);
  }

  if (source?.includes('marketing text on product') && isClaimed === 'yes') {
    return Promise.resolve(true);
  }

  return Promise.resolve(false);
};

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
  'refined sugars',
  'reduced sugar',
  'sugar free',
  'unsweetened',
  'xylitol',
];

const SUGAR_CLAIMS_MAP = {
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
    sugar: 'no sugar',
    'sugar added': 'no sugar added',
    'sugar alcohol': 'no sugar alcohol',
    tagatose: 'no tagatose',
    xylitol: 'no xylitol',
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
    sugar: 'no sugar',
    'sugar added': 'no sugar added',
    'sugar alcohol': 'no sugar alcohol',
    tagatose: 'no tagatose',
    xylitol: 'no xylitol',
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
  low: {
    'low sugar': 'low sugar',
  },
  lower: {
    'lower sugar': 'lower sugar',
  },
  unsweetened: {
    unsweetened: 'unsweetened',
  },
  contain: {
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
    'fruit juice': 'fruit juice',
    'high fructose corn syrup': 'high fructose corn syrup',
    honey: 'honey',
    'low sugar': 'low sugar',
    'lower sugar': 'lower sugar',
    'monk fruit': 'monk fruit',
    'natural sweeteners': 'natural sweeteners',
  },
} as any;
