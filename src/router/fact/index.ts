import express from 'express';
import fs from 'fs';
import { resultsDir, historyDir } from '../../server';
import path from 'path';
import { writeJsonToFile } from '../../utils';
import { lowerCase } from 'lodash';
import { responseValidator } from '../../lib/validator/main';

const router = express.Router();

router.get('/get-result/:sessionId', async (req, res) => {
  // Validate that the file extension is .json
  const sessionId = req.params.sessionId;

  if (!sessionId) {
    return res.json({ isSuccess: false });
  }

  // Construct the full file path
  // const filePath = path.join(resultsDir + `/${sessionId}`, sessionId);
  const allFilePath = path.join(
    resultsDir + `/${sessionId}`,
    'all-' + sessionId + '.json'
  );
  const nutFilePath = path.join(
    resultsDir + `/${sessionId}`,
    'nut-' + sessionId + '.json'
  );

  const finalResultPath = path.join(
    resultsDir + `/${sessionId}`,
    'validated-output-' + sessionId + '.json'
  );

  try {
    const [finalData] = await Promise.all([
      fs.readFileSync(finalResultPath, 'utf8'),
    ]);

    const finalRes = JSON.parse(finalData);

    return res.json(finalRes);
  } catch (err) {}

  try {
    const [allData, nutData] = await Promise.all([
      fs.readFileSync(allFilePath, 'utf8'),
      fs.readFileSync(nutFilePath, 'utf8'),
    ]);

    const allRes = JSON.parse(allData);
    const nutRes = JSON.parse(nutData);

    const { isSuccess: allSuccess } = allRes || {};
    const { isSuccess: nutSuccess } = nutRes || {};

    if (nutSuccess === false || allSuccess === false) {
      res.json({ isSuccess: false });
    }

    let response = {
      ...allRes,
      ...nutRes,
      validatorAndFixBug: {
        ...allRes.validatorAndFixBug,
        ...nutRes.validatorAndFixBug,
      },
      product: {
        ...allRes.product,
        factPanels: nutRes.product.factPanels,
      },
    };

    let validatedResponse = await responseValidator(response);

    writeJsonToFile(
      resultsDir + `/${sessionId}`,
      'validated-output-' + sessionId + '.json',
      JSON.stringify(validatedResponse)
    );

    // ...validateProductDataPoints(allRes.product),
    // factPanels: transformFactPanels(nutRes.product.factPanels),

    // console.log('response', response);

    // if (finalRes) {
    //   res.json(validatedResponse);
    // }

    // removeFieldByPath(response, 'answerOfQuestion');
    // removeFieldByPath(response, 'answerOfRemindQuestion');
    // removeFieldByPath(response, 'answerOfFoundBug');
    // removeFieldByPath(response, 'answerOfFoundBug');
    // removeFieldByPath(response, 'answerOfQuestionsAboutNutritionFact');
    // removeFieldByPath(response, 'answerOfQuestionAboutNutritionFactTitle');
    // removeFieldByPath(response, 'answerOfQuestionAboutValidator');
    // removeFieldByPath(response, 'answerOfQuestionAboutLanguage');
    // removeFieldByPath(response, 'answerOfDebug');
    //**** ========= */
    // removeFieldByPath(response, 'product.is_product_supplement');
    // removeFieldByPath(response, 'product.readAllConstants');
    // removeFieldByPath(response, 'product.certifierAndLogo');
    // removeFieldByPath(response, 'validatorAndFixBug');
  } catch (error) {
    console.log('error', error);
    return res.status(200).send('Image is processing. Please wait');
  }
});

router.get('/get-history', (req, res) => {
  const historyPath = path.join(historyDir, 'history.json');

  fs.readFile(historyPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Wating for result');
      // Send a 404 error if the file is not found
      return res.status(404).send('history not found.');
    }
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (parseError) {}
  });
});

export default router;

type AnyObject = { [key: string]: any };

const removeFieldByPath = (obj: AnyObject, path: string): AnyObject => {
  const keys = path.split('.');
  let current: AnyObject = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    if (current[keys[i]] === undefined) {
      return obj; // Path does not exist
    }
    current = current[keys[i]] as AnyObject;
  }

  delete current[keys[keys.length - 1]];
  return obj;
};

const combineResult = (result: any) => {
  if (result.nut && result.all) {
    return {
      product: {
        ...result.all.product,
        factPanels: result.nut.product.factPanels,
      },
    };
  }

  return false;
};

// const transformFactPanels = (factPanels: any) => {
//   if (!factPanels) return factPanels;

//   let cloneFactPanels = [...factPanels];

//   cloneFactPanels = cloneFactPanels.map((factPanelItem: any) => {
//     return transformOneFactPanel(factPanelItem);
//   });

//   return cloneFactPanels;
// };

// const transformOneFactPanel = (factPanelItem: any) => {
//   let cloneFactPanelItem = { ...factPanelItem };

//   cloneFactPanelItem.nutrients = cloneFactPanelItem.nutrients.map(
//     (nutrientItem: any) => {
//       let modifiedNutrient = { ...nutrientItem };

//       validateNutrientName(modifiedNutrient);

//       return modifiedNutrient;
//     }
//   );

//   return cloneFactPanelItem;
// };

// const getDescriptor = (nutrientName: string) => {
//   const pattern = /(\s*\([^()]*\))+$/;
//   const match = nutrientName.match(pattern);
//   return match ? match[0] : null;
// };

