import { toUpper } from 'lodash';

export const nonCertifierClaimValidate = async (
  modifiedProductDataPoints: any
) => {
  const claim_list =
    modifiedProductDataPoints?.['attributes']?.['nonCertificateClaims'] || [];

  await validate(
    [...claim_list],
    modifiedProductDataPoints,
    'validated_nonCertificateClaims'
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
      const claimValue = analysisItem['claim'];

      const currentValues =
        modifiedProductDataPoints?.['attributes']?.[dataPointKey] || [];

      modifiedProductDataPoints['attributes'][dataPointKey] = [
        ...currentValues,
        NON_CERTIFICATE_CLAIMS_MAP?.[claimValue],
      ];
    }
  }
};

const check = async (analysisItem: any): Promise<boolean> => {
  const { claim, isClaimed, source } = analysisItem;

  if (!claim) return Promise.resolve(false);

  if (isClaimed === 'false' || isClaimed === 'unknown')
    return Promise.resolve(false);

  if (
    source?.includes('ingredient list') ||
    source?.includes('nutrition fact')
  ) {
    return Promise.resolve(false);
  }

  if (!NON_CERTIFICATE_CLAIMS.includes(claim)) {
    return Promise.resolve(false);
  }

  if (source?.includes('marketing text on product')) {
    return Promise.resolve(true);
  }

  return Promise.resolve(false);
};

const NON_CERTIFICATE_CLAIMS = [
  '100% natural',
  '100% natural ingredients',
  '100% pure',
  'acid free',
  'aeroponic grown',
  'all natural',
  'all natural ingredients',
  'aquaponic/aquaculture grown',
  'baked',
  'biodegradable',
  'cage free',
  'cold-pressed',
  'direct trade',
  'dolphin safe',
  'dry roasted',
  'eco-friendly',
  'farm raised',
  'filtered',
  'free range',
  'freeze-dried',
  'from concentrate',
  'grade a',
  'greenhouse grown',
  'heat treated',
  'heirloom',
  'homeopathic',
  'homogenized',
  'hydroponic grown',
  'hypo-allergenic',
  'irradiated',
  'live food',
  'low acid',
  'low carbohydrate',
  'low carbohydrate or low-carb',
  'low carbohydrate',
  'low-carb',
  'low cholesterol',
  'macrobiotic',
  'minimally processed',
  'natural',
  'natural botanicals',
  'natural fragrances',
  'natural ingredients',
  'no animal testing',
  'no sulfites added',
  'non gebrokts',
  'non-alcoholic',
  'non-irradiated',
  'non-toxic',
  'not fried',
  'not from concentrate',
  'pasteurized',
  'pasture raised',
  'prairie raised',
  'raw',
  'responsibly sourced palm oil',
  'sprouted',
  'un-filtered',
  'un-pasteurized',
  'unscented',
  'vegetarian or vegan diet/feed',
  'wild',
  'wild caught',
];

export const NON_CERTIFICATE_CLAIMS_MAP = {
  '100% natural': '100% natural',
  '100% natural ingredients': '100% natural ingredients',
  '100% pure': '100% pure',
  'acid free': 'acid free',
  'aeroponic grown': 'aeroponic grown',
  'all natural': 'all natural',
  'all natural ingredients': 'all natural ingredients',
  'aquaponic/aquaculture grown': 'aquaponic/aquaculture grown',
  baked: 'baked',
  biodegradable: 'biodegradable',
  'cage free': 'cage free',
  'cold-pressed': 'cold-pressed',
  'direct trade': 'direct trade',
  'dolphin safe': 'dolphin safe',
  'dry roasted': 'dry roasted',
  'eco-friendly': 'eco-friendly',
  'farm raised': 'farm raised',
  filtered: 'filtered',
  'free range': 'free range',
  'freeze-dried': 'freeze-dried',
  'from concentrate': 'from concentrate',
  'grade a': 'grade a',
  'greenhouse grown': 'greenhouse grown',
  'heat treated': 'heat treated',
  heirloom: 'heirloom',
  homeopathic: 'homeopathic',
  homogenized: 'homogenized',
  'hydroponic grown': 'hydroponic grown',
  'hypo-allergenic': 'hypo-allergenic',
  irradiated: 'irradiated',
  'live food': 'live food',
  'low acid': 'low acid',
  'low carbohydrate': 'low carbohydrate',
  'low carbohydrate or low-carb': 'low carbohydrate',
  'low-carb': 'low carbohydrate',
  'low - carb': 'low carbohydrate',
  'low cholesterol': 'low cholesterol',
  macrobiotic: 'macrobiotic',
  'minimally processed': 'minimally processed',
  natural: 'natural',
  'natural botanicals': 'natural botanicals',
  'natural fragrances': 'natural fragrances',
  'natural ingredients': 'natural ingredients',
  'no animal testing': 'no animal testing',
  'no sulfites added': 'no sulfites added',
  'non gebrokts': 'non gebrokts',
  'non-alcoholic': 'non-alcoholic',
  'non-irradiated': 'non-irradiated',
  'non-toxic': 'non-toxic',
  'not fried': 'not fried',
  'not from concentrate': 'not from concentrate',
  pasteurized: 'pasteurized',
  'pasture raised': 'pasture raised',
  'prairie raised': 'prairie raised',
  raw: 'raw',
  'responsibly sourced palm oil': 'responsibly sourced palm oil',
  sprouted: 'sprouted',
  'un-filtered': 'un-filtered',
  'un-pasteurized': 'un-pasteurized',
  unscented: 'unscented',
  'vegetarian or vegan diet/feed': 'vegetarian or vegan diet/feed',
  wild: 'wild',
  'wild caught': 'wild caught',
} as any;
