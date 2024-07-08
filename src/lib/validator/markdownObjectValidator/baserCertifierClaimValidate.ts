export const baseCertifierClaimValidate = async (
  modifiedProductDataPoints: any
) => {
  const claim_list =
    modifiedProductDataPoints?.['attributes']?.['baseCertifierClaims'] || [];

  await validate(
    [...claim_list],
    modifiedProductDataPoints,
    'validated_baseCertifierClaims'
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
        modifiedProductDataPoints?.['attributes']?.[dataPointKey] || {};

      modifiedProductDataPoints['attributes'][dataPointKey] = {
        ...currentValues,
      };
    }
  }
};

const check = async (analysisItem: any): Promise<boolean> => {
  const { claim, isClaimed, source } = analysisItem;

  if (!claim) return Promise.resolve(false);

  if (isClaimed === 'no' || isClaimed === 'unknown')
    return Promise.resolve(false);

  if (source === 'ingredient list' || source === 'nutrition fact') {
    return Promise.resolve(false);
  }

  if (!FAT_CLAIMS.includes(claim)) {
    return Promise.resolve(false);
  }

  return Promise.resolve(true);
};

const BASE_CERTIFIER_CLAIMS = [
  'bee friendly claim',
  'bio-based claim',
  'biodynamic claim',
  'bioengineered claim',
  'cbd cannabidiol / help claim',
  'carbon footprint claim',
  'certified b corporation',
  'certified by international packaged ice association',
  'cold pressure verified',
  'cold pressure protected claim',
  'cradle to cradle claim',
  'cruelty free claim',
  'diabetic friendly claim',
  'eco fishery claim',
  'fair trade claim',
  'for life claim',
  'use GMO claim',
  'gmp claim',
  'gluten-free claim',
  'glycemic index claim',
  'glyphosate residue free claim',
  'grass-fed claim',
  'halal claim',
  'hearth healthy claim',
  'high potency',
  'ITAL CERTIFIED SEAL Claim',
  'ITAL CONSCIOUS SEAL Claim',
  'ITAL SACRAMENT SEAL Claim',
  'Keto/Ketogenic Claim',
  'Kosher Claim',
  'Live and Active Culture Claim',
  'Low Glycemic Claim',
  'New York State Grown & Certified Claim',
  'Non-GMO Claim',
  'Organic Claim',
  'PACA Claim',
  'PASA Claim',
  'Paleo Claim',
  'Plant Based/Derived Claim',
  'Rain Forest Alliance Claim',
  'Vegan Claim',
  'Vegetarian Claim',
  'Viticulture Claim',
  'Whole Grain Claim',
];

const BASE_CERTIFIER_CLAIMS_MAP = {
  'bee friendly claim': 'bee friendly claim',
  'bio-based claim': 'bio-based claim',
  'biodynamic claim': 'BioDynamicYN',
  'bioengineered claim': 'bioengineered claim',
  'cbd cannabidiol / help claim': 'cbd cannabidiol / help claim',
  'carbon footprint claim': 'CarbonFootprintYN',
  'certified b corporation': 'certified b corporation',
  'certified by international packaged ice association':
    'certified by international packaged ice association',
  'cold pressure verified': 'cold pressure verified',
  'cold pressure protected claim': 'cold pressure protected claim',
  'cradle to cradle claim': 'CradleToCradleYN',
  'cruelty free claim': 'CrueltyFreeYN',
  'diabetic friendly claim': 'DiabeticFriendlyYN',
  'eco fishery claim': 'EcoFisheryYN',
  'fair trade claim': 'FairTradeYN',
  'for life claim': 'ForLifeYN"',
  'use GMO claim': 'use GMO claim',
  'gmp claim': 'GMPYN"',
  'gluten-free claim': 'GlutenFreeYN',
  'glycemic index claim': 'glycemic index claim',
  'glyphosate residue free claim': 'glyphosate residue free claim',
  'grass-fed claim': 'GrassFedYN',
  'halal claim': 'HalalYN',
  'hearth healthy claim': 'HeartHealthyYN',
  'high potency': 'high potency',
  'ITAL CERTIFIED SEAL Claim': 'ITAL CERTIFIED SEAL Claim',
  'ITAL CONSCIOUS SEAL Claim': 'ITAL CONSCIOUS SEAL Claim',
  'ITAL SACRAMENT SEAL Claim': 'ITAL SACRAMENT SEAL Claim',
  'Keto/Ketogenic Claim': 'Keto/Ketogenic Claim',
  'Kosher Claim': 'KosherYN',
  'Live and Active Culture Claim': 'Live and Active Culture Claim',
  'Low Glycemic Claim': 'LowGlycemicYN',
  'New York State Grown & Certified Claim':
    'New York State Grown & Certified Claim',
  'Non-GMO Claim': 'NonGMOYN',
  'Organic Claim': 'OrganicYN',
  'PACA Claim': 'PACA Claim',
  'PASA Claim': 'PASA Claim',
  'Paleo Claim': 'Paleo Claim',
  'Plant Based/Derived Claim': 'Plant Based/Derived Claim',
  'Rain Forest Alliance Claim': 'Rain Forest Alliance Claim',
  'Vegan Claim': 'Vegan Claim',
  'Vegetarian Claim': 'Vegetarian Claim',
  'Viticulture Claim': 'Viticulture Claim',
  'Whole Grain Claim': 'Whole Grain Claim',
} as any;
