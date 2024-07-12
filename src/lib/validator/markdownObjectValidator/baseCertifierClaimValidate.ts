import { is } from 'cheerio/lib/api/traversing';
import { toLower } from 'lodash';

export const baseCertifierClaimValidate = async (
  modifiedProductDataPoints: any
) => {
  if (!modifiedProductDataPoints?.['attributes']) {
    console.log('finish validate base certifier claim');

    return;
  }

  const claim_list =
    modifiedProductDataPoints?.['attributes']?.['baseCertifierClaims'] || [];

  await validate(
    [...claim_list],
    modifiedProductDataPoints,
    'validated_baseCertifierClaims'
  );

  console.log('finish validate base certifier claim');
};

const validate = async (
  analysisList: any[],
  modifiedProductDataPoints: any,
  dataPointKey: string
) => {
  modifiedProductDataPoints['attributes'][dataPointKey] = {};

  // console.log('analysis list', JSON.stringify(analysisList));

  for (const analysisItem of analysisList) {
    let valid = await check(analysisItem);

    // console.log('base cert check', `${analysisItem?.claim} - ${valid}`);

    if (valid === true) {
      const { claim: claimValue, isClaimed } = analysisItem;
      // console.log('base cert', `${claimValue} - ${isClaimed}`);

      if (
        BASE_CERTIFIER_CLAIMS_MAP?.[toLower(claimValue)] &&
        toLower(isClaimed) === 'yes'
      ) {
        modifiedProductDataPoints['attributes'][dataPointKey][
          BASE_CERTIFIER_CLAIMS_MAP?.[toLower(claimValue)]
        ] = 'TRUE';
      }
    }
  }
};

const check = async (analysisItem: any): Promise<boolean> => {
  const { claim, isClaimed } = analysisItem;

  if (!claim) return Promise.resolve(false);

  if (isClaimed === 'unknown') return Promise.resolve(false);

  if (!BASE_CERTIFIER_CLAIMS.includes(toLower(claim))) {
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
  'use gmo claim',
  'gmp claim',
  'gluten-free claim',
  'glycemic index claim',
  'glyphosate residue free claim',
  'grass-fed claim',
  'halal claim',
  'hearth healthy claim',
  'keto/ketogenic claim',
  'kosher claim',
  'live and active culture claim',
  'low glycemic claim',
  'new york state grown & certified claim',
  'non-gmo claim',
  'organic claim',
  'paca claim',
  'pasa claim',
  'paleo claim',
  'plant based/derived claim',
  'rain forest alliance claim',
  'vegan claim',
  'vegetarian claim',
  'viticulture claim',
  'whole grain claim',
];

const BASE_CERTIFIER_CLAIMS_MAP = {
  'bee friendly claim': 'BeeBetterClaim',
  'bio-based claim': 'BioBasedYN',
  'biodynamic claim': 'BioDynamicYN',
  'bioengineered claim': 'BioengineeredYN',
  'cbd cannabidiol / help claim': 'CBDHempClaim',
  'carbon footprint claim': 'CarbonFootprintYN',
  'certified b corporation': 'CertifiedBCorporation',
  'certified by international packaged ice association':
    'InternationalPackagedIceAssociation',
  'cold pressure verified': 'ColdPressureVerified',
  'cold pressure protected claim': 'ColdPressuredProtectedClaim',
  'cradle to cradle claim': 'CradleToCradleYN',
  'cruelty free claim': 'CrueltyFreeYN',
  'diabetic friendly claim': 'DiabeticFriendlyYN',
  'eco fishery claim': 'EcoFisheryYN',
  'fair trade claim': 'FairTradeYN',
  'for life claim': 'ForLifeYN"',
  'use GMO claim': 'GMO',
  'gmp claim': 'GMPYN"',
  'gluten-free claim': 'GlutenFreeYN',
  'glycemic index claim': 'GlycemicIndexClaim',
  'glyphosate residue free claim': 'GlyphosateResidueFreeClaim',
  'grass-fed claim': 'GrassFedYN',
  'halal claim': 'HalalYN',
  'hearth healthy claim': 'HeartHealthyYN',
  'keto/ketogenic claim': 'KetoYN',
  'kosher claim': 'KosherYN',
  'live and active culture claim': 'LiveAndActiveCulture',
  'low glycemic claim': 'LowGlycemicYN',
  'new york state grown & certified claim': 'NewYorkStateGrownCertifierClaim',
  'non-gmo claim': 'NonGMOYN',
  'organic claim': 'OrganicYN',
  'paca claim': 'PACAYN',
  'pasa claim': 'PASAYN',
  'paleo claim': 'PaleoYN',
  'plant based/derived claim': 'PlantBasedDerivedClaim',
  'rain forest alliance claim': 'RainForestAllianceYN',
  'vegan claim': 'VeganYN',
  'vegetarian claim': 'VeganYN',
  'viticulture claim': 'ViticultureYN',
  'whole grain claim': 'WholeGrainYN',
} as any;

// 'high potency': 'high potency',
// 'ITAL CERTIFIED SEAL Claim': 'ITAL CERTIFIED SEAL Claim',
// 'ITAL CONSCIOUS SEAL Claim': 'ITAL CONSCIOUS SEAL Claim',
// 'ITAL SACRAMENT SEAL Claim': 'ITAL SACRAMENT SEAL Claim',

// 'high potency',
// 'ITAL CERTIFIED SEAL Claim',
// 'ITAL CONSCIOUS SEAL Claim',
// 'ITAL SACRAMENT SEAL Claim',
