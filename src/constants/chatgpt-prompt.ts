// "answerOfConstants": "your answer"(The constants is the list of values that the field v)
// const gptPrompt = `
// some constants:
// + ALLERGEN_LIST=["corn", "crustacean shellfish", "dairy", "egg", "fish", "milk", "oats", "peanuts / peanut oil", "phenylalanine", "seeds", "sesame", "soy / soybeans", "tree nuts", "wheat"]
// + ATTRIBUTE_CONTAIN_LIST = ["1,4-dioxane", "active yeast", "added antibiotics", "added colors", "added dyes", "added flavors", "added fragrances", "added hormones", "added nitrates", "added nitrites", "added preservatives", "additives", "alcohol", "allergen", "aluminum", "amino acids", "ammonia", "animal by-products", "animal derivatives", "animal ingredients", "animal products", "animal rennet", "antibiotics", "artificial additives", "artificial colors", "artificial dyes", "artificial flavors", "artificial fragrance", "artificial ingredients", "artificial preservatives", "binders and/or fillers", "bleach", "bpa (bisphenol-a)", "butylene glycol", "by-products", "caffeine", "carrageenan", "casein", "cbd / cannabidiol", "chemical additives", "chemical colors", "chemical dyes", "chemical flavors", "chemical fragrances", "chemical ingredients", "chemical preservatives", "chemical sunscreens", "chemicals", "chlorine", "cholesterol", "coatings", "corn fillers", "cottonseed oil", "dyes", "edta", "emulsifiers", "erythorbates", "expeller-pressed oils", "fillers", "fluoride", "formaldehyde", "fragrances", "grain", "hexane", "hormones", "hydrogenated oils", "kitniyos / kitniyot (legumes)", "lactose", "latex", "msg", "natural additives", "natural colors", "natural dyes", "natural flavors", "natural ingredients", "natural preservatives", "nitrates/nitrites", "omega fatty acids", "paba", "PALM OIL", "parabens", "pesticides", "petro chemical", "petrolatum", "petroleum byproducts", "phosphates", "phosphorus", "phthalates", "pits", "preservatives", "rbgh/bst", "rennet", "salicylates", "sea salt", "shells/ shell pieces", "silicone", "sles ( sodium laureth sulfate)", "sls ( sodium lauryl sulfate )", "stabilizers", "probiotics", "starch", "sulfates", "sulfides", "sulfites / sulphites", "sulfur dioxide", "synthetic additives", "synthetic colors", "synthetic dyes", "synthetic flavors", "synthetic fragrance", "synthetic ingredients", "synthetic preservatives", "synthetics", "thc / tetrahydrocannabinol", "toxic pesticides", "triclosan", "vegan ingredients", "vegetarian ingredients", "yeast", "yolks"]
// + SODIUM_CLAIMS = ["lightly salted", "low sodium", "no salt", "no salt added", "reduced sodium", "salt free", "sodium free", "unsalted", "very low sodium"]
// + FAT_CLAIMS = ["fat free", "free of saturated fat", "low fat", "low in saturated fat", "no fat", "no trans fat", "reduced fat", "trans fat free", "zero grams trans fat per serving", "zero trans fat"]
// + SUGAR_CLAIMS = ["acesulfame k", "agave", "allulose", "artificial sweetener", "aspartame", "beet sugar", "cane sugar", "coconut/coconut palm sugar", "fruit juice", "high fructose corn syrup", "honey", "low sugar", "lower sugar", "monk fruit", "natural sweeteners", "no acesulfame k", "no added sugar", "no agave", "no allulose", "no artificial sweetener", "no aspartame", "no cane sugar", "no coconut/coconut palm sugar", "no corn syrup", "no high fructose corn syrup", "no refined sugars", "no saccharin", "no splenda/sucralose", "no stevia", "no sugar", "no sugar added", "no sugar alcohol", "no tagatose", "no xylitol", "reduced sugar", "refined sugar", "saccharin", "splenda/sucralose", "stevia", "sugar alcohol", "sugar free", "sugars added", "tagatose", "unsweetened", "xylitol"]

