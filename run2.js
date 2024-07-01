const logger = require('./src/lib/logger/index.js');

let result_1 = `EXTRA_CLAIM_TABLE\n| extra item |  explicitly and directly mentioned in product info without implied from other text (answer is true/false/unknown) | Does the product explicitly state contain it ? (answer is yes/no) |  Does the product explicitly state to not contain it ? (answer is yes/no)  |  do you know it through which info ? (answer are  \"ingredient list\"/ \"marketing text on product\"/ \"nutrition fact\"/ \"others\") (answer could be multiple string since the info can appeared in multiple sources) | how do you know that ? and give me you explain (answer in string) |\n| ------- | -------- | ------- | ------- | -------- | -------- |\n| allergen | true | yes | no | marketing text on product | The product packaging states \"Gluten-Free\". |\n| gluten free | true | yes | no | marketing text on product | The product packaging states \"Gluten-Free\". |\n\n## SUGAR_CLAIM_TABLE\n| sugar claim | does product claim that sugar claim? (answer are true/false/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are \"ingredient list\"/ \"nutrition fact\"/ \"marketing text on product\"/ \"others\") (answer could be multiple string from many sources) (answer could be multiple string from many sources)| how do you know that ? and give me you explain (answer in string) |\n| ------- | -------- | -------- | -------- |\n| no contain sugar added | false |  |  |\n\n## FAT_CLAIM_TABLE\n| fat claim | does product claim that fat claim? (answer are true/false/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are \"ingredient list\"/ \"nutrition fact\"/ \"marketing text on product\"/ \"others\") (answer could be multiple string from many sources) | how do you know that ? and give me you explain (answer in string) |\n| ------- | -------- | -------- | -------- |\n| trans fat free | false |  |  |\n\n## OTHER_CLAIM_TABLE\n| other claim | does product explicitly claim this claim? (answer are true/false/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are \"ingredient list\"/ \"nutrition fact\"/ \"marketing text on product\"/ \"others\") (answer could be multiple string from many sources) | how do you know that ? and give me you explain (answer in string) |\n| ------- | -------- | -------- | -------- |\n| not fried | true | marketing text on product | The product is described as \"SEASONED & NON-FRIED RICE NOODLE\". |\n\n## CALORIE_CLAIM_TABLE\n| calorie claim | does product explicitly claim this claim? (answer are true/false/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are \"ingredient list\"/ \"nutrition fact\"/ \"marketing text on product\"/ \"others\") (answer could be multiple string from many sources) |\n| ------- | -------- | -------- |\n| low calorie | false |  |\n\n## SALT_CLAIM_TABLE\n| salt claim | does product explicitly claim this claim? (answer are true/false/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are \"ingredient list\"/ \"nutrition fact\"/ \"marketing text on product\"/ \"others\") (answer could be multiple string from many sources) |\n| ------- | -------- | -------- |\n| low sodium | false |  |\n\n## ALLERGEN_TABLE\n| allergen contain statement | allergen contain break-down list | allergen does-not-contain statement | allergen does-not-contain statement break-down list | allergen contain on equipment statement | allergen contain on equipment break-down list| \n| ------- | -------- | -------- | ------- | -------- | -------- |\n| Contains: SOYBEANS, SULFITES, FISH AND TREE NUTS (COCONUT) | soy / soybeans; fish; tree nuts |  |  |  |  |\n\n## HEADER_TABLE\n| product name | brand name | primary size | secondary size | third size | full size text description | count |\n| ------- | -------- | -------- | ------- | -------- | -------- | -------- |\n| Yaki Be-fun | KENMIN FOODS | 2.29 oz | 65g |  |  |  |\n\n## INGREDIENT_TABLE\n| is product supplement ? (answer boolean) | ingredient statement | \n| ------- | -------- |\n| false | RICE, STARCH ( TAPIOCA , POTATO , CORN ) , SOY SAUCE ( WATER , SOYBEANS , WHEAT , SALT ) , SALT , KELP EXTRACT , MONOSODIUM GLUTAMATE , FISH EXTRACT ( MALTODEXTRIN , BONITO EXTRACT , SALT , FISH EXTRACT POWDER ( EASTERN LITTLE TUNA , FRIGATE MACKEREL , SKIPJACK TUNA ) , YEAST EXTRACT ) , SUGAR , GINGER PASTE , MONO - AND DIGLYCERIDES OF FATTY ACIDS , SODIUM METAPHOSPHATE , SODIUM TRIPOLYPHOSPHATE , TETRASODIUM PYROPHOSPHATE , CARBOXYMETHYL CELLULOSE , GARLIC POWDER , ONION POWDER , DISODIUM 5 ' - RIBONUCLEOTIDE , CARAMEL COLOR , YEAST EXTRACT , PEPPER , SUCROSE FATTY ACID ESTERS , COLOR ( RIBOFLAVIN ) , ROSEMARY EXTRACT . |\n\n## PHYSICAL_TABLE\n| upc-12 or gtin-12 |\n| ------- |\n| 50009312013 |\n\n## MARKETING_TABLE\n| have QR code (answer is boolean) | have Instagram icon ? | have Pinterest icon ? | have Youtube icon ? | have Facebook icon ? | social media list | website list | social media text list | enlarged to show (answer is boolean) |\n| ------- | -------- | -------- | ------- | ------- | -------- | -------- | -------- | -------- |\n| false | false | false | false | false |  | http://www.kenmin.co.jp |  | false |\n\n## INSTRUCTION_TABLE\n| storage instructions (answer are multiple string) | cooking instructions  (answer are multiple string) | usage instructions (answer are multiple string) | usage time instruction (answer are multiple string)| other instructions (answer are multiple string)|\n| ------- | -------- | -------- | ------- | -------- |\n|  | Heat frying pan and add one and half table spoon of cooking oil. Lay down pork belly strips and layer with Yaki - Befun noodles , and ( vegetables in this particular order . Add 6.7 ounces of water , seal with a lid and heat on high heat for 3 mins . After 3 minutes , remove the lid and lightly mix the ingredients around and let the remaining water evaporate . Serve hot . |  |  | Can change thin cut pork belly with bacon , cabbage to be cut in bite sizes , carrots to be cut in match sticks , the green bell peppers and onions to be cut into strips . * 2 servings add 11.5 ounces of water . * sesame oil can be added for extra flavor |\n\n## SUPPLY_CHAIN_TABLE\n| country of origin | manufacture name | manufacture date | manufacture phone number | manufacture street address | manufacture city | manufacture state | manufacture zipCode |\n| ------- | -------- | -------- | ------- | ------- | -------- | -------- | ------- |\n| Thailand | KENMIN FOODS CO., LTD. |  |  |  |  |  |  |\n\n## DEBUG_TABLE\n| question (question from DEBUG LIST below) | gemini answer |\n| ------- | -------- |\n| i see you think too deeply for example when you see \"free from artificial flavor\" and you think product claim \"does not contain added flavor\". That is not what i want it must say that product claim \"does not contain artificial flavor\". I do not how to prompt and make you understand that so next time you will no make same mistake help me write prompt sentences to fix that | I understand the issue. You're looking for explicit claims, not inferences.  Here are some ways to phrase your prompt to avoid this:\n\n**Focus on direct statements:**\n\n* **Instead of:** \"Does the product claim to be free from added flavors?\"\n* **Use:** \"Does the product packaging explicitly state 'no added flavors' or 'does not contain added flavors'?\"\n\n**Emphasize literal interpretation:**\n\n* \"Only report claims that are directly stated on the packaging, without making any assumptions or deductions.\"\n* \"Do not infer information from similar phrases. For example, 'free from artificial flavors' does not automatically mean 'no added flavors'.\"\n\n**Provide examples:**\n\n* \"For the 'extra claim list', only include items where the packaging explicitly states the claim. For example, only include 'no added sugar' if the packaging literally says 'no added sugar'.\" \n\nBy being this specific, you'll guide the model to focus on literal interpretations and avoid making inferences. |\n`;
let result_2 =
  '## Zoey\'s Fresh Queso Product Information\n\n**EXTRA_CLAIM_TABLE**\n| extra item |  explicitly and directly mentioned in product info without implied from other text (answer is true/false/unknown) | Does the product explicitly state contain it ? (answer is yes/no) |  Does the product explicitly state to not contain it ? (answer is yes/no)  |  do you know it through which info ? (answer are  "ingredient list"/ "marketing text on product"/ "nutrition fact"/ "others") (answer could be multiple string since the info can appeared in multiple sources) | how do you know that ? and give me you explain (answer in string) |\n| ------- | -------- | ------- | ------- | -------- | -------- |\n| added preservatives | true | no | yes | marketing text on product | The product label states "NO PRESERVATIVES" |\n| additives | true | no | yes | marketing text on product | The product label states "NO ADDITIVES" |\n| artificial flavors | true | no | yes | marketing text on product | The product label states "NO ARTIFICIAL FLAVORS" |\n| gluten free | true | unknown | yes | marketing text on product | The product label states "GLUTEN FREE" |\n| msg | true | no | yes | marketing text on product | The product label states "NO MSG" |\n\n**SUGAR_CLAIM_TABLE**\n| sugar claim | does product claim that sugar claim? (answer are true/false/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are "ingredient list"/ "nutrition fact"/ "marketing text on product"/ "others") (answer could be multiple string from many sources) (answer could be multiple string from many sources)| how do you know that ? and give me you explain (answer in string) |\n| ------- | -------- | -------- | -------- |\n| no contain added sugar | true | nutrition fact | The nutrition facts panel states "Includes 0g Added Sugars" |\n\n**FAT_CLAIM_TABLE**\n| fat claim | does product claim that fat claim? (answer are true/false/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are "ingredient list"/ "nutrition fact"/ "marketing text on product"/ "others") (answer could be multiple string from many sources) | how do you know that ? and give me you explain (answer in string) |\n| ------- | -------- | -------- | -------- |\n| trans fat free | true | nutrition fact | The nutrition facts panel states "Trans Fat 0g" |\n\n**OTHER_CLAIM_TABLE**\n| other claim | does product explicitly claim this claim? (answer are true/false/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are "ingredient list"/ "nutrition fact"/ "marketing text on product"/ "others") (answer could be multiple string from many sources) | how do you know that ? and give me you explain (answer in string) |\n| ------- | -------- | -------- | -------- |\n| all natural | true | marketing text on product | The product label states "All Natural QUESO CHEESE DIP" |\n\n**CALORIE_CLAIM_TABLE**\n| calorie claim | does product explicitly claim this claim? (answer are true/false/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are "ingredient list"/ "nutrition fact"/ "marketing text on product"/ "others") (answer could be multiple string from many sources) |\n| ------- | -------- | -------- |\n| low calorie | false |  | \n\n**SALT_CLAIM_TABLE**\n| salt claim | does product explicitly claim this claim? (answer are true/false/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are "ingredient list"/ "nutrition fact"/ "marketing text on product"/ "others") (answer could be multiple string from many sources) |\n| ------- | -------- | -------- | \n| unsalted | false |  | \n\n**ALLERGEN_TABLE**\n| allergen contain statement | allergen contain break-down list | allergen does-not-contain statement | allergen does-not-contain statement break-down list | allergen contain on equipment statement | allergen contain on equipment break-down list| \n| ------- | -------- | -------- | ------- | -------- | -------- |\n| CONTAINS: MILK | milk |  |  |  |  |\n\n**HEADER_TABLE**\n| product name | brand name | primary size | secondary size | third size | full size text description | count |\n| ------- | -------- | -------- | ------- | -------- | -------- | -------- |\n| QUESO CHEESE DIP | ZOEYS | 10 oz | 284 g |  | Net Wt. 10 oz (284 g) |  |\n\n**INGREDIENT_TABLE**\n| is product supplement ? (answer boolean) | ingredient statement | \n| ------- | -------- |\n| false | Pasteurized American Cheese (Cultured Pasteurized Milk, Cream, Milkfat, Salt, Milk Solids, Enzymes), Whole Milk (Vitamin D3), Unsalted Butter (Pasteurized Cream, Natural Falvorings), Buttermilk (Cultured Milk, Cream, Contains Less Than 1% of: Butter, Grade A Whole Milk, Salt), Fresh Jalapeno Peppers, Fresh Tomatoes, Sea Salt, White Pepper. |\n\n**PHYSICAL_TABLE**\n| upc-12 or gtin-12 |\n| ------- |\n| 051497022877 |\n\n**MARKETING_TABLE**\n| have QR code (answer is boolean) | have Instagram icon ? | have Pinterest icon ? | have Youtube icon ? | have Facebook icon ? | social media list | website list | social media text list | enlarged to show (answer is boolean) |\n| ------- | -------- | -------- | ------- | ------- | -------- | -------- | -------- | -------- |\n| false | false | false | false | false |  |  |  | false |\n\n**INSTRUCTION_TABLE**\n| storage instructions (answer are multiple string) | cooking instructions  (answer are multiple string) | usage instructions (answer are multiple string) | usage time instruction (answer are multiple string)| other instructions (answer are multiple string)|\n| ------- | -------- | -------- | ------- | -------- |\n| KEEP REFRIGERATED | Remove Lid, Microwave for 1 minute or until desired temperature is reached |  |  |  |\n\n**SUPPLY_CHAIN_TABLE**\n| country of origin | manufacture name | manufacture date | manufacture phone number | manufacture street address | manufacture city | manufacture state | manufacture zipCode |\n| ------- | -------- | -------- | ------- | ------- | -------- | -------- | ------- |\n|  | Zoe Foods LLC |  |  | 37238 City Park Ave. | Geismar | LA | 70734 |\n\n**DEBUG_TABLE**\n| question (question from DEBUG LIST below) | gemini answer |\n| ------- | -------- |\n| i see you think too deeply for example when you see "free from artificial flavor" and you think product claim "does not contain added flavor". That is not what i want it must say that product claim "does not contain artificial flavor". I do not how to prompt and make you understand that so next time you will no make same mistake help me write prompt sentences to fix that | I understand the issue. You want me to focus on direct claims made on the product packaging and avoid making inferences based on the ingredient list or similar phrases. For example, "free from artificial flavors" should only be interpreted as a claim of "no artificial flavors" and not as a claim of "no added flavors." \n\nTo ensure I capture this correctly, please continue to emphasize the importance of extracting information directly from the text on the packaging. You can use phrases like:\n\n* **"Explicitly stated claims only:"**  Emphasize that you only want claims directly stated on the packaging.\n* **"Do not infer or deduce:"**  Clearly instruct me to avoid making assumptions or drawing conclusions beyond the literal text.\n* **"Directly mentioned without implied meaning:"**  Use this phrase to reinforce that you are looking for literal interpretations of the text. \n\nBy consistently using these phrases and providing clear examples, I will learn to focus on direct claims and avoid making inferences. | \n';

