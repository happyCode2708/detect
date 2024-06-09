import { toLower } from 'lodash';

export const mapOcrToPredictDataPoint = async (
  OcrText: string
): Promise<any> => {
  if (!OcrText) return [];

  const ocrImageTexts = Object.entries(OcrText)?.map((keyAndValue: any) => {
    let [key, value] = keyAndValue;

    return { text: value?.[0] };
  });

  let modData = {
    ocr_claims: {
      non_certified_claim: [],
    },
  };

  await validate(
    ocrImageTexts,
    modData,
    'non_certified_claim',
    NON_CERTIFICATE_CLAIMS
  );

  await validate(ocrImageTexts, modData, 'contain_claim', CONTAIN_MAPPING);

  await validate(
    ocrImageTexts,
    modData,
    'sugar_and_sweet_claim',
    SUGAR_AND_SWEET_CLAIMS
  );

  await validate(ocrImageTexts, modData, 'fat_claim', FAT_CLAIMS);

  return Promise.resolve(modData);
};

const validate = async (
  textImageList: any[],
  modifiedProductDataPoints: any,
  dataPointKey: string,
  enumValue: any
) => {
  let validated_fields = [] as any;

  for (const textImage of textImageList) {
    const lowercaseText = toLower(textImage?.text);
    const matched = await checkMatch(lowercaseText, enumValue);

    if (matched?.length > 0) {
      validated_fields = [...validated_fields, ...matched];
    }
  }

  let currentValues =
    modifiedProductDataPoints?.['ocr_claims']?.[dataPointKey] || [];

  modifiedProductDataPoints['ocr_claims'][dataPointKey] = [
    ...currentValues,
    ...new Set(validated_fields),
  ];
};

const checkMatch = async (lowercaseText: string, enumValue: any) => {
  let matchContains = [] as any;

  for (const keyNvalue of Object.entries(enumValue)) {
    const foundMatchs = await promiseCheckEachEnum(keyNvalue, lowercaseText);
    matchContains = [...matchContains, ...foundMatchs];
  }

  console.log('matchContains', matchContains);

  return Promise.resolve(matchContains);
};

const promiseCheckEachEnum = async (keyNvalue: any, ingredientName: string) => {
  const [containEnum, possibleValueList] = keyNvalue;
  let foundMatches = [] as any;

  possibleValueList.forEach((possibleValueItem: string) => {
    console.log('comoare', `${ingredientName}-${possibleValueItem}`);
    if (ingredientName.includes(possibleValueItem)) {
      console.log('found in enums -- ocr');
      if (containEnum === 'natural') {
        if (!possibleValueItem.includes(ingredientName)) {
          //   return;
        }
      }
      foundMatches.push(containEnum);
      return;
    }
  });

  return Promise.resolve(foundMatches);
};

const NON_CERTIFICATE_CLAIMS = {
  'acid free': ['acid free'],
  'free range': ['free range'],
  'no animal testing': ['no animal testing'],
  'no sulfites added': ['no sulfites added'],
  'non gebrokts': ['non gebrokts'],
  'non-alcoholic': ['non-alcoholic'],
  'non-irradiated': ['non-irradiated'],
  'non-toxic': ['non-toxic'],
  'not fried': ['not fried'],
  'not from concentrate': ['not from concentrate'],
  '100% natural': ['100% natural'],
  '100% natural ingredients': ['100% natural ingredients'],
  '100% pure': ['100% pure'],
  'aeroponic grown': ['aeroponic grown'],
  'all natural': ['all natural'],
  'all natural ingredients': ['all natural ingredients'],
  'aquaponic/aquaculture grown': [
    'aquaponic/aquaculture grown',
    'aquaponic',
    'aquaculture grown',
  ],
  baked: ['baked'],
  biodegradable: ['biodegradable'],
  'cage free': ['cage free'],
  'cold-pressed': ['cold-pressed'],
  'direct trade': ['direct trade'],
  'dolphin safe': ['dolphin safe'],
  'dry roasted': ['dry roasted'],
  'eco-friendly': ['eco-friendly'],
  'farm raised': ['farm raised'],
  filtered: ['filtered'],
  'freeze-dried': ['freeze-dried'],
  'from concentrate': ['from concentrate'],
  'grade a': ['grade a'],
  'greenhouse grown': ['greenhouse grown'],
  'heat treated': ['heat treated'],
  heirloom: ['heirloom'],
  homeopathic: ['homeopathic'],
  homogenized: ['homogenized'],
  'hydroponic grown': ['hydroponic grown'],
  'hypo-allergenic': ['hypo-allergenic'],
  irradiated: ['irradiated'],
  'live food': ['live food'],
  macrobiotic: ['macrobiotic'],
  'minimally processed': ['minimally processed'],
  pasteurized: ['pasteurized'],
  'pasture raised': ['pasture raised'],
  'prairie raised': ['prairie raised'],
  raw: ['raw'],
  'responsibly sourced palm oil': ['responsibly sourced palm oil'],
  sprouted: ['sprouted'],
  'vegetarian or vegan diet/feed': ['vegetarian or vegan diet/feed'],
  wild: ['wild'],
  'wild caught': ['wild caught'],
  'low acid': ['low acid'],
  'low carbohydrate': ['low carbohydrate', 'low-carb', 'low carb'],
  'low cholesterol': ['low cholesterol'],
  'un-filtered': ['un-filtered', 'unfiltered'],
  'un-pasteurized': ['un-pasteurized', 'unpasteurized'],
  unscented: ['unscented'],
  natural: ['natural'],
  'natural botanicals': ['natural botanicals'],
  'natural fragrances': ['natural fragrances'],
  'natural ingredients': ['natural ingredients'],
};