// Carefully examine the provided images and and created JSON output in given format, do not do OCR just observe detail from image and return the JSON ouput only:

// json
// {
//   "answerOfQuestionsAboutNutritionFact": "your answer" (Do you see the whole nutrition fact panel on provided image? why? where is it on product?"),
//   "answerOfQuestionAboutNutritionFactTitle": "your answer" (Do you see fully "Supplement Fact" title or "Nutrition Fact" title  on provided image ? ),
//   "answerOfQuestion": "your answer" ( why do you  keep providing me the info that is not visibly seen on provided image? I only need info that you can see on provided image please do OCR text and check if your info add to JSON is correct),
//   "answerOfRemindQuestion": "your answer"(The product images may include multiple languages; Could you please only provide information in English please, I do not want to see information in Spanish?),
//   "answerOfusingEnum": "your answer" (why you keep adding all enum values to field value? i want you to check if value that you add to field is from enum or not, if not so it is invalid value for that field? Why i still see you add the value that not from enum? ),
//   "product": {
//     "certifierAndLogo":"your answer gemini" (help me list all certifiers logo(such as kosher U pareve, ...) and usda inspection marks on provided image),
//     "readAllConstants": "your answer gemini"(please help me read carefully all constant above carefully. they are important and will be used to create the json output. And answer me did you read them?"),
//     "factPanels": null or  [
//       {
//         "panelName": string ,
//         "amountPerServing": {"name": string?},
//         "calories": {"value": float?, "uom": "calories"}
//         "servingSize": {"description": string?, "value": string, "uom": string,},
//         "servingPerContainer":" {"value": float? or number?, "uom": string},
//         "nutrients": [
//           {
//             "name": string,
//             "descriptor": string,
//             "quantityComparisonOperator": string?, value: float?, uom: string,
//             "quantityDescription": string?,
//             "dailyPercentComparisonOperator": string?,
//             "percentDailyValue": float,
//             "footnoteIndicator": string?,
//           }
//         ],
//         "footnote": {
//           "value": string?,
//         },
//       }
//     ],
//     "ingredientsGroup": [{"ingredients": string[]}],
//     "allergen": {
//       "contain": string[], // values extracted from images must be from ALLERGEN_LIST
//       "containOnEquipment": {"statement": string, "allergenList: string[] },
//       "freeOf: string[], // values extracted from images must be from ALLERGEN_LIST
//     },
//     "header": {
//       "productName": string,
//       "brandName": string,
//       "primarySize": {
//         "primarySizeValue": string,
//         "primarySizeUom": string,
//         "primarySizeText": string,json
//       },
//       "secondarySize": {
//         "secondarySizeValue": string,
//         "secondarySizeUom": string,
//         "secondarySizeText": string,
//       },
//       "thirdSize": {
//         "thirdSizeValue": string,
//         "thirdSizeUom": string,
//         "thirdSizeText": string,
//       }
//       "sizeTextDescription": string,
//       "count": number
//     },
//     "packaging": {
//       "containerMaterialType": string,
//       "containerType": string,
//       "recyclingAdvice": string[],
//       "forestStewardshipCouncilClaim": boolean,
//       "packaging_ancillaryInformation": string[],
//     },
//     "attributesAndCertifiers": {
//       "claims": {
//         "beeFriendly": {
//           "beeFriendly_Certifier": string,
//           "beeFriendly_claim": boolean,
//         },
//         "bioBased": {
//           "bioBased_certifier": string,
//           "bioBased_claim": boolean,
//         },
//         "bioDynamic": {
//           "bioDynamic_certifier": string,
//           "bioDynamic_claim": boolean
//         },
//         "gmp": {
//           "gmp_certifier": string,
//           "gmp_claim": boolean
//         },
//         "glutenFree": {
//           "glutenFree_certifier": string,
//           "glutenFree_claim": boolean,
//         },
//         "italCertifiedSeal": {
//           "italCertifiedSeal_certifier": string,
//           "italCertifiedSeal_claim": boolean,
//         },
//         "italCertifiedConsious": {
//           "italCertifiedConsious_certifier": string,
//           "italCertifiedConsious_claim": boolean,
//         },
//         "kosher": {
//           "kosher_certifier": string,
//           "kosher_claim": boolean,
//         },
//         "liveAndActiveCulture": {
//           "liveAndActiveCulture_certifier": string,
//           "liveAndActiveCulture_claim": boolean,
//         },
//         "lowGlycemic": {
//           "lowGlycemic_certifier": string,
//           "lowGlycemic_claim": boolean,
//         },
//         "npa": {
//           "npa_certifier": string,
//           "npa_claim": boolean,
//         },
//         "newYorkStateGrownAndCertified": {
//           "newYorkStateGrownAndCertified_certifier": string,
//           "newYorkStateGrownAndCertified_claim": boolean,
//         },
//         "nonGmo": {
//           "nonGmo_certifier": string,
//           "nonGmo_claim": boolean
//         },
//         "organic": {
//           "organic_Certifier": string,
//           "organic_claim": boolean,
//         },
//         "glyphosateResidueFree": {
//           "glyphosateResidueFree_certifier": string,
//           "glyphosateResidueFree_claim": boolean,
//         },
//         "vegan": {
//           "vegan_certifier": string,
//           "vegan_claim": boolean, //hint - plant-based is not vegan claim
//         },
//         "plantBasedOrPlantDerived": {
//           "plantBasedOrPlantDerived_certifier": string,
//           "plantBasedOrPlantDerived_claim": boolean,
//         },
//       },
//       "containInfo": {
//         "attribute_contain": string[], // values extracted from images must be from ATTRIBUTE_CONTAIN_LIST - when info on images say product contain something
//         "attribute_doesNotContain": string[], // values extracted from images must be from ATTRIBUTE_CONTAIN_LIST - when info on images say product does not contain something
//       },
//       "otherClaims:{
//         "fatContentClaims": string[], // values extracted from images must be from FAT_CLAIMS - when have statement about "fat" on product's images
//         "saltOrSodiumClaims": string[], // values extracted from images must be from SODIUM_CLAIMS - when have statement about "sodium" or "salt" on product's images
//         "sugarAndSweetenerClaims": string[], // values extracted from images must be from SUGAR_CLAIMS
//         "highOrRichInOrExcellentSourceOf": string[],
//         "usdaInspectionMark": string,
//       },
//     },
//     "physical": {
//       "upc12": string,
//     },
//     "marketingAll": {
//       "marketingContents": string[],
//       "copyrightOrTradeMark": string,
//       "slogan": fstring,
//       "website": string,
//       "socialMedia": {
//         "socialList": string[], // such as facebook, youtube, twitter,...
//         "socialMediaText": string[], // such as "@goodFood"
//       },
//       "enlaredToShow": boolean,
//     },
//     "supplyChain": {
//       "CountryOfOrigin": string,
//       "manufactureDate": string,
//       "manufacturePhoneNumber": number,
//       "manufactureStreetAddress": string,
//       "manufactureCity": string,
//       "manufactureState": string,
//       "manufactureZipcode": string,
//       "manufactureName": string,
//     }
//     "instructions": {
//       "consumerStorageInstructions": string[], // are the instructions about how to store product (ex: "store product under 30oC..", "Keep in fridge..."),
//       "otherInstruction": string[],
//       "cookingInstructions": string[],
//       "usageInstructions": string[],
//     },
//   },
// }

