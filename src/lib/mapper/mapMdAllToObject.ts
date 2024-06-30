import logger from '../logger/index';

export const mapMarkdownAllToObject = (markdown: string) => {
  const extraClaimSection = markdown
    .split('EXTRA_CLAIM_TABLE')?.[1]
    ?.split('SUGAR_CLAIM_TABLE')?.[0];

  logger.error('extra');
  logger.info(extraClaimSection);

  const sugarClaimSection = markdown
    .split('SUGAR_CLAIM_TABLE')?.[1]
    ?.split('FAT_CLAIM_TABLE')?.[0];

  logger.error('sugar');
  logger.info(sugarClaimSection);

  const fatClaimSection = markdown
    .split('FAT_CLAIM_TABLE')?.[1]
    ?.split('OTHER_CLAIM_TABLE')?.[0];

  logger.error('fat');
  logger.info(fatClaimSection);

  const otherClaimSection = markdown
    .split('OTHER_CLAIM_TABLE')?.[1]
    ?.split('CALORIE_CLAIM_TABLE')?.[0];

  logger.error('other');
  logger.info(otherClaimSection);

  const calorieClaimSection = markdown
    .split('CALORIE_CLAIM_TABLE')?.[1]
    ?.split('SALT_CLAIM_TABLE')?.[0];

  logger.error('calorie');
  logger.info(calorieClaimSection);

  const saltClaimSection = markdown
    .split('SALT_CLAIM_TABLE')?.[1]
    ?.split('ALLERGEN_TABLE')?.[0];

  logger.error('salt');
  logger.info(saltClaimSection);

  const allergenClaimSection = markdown
    .split('ALLERGEN_TABLE')?.[1]
    ?.split('HEADER_TABLE')?.[0];

  logger.error('allergen');
  logger.info(allergenClaimSection);

  const headerSection = markdown
    .split('HEADER_TABLE')?.[1]
    ?.split('INGREDIENT_TABLE')?.[0];

  logger.error('header');
  logger.info(headerSection);

  const ingredientSection = markdown
    .split('INGREDIENT_TABLE')?.[1]
    ?.split('PHYSICAL_TABLE')?.[0];

  logger.error('ingredient');
  logger.info(ingredientSection);

  const physicalSection = markdown
    .split('PHYSICAL_TABLE')?.[1]
    ?.split('MARKETING_TABLE')?.[0];

  logger.error('physical');
  logger.info(physicalSection);

  const marketingSection = markdown
    .split('MARKETING_TABLE')?.[1]
    ?.split('INSTRUCTION_TABLE')?.[0];

  logger.error('marketing');
  logger.info(marketingSection);

  const instructionSection = markdown
    .split('INSTRUCTION_TABLE')?.[1]
    ?.split('SUPPLY_CHAIN_TABLE')?.[0];

  logger.error('instruction');
  logger.info(instructionSection);

  const supplyChainSection = markdown
    .split('SUPPLY_CHAIN_TABLE')?.[1]
    ?.split('DEBUG_TABLE')?.[0];

  logger.error('supply chain');
  logger.info(supplyChainSection);

  //? EXTRA
  const extraClaimsObjList = getObjectDataFromTable(extraClaimSection, [
    'claim',
    'mentioned',
    'contain',
    'notContain',
    'source',
    'reason',
  ]);
  logger.error('extra claim object list');
  logger.info(JSON.stringify(extraClaimsObjList));

  //? SUGAR
  const sugarClaimsObjList = getObjectDataFromTable(sugarClaimSection, [
    'claim',
    'isClaimed',
    'source',
    'reason',
  ]);
  logger.error('sugar claim list');
  logger.info(JSON.stringify(sugarClaimsObjList));

  //? FAT
  const fatClaimsObjList = getObjectDataFromTable(fatClaimSection, [
    'claim',
    'isClaimed',
    'source',
    'reason',
  ]);
  logger.error('fat claim list');
  logger.info(JSON.stringify(fatClaimsObjList));

  //? OTHER
  const otherClaimsObjList = getObjectDataFromTable(otherClaimSection, [
    'claim',
    'isClaimed',
    'source',
    'reason',
  ]);
  logger.error('other claim list');
  logger.info(JSON.stringify(otherClaimsObjList));

  //? CALORIE
  const calorieClaimsObjList = getObjectDataFromTable(calorieClaimSection, [
    'claim',
    'isClaimed',
    'source',
  ]);
  logger.error('calorie claim list');
  logger.info(JSON.stringify(calorieClaimsObjList));

  //? SALT
  const saltClaimsObjList = getObjectDataFromTable(saltClaimSection, [
    'claim',
    'isClaimed',
    'source',
  ]);
  logger.error('salt claim list');
  logger.info(JSON.stringify(saltClaimsObjList));

  //? ALLERGEN
  const allergenObjList = getObjectDataFromTable(allergenClaimSection, [
    'containStatement',
    'containList',
    'notContainStatement',
    'notContainList',
    'containOnEquipmentStatement',
    'containOnEquipmentList',
  ]);
  logger.error('allergen list');
  logger.info(JSON.stringify(allergenObjList));

  //? HEADER
  const headerObjList = getObjectDataFromTable(headerSection, [
    'productName',
    'brandName',
    'primarySize',
    'secondarySize',
    'thirdSize',
    'fullSizeTextDescription',
    'count',
  ]);
  logger.error('header list');
  logger.info(JSON.stringify(headerObjList));

  //? INGREDIENT TABLE
  const ingredientObjList = getObjectDataFromTable(ingredientSection, [
    'isProductSupplement',
    'ingredientStatement',
  ]);
  logger.error('ingredient list');
  logger.info(JSON.stringify(ingredientObjList));

  //? PHYSICAL
  const physicalObjList = getObjectDataFromTable(physicalSection, ['upc12']);
  logger.error('physical');
  logger.info(JSON.stringify(physicalObjList));

  //? MARKETING
  const marketingObjList = getObjectDataFromTable(marketingSection, [
    'haveQrCode',
    'instagram',
    'pinterest',
    'youtube',
    'facebook',
    'socialMediaList',
    'website',
    'socialMediaText',
    'enlargedToShow',
  ]);
  logger.error('marketing');
  logger.info(JSON.stringify(marketingObjList));

  //? INSTRUCTION
  const instructionObjList = getObjectDataFromTable(instructionSection, [
    'storageInstruction',
    'cookingInstruction',
    'usageInstruction',
    'usageTimeInstruction',
    'otherInstructions',
  ]);
  logger.error('instruction');
  logger.info(JSON.stringify(instructionObjList));

  //? SUPPLY CHAIN
  const supplyChainObjList = getObjectDataFromTable(physicalSection, [
    'countryOfOrigin',
    'manufacturerName',
    'manufacturerDate',
    'manufacturerPhoneNumber',
    'manufacturerStreetAddress',
    'manufacturerCity',
    'manufacturerState',
    'manufactureZipCode',
  ]);
  logger.error('supplyChain');
  logger.info(JSON.stringify(supplyChainObjList));

  return {
    header: headerObjList,
    physical: physicalObjList,
    attributes: {
      containAndNotContain: extraClaimsObjList,
      fatClaims: fatClaimsObjList,
      nonCertificateClaims: otherClaimsObjList,
      calorieClaims: calorieClaimsObjList,
      saltClaims: saltClaimsObjList,
    },
    ingredients: ingredientObjList,
    allergens: allergenObjList,
    instructions: instructionObjList,
    marketing: marketingObjList,
    supplyChain: supplyChainObjList,
  };
};

const getObjectDataFromTable = (
  sectionContent: string,
  propertyList: string[]
) => {
  const [tableHeader, tableDivider, ...itemStringList] = sectionContent
    .trim()
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .filter((line) => line.trim() !== '##');

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
