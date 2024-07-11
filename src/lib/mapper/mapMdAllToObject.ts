import logger from '../logger/index';

export const mapMarkdownAllToObject = (markdown: string) => {
  const sugarClaimSection = markdown
    .split('SUGAR_CLAIM_TABLE')?.[1]
    ?.split('FAT_CLAIM_TABLE')?.[0];

  // logger.error('sugar');
  // logger.info(sugarClaimSection);

  const fatClaimSection = markdown
    .split('FAT_CLAIM_TABLE')?.[1]
    ?.split('PROCESS_CLAIM_TABLE')?.[0];

  // logger.error('fat');
  // logger.info(fatClaimSection);

  const processClaimSection = markdown
    .split('PROCESS_CLAIM_TABLE')?.[1]
    ?.split('CALORIE_CLAIM_TABLE')?.[0];

  // logger.error('other');
  // logger.info(processClaimSection);

  const calorieClaimSection = markdown
    .split('CALORIE_CLAIM_TABLE')?.[1]
    ?.split('SALT_CLAIM_TABLE')?.[0];

  // logger.error('calorie');
  // logger.info(calorieClaimSection);

  const saltClaimSection = markdown
    .split('SALT_CLAIM_TABLE')?.[1]
    ?.split('FIRST_EXTRA_CLAIM_TABLE')?.[0];

  // logger.error('salt');
  // logger.info(saltClaimSection);

  const extraClaimSection_1 = markdown
    .split('FIRST_EXTRA_CLAIM_TABLE')?.[1]
    ?.split('SECOND_EXTRA_CLAIM_TABLE')?.[0];

  // logger.error('extra 1');
  // logger.info(extraClaimSection_1);

  const extraClaimSection_2 = markdown
    .split('SECOND_EXTRA_CLAIM_TABLE')?.[1]
    ?.split('THIRD_EXTRA_CLAIM_TABLE')?.[0];

  // logger.error('extra 2');
  // logger.info(extraClaimSection_2);

  const extraClaimSection_3 = markdown
    .split('THIRD_EXTRA_CLAIM_TABLE')?.[1]
    ?.split('ALLERGEN_TABLE')?.[0];

  // logger.error('extra 3');
  // logger.info(extraClaimSection_3);

  const allergenClaimSection = markdown
    .split('ALLERGEN_TABLE')?.[1]
    ?.split('HEADER_TABLE')?.[0];

  // logger.error('allergen');
  // logger.info(allergenClaimSection);

  const headerSection = markdown
    .split('HEADER_TABLE')?.[1]
    ?.split('INGREDIENT_TABLE')?.[0];

  // logger.error('header');
  // logger.info(headerSection);

  const ingredientSection = markdown
    .split('INGREDIENT_TABLE')?.[1]
    ?.split('PHYSICAL_TABLE')?.[0];

  // logger.error('ingredient');
  // logger.info(ingredientSection);

  const physicalSection = markdown
    .split('PHYSICAL_TABLE')?.[1]
    ?.split('MARKETING_TABLE')?.[0];

  // logger.error('physical');
  // logger.info(physicalSection);

  const marketingSection = markdown
    .split('MARKETING_TABLE')?.[1]
    ?.split('INSTRUCTION_TABLE')?.[0];

  // logger.error('marketing');
  // logger.info(marketingSection);

  const instructionSection = markdown
    .split('INSTRUCTION_TABLE')?.[1]
    ?.split('SUPPLY_CHAIN_TABLE')?.[0];

  // logger.error('instruction');
  // logger.info(instructionSection);

  const supplyChainSection = markdown
    .split('SUPPLY_CHAIN_TABLE')?.[1]
    ?.split('BASE_CERTIFIER_CLAIM_TABLE')?.[0];

  // logger.error('supply chain');
  // logger.info(supplyChainSection);

  const baseCertifierClaimSection = markdown
    .split('BASE_CERTIFIER_CLAIM_TABLE')?.[1]
    ?.split('ATTRIBUTE_TABLE')?.[0];

  // logger.error('base certifier claim');
  // logger.info(baseCertifierClaimSection);

  const attributeClaimSection = markdown
    .split('ATTRIBUTE_TABLE')?.[1]
    ?.split('MARKETING_TEXT_TABLE')?.[0];

  // logger.error('attribute claim');
  // logger.info(attributeClaimSection);

  const marketingTextSection = markdown
    ?.split('MARKETING_TEXT_TABLE')?.[1]
    ?.split('DEBUG_TABLE')?.[0];

  // logger.error('marketingTextSection');
  // logger.info(marketingTextSection);

  //? EXTRA
  const extraClaimsObjList_1 = getObjectDataFromTable(extraClaimSection_1, [
    'claim',
    'mentioned',
    'statement',
    'source',
    'reason',
  ]);
  // logger.error('extra claim object list 1');
  // logger.info(JSON.stringify(extraClaimsObjList_1));

  const extraClaimsObjList_2 = getObjectDataFromTable(extraClaimSection_2, [
    'claim',
    'mentioned',
    'statement',
    'source',
    'reason',
  ]);
  // logger.error('extra claim object list 2');
  // logger.info(JSON.stringify(extraClaimsObjList_2));

  const extraClaimsObjList_3 = getObjectDataFromTable(extraClaimSection_3, [
    'claim',
    'mentioned',
    'statement',
    'source',
    'reason',
  ]);
  // logger.error('extra claim object list 3');
  // logger.info(JSON.stringify(extraClaimsObjList_3));

  //? SUGAR
  const sugarClaimsObjList = getObjectDataFromTable(sugarClaimSection, [
    'claim',
    'isClaimed',
    'statement',
    'source',
    'reason',
  ]);
  // logger.error('sugar claim list');
  // logger.info(JSON.stringify(sugarClaimsObjList));

  //? FAT
  const fatClaimsObjList = getObjectDataFromTable(fatClaimSection, [
    'claim',
    'isClaimed',
    'source',
    'reason',
  ]);
  // logger.error('fat claim list');
  // logger.info(JSON.stringify(fatClaimsObjList));

  //? OTHER
  const nonCertificateClaimsObjList = getObjectDataFromTable(
    processClaimSection,
    ['claim', 'isClaimed', 'source', 'reason']
  );
  // logger.error('other claim list');
  // logger.info(JSON.stringify(nonCertificateClaimsObjList));

  //? CALORIE
  const calorieClaimsObjList = getObjectDataFromTable(calorieClaimSection, [
    'claim',
    'isClaimed',
    'source',
  ]);
  // logger.error('calorie claim list');
  // logger.info(JSON.stringify(calorieClaimsObjList));

  //? SALT
  const saltClaimsObjList = getObjectDataFromTable(saltClaimSection, [
    'claim',
    'isClaimed',
    'source',
  ]);
  // logger.error('salt claim list');
  // logger.info(JSON.stringify(saltClaimsObjList));

  //? ALLERGEN
  const allergenObjList = getObjectDataFromTable(allergenClaimSection, [
    'containStatement',
    'containList',
    'notContainStatement',
    'notContainList',
    'containOnEquipmentStatement',
    'containOnEquipmentList',
  ]);
  // logger.error('allergen list');
  // logger.info(JSON.stringify(allergenObjList));

  //? HEADER
  const headerObjList = getObjectDataFromTable(headerSection, [
    'productName',
    'brandName',
    'primarySize',
    'secondarySize',
    'thirdSize',
    'fullSizeTextDescription',
    'count',
    'countUom',
  ]);
  // logger.error('header list');
  // logger.info(JSON.stringify(headerObjList));

  //? INGREDIENT TABLE
  const ingredientObjList = getObjectDataFromTable(ingredientSection, [
    'productType',
    'ingredientPrefix',
    'ingredientStatement',
    'ingredientBreakdown',
  ]);
  logger.error('ingredient list');
  logger.info(JSON.stringify(ingredientObjList));

  //? PHYSICAL
  const physicalObjList = getObjectDataFromTable(physicalSection, ['upc12']);
  // logger.error('physical');
  // logger.info(JSON.stringify(physicalObjList));

  //? MARKETING
  const marketingObjList = getObjectDataFromTable(marketingSection, [
    'haveQrCode',
    'instagram',
    'pinterest',
    'youtube',
    'youtubeType',
    'facebook',
    'twitter',
    'socialMediaList',
    'socialMediaAddresses',
    'website',
    'socialMediaText',
    'enlargedToShow',
  ]);
  logger.error('marketing');
  logger.info(JSON.stringify(marketingObjList));

  //? INSTRUCTION
  const instructionObjList = getObjectDataFromHorizontalTable(
    instructionSection,
    {
      'storage instructions': 'storageInstruction',
      'cooking instructions': 'cookingInstruction',
      'usage instructions': 'usageInstruction',
      'store by a date time instructions / freeze by a date time instructions / use product within a time instructions':
        'useOrFreezeBy',
      'all other instructions': 'otherInstructions',
    }
  );
  logger.error('instruction');
  logger.info(JSON.stringify(instructionObjList));

  //? SUPPLY CHAIN
  // const supplyChainObjList = getObjectDataFromTable(supplyChainSection, [
  //   'countryOfOriginText',
  //   'countryOfOrigin',
  //   'distributedBy',
  //   'manufacturerName',
  //   'manufacturerDate',
  //   'manufacturerPhoneNumber',
  //   'manufacturerStreetAddress',
  //   'manufacturerCity',
  //   'manufacturerState',
  //   'manufactureZipCode',
  // ]);
  const supplyChainObjList = getObjectDataFromHorizontalTable(
    supplyChainSection,
    {
      'country of origin text': 'countryOfOriginText',
      'country of origin': 'countryOfOrigin',
      'distributor name': 'distributorName',
      'distributor city': 'distributorCity',
      'distributor state': 'distributorState',
      'distributor zipCode': 'distributorZipCode',
      'distributor phone Number': 'distributorPhoneNumber',
      'full text about distributor': 'fullTextDistributor',
      'manufacture name': 'manufacturerName',
      'manufacture date': 'manufacturerDate',
      'manufacture phone number': 'manufacturerPhoneNumber',
      'manufacture street address': 'manufacturerStreetAddress',
      'manufacture city': 'manufacturerCity',
      'manufacture state': 'manufacturerState',
      'manufacture zipCode': 'manufactureZipCode',
    }
  );
  // logger.error('supplyChain');
  // logger.info(JSON.stringify(supplyChainObjList));

  //? BASE CERTIFIER CLAIM
  const baseCertifierClaimObjList = getObjectDataFromTable(
    baseCertifierClaimSection,
    ['claim', 'isClaimed']
  );
  // logger.error('base certifier claim object list');
  // logger.info(JSON.stringify(baseCertifierClaimObjList));

  //? ATTRIBUTE
  const attributeObjList = getObjectDataFromTable(attributeClaimSection, [
    'grade',
    'juicePercent',
  ]);
  // logger.error('attribute object list');
  // logger.info(JSON.stringify(attributeObjList));

  //? MARKETING TEXT TABLE
  const marketingTextObjList = getObjectDataFromTable(marketingTextSection, [
    'idx',
    'marketingContent',
  ]);
  // logger.error('marketing text');
  // logger.info(JSON.stringify(marketingTextObjList));

  return {
    header: headerObjList,
    physical: physicalObjList,
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
    marketing: [
      {
        ...marketingObjList?.[0],
        marketingClaims: marketingTextObjList?.map(
          (item) => item?.marketingContent
        ),
      },
    ],
    supplyChain: supplyChainObjList,
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

const getObjectDataFromHorizontalTable = (
  sectionContent: string,
  propertyListMap: any
) => {
  if (!sectionContent) return [];

  const [tableHeader, tableDivider, ...itemStringList] = sectionContent
    .trim()
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .filter((line) => line.trim() !== '##')
    .filter((line) => line.trim() !== '**');

  const obj: Record<string, any> = {};

  itemStringList.forEach((line, idx) => {
    const values = line
      .split('|')
      .filter((item) => item !== '')
      .map((item) => item.trim());
    const [name, ...multiValues] = values;

    // const currentPropertyValue

    obj[propertyListMap?.[name]] = multiValues?.filter(
      (item: string) => item !== ''
    );
  });

  return [obj];
};