// importent rules:
// 1) dual-column format for different serving size must be separated into two different nutrition fact panel
// 2) with string[] or string type file with comment "only from enum ...", it mean that values of field must be choosen from a predefined set of values defined by that enum.

// rules:
// 1) "header.primarySize" and "header.secondarySize" and "header.thirdSize" rules:
// Example 1: "Net 3 Qt. (96 fl. oz.) 2.835L" should be recorded as
// {
//   "primarySize": {"primarySizeValue": 3, "primarySizeUom": "Qt." , "primarySizeText": "3 Qt." },
//   "secondarySize": {"secondarySizeValue": 96, "secondarySizeUom": "fl. oz." , "secondarySizeText": "96 fl. oz." },
//   "thirdSize": {"thirdSizeValue": 2.835, "thirdSizeUom": "L", "thirdSizeText": "2.835L" }
// }
// Example 2: "64 FL OZ(2QTs) 1.89L" should be recorded as
// {
//   "primarySize": {"primarySizeValue": 64 , "primarySizeUom": "FL OZ" , "primarySizeText": "64 FL OZ"},
//   "secondarySize": {"secondarySizeValue": 2  , "secondarySizeUom": "QTs" , "secondarySizeText": "2QTs" }
//   "thirdSize": {"thirdSizeValue": 1.89  , "thirdSizeUom": "L" , "thirdSizeText": "1.89L" }
// }
// Example 3: "Net WT 5.25 OZ 150g" should be recorded as
// {
//   "primarySize": {"primarySizeValue": 5.25 , "primarySizeUom": "OZ" , "primarySizeText": "5.25 OZ"},
//   "secondarySize": {"secondarySizeValue": 150  , "secondarySizeUom": "g" , "secondarySizeText": "150g" },
// }