// const validateNutrientName = (modifiedNutrient: any) => {
//   const logicExtractedDescriptor = getDescriptor(modifiedNutrient?.name);
//   if (logicExtractedDescriptor && !modifiedNutrient?.['descriptor']) {
//     modifiedNutrient['descriptor'] = logicExtractedDescriptor;
//     modifiedNutrient['name'] = modifiedNutrient['name']?.split(
//       logicExtractedDescriptor
//     )?.[0];
//   }
// };

// const validateProductDataPoints = (productDataPoints: any) => {
//   let modifiedProductDataPoints = { ...productDataPoints };

//   validateAllergen(productDataPoints);
//   // validateContainAndDoesNotContain(productDataPoints); //* attribute

//   return modifiedProductDataPoints;
// };

// const validateContainAndDoesNotContainAttribute = (
//   modifiedProductDataPoints: any
// ) => {
//   const current_allergen_freeOf =
//     modifiedProductDataPoints['allergen']['allergen_freeOf'] || [];

//   const current_allergen_contain =
//     modifiedProductDataPoints['allergen']['allergen_contain'] || [];

//   const current_product_does_not_contain =
//     modifiedProductDataPoints['contain_and_notContain'][
//       'product_does_not_contain'
//     ] || [];

//   const current_product_contain =
//     modifiedProductDataPoints['contain_and_notContain']['product_contain'] ||
//     [];
// };

// const validateContainOrDoesNotContain = (
//   allergenList: any,
//   containList: any,
//   modifiedProductDataPoints: any,
//   dataPointKey: string
// ) => {
//   let validated_allegen_field = [] as any;

//   [...allergenList, ...containList].forEach((ingredientName) => {
//     const lowercaseIngredientName = lowerCase(ingredientName);
//     const matchedAllergen = checkMatchAllergen(lowercaseIngredientName);
//     if (matchedAllergen && !validated_allegen_field.includes(matchedAllergen)) {
//       validated_allegen_field.push(matchedAllergen);
//     }
//   });

//   modifiedProductDataPoints['contain_and_notContain'][dataPointKey] =
//     validated_allegen_field;
// };

// const validateAllergen = (modifiedProductDataPoints: any) => {
//   const ALLERGENS = [
//     'corn',
//     'crustacean shellfish',
//     'dairy',
//     'egg',
//     'fish',
//     'milk',
//     'oats',
//     'peanuts / peanut oil',
//     'phenylalanine',
//     'seeds',
//     'sesame',
//     'soy / soybeans',
//     'tree nuts',
//     'wheat',
//   ];

//   const current_allergen_freeOf =
//     modifiedProductDataPoints['allergen']['allergen_freeOf'] || [];

//   const current_allergen_contain =
//     modifiedProductDataPoints['allergen']['allergen_contain'] || [];

//   const current_product_does_not_contain =
//     modifiedProductDataPoints['contain_and_notContain'][
//       'product_does_not_contain'
//     ] || [];

//   const current_product_contain =
//     modifiedProductDataPoints['contain_and_notContain']['product_contain'] ||
//     [];

//   validateAllergenFreeOfOrContainOrContainOnEquipment(
//     current_allergen_freeOf,
//     current_product_does_not_contain,
//     modifiedProductDataPoints,
//     'validated_allergen_freeOf'
//   );

//   validateAllergenFreeOfOrContainOrContainOnEquipment(
//     current_allergen_contain,
//     current_product_contain,
//     modifiedProductDataPoints,
//     'validated_allergen_contain'
//   );
// };

// const validateAllergenFreeOfOrContainOrContainOnEquipment = (
//   allergenList: any,
//   containList: any,
//   modifiedProductDataPoints: any,
//   dataPointKey: string
// ) => {
//   let validated_allegen_field = [] as any;

//   [...allergenList, ...containList].forEach((ingredientName) => {
//     const lowercaseIngredientName = lowerCase(ingredientName);
//     const matchedAllergen = checkMatchAllergen(lowercaseIngredientName);
//     if (matchedAllergen && !validated_allegen_field.includes(matchedAllergen)) {
//       validated_allegen_field.push(matchedAllergen);
//     }
//   });

//   modifiedProductDataPoints['allergen'][dataPointKey] = validated_allegen_field;
// };

// const checkMatchAllergen = (ingredientName: string) => {
//   const ALLERGEN_MAPPING = {
//     'crustacean shellfish': ['shellfish', 'crustacean shellfish'],
//     corn: ['corn'],
//     dairy: ['dairy'],
//     egg: ['egg'],
//     fish: ['fish'],
//     milk: ['milk'],
//     oats: ['oats'],
//     'peanuts / peanut oil': ['peanuts / peanut oil', 'peanuts', 'peanut oil'],
//     phenylalanine: ['phenylalanine'],
//     seeds: ['seeds'],
//     sesame: ['seasame'],
//     'soy / soybeans': ['soy / soybeans', 'soy', 'soybeans'],
//     'tree nuts': ['tree nuts', 'nuts', 'nut'],
//     wheat: ['wheat'],
//   };

//   let matchAllergen = '';

//   Object.entries(ALLERGEN_MAPPING).map((keyNvalue: any) => {
//     const [allergenEnum, possibleValueList] = keyNvalue;

//     if (possibleValueList.includes(ingredientName)) {
//       matchAllergen = allergenEnum;
//     }
//   });

//   return matchAllergen;
// };