const CONTAIN_MAPPING = {
  '1,4-dioxane': ['1,4-dioxane'],
  'active yeast': ['active yeast'],
  'added antibiotics': ['added antibiotics'],
  'added colors': ['added colors'],
  'added dyes': ['added dyes'],
  'added flavors': ['added flavors'],
  'added fragrances': ['added fragrances'],
  'added hormones': ['added hormones'],
  'added nitrates': ['added nitrates'],
  'added nitrites': ['added nitrites'],
  'added preservatives': ['added preservatives'],
  'artificial preservatives': ['artificial preservatives'],
  'chemical preservatives': ['chemical preservatives'],
  'natural preservatives': ['natural preservatives'],
  'synthetic preservatives': ['synthetic preservatives'],
  preservatives: ['preservatives'],
  additives: ['additives'],
  alcohol: ['alcohol'],
  allergen: ['allergen'],
  aluminum: ['aluminum'],
  'amino acids': ['amino acids'],
  ammonia: ['ammonia'],
  'animal by-products': ['animal by-products'],
  'animal derivatives': ['animal derivatives'],
  'animal ingredients': ['animal ingredients'],
  'animal products': ['animal products'],
  'animal rennet': ['animal rennet'],
  antibiotics: ['antibiotics'],
  'artificial additives': ['artificial additives'],
  'artificial colors': ['artificial colors'],
  'artificial dyes': ['artificial dyes'],
  'artificial flavors': ['artificial flavors'],
  'artificial fragrance': ['artificial fragrance'],
  'artificial ingredients': ['artificial ingredients'],
  'binders and/or fillers': ['binders and fillers', 'binders or fillers'],
  bleach: ['bleach'],
  'bpa (bisphenol-a)': ['bpa (bisphenol-a)'],
  'butylene glycol': ['butylene glycol'],
  'by-products': ['by-products'],
  caffeine: ['caffeine'],
  carrageenan: ['carrageenan'],
  casein: ['casein'],
  'cbd / cannabidiol': ['cbd / cannabidiol', 'cbd', 'cannabidiol'],
  'chemical additives': ['chemical additives'],
  'chemical colors': ['chemical colors'],
  'chemical dyes': ['chemical dyes'],
  'chemical flavors': ['chemical flavors'],
  'chemical fragrances': ['chemical fragrances'],
  'chemical ingredients': ['chemical ingredients'],
  'chemical sunscreens': ['chemical sunscreens'],
  chemicals: ['chemicals'],
  chlorine: ['chlorine'],
  cholesterol: ['cholesterol'],
  coatings: ['coatings'],
  'corn fillers': ['corn fillers'],
  'cottonseed oil': ['cottonseed oil'],
  dyes: ['dyes'],
  edta: ['edta'],
  emulsifiers: ['emulsifiers'],
  erythorbates: ['erythorbates'],
  'expeller-pressed oils': ['expeller-pressed oils'],
  fillers: ['fillers'],
  fluoride: ['fluoride'],
  formaldehyde: ['formaldehyde'],
  fragrances: ['fragrances'],
  grain: ['grain'],
  hexane: ['hexane'],
  hormones: ['hormones'],
  'hydrogenated oils': ['hydrogenated oils'],
  'kitniyos / kitniyot (legumes)': [
    'kitniyos / kitniyot (legumes)',
    'kitniyos',
    'kitniyot (legumes)',
  ],
  lactose: ['lactose'],
  latex: ['latex'],
  msg: ['msg'],
  'natural additives': ['natural additives'],
  'natural colors': ['natural colors'],
  'natural dyes': ['natural dyes'],
  'natural flavors': [
    'natural flavors',
    'natural flavor',
    'naturally flavored',
  ],
  //? extra,
  // 'naturally flavored': ['naturally flavored'], //! sub - natural flavors
  'natural ingredients': ['natural ingredients'],
  'nitrates/nitrites': ['nitrates/nitrites', 'nitrates', 'nitrites'],
  'omega fatty acids': ['omega fatty acids', 'omega'],
  paba: ['paba'],
  'palm oil': ['palm oil'],
  parabens: ['parabens'],
  pesticides: ['pesticides', 'pesticide'],
  'petro chemical': ['petro chemical'],
  petrolatum: ['petrolatum'],
  'petroleum byproducts': ['petroleum byproducts'],
  phosphates: ['phosphates'],
  phosphorus: ['phosphorus'],
  phthalates: ['phthalates'],
  pits: ['pits'],
  'rbgh/bst': ['rbgh/bst', 'bst', 'rbst'],
  rennet: ['rennet'],
  salicylates: ['salicylates'],
  'sea salt': ['sea salt'],
  'shells/ shell pieces': [
    'shells/ shell pieces',
    'shells',
    'shell pieces',
    'shell',
    'nut shell fragments',
  ],
  silicone: ['silicone'],
  'sles ( sodium laureth sulfate)': ['sles ( sodium laureth sulfate)'],
  'sls ( sodium lauryl sulfate )': ['sls ( sodium lauryl sulfate )'],
  stabilizers: ['stabilizers'],
  probiotics: ['probiotics', 'probiotic'],
  starch: ['starch'],
  sulfates: ['sulfates'],
  sulfides: ['sulfides'],
  'sulfites / sulphites': ['sulfites / sulphites', 'sulfites', 'sulphites'],
  'sulfur dioxide': ['sulfur dioxide'],
  'synthetic additives': ['synthetic additives'],
  'synthetic colors': ['synthetic colors'],
  'synthetic dyes': ['synthetic dyes'],
  'synthetic flavors': ['synthetic flavors'],
  'synthetic fragrance': ['synthetic fragrance'],
  'synthetic ingredients': ['synthetic ingredients'],
  synthetics: ['synthetics'],
  'thc / tetrahydrocannabinol': [
    'thc / tetrahydrocannabinol',
    'thc',
    'tetrahydrocannabinol',
  ],
  'toxic pesticides': ['toxic pesticides'],
  triclosan: ['triclosan'],
  'vegan ingredients': ['vegan ingredients'],
  'vegetarian ingredients': ['vegetarian ingredients'],
  yeast: ['yeast'],
  yolks: ['yolks'],
};

