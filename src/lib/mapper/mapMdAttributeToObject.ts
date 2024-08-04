import _ from 'lodash';
import { parseJson } from '@/lib/json';

export const mapMdAttributeToObject = (markdown: string, extraInfo?: any) => {
  const labelingInfoSection = markdown
    .split('LABELING_INFO_TABLE')?.[1]
    ?.split('END_')?.[0];

  const labelingInfoAnalysisSection = markdown
    .split('LABELING_INFO_ANALYSIS_TABLE')?.[1]
    ?.split('END_')?.[0];

  const sugarClaimSection = markdown
    .split('SUGAR_CLAIM_TABLE')?.[1]
    ?.split('END_')?.[0];

  const fatClaimSection = markdown
    .split('FAT_CLAIM_TABLE')?.[1]
    ?.split('END_')?.[0];

  const processClaimSection = markdown
    .split('PROCESS_CLAIM_TABLE')?.[1]
    ?.split('END_')?.[0];

  const calorieClaimSection = markdown
    .split('CALORIE_CLAIM_TABLE')?.[1]
    ?.split('END_')?.[0];

  const saltClaimSection = markdown
    .split('SALT_CLAIM_TABLE')?.[1]
    ?.split('END_')?.[0];

  const extraClaimSection_1 = markdown
    .split('FIRST_EXTRA_CLAIM_TABLE')?.[1]
    ?.split('END_')?.[0];

  const extraClaimSection_2 = markdown
    .split('SECOND_EXTRA_CLAIM_TABLE')?.[1]
    ?.split('END_')?.[0];

  const extraClaimSection_3 = markdown
    .split('THIRD_EXTRA_CLAIM_TABLE')?.[1]
    ?.split('END_')?.[0];

  const allergenClaimSection = markdown
    .split('ALLERGEN_OBJECT')?.[1]
    ?.split('END_')?.[0];

  const headerSection = markdown
    .split('HEADER_OBJECT')?.[1]
    ?.split('END_')?.[0];

  const ingredientSection = markdown
    .split('INGREDIENT_TABLE')?.[1]
    ?.split('END_')?.[0];

  const marketingSection = markdown
    .split('MARKETING_OBJECT')?.[1]
    ?.split('END_')?.[0];

  const cookingInstructionSection = markdown
    .split('COOKING_INSTRUCTION_OBJECT')?.[1]
    ?.split('END_')?.[0];

  const storageInstructionSection = markdown
    .split('STORAGE_INSTRUCTION')?.[1]
    ?.split('END_')?.[0];

  const usageInstructionSection = markdown
    .split('USAGE_INSTRUCTION')?.[1]
    ?.split('END_')?.[0];

  const informationInstructionSection = markdown
    .split('INFORMATION_INSTRUCTION')?.[1]
    ?.split('END_')?.[0];

  const supplyChainSection = markdown
    .split('SUPPLY_CHAIN_OBJECT')?.[1]
    ?.split('END_')?.[0];

  const baseCertifierClaimSection = markdown
    .split('BASE_CERTIFIER_CLAIM_TABLE')?.[1]
    ?.split('END_')?.[0];

  const attributeClaimSection = markdown
    .split('ATTRIBUTE_TABLE')?.[1]
    ?.split('END_')?.[0];

  const marketingTextSection = markdown
    ?.split('MARKETING_TEXT_TABLE')?.[1]
    ?.split('END_')?.[0];

  //? LABELING INFO
  const labelingObjList = getObjectDataFromTable(labelingInfoSection, [
    'label item',
    'label',
    'labelText',
  ]);

  //? LABELING ANALYSIS
  const labelingAnalysisObjList = getObjectDataFromTable(
    labelingInfoAnalysisSection,
    ['label', 'isFreeOf', 'free']
  );

  //? EXTRA
  const extraClaimsObjList_1 = getObjectDataFromTable(extraClaimSection_1, [
    'claim',
    'mentioned',
    'statement',
    'source',
    'reason',
  ]);

  const extraClaimsObjList_2 = getObjectDataFromTable(extraClaimSection_2, [
    'claim',
    'mentioned',
    'statement',
    'source',
    'reason',
  ]);

  const extraClaimsObjList_3 = getObjectDataFromTable(extraClaimSection_3, [
    'claim',
    'mentioned',
    'statement',
    'source',
    'reason',
  ]);

  //? SUGAR
  const sugarClaimsObjList = getObjectDataFromTable(sugarClaimSection, [
    'claim',
    'isClaimed',
    'statement',
    'source',
    'reason',
  ]);

  //? FAT
  const fatClaimsObjList = getObjectDataFromTable(fatClaimSection, [
    'claim',
    'isClaimed',
    'source',
    'reason',
  ]);

  //? OTHER
  const nonCertificateClaimsObjList = getObjectDataFromTable(
    processClaimSection,
    ['claim', 'isClaimed', 'source', 'reason']
  );

  //? CALORIE
  const calorieClaimsObjList = getObjectDataFromTable(calorieClaimSection, [
    'claim',
    'isClaimed',
    'source',
  ]);

  //? SALT
  const saltClaimsObjList = getObjectDataFromTable(saltClaimSection, [
    'claim',
    'isClaimed',
    'source',
  ]);

  //? ALLERGEN
  const allergenObjList = parseJson(allergenClaimSection);

  //? HEADER
  const headerObjList = parseJson(headerSection);

  //? INGREDIENT TABLE
  const ingredientObjList = getObjectDataFromTable(ingredientSection, [
    'productType',
    'ingredientPrefix',
    'ingredientStatement',
    'ingredientBreakdown',
    'liveAndActiveCulturesStatement',
    'liveAndActiveCulturesBreakdown',
  ]);

  //? MARKETING
  // const marketingObjList = getObjectDataFromTable(marketingSection, [
  //   'haveQrCode',
  //   'instagram',
  //   'pinterest',
  //   'youtube',
  //   'youtubeType',
  //   'facebook',
  //   'twitter',
  //   'socialMediaList',
  //   'website',
  //   'socialMediaText',
  //   'enlargedToShow',
  // ]);

  const marketingObjList = {
    websites: parseJson(marketingSection)?.websites?.map(
      (item: any) => item?.['website link']
    ),
  };

  //? INSTRUCTION
  const instructionObjList = {
    cookingInstruction: parseJson(cookingInstructionSection),
    storageInstruction: parseJson(storageInstructionSection),
    usageInstruction: parseJson(usageInstructionSection),
    informationInstruction: parseJson(informationInstructionSection),
  };

  //? SUPPLY CHAIN
  const supplyChainObjList = parseJson(supplyChainSection);

  //? BASE CERTIFIER CLAIM
  const baseCertifierClaimObjList = getObjectDataFromTable(
    baseCertifierClaimSection,
    ['claim', 'isClaimed']
  );

  //? ATTRIBUTE
  const attributeObjList = getObjectDataFromTable(attributeClaimSection, [
    'grade',
    'juicePercent',
  ]);

  //? MARKETING TEXT TABLE
  const marketingTextObjList = getObjectDataFromTable(marketingTextSection, [
    'idx',
    'marketingContent',
  ]);

  return {
    labeling: labelingObjList,
    labelingAnalysis: labelingAnalysisObjList,
    header: headerObjList,
    attributes: {
      containAndNotContain: [
        ...extraClaimsObjList_1,
        ...extraClaimsObjList_2,
        ...extraClaimsObjList_3,
      ],
      sugarClaims: sugarClaimsObjList,
      fatClaims: fatClaimsObjList,
      nonCertificateClaims: nonCertificateClaimsObjList,
      calorieClaims: calorieClaimsObjList,
      saltClaims: saltClaimsObjList,
      baseCertifierClaims: baseCertifierClaimObjList,
      otherAttribute: attributeObjList,
    },
    ingredients: ingredientObjList,
    allergens: allergenObjList,
    instructions: instructionObjList,
    // marketing: [
    //   {
    //     ...marketingObjList?.[0],
    //     marketingClaims: marketingTextObjList?.map(
    //       (item) => item?.marketingContent
    //     ),
    //   },
    // ],
    marketing: marketingObjList,
    supplyChain: supplyChainObjList,
    extraInfo,
    physical: {
      upc12: extraInfo?.physical?.upc12,
    },
  };
};

const getObjectDataFromTable = (
  sectionContent: string,
  propertyList: string[]
) => {
  if (!sectionContent) return [];

  const [tableHeader, tableDivider, ...itemStringList] = sectionContent
    .trim()
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .filter((line) => line.trim() !== '##')
    .filter((line) => line.trim() !== '**');

  return itemStringList.map((line) => {
    const values = line
      .split('|')
      .filter((item) => item !== '')
      .map((item) => item.trim());

    const obj: Record<string, any> = {};
    propertyList.forEach((property, index) => {
      obj[property] = values[index] || '';
    });

    return obj;
  });
};