let result_3 =
  '## SlimFast Keto Fat Bomb Snack Cups, Peanut Butter Chocolate Product Information\n\n**EXTRA_CLAIM_TABLE**\n| extra item | is the item explicitly and directly mentioned in product info without implied from other text? (answer is true/false/unknown) | Does the product explicitly state contain it ? (answer is yes/no) |  Does the product explicitly state to not contain it ? (answer is yes/no)  |  do you know it through which info ? (answer are  "ingredient list"/ "marketing text on product"/ "nutrition fact"/ "others") (answer could be multiple string since the info can appeared in multiple sources) | how do you know that ? and give me you explain (answer in string) |\n| ------- | -------- | ------- | ------- | -------- | -------- |\n| low - carb | true | yes |  | marketing text on product | "low - carb , ketogenic nutrition" |\n| gluten | false |  | yes | marketing text on product | "FREE from GLUTEN" |\n| artificial sweeteners | false |  | yes | marketing text on product | "FREE from ... ARTIFICIAL SWEETENERS" |\n| artificial flavors | false |  | yes | marketing text on product | "FREE from ... ARTIFICIAL FLAVORS" |\n| artificial colors | false |  | yes | marketing text on product | "FREE from ... ARTIFICIAL FLAVORS , COLORS" |\n| keto-friendly | true | yes |  | marketing text on product | "SlimFast Keto Fat Bomb Snack Cups are the no - compromise , Keto - friendly snack" |\n\n**SUGAR_CLAIM_TABLE**\n| sugar claim | does product claim that sugar claim? (answer are true/false/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are "ingredient list"/ "nutrition fact"/ "marketing text on product"/ "others") (answer could be multiple string from many sources) (answer could be multiple string from many sources)| how do you know that ? and give me you explain (answer in string) |\n| ------- | -------- | -------- | -------- |\n| contain artificial sweetener | false | marketing text on product | "FREE from ... ARTIFICIAL SWEETENERS" |\n| no contain saccharin | true | marketing text on product | "DOES NOT CONTAIN SUCRALOSE , SACCHARIN , ASPARTAME , ACESULFAME POTASSIUM" |\n| no contain aspartame | true | marketing text on product | "DOES NOT CONTAIN SUCRALOSE , SACCHARIN , ASPARTAME , ACESULFAME POTASSIUM" |\n| no contain sucralose | true | marketing text on product | "DOES NOT CONTAIN SUCRALOSE , SACCHARIN , ASPARTAME , ACESULFAME POTASSIUM" |\n\n**FAT_CLAIM_TABLE**\n| fat claim | does product claim that fat claim? (answer are true/false/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are "ingredient list"/ "nutrition fact"/ "marketing text on product"/ "others") (answer could be multiple string from many sources) | how do you know that ? and give me you explain (answer in string) |\n| ------- | -------- | -------- | -------- |\n| trans fat free | true | nutrition fact | "Trans Fat 0g" |\n\n**OTHER_CLAIM_TABLE**\n| other claim | does product explicitly claim this claim? (answer are true/false/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are "ingredient list"/ "nutrition fact"/ "marketing text on product"/ "others") (answer could be multiple string from many sources) | how do you know that ? and give me you explain (answer in string) |\n| ------- | -------- | -------- | -------- |\n| low carbohydrate | true | marketing text on product | "Our line of premium products is the perfect choice for making optimal low - carb , ketogenic nutrition" |\n\n**ALLERGEN_TABLE**\n| allergen contain statement | allergen contain break-down list | allergen does-not-contain statement | allergen does-not-contain statement break-down list | allergen contain on equipment statement | allergen contain on equipment break-down list| \n| ------- | -------- | -------- | ------- | -------- | -------- |\n| CONTAINS MILK , PEANUTS , COCONUT , AND SOY . | milk, peanuts, coconut, soy |  |  | MADE IN A FACILITY THAT PROCESSES PEANUTS , TREE NUTS , DAIRY , EGGS , WHEAT , AND SOY . | peanuts, tree nuts, dairy, eggs, wheat, soy |\n\n**HEADER_TABLE**\n| product name | brand name | primary size | secondary size | third size | full size text description | count |\n| ------- | -------- | -------- | ------- | -------- | -------- | -------- |\n| SlimFast Keto Fat Bomb Snack Cups, Peanut Butter Chocolate | SlimFast Keto | 8.4 oz | 238 g |  | 14-0.6 OZ ( 17g ) CUPS | 14 |\n\n**INGREDIENT_TABLE**\n| is product supplement ? (answer boolean) | ingredient statement | \n| ------- | -------- |\n| false | MILK CHOCOLATE COATING [ CHOCOLATE , ERYTHRITOL , COCOA BUTTER , WHOLE MILK POWDER , INULIN ( NATURAL VEGETABLE FIBER ) , NONFAT DRY MILK , SOY LECITHIN , NATURAL VANILLA EXTRACT , SALT , STEVIA LEAF EXTRACT ] , MCT OIL BLEND ( PALM KERNEL , PALM , COCONUT ) , INULIN , PEANUT BUTTER ( PEANUTS ) , ERYTHRITOL , MILK PROTEIN ISOLATE , PEANUT FLOUR , PEANUT OIL , SOY LECITHIN , STEVIA LEAF EXTRACT , SALT . |\n\n**PHYSICAL_TABLE**\n| upc-12 or gtin-12 |\n| ------- |\n| 083468748218 |\n\n**MARKETING_TABLE**\n| have QR code (answer is boolean) | have Instagram icon ? | have Pinterest icon ? | have Youtube icon ? | have Facebook icon ? | have twitter icon ? | social media list | website list | social media text list | enlarged to show (answer is boolean) |\n| ------- | -------- | -------- | ------- | ------- | -------- | -------- | -------- | -------- | -------- |\n| false | true | true | true | true | false | Facebook, Instagram, Pinterest, Youtube | slimfastketo.com |  | false |\n\n**INSTRUCTION_TABLE**\n| storage instructions (answer are multiple string) | cooking instructions  (answer are multiple string) | usage instructions (answer are multiple string) | usage time instruction (answer are multiple string)| other instructions (answer are multiple string)|\n| ------- | -------- | -------- | ------- | -------- |\n| DO NOT EXPOSE TO HEAT . STORE IN A COOL DRY PLACE . |  |  |  |  |\n\n\n**DEBUG_TABLE**\n| question (question from DEBUG LIST below) | gemini answer |\n| ------- | -------- |\n| i see you think too deeply for example when you see "free from artificial flavor" and you think product claim "does not contain added flavor". That is not what i want it must say that product claim "does not contain artificial flavor". I do not how to prompt and make you understand that so next time you will no make same mistake help me write prompt sentences to fix that | I understand. You are looking for explicit claims on the packaging, not implied claims.  I will focus on directly extracting product claims from the text on the packaging and avoid making deductions based on the presence or absence of specific ingredients. For example, if a product says "free from artificial flavors," I will not assume it also means "does not contain added flavors." I will only report what the text directly states. | \n';

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
  const nonCertificateClaimsObjList = getObjectDataFromTable(
    otherClaimSection,
    ['claim', 'isClaimed', 'source', 'reason']
  );
  logger.error('other claim list');
  logger.info(JSON.stringify(nonCertificateClaimsObjList));

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
      nonCertificateClaims: nonCertificateClaimsObjList,
      calorieClaims: calorieClaimsObjList,
      saltClaims: saltClaimsObjList,
      sugarClaims: sugarClaimsObjList,
    },
    ingredients: ingredientObjList,
    allergens: allergenObjList,
    instructions: instructionObjList,
    marketing: marketingObjList,
    supplyChain: supplyChainObjList,
  };
};

const getObjectDataFromTable = (sectionContent, propertyList) => {
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

    const obj = {};
    propertyList.forEach((property, index) => {
      obj[property] = values[index] || '';
    });

    return obj;
  });
};

let final = parse2(result_3);
