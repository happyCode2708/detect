export const makePrompt = ({
  ocrText,
  imageCount,
  detectedClaims,
}: {
  ocrText?: string;
  imageCount?: number;
  detectedClaims: string;
}) => {
  return `
Remember (important):
+ do not provide data that you cannot see it by human eyes on provided images.
+ The product images may include multiple languages. Please ignore non-english content.
Ex: Saturated Fat/Grasa Saturada (english/spanish) we should only record english content only and ignore spanish part. Do not translate spanish part to english and add it to JSON result
+ sometimes a content could appears twice on the image, once in English and once in Spanish. Please do not include spanish content
+ be careful that all images are from only one product. You may see the same nutrition fact from different images those are captured from different angles of product.
+ the product images are captured from different angles and some info on an images could be obscured partly but the hidden parts could appear in other images. It is the remind to avoid you repeat the collected data since it could appear multiple times on different images.

+ OCR texts from ${imageCount} provided images:
${ocrText}

+ Guessed claims form OCR
const detected_claims = ${detectedClaims}


Carefully examine the provided image and and created JSON output in given format:

json
{
  "validatorAndFixBug": {
    "answerOfQuestion_1": your answer gemini ( why do you  keep providing me the info that is not visibly seen on provided image? I only need info that you can see on provided image),
    "require__1": "gemini stop keeping to put spanish contents to JSON Object (such as 'instructions', 'other_ingredients_group', 'ingredients_group')",
    "require__2": "gemini you must analyze, and validate all detected_claims, i see you only some items in detected_claims",
    "end": true
  },
  "product": {
    "content_in_spanish_must_be_prohibited": true,
    "is_product_supplement": boolean,
    "certifierAndLogo":"your answer gemini" (help me list all certifiers logo(such as kosher U pareve, ...) and usda inspection marks on provided image),
    "other_ingredients_group":[
      {
        "ingredients_statement": string, 
      }, 
      ...
    ], 
    "ingredients_group":[
      {
        "ingredients_statement": string, 
      }, 
      ...
    ],
    "allergen": {
      "allergen_contain_statement": string, 
      "allergen_freeOf_statement": string,
      "allergen_containOnEquipment_statement": string,
      "allergen_freeOf": {
        "allergen_freeOf_list: string[],
      },
      "allergen_contain": {
        "allergen_contain_list: string[] 
      },
      "allergen_containOnEquipment": {
        "allergen_containOnEquipment_list: string[] 
      }
    },
    "contain_and_notContain": {
      "product_contain": string[],
      "product_does_not_contain": string[]
    },
    "process": {
      "very_low": string[],
      "lower": string[],
      "low": string[],
      "reduced": string[],
      "no": string[],
      "free_of": string[],
      "zero_at": string[],
      "high_in_full_statement": string[],
      "rich_in_full_statement": string[],
      "exploit_methods": string[],
      "do_not_do": string[],
      "100_percent_or_all": string[],
      "un_prefix": string[],
      "raw": string[],
      "acidity_percent_statement": string[],
      "total_fat": {
        value: float,
        "uom": string
      },
      "grade": string[],
      "natural": string[],
      "live_and_active_cultures": {
        "statement": string,
        "list_break_out": string[]
      }
    },
    "header": {
      "productName": string,
      "brandName": string,
      "primarySize": {
        "primarySizeValue": string,
        "primarySizeUom": string,
        "primarySizeText": string,json
      },ƒ
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
    "packaging": {
      "containerMaterialType": string,
      "containerType": string,
      "packagingDescriptors": string[],
      "recyclingInfo": any,
      "recyclable": [{
        name: string,
        recyclable: boolean,
      },...],
      "forestStewardshipCouncilClaim": boolean,
      "packaging_ancillaryInformation": string[]
    },
    "attributesAndCertifiers": {
      "claims": {
        "beeFriendly": {
          "beeFriendly__Certifier": string,
          "beeFriendlyClaim": boolean,
        },
        "bioBased": {
          "bioBased__Certifier": string,
          "bioBasedClaim": boolean,
        },
        "bioDynamic": {
          "bioDynamic__Certifier": string,
          "bioDynamicClaim": boolean
        },
        "gmp": {
          "gmp__Certifier": string,
          "gmpClaim": boolean
        },
        "glutenFree": {
          "glutenFree__Certifier": string,
          "glutenFreeClaim": boolean,
        },
        "italCertifiedSeal": {
          "italCertifiedSeal__Certifier": string,
          "italCertifiedSealClaim": boolean,
        },
        "italCertifiedConsious": {
          "italCertifiedConsious__Certifier": string,
          "italCertifiedConsiousClaim": boolean,
        },
        "kosher": {
          "kosher__Certifier": string,
          "kosherClaim": boolean,
        },
        "liveAndActiveCulture": {
          "liveAndActiveCulture__Certifier": string,
          "liveAndActiveCultureClaim": boolean,
        },
        "lowGlycemic": {
          "lowGlycemic__Certifier": string,
          "lowGlycemicClaim": boolean,
        },
        "npa": {
          "npa__Certifier": string,
          "npaClaim": boolean,
        },
        "newYorkStateGrownAndCertified": {
          "newYorkStateGrownAndCertified__Certifier": string,
          "newYorkStateGrownAndCertifiedClaim": boolean,
        },
        "nonGmo": {
          "nonGmo__Certifier": string,
          "nonGmoClaim": boolean
        },
        "organic": {
          "organic__Certifier": string,
          "organicClaim": boolean,
        },
        "glyphosateResidueFree": {
          "glyphosateResidueFree__Certifier": string,
          "glyphosateResidueFreeClaim": boolean,
        },
        "vegan": {
          "vegan__Certifier": string,
          "veganClaim": boolean, //hint - plant-based is not vegan claim
        },
        "plantBasedOrPlantDerived": {
          "plantBasedOrPlantDerived__Certifier": string,
          "plantBasedOrPlantDerivedClaim": boolean,
        }
      },
      "otherClaims:{
        "usdaInspectionMark": string
      }
    },
    "physical": {
      "upc12": string, //find UPC12 in the provided image
    },
    "marketingAll": {
      "copyrightOrTradeMark": string,
      "website": string,
      "social_media_check": {
        "see_facebook_icon": boolean,
        "see_google_icon": boolean,
        "see_instagram_icon": boolean,
        "see_pinterest_icon": boolean,
        "see_snapchat": boolean,
        "see_tiktok_icon": boolean,
        "see_youtube_icon": boolean,
        "see_twitter_icon": boolean,
      },
      "socialMedia": {
        "socialList": string[],
        "socialMediaText": string[],
      },
      "enlaredToShow": boolean
    },
    "supplyChain": {
      "CountryOfOrigin": string,
      "manufactureDate": string,
      "manufacturePhoneNumber": number,
      "manufactureStreetAddress": string,
      "manufactureCity": string,
      "manufactureState": string,
      "manufactureZipcode": string,
      "manufactureName": string
    }
    "instructions": {
      "otherInstruction": string[],
      "consumerStorageInstructions": string[],
      "cookingInstructions": string[],
      "usageInstructions": string[]
    },
    "analysis_detected_claims": {
      "non_certified_claim": [
        {
          "claim": string,
          "does_claim_correct_with_info_provided_on_image": boolean, //* important note (1 - wildly is not mean wild claim )
        },
        ...
      ],
      "contain_claim": [
        {
          "claim": string,
          "amount_value": string,
          "does_product_info_talk_about_thing_in_claim": boolean, 
          "does_product_contain_thing_in_claim": boolean, // important notes (Note 1 - cholesterol in nutrition fact with 0mg mean that product does not contain cholesterol) (Note 2 - "sugar alcohol" is not a type of "alcohol") (Note 3 - "Artificial Food Colors" does not imply "Artificial ingredients")   
          "debug": string, // tell me how you gemini know product contain or not contain the thing mentioned in claim?
          "validate": "deduced/implied from other info or similar text" | "seen on product",
        },
        ...
      ],
      "sugar_and_sweet_claim": [
        {
          "sugar_type_claim": string,
          "product_contain_sugar_type_above": boolean, // important note (1 - the sugar could naturally occurring in ingredient mean that product have sugar. 2 - "zero sugar" or "insignificant amount of sugar" mean have no "sugar"),
          "amount_value": string,
          "debug": string, // tell me how you gemini know product contain or not contain that sweet source?
        },
        ...
      ],
      "salt_or_sodium_claim": [
        {
          "claim": string,
          "does_claim_correct_with_info_provided_on_image": boolean,
        },
        ...
      ],
      "calorie_claim": [
        {
          "claim": string,
          "does_claim_correct_with_info_provided_on_image": boolean, 
        },
        ...
      ],
      "fat_claim": [
        {
          "claim": string,
          "does_claim_correct_with_info_provided_on_image": boolean, 
        },
        ...
      ],
      ...
    }
  }
}

The Most Important rule:
+ Only get data that visibly seen by normal eyes not from other sources on internet
+ Only get ingredients data that visibly seen by normal eyes not from other sources on internet.
+ Remind you again only provide the data visibly on provnonided image, and must be detected by human eyes not from other source on internet.

Some common rules:
+ content in prompt can be similar to typescript and nodejs syntax.
+ do not return json in format [{product: {...}}] since the result is only for one product

Some rules for you:
1) "ingredients_groups":
+ "ingredients_groups" is the list of ingredients list since a product can have many ingredient list
+ "ingredients_groups.ingredients_statement" content start right after a prefix text such as "ingredients:" or "Ingredients:" or "INGREDIENTS:".
+ "ingredients_groups.ingredients_statement" usually appear below or next to the nutrition panel.

2) "other_ingredients_group":
+ "other_ingredients_group" is the list of ingredients list since a product can have many ingredient list. And it is only for supplement product.
+ "other_ingredients_group.ingredients_statement" content start right after a prefix text such as "other ingredients".
+ "other_ingredients_group.ingredients_statement" usually appear below or next to the nutrition panel.

3) "marketingAll" rules:
a) "marketingAll.website":
+ find website link
+ website link exclude "nongmoproject.org"
+ be careful the content after slash could be phone number
Ex 1: text "www.test.com/999.444.3344" should be recorded as {website: "www.test.com", ...} since the number after slash is phone number

b) "marketingAll.socialMedia":
+ "socialMedia.socialList" is the list of all social media type provided on product image such as facebook, pinterest, instagram, twitter, threads,... which can be easily detected by social mdeia icon, logo, or link.
+ "socialMedia.socialMediaText" is a list of text usually start with "@", or "#" those can be used to search the product on social media. Hint, it is usually next to social media icons
Ex: "@cocacola", "#cocacola"


e) "copyrightOrTradeMarkOrRegistration" rules:
+ "copyrightOrTradeMarkOrRegistration" is trademark, copyright or registration statement of product may contain some symbols below:
™ - stands for a trademark;
® - stands for a registered trademark;
© - stands for copyright.
+ the "copyrightOrTradeMarkOrRegistration" usually contain strings such as "...is/are registered trademark...", "copyright..."

f) "enlargedToShow" rules:
Ex: if statement such as "enlarged to show..." = {"enlargedToShowTexture": true}

4) "header" rules:
a) "header.productName" :
+ extract possible name of product from given image.

b) "header.brandName":
+ find brand name

c) "header.primarySize" and "header.secondarySize" and "header.thirdSize" rules:
+ "header.primarySize" and "header.secondarySize" and "header.thirdSize" is a quantity measurement of product in two different unit of measurement
+ "primarySizeUom" and "secondarySizeUom" and "thirdSizeUom" is "Units of Liquid Measurement" (such as "Fl OZ", "L", ...) or "Weight Units of Measure" (such as "Gram", "Kg", ...)
+ "primarySizeUom" and "secondarySizeUom" and "thirdSizeUom" exclude "calories"
Ex 1: "Net 3 Qt. (96 fl. oz.) 2.835L" should be recorded as 
{
  "primarySize": {"primarySizeValue": 3, "primarySizeUom": "Qt." , "primarySizeText": "3 Qt." }, 
  "secondarySize": {"secondarySizeValue": 96, "secondarySizeUom": "fl. oz." , "secondarySizeText": "96 fl. oz." },
  "thirdSize": {"thirdSizeValue": 2.835, "thirdSizeUom": "L", "thirdSizeText": "2.835L" }
}
Ex 2: "64 FL OZ(2QTs) 1.89L" should be recorded as 
{
  "primarySize": {"primarySizeValue": 64 , "primarySizeUom": "FL OZ" , "primarySizeText": "64 FL OZ"},
  "secondarySize": {"secondarySizeValue": 2  , "secondarySizeUom": "QTs" , "secondarySizeText": "2QTs" }
  "thirdSize": {"thirdSizeValue": 1.89  , "thirdSizeUom": "L" , "thirdSizeText": "1.89L" }
}
Ex 3: "Net WT 5.25 OZ 150g" should be recorded as 
{
  "primarySize": {"primarySizeValue": 5.25 , "primarySizeUom": "OZ" , "primarySizeText": "5.25 OZ"},
  "secondarySize": {"secondarySizeValue": 150  , "secondarySizeUom": "g" , "secondarySizeText": "150g" },
}
Ex 4: "22 - 2.52 OZ (73g) BARS NET WT 2.14 LB (800g)" should be recorded as
{
  "primarySize": {"primarySizeValue": 2.14 , "primarySizeUom": "LB" , "primarySizeText": "2.14 LB"},
  "secondarySize": {"secondarySizeValue": 800  , "secondarySizeUom": "g" , "secondarySizeText": "800g" },
}

d) "header.count":
+ is the count number of smaller unit inside a packagge, or a display shipper, or a case, or a box.
Ex: there are 15 cookies in the packages so {"count": 15}

e) "header.sizeTextDescription":
+ is the whole quantity measurement description statement of the product on image. It is usually appear on the front face of product.

16) "packaging" rules:
a) "containerMaterialType":
+ is the type of material is used to make the package such as "paper", "plastic", or "metal", ...

b) "containerType":
+ is the type of package such as "box", "bottle", "bag", "tube", or "shrink wrapped"

c) "packagingDescriptors":
+ is a list statements of packaing materials.

d) "packaging.recyclingInfo":
+ is your answer gemini - Cam you give me the recycling info on provided images?

e) "forestStewardshipCouncilClaim":
+ return true if "forest stewardship council FSC" logo found

f) "packaging_ancillaryInformation":
+ is a list of text
+ text could be the code near upc bar code
Ex: "22222-22-A4433"

5) "allergen" rules:
a) "allergen_contain_statement" is the exact context that you found on provided images about allergen info, ususally start with "contains", "contains:", "may contains:", ....

b) "allergen_freeOf_statement" is the exact context that you found on provided images about allergen info, that product claim not to contain.

c) "allergen_containOnEquipment_statement" is the exact context that you found on provided images about list of allergen ingredients that is said they may be contained in/on manufacturing equipments.

c) "allergen_containOnEquipment" rules:
+ "allergen_containOnEquipment_list" is a list of allergen ingredients that is said they may be contained in/on manufacturing equipments.

d) "allergen_contain" rules:
+ "allegen_contain_list" is a list of allergen ingredients could make customer allergen.
+ "allegen_contain_list" is different from "allergen_containOnEquipment_list".
+ "allergen_contain_list" list usually start after text "contain:", "contain", "Allergens ...", or "Allergen information ...".
+ "allergen_contain_list" each allergen ingredient must be an separted string array item.
Ex 1: "May contain milk and corn" should be recorded as {"allergen_contain_list": ["milk". "corn]} 
Ex 2: "Contain: Corn, Milk, and Oats" should be recorded as   {""allergen_contain_list": ["corn", "milk", "oats"]}

e) "allergen_freeOf":
+ "allergen_freeOf" is complicated to extract so please follow all rule below to get "freeOf" values:

+ "allergen_freeOf_list" is all ingredients that is claim not be in product. usually start with text "free of ...", "made without ...".
Ex 1: "free of soy & milk" should be recorded as {"allergen_freeOf_list": ["soy", "milk"]} 
Ex 2: "No Milk, Corn" should be recorded as {"allergen_freeOf_list": ["milk", "corn"]}


6) "supplyChain":
+  "supplyChain.countryOfOrigin" is the country name in where product was made. Ex: "USA".

7) "instructions" rules:
a) "instructions.otherInstruction" is a list of text that guide user to do something.
Ex: "read instruction for...", "see nutrition fact for..." 

b) "instructions.consumerStorageInstructions" is a list of of text about storage instructions



8) "attributesAndCertifiers" rules:
a) "attributesAndCertifiers.claims" rules:
+ for "attributesAndCertifiers.claims" gemini you are allowed to access the external source from internet to verfiy if detected "certified logo" is valid. Some product may use a logo for a claim but it could be invalid "certified logo"
+ field name with format string__Certifier such as  "nonGmo__Certifier", "npa__Certifier",... please give these field the name of certifier from detected "certifier logo" which is visibly seen by human eye on provided image.
Ex 1: The Non-GMO valid certifier is visibly seen by human eyes on the provided image so it should be recorded as 
{
  "nonGmo": {
    "nonGmo__Certifier": "gemini return the name of Certifier",
    "nonGmoClaim": true
  }  
}  
Ex 2: If you see statement like "Non-gmo" but do not found the "Non-GMO" certifier logo on the image so it should be recorded as
{
  "nonGmo": {
    "nonGmo__Certifier": null,
    "nonGmoClaim": true
  }  
}


h) attributesAndCertifiers.otherClaims.usdaInspectionMark":
+ if USDA inspection mark found on provided image, return full words on that inspection mark
  
10) "contain_and_notContain" rules:
a) "product_contain" is a list of things product claim to contain, made with , or with, ...

b) "product_does_not_contain" rules: 
+ "product_does_not_contain" is a list of things that product claim not contain in the product.
+ "product_does_not_contain" could be detected through some text such as
  - "does not contain ..."
  - "made without...",
  - "free of ...", 
  - "No ..." (Ex: "No preservatives")
  
11) "process" rules:
  + "very_low" is the list of things product claim to have at very low amount (such as "very low sodium", ...).
  
  + "lower" is the list of things that product claim to have at lower amount (such as "lower sugar", ...).
  
  + "low" is the list of things that product claim to have at low amount (such as "low calorie", ...).
  
  + "reduced" is the list of things product claim to have reduced amount (such as "reduced calorie",...).
  
  + "no" is the list of things that product claim to have no at (such as "no sugar added",...).
  
  + "free_of" is the list of things that product claim to free of (such as "free of saturated fat", "fat free",...).
  
  + "high_in_full_statement" is the list of statements that product claim to have at high amount (such as "high fructose conrn syrup", ...).

  + "rich_in_full_statement" is the list of statements that product claim to rich in (such as "rich in vitamin D", "rich sourch of vitamin C", ...).
  
  + "zero_at" is the list of things that product claim to have zero amount (such as "0g trans fat", ...).
  
  + "exploit_methods" is how they make product (ex: 'wild caught').
  
  + "do_not_do" is the list of things that company claim they do not doing at any stage of product development or production. (ex: 'no sulfites added', ...).
  
  + "100_percent_or_all" is the list of things that product claim to have at 100 percent or made with all (ex: "all natural", "100% pure ...").
  
  + "raw" is the list of things that product claim to have raw at (such as "raw juice", ...).
  
  + "un_prefix" is the list of things that product claim with adjective start withh "un" (such as "unpasteurized", "un-pasteurized", "unfiltered", ...).
  
  + "acidity_percent_statement" is the list of acidity statement (such as "Acidity 12%",...)
  
  + "total_fat.value" is the value of total fat on nutrition fact panel.

  + "grade" is the list of statements on product about grading (such as "grade A", "choice", "prime", "select", "premium", ...)
  
  + "natural" is the list of statements about natural (such as: "natural botanicals", "natural ingredients", ...)

  + "live_and_active_cultures.statement" is the statement about all active cultures inside product (include the active cultures list).
  
12)  "analysis_detected_claims.contain_claim.validate":
+ is to check if claim info is deduced from other text, or deduced from other info, or implied from equivalent text info, or being seen directly on product.
  `;
};
