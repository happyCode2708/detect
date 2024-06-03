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