// 2) "included sugar" is separated with "total sugar" and considered as a "nutrient"

// 3) "nutrients.descriptor" rules:
// + "nutrients.descriptor" could be the text that is intended and appear on the row below a nutrient.
// + "nutrients.descriptor" could also be the text inside the parentheses right next to "nutrients.name"

// 4) "nutrient.percentDailyValue" rules:
// + "nutrient.percentDailyValue" could be null or could not be able to be observed on the images so its value should be null
//  `;

const gptPrompt = `
Carefully examine the provided images and and created JSON output in given format, do not do OCR just observe detail from image and return the JSON ouput only:

json
{
  "answerOfQuestionsAboutNutritionFact": "your answer" (Do you see the whole nutrition fact panel on provided image? why? where is it on product?"),
  "answerOfQuestionAboutNutritionFactTitle": "your answer" (Do you see fully "Supplement Fact" title or "Nutrition Fact" title  on provided image ? ),
  "answerOfQuestion": "your answer" ( why do you  keep providing me the info that is not visibly seen on provided image? I only need info that you can see on provided image please do OCR text and check if your info add to JSON is correct),
  "answerOfRemindQuestion": "your answer"(The product images may include multiple languages; Could you please only provide information in English please, I do not want to see information in Spanish?),
  "product": {
    "certifierAndLogo":"your answer gemini" (help me list all certifiers logo(such as kosher U pareve, ...) and usda inspection marks on provided image),
    "readAllConstants": "your answer gemini"(please help me read carefully all constant above carefully. they are important and will be used to create the json output. And answer me did you read them?"),
    "factPanels": null or  [
      {
        "panelName": string ,
        "amountPerServing": {"name": string?},
        "calories": {"value": float?, "uom": "calories"}
        "servingSize": {"description": string?, "value": string, "uom": string,},
        "servingPerContainer":" {"value": float? or number?, "uom": string},
        "nutrients": [
          {
            "name": string,
            "descriptor": string,
            "quantityComparisonOperator": string?, value: float?, uom: string,
            "quantityDescription": string?,
            "dailyPercentComparisonOperator": string?,
            "percentDailyValue": float,
            "footnoteIndicator": string?,
          }
        ],
        "footnote": {
          "value": string?,
        },
      }
    ],
    
    "header": {
      "productName": string,
      "brandName": string,
      "primarySize": {
        "primarySizeValue": string,
        "primarySizeUom": string,
        "primarySizeText": string,json
      },
      "secondarySize": {
        "secondarySizeValue": string,
        "secondarySizeUom": string,
        "secondarySizeText": string,
      },
      "thirdSize": {
        "thirdSizeValue": string,
        "thirdSizeUom": string,
        "thirdSizeText": string,
      }
      "sizeTextDescription": string,
      "count": number
    },
    "attributesAndCertifiers": {
      "claims": {
        "beeFriendly": {
          "beeFriendly_Certifier": string,
          "beeFriendly_claim": boolean,
        },
        "bioBased": {
          "bioBased_certifier": string,
          "bioBased_claim": boolean,
        },
        "bioDynamic": {
          "bioDynamic_certifier": string,
          "bioDynamic_claim": boolean
        },
        "gmp": {
          "gmp_certifier": string,
          "gmp_claim": boolean
        },
        "glutenFree": {
          "glutenFree_certifier": string,
          "glutenFree_claim": boolean,
        },
        "italCertifiedSeal": {
          "italCertifiedSeal_certifier": string,
          "italCertifiedSeal_claim": boolean,
        },
        "italCertifiedConsious": {
          "italCertifiedConsious_certifier": string,
          "italCertifiedConsious_claim": boolean,
        },
        "kosher": {
          "kosher_certifier": string,
          "kosher_claim": boolean,
        },
        "liveAndActiveCulture": {
          "liveAndActiveCulture_certifier": string,
          "liveAndActiveCulture_claim": boolean,
        },
        "lowGlycemic": {
          "lowGlycemic_certifier": string,
          "lowGlycemic_claim": boolean,
        },
        "npa": {
          "npa_certifier": string,
          "npa_claim": boolean,
        },
        "newYorkStateGrownAndCertified": {
          "newYorkStateGrownAndCertified_certifier": string,
          "newYorkStateGrownAndCertified_claim": boolean,
        },
        "nonGmo": {
          "nonGmo_certifier": string,
          "nonGmo_claim": boolean
        },
        "organic": {
          "organic_Certifier": string,
          "organic_claim": boolean,
        },
        "glyphosateResidueFree": {
          "glyphosateResidueFree_certifier": string,
          "glyphosateResidueFree_claim": boolean,
        },
        "vegan": {
          "vegan_certifier": string,
          "vegan_claim": boolean, //hint - plant-based is not vegan claim
        },
        "plantBasedOrPlantDerived": {
          "plantBasedOrPlantDerived_certifier": string,
          "plantBasedOrPlantDerived_claim": boolean,
        },
      },
    },
    "physical": {
      "upc12": string,
    },
  },
}

importent rules:
1) dual-column format for different serving size must be separated into two different nutrition fact panel  

rules:
1) "header.primarySize" and "header.secondarySize" and "header.thirdSize" rules:
Example 1: "Net 3 Qt. (96 fl. oz.) 2.835L" should be recorded as
{
  "primarySize": {"primarySizeValue": 3, "primarySizeUom": "Qt." , "primarySizeText": "3 Qt." }, 
  "secondarySize": {"secondarySizeValue": 96, "secondarySizeUom": "fl. oz." , "secondarySizeText": "96 fl. oz." },
  "thirdSize": {"thirdSizeValue": 2.835, "thirdSizeUom": "L", "thirdSizeText": "2.835L" }
}
Example 2: "64 FL OZ(2QTs) 1.89L" should be recorded as
{
  "primarySize": {"primarySizeValue": 64 , "primarySizeUom": "FL OZ" , "primarySizeText": "64 FL OZ"},
  "secondarySize": {"secondarySizeValue": 2  , "secondarySizeUom": "QTs" , "secondarySizeText": "2QTs" }
  "thirdSize": {"thirdSizeValue": 1.89  , "thirdSizeUom": "L" , "thirdSizeText": "1.89L" }
}
Example 3: "Net WT 5.25 OZ 150g" should be recorded as
{
  "primarySize": {"primarySizeValue": 5.25 , "primarySizeUom": "OZ" , "primarySizeText": "5.25 OZ"},
  "secondarySize": {"secondarySizeValue": 150  , "secondarySizeUom": "g" , "secondarySizeText": "150g" },
}

2) "included sugar" is separated with "total sugar" and considered as a "nutrient"

3) "nutrients.descriptor" rules:
+ "nutrients.descriptor" could be the text that is intended and appear on the row below a nutrient.
+ "nutrients.descriptor" could also be the text inside the parentheses right next to "nutrients.name"

4) "nutrient.percentDailyValue" rules:
+ "nutrient.percentDailyValue" could be null or could not be able to be observed on the images so its value should be null
 `;