const FAT_CLAIMS = {
  'low fat': ['low fat'],
  'low in saturated fat': ['low in saturated fat'],
  'no fat': ['no fat'],
  'no trans fat': ['no trans fat'],
  'fat free': ['fat free'],
  'free of saturated fat': ['free of saturated fat'],
  'trans fat free': ['trans fat free'],
  'reduced fat': ['reduced fat'],
  'zero grams trans fat per serving': ['zero grams trans fat per serving'],
  'zero trans fat': ['zero trans fat'],
};

const SUGAR_AND_SWEET_CLAIMS = {
  'acesulfame k': ['acesulfame k', 'acesulfame'],
  agave: ['agave'],
  allulose: ['allulose'],
  'artificial sweetener': ['artificial sweetener'],
  aspartame: ['aspartame'],
  'beet sugar': ['beet sugar'],
  'cane sugar': ['cane sugar'],
  'coconut/coconut palm sugar': [
    'coconut/coconut palm sugar',
    'coconut sugar',
    'coconut palm sugar',
  ],
  'fruit juice': ['fruit juice'],
  'high fructose corn syrup': ['high fructose corn syrup'],
  honey: ['honey'],
  'low sugar': ['low sugar'],
  'lower sugar': ['lower sugar'],
  'monk fruit': ['monk fruit'],
  'natural sweeteners': ['natural sweeteners'],
  'no acesulfame k': ['no acesulfame k', 'acesulfame k', 'acesulfame'],
  'no added sugar': ['no added sugar', 'added sugar'],
  'no agave': ['no agave', 'agave'],
  'no allulose': ['no allulose', 'allulose'],
  'no artificial sweetener': [
    'no artificial sweetener',
    'artificial sweetener',
  ],
  'no aspartame': ['no aspartame', 'aspartame'],
  'no cane sugar': ['no cane sugar', 'cane sugar'],
  'no coconut/coconut palm sugar': [
    'no coconut/coconut palm sugar',
    'no coconut sugar',
    'no coconut palm sugar',
    'coconut sugar',
    'coconut palm',
  ],
  'no corn syrup': ['no corn syrup'],
  'no high fructose corn syrup': [
    'no high fructose corn syrup',
    'high fructose corn syrup',
  ],
  'no refined sugars': ['no refined sugars', 'refined sugars'],
  'no saccharin': ['no saccharin', 'saccharin'],
  'no splenda/sucralose': [
    'no splenda/sucralose',
    'no splenda',
    'no sucralose',
    'splenda',
    'sucralose',
  ],
  'no stevia': ['no stevia', 'stevia'],
  'no sugar': ['no sugar', 'sugar'],
  'no sugar added': ['no sugar added'],
  'no sugar alcohol': ['no sugar alcohol', 'sugar alcohol'],
  'no tagatose': ['no tagatose', 'tagatose'],
  'no xylitol': ['no xylitol', 'xylitol'],
  'reduced sugar': ['reduced sugar'],
  'refined sugar': ['refined sugar'],
  saccharin: ['saccharin'],
  'splenda/sucralose': ['splenda/sucralose', 'splenda', 'sucralose'],
  stevia: ['stevia'],
  'sugar alcohol': ['sugar alcohol'],
  'sugar free': ['sugar free'],
  'sugars added': ['sugars added'],
  tagatose: ['tagatose'],
  unsweetened: ['unsweetened'],
  xylitol: ['xylitol'],
};

