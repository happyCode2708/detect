const logger = require('./src/lib/logger/index.js');

let result_1 = `EXTRA_CLAIM_TABLE\n| extra item |  explicitly and directly mentioned in product info without implied from other text (answer is true/false/unknown) | Does the product explicitly state contain it ? (answer is yes/no) |  Does the product explicitly state to not contain it ? (answer is yes/no)  |  do you know it through which info ? (answer are  \"ingredient list\"/ \"marketing text on product\"/ \"nutrition fact\"/ \"others\") (answer could be multiple string since the info can appeared in multiple sources) | how do you know that ? and give me you explain (answer in string) |\n| ------- | -------- | ------- | ------- | -------- | -------- |\n| allergen | true | yes | no | marketing text on product | The product packaging states \"Gluten-Free\". |\n| gluten free | true | yes | no | marketing text on product | The product packaging states \"Gluten-Free\". |\n\n## SUGAR_CLAIM_TABLE\n| sugar claim | does product claim that sugar claim? (answer are true/false/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are \"ingredient list\"/ \"nutrition fact\"/ \"marketing text on product\"/ \"others\") (answer could be multiple string from many sources) (answer could be multiple string from many sources)| how do you know that ? and give me you explain (answer in string) |\n| ------- | -------- | -------- | -------- |\n| no contain sugar added | false |  |  |\n\n## FAT_CLAIM_TABLE\n| fat claim | does product claim that fat claim? (answer are true/false/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are \"ingredient list\"/ \"nutrition fact\"/ \"marketing text on product\"/ \"others\") (answer could be multiple string from many sources) | how do you know that ? and give me you explain (answer in string) |\n| ------- | -------- | -------- | -------- |\n| trans fat free | false |  |  |\n\n## OTHER_CLAIM_TABLE\n| other claim | does product explicitly claim this claim? (answer are true/false/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are \"ingredient list\"/ \"nutrition fact\"/ \"marketing text on product\"/ \"others\") (answer could be multiple string from many sources) | how do you know that ? and give me you explain (answer in string) |\n| ------- | -------- | -------- | -------- |\n| not fried | true | marketing text on product | The product is described as \"SEASONED & NON-FRIED RICE NOODLE\". |\n\n## CALORIE_CLAIM_TABLE\n| calorie claim | does product explicitly claim this claim? (answer are true/false/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are \"ingredient list\"/ \"nutrition fact\"/ \"marketing text on product\"/ \"others\") (answer could be multiple string from many sources) |\n| ------- | -------- | -------- |\n| low calorie | false |  |\n\n## SALT_CLAIM_TABLE\n| salt claim | does product explicitly claim this claim? (answer are true/false/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are \"ingredient list\"/ \"nutrition fact\"/ \"marketing text on product\"/ \"others\") (answer could be multiple string from many sources) |\n| ------- | -------- | -------- |\n| low sodium | false |  |\n\n## ALLERGEN_TABLE\n| allergen contain statement | allergen contain break-down list | allergen does-not-contain statement | allergen does-not-contain statement break-down list | allergen contain on equipment statement | allergen contain on equipment break-down list| \n| ------- | -------- | -------- | ------- | -------- | -------- |\n| Contains: SOYBEANS, SULFITES, FISH AND TREE NUTS (COCONUT) | soy / soybeans; fish; tree nuts |  |  |  |  |\n\n## HEADER_TABLE\n| product name | brand name | primary size | secondary size | third size | full size text description | count |\n| ------- | -------- | -------- | ------- | -------- | -------- | -------- |\n| Yaki Be-fun | KENMIN FOODS | 2.29 oz | 65g |  |  |  |\n\n## INGREDIENT_TABLE\n| is product supplement ? (answer boolean) | ingredient statement | \n| ------- | -------- |\n| false | RICE, STARCH ( TAPIOCA , POTATO , CORN ) , SOY SAUCE ( WATER , SOYBEANS , WHEAT , SALT ) , SALT , KELP EXTRACT , MONOSODIUM GLUTAMATE , FISH EXTRACT ( MALTODEXTRIN , BONITO EXTRACT , SALT , FISH EXTRACT POWDER ( EASTERN LITTLE TUNA , FRIGATE MACKEREL , SKIPJACK TUNA ) , YEAST EXTRACT ) , SUGAR , GINGER PASTE , MONO - AND DIGLYCERIDES OF FATTY ACIDS , SODIUM METAPHOSPHATE , SODIUM TRIPOLYPHOSPHATE , TETRASODIUM PYROPHOSPHATE , CARBOXYMETHYL CELLULOSE , GARLIC POWDER , ONION POWDER , DISODIUM 5 ' - RIBONUCLEOTIDE , CARAMEL COLOR , YEAST EXTRACT , PEPPER , SUCROSE FATTY ACID ESTERS , COLOR ( RIBOFLAVIN ) , ROSEMARY EXTRACT . |\n\n## PHYSICAL_TABLE\n| upc-12 or gtin-12 |\n| ------- |\n| 50009312013 |\n\n## MARKETING_TABLE\n| have QR code (answer is boolean) | have Instagram icon ? | have Pinterest icon ? | have Youtube icon ? | have Facebook icon ? | social media list | website list | social media text list | enlarged to show (answer is boolean) |\n| ------- | -------- | -------- | ------- | ------- | -------- | -------- | -------- | -------- |\n| false | false | false | false | false |  | http://www.kenmin.co.jp |  | false |\n\n## INSTRUCTION_TABLE\n| storage instructions (answer are multiple string) | cooking instructions  (answer are multiple string) | usage instructions (answer are multiple string) | usage time instruction (answer are multiple string)| other instructions (answer are multiple string)|\n| ------- | -------- | -------- | ------- | -------- |\n|  | Heat frying pan and add one and half table spoon of cooking oil. Lay down pork belly strips and layer with Yaki - Befun noodles , and ( vegetables in this particular order . Add 6.7 ounces of water , seal with a lid and heat on high heat for 3 mins . After 3 minutes , remove the lid and lightly mix the ingredients around and let the remaining water evaporate . Serve hot . |  |  | Can change thin cut pork belly with bacon , cabbage to be cut in bite sizes , carrots to be cut in match sticks , the green bell peppers and onions to be cut into strips . * 2 servings add 11.5 ounces of water . * sesame oil can be added for extra flavor |\n\n## SUPPLY_CHAIN_TABLE\n| country of origin | manufacture name | manufacture date | manufacture phone number | manufacture street address | manufacture city | manufacture state | manufacture zipCode |\n| ------- | -------- | -------- | ------- | ------- | -------- | -------- | ------- |\n| Thailand | KENMIN FOODS CO., LTD. |  |  |  |  |  |  |\n\n## DEBUG_TABLE\n| question (question from DEBUG LIST below) | gemini answer |\n| ------- | -------- |\n| i see you think too deeply for example when you see \"free from artificial flavor\" and you think product claim \"does not contain added flavor\". That is not what i want it must say that product claim \"does not contain artificial flavor\". I do not how to prompt and make you understand that so next time you will no make same mistake help me write prompt sentences to fix that | I understand the issue. You're looking for explicit claims, not inferences.  Here are some ways to phrase your prompt to avoid this:\n\n**Focus on direct statements:**\n\n* **Instead of:** \"Does the product claim to be free from added flavors?\"\n* **Use:** \"Does the product packaging explicitly state 'no added flavors' or 'does not contain added flavors'?\"\n\n**Emphasize literal interpretation:**\n\n* \"Only report claims that are directly stated on the packaging, without making any assumptions or deductions.\"\n* \"Do not infer information from similar phrases. For example, 'free from artificial flavors' does not automatically mean 'no added flavors'.\"\n\n**Provide examples:**\n\n* \"For the 'extra claim list', only include items where the packaging explicitly states the claim. For example, only include 'no added sugar' if the packaging literally says 'no added sugar'.\" \n\nBy being this specific, you'll guide the model to focus on literal interpretations and avoid making inferences. |\n`;

const getObjectDataFromTable = (sectionContent, propertyList) => {
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

    const obj = {};
    propertyList.forEach((property, index) => {
      obj[property] = values[index] || '';
    });

    return obj;
  });
};

let parse2 = (markdown) => {
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

let final = parse2(result_1);
