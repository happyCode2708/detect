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
      non_certified_claim_predict: [],
    },
  };

  await validate(
    ocrImageTexts,
    modData,
    'non_certified_claim_predict',
    NON_CERTIFICATE_CLAIMS
  );

  await validate(
    ocrImageTexts,
    modData,
    'contain_claim_predict',
    CONTAIN_MAPPING
  );

  await validate(
    ocrImageTexts,
    modData,
    'sugar_and_sweet_claim_predict',
    SUGAR_AND_SWEET_CLAIMS
  );

  await validate(ocrImageTexts, modData, 'fat_claim_predict', FAT_CLAIMS);

  return Promise.resolve(modData);

  console.log(JSON.stringify(modData));
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
    // console.log('coup', `${ingredientName}-${possibleValueItem}`);
    if (ingredientName.includes(possibleValueItem)) {
      console.log('found in enums');
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
  'added colors': ['added colors', 'colors'],
  'added dyes': ['added dyes'],
  'added flavors': ['added flavors', 'flavors'],
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
  'artificial colors': ['artificial colors', 'colors'],
  'artificial dyes': ['artificial dyes'],
  'artificial flavors': ['artificial flavors', 'flavors'],
  'artificial fragrance': ['artificial fragrance'],
  'artificial ingredients': ['artificial ingredients'],
  'binders and/or fillers': ['binders and/or fillers'],
  bleach: ['bleach'],
  'bpa (bisphenol-a)': ['bpa (bisphenol-a)'],
  'butylene glycol': ['butylene glycol'],
  'by-products': ['by-products'],
  caffeine: ['caffeine'],
  carrageenan: ['carrageenan'],
  casein: ['casein'],
  'cbd / cannabidiol': ['cbd / cannabidiol', 'cbd', 'cannabidiol'],
  'chemical additives': ['chemical additives'],
  'chemical colors': ['chemical colors', 'colors'],
  'chemical dyes': ['chemical dyes'],
  'chemical flavors': ['chemical flavors', 'flavors'],
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

const NO_CONTAIN_MAPPING = {
  'no contain 1,4-dioxane': ['1,4-dioxane'],
  'no contain active yeast': ['active yeast'],
  'no contain added antibiotics': ['added antibiotics'],
  'no contain added colors': ['added colors', 'colors'],
  'no contain added dyes': ['added dyes'],
  'no contain added flavors': ['added flavors', 'flavors'],
  'no contain added fragrances': ['added fragrances'],
  'no contain added hormones': ['added hormones'],
  'no contain added nitrates': ['added nitrates'],
  'no contain added nitrites': ['added nitrites'],
  'no contain added preservatives': ['added preservatives'],
  'no contain artificial preservatives': ['artificial preservatives'],
  'no contain chemical preservatives': ['chemical preservatives'],
  'no contain natural preservatives': ['natural preservatives'],
  'no contain synthetic preservatives': ['synthetic preservatives'],
  'no contain preservatives': ['preservatives'],
  'no contain additives': ['additives'],
  'no contain alcohol': ['alcohol'],
  'no contain allergen': ['allergen'],
  'no contain aluminum': ['aluminum'],
  'no contain amino acids': ['amino acids'],
  'no contain ammonia': ['ammonia'],
  'no contain animal by-products': ['animal by-products'],
  'no contain animal derivatives': ['animal derivatives'],
  'no contain animal ingredients': ['animal ingredients'],
  'no contain animal products': ['animal products'],
  'no contain animal rennet': ['animal rennet'],
  'no contain antibiotics': ['antibiotics'],
  'no contain artificial additives': ['artificial additives'],
  'no contain artificial colors': ['artificial colors', 'colors'],
  'no contain artificial dyes': ['artificial dyes'],
  'no contain artificial flavors': ['artificial flavors', 'flavors'],
  'no contain artificial fragrance': ['artificial fragrance'],
  'no contain artificial ingredients': ['artificial ingredients'],
  'no contain binders and/or fillers': ['binders and/or fillers'],
  'no contain bleach': ['bleach'],
  'no contain bpa (bisphenol-a)': ['bpa (bisphenol-a)'],
  'no contain butylene glycol': ['butylene glycol'],
  'no contain by-products': ['by-products'],
  'no contain caffeine': ['caffeine'],
  'no contain carrageenan': ['carrageenan'],
  'no contain casein': ['casein'],
  'no contain cbd / cannabidiol': ['cbd / cannabidiol', 'cbd', 'cannabidiol'],
  'no contain chemical additives': ['chemical additives'],
  'no contain chemical colors': ['chemical colors', 'colors'],
  'no contain chemical dyes': ['chemical dyes'],
  'no contain chemical flavors': ['chemical flavors', 'flavors'],
  'no contain chemical fragrances': ['chemical fragrances'],
  'no contain chemical ingredients': ['chemical ingredients'],
  'no contain chemical sunscreens': ['chemical sunscreens'],
  'no contain chemicals': ['chemicals'],
  'no contain chlorine': ['chlorine'],
  'no contain cholesterol': ['cholesterol'],
  'no contain coatings': ['coatings'],
  'no contain corn fillers': ['corn fillers'],
  'no contain cottonseed oil': ['cottonseed oil'],
  'no contain dyes': ['dyes'],
  'no contain edta': ['edta'],
  'no contain emulsifiers': ['emulsifiers'],
  'no contain erythorbates': ['erythorbates'],
  'no contain expeller-pressed oils': ['expeller-pressed oils'],
  'no contain fillers': ['fillers'],
  'no contain fluoride': ['fluoride'],
  'no contain formaldehyde': ['formaldehyde'],
  'no contain fragrances': ['fragrances'],
  'no contain grain': ['grain'],
  'no contain hexane': ['hexane'],
  'no contain hormones': ['hormones'],
  'no contain hydrogenated oils': ['hydrogenated oils'],
  'no contain kitniyos / kitniyot (legumes)': [
    'kitniyos / kitniyot (legumes)',
    'kitniyos',
    'kitniyot (legumes)',
  ],
  'no contain lactose': ['lactose'],
  'no contain latex': ['latex'],
  'no contain msg': ['msg'],
  'no contain natural additives': ['natural additives'],
  'no contain natural colors': ['natural colors'],
  'no contain natural dyes': ['natural dyes'],
  'no contain natural flavors': [
    'natural flavors',
    'natural flavor',
    'naturally flavored',
  ],
  'no contain natural ingredients': ['natural ingredients'],
  'no contain nitrates/nitrites': ['nitrates/nitrites', 'nitrates', 'nitrites'],
  'no contain omega fatty acids': ['omega fatty acids', 'omega'],
  'no contain paba': ['paba'],
  'no contain palm oil': ['palm oil'],
  'no contain parabens': ['parabens'],
  'no contain pesticides': ['pesticides', 'pesticide'],
  'no contain petro chemical': ['petro chemical'],
  'no contain petrolatum': ['petrolatum'],
  'no contain petroleum byproducts': ['petroleum byproducts'],
  'no contain phosphates': ['phosphates'],
  'no contain phosphorus': ['phosphorus'],
  'no contain phthalates': ['phthalates'],
  'no contain pits': ['pits'],
  'no contain rbgh/bst': ['rbgh/bst', 'bst', 'rbst'],
  'no contain rennet': ['rennet'],
  'no contain salicylates': ['salicylates'],
  'no contain sea salt': ['sea salt'],
  'no contain shells/ shell pieces': [
    'shells/ shell pieces',
    'shells',
    'shell pieces',
    'shell',
    'nut shell fragments',
  ],
  'no contain silicone': ['silicone'],
  'no contain sles ( sodium laureth sulfate)': [
    'sles ( sodium laureth sulfate)',
  ],
  'no contain sls ( sodium lauryl sulfate )': ['sls ( sodium lauryl sulfate )'],
  'no contain stabilizers': ['stabilizers'],
  'no contain probiotics': ['probiotics', 'probiotic'],
  'no contain starch': ['starch'],
  'no contain sulfates': ['sulfates'],
  'no contain sulfides': ['sulfides'],
  'no contain sulfites / sulphites': [
    'sulfites / sulphites',
    'sulfites',
    'sulphites',
  ],
  'no contain sulfur dioxide': ['sulfur dioxide'],
  'no contain synthetic additives': ['synthetic additives'],
  'no contain synthetic colors': ['synthetic colors'],
  'no contain synthetic dyes': ['synthetic dyes'],
  'no contain synthetic flavors': ['synthetic flavors'],
  'no contain synthetic fragrance': ['synthetic fragrance'],
  'no contain synthetic ingredients': ['synthetic ingredients'],
  'no contain synthetics': ['synthetics'],
  'no contain thc / tetrahydrocannabinol': [
    'thc / tetrahydrocannabinol',
    'thc',
    'tetrahydrocannabinol',
  ],
  'no contain toxic pesticides': ['toxic pesticides'],
  'no contain triclosan': ['triclosan'],
  'no contain vegan ingredients': ['vegan ingredients'],
  'no contain vegetarian ingredients': ['vegetarian ingredients'],
  'no contain yeast': ['yeast'],
  'no contain yolks': ['yolks'],
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