const SUGAR_AND_SWEET_CLAIMS_SUBJECT = {
  'acesulfame k': ['acesulfame k', 'acesulfame'],
  agave: ['agave'],
  allulose: ['allulose'],
  'artificial sweetener': ['artificial sweetener'],
  aspartame: ['aspartame'],
  'beet sugar': ['beet sugar'],
  'cane sugar': ['cane sugar'],
  'coconut/coconut palm sugar': [
    'coconut/coconut palm sugar',
    'coconut sugar',
    'coconut palm sugar',
  ],
  'fruit juice': ['fruit juice'],
  'high fructose corn syrup': ['high fructose corn syrup'],
  honey: ['honey'],
  'low sugar': ['sugar'],
  'lower sugar': ['sugar'],
  'monk fruit': ['monk fruit'],
  'natural sweeteners': ['natural sweeteners'],
  'no acesulfame k': ['acesulfame k', 'acesulfame'],
  'no added sugar': ['added sugar'],
  'no agave': ['agave'],
  'no allulose': ['no allulose', 'allulose'],
  'no artificial sweetener': [
    'no artificial sweetener',
    'artificial sweetener',
  ],
  'no aspartame': ['no aspartame', 'aspartame'],
  'no cane sugar': ['no cane sugar', 'cane sugar'],
  'no coconut/coconut palm sugar': [
    'no coconut/coconut palm sugar',
    'no coconut sugar',
    'no coconut palm sugar',
    'coconut sugar',
    'coconut palm',
  ],
  'no corn syrup': ['no corn syrup'],
  'no high fructose corn syrup': [
    'no high fructose corn syrup',
    'high fructose corn syrup',
  ],
  'no refined sugars': ['no refined sugars', 'refined sugars'],
  'no saccharin': ['no saccharin', 'saccharin'],
  'no splenda/sucralose': [
    'no splenda/sucralose',
    'no splenda',
    'no sucralose',
    'splenda',
    'sucralose',
  ],
  'no stevia': ['no stevia', 'stevia'],
  'no sugar': ['no sugar', 'sugar'],
  'no sugar added': ['no sugar added'],
  'no sugar alcohol': ['no sugar alcohol', 'sugar alcohol'],
  'no tagatose': ['no tagatose', 'tagatose'],
  'no xylitol': ['no xylitol', 'xylitol'],
  'reduced sugar': ['reduced sugar'],
  'refined sugar': ['refined sugar'],
  saccharin: ['saccharin'],
  'splenda/sucralose': ['splenda/sucralose', 'splenda', 'sucralose'],
  stevia: ['stevia'],
  'sugar alcohol': ['sugar alcohol'],
  'sugar free': ['sugar free'],
  'sugars added': ['sugars added'],
  tagatose: ['tagatose'],
  unsweetened: ['unsweetened'],
  xylitol: ['xylitol'],
};
