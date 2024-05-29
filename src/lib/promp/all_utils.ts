// "marketingContents": string[],
// c) "marketingContents" rules:
// + "marketingContents" is texts to introduce or marketing features or benefits of product, and usually appear on the front face of product or some marketing pharagraph to appeal customer.
// + there could be also marketing contents which are texts about nutrients appear on the main face of product to appeal customer to buy product
// "answerOfDebug_4": your answer gemini (remember "marketingContents" is texts to introduce or marketing features or benefits of product, or some marketing pharagraph to appeal customer),

export const makePrompt = ({
  ocrText,
  imageCount,
}: {
  ocrText?: string;
  imageCount?: number;
}) => {
  return `
  Some common constants:
+ FAT_CONTAIN_CLAIM = ["zero grams trans fat per serving", "fat free"]
+ SALT_OR_SODIUM_CLAIMS = ["low sodium", "low salt"]
+ SUGAR_AND_SWEET_CLAIMS = ["no sugar alcohol"]
+ ATTRIBUTE_CONTAIN_LIST = ["1,4-dioxane", "active yeast", "added antibiotics", "added colors", "added dyes", "added flavors", "added fragrances", "added hormones", "added nitrates", "added nitrites", "added preservatives", "additives", "alcohol", "allergen", "aluminum", "amino acids", "ammonia", "animal by-products", "animal derivatives", "animal ingredients", "animal products", "animal rennet", "antibiotics", "artificial additives", "artificial colors", "artificial dyes", "artificial flavors", "artificial fragrance", "artificial ingredients", "artificial preservatives", "binders and/or fillers", "bleach", "bpa (bisphenol-a)", "butylene glycol", "by-products", "caffeine", "carrageenan", "casein", "cbd / cannabidiol", "chemical additives", "chemical colors", "chemical dyes", "chemical flavors", "chemical fragrances", "chemical ingredients", "chemical preservatives", "chemical sunscreens", "chemicals", "chlorine", "cholesterol", "coatings", "corn fillers", "cottonseed oil", "dyes", "edta", "emulsifiers", "erythorbates", "expeller-pressed oils", "fillers", "fluoride", "formaldehyde", "fragrances", "grain", "hexane", "hormones", "hydrogenated oils", "kitniyos / kitniyot (legumes)", "lactose", "latex", "msg", "natural additives", "natural colors", "natural dyes", "natural flavors", "natural ingredients", "natural preservatives", "nitrates/nitrites", "omega fatty acids", "paba", "palm oil", "parabens", "pesticides", "petro chemical", "petrolatum", "petroleum byproducts", "phosphates", "phosphorus", "phthalates", "pits", "preservatives", "rbgh/bst", "rennet", "salicylates", "sea salt", "shells/ shell pieces", "silicone", "sles ( sodium laureth sulfate)", "sls ( sodium lauryl sulfate )", "stabilizers", "probiotics", "starch", "sulfates", "sulfides", "sulfites / sulphites", "sulfur dioxide", "synthetic additives", "synthetic colors", "synthetic dyes", "synthetic flavors", "synthetic fragrance", "synthetic ingredients", "synthetic preservatives", "synthetics", "thc / tetrahydrocannabinol", "toxic pesticides", "triclosan", "vegan ingredients", "vegetarian ingredients", "yeast", "yolks"]
+ NON_CERTIFIED_CLAIMS = ["100% natural", "100% natural ingredients", "100% pure", "acid free", "aeroponic grown", "all natural", "all natural ingredients", "aquaponic/aquaculture grown", "baked", "biodegradable", "cage free", "cold-pressed", "direct trade", "dolphin safe", "dry roasted", "eco-friendly", "farm raised", "filtered", "free range", "freeze-dried", "from concentrate", "grade a", "greenhouse grown", "heat treated", "heirloom", "homeopathic", "homogenized", "hydroponic grown", "hypo-allergenic", "irradiated", "live food", "low acid", "low carbohydrate", "low cholesterol", "macrobiotic", "minimally processed", "natural", "natural botanicals", "natural fragrances", "natural ingredients", "no animal testing", "no sulfites added", "non gebrokts", "non-alcoholic", "non-irradiated", "non-toxic", "not fried", "not from concentrate", "pasteurized", "pasture raised", "prairie raised", "raw", "responsibly sourced palm oil", "sprouted", "un-filtered", "un-pasteurized", "unscented", "vegetarian or vegan diet/feed", "wild", "wild caught"]
+ ALLERGEN_LIST=["corn", "crustacean shellfish", "dairy", "egg", "fish", "milk", "oats", "peanuts / peanut oil", "phenylalanine", "seeds", "sesame", "soy / soybeans", "tree nuts", "wheat"]

Remember (important):
+ do not provide data that you cannot see it by human eyes on provided images.
+ The product images may include multiple languages. Please ignore non-english content.
Ex: Saturated Fat/Grasa Saturada (english/spanish) we should only record english content only and ignore spanish part. Do not translate spanish part to english and add it to JSON result
+ sometimes a content could appears twice on the image, once in English and once in Spanish. Please do not include spanish content
+ be careful that all images are from only one product. You may see the same nutrition fact from different images those are captured from diffrent angles of product.

Carefully examine the provided image and and created JSON output in given format:

json
{
  "validatorAndFixBug": {
    "answerOfDenbug_1": "your answer gemini" ( why do you  keep providing me the info that is not visibly seen on provided image? I only need info that you can see on provided image),
    "answerOfDebug_2": "your answer gemini" (The product images may include multiple languages; Could you please only provide information in English please, I do not want to see information in Spanish?),
    "answerOfDebug_3": your answer gemini" (Why you include translated content in JSON?),
  },
  "product": {
    "is_product_supplement": boolean,
    "certifierAndLogo":"your answer gemini" (help me list all certifiers logo(such as kosher U pareve, ...) and usda inspection marks on provided image),
    "readAllConstants": "your answer gemini"(please help me read carefully all constant above carefully. they are important and will be used to create the json output. And answer me did you read them?"),
    "other_ingredients_group:[{"ingredients": string[]}, ...], 
    "ingredients_group": [{"ingredients": string[]}, ...], 
    "allergen": {
      "contain": string[],
      "containOnEquipment": {"statement": string, "allergenList: string[] },
      "freeOf": string[],
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
      "packaging_ancillaryInformation": string[],
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
        },
      },
      "containInfo": {
        "attribute__contain": string[],
        "attribute__doesNotContain": string[],
      },
      "otherClaims:{
        "fatContentClaims": string[],
        "saltOrSodiumClaims": string[],
        "sugarAndSweetenerClaims": string[],
        "highOrRichInOrExcellentSourceOf": string[],
        "usdaInspectionMark": string,
      },
    },
    "physical": {
      "upc12": string, //find UPC12 in the provided image
    },
    "marketingAll": {
      "copyrightOrTradeMark": string,
      "website": string,
      "socialMedia": {
        "socialList": string[],
        "socialMediaText": string[],
      },
      "enlaredToShow": boolean,
    },
    "supplyChain": {
      "CountryOfOrigin": string,
      "manufactureDate": string,
      "manufacturePhoneNumber": number,
      "manufactureStreetAddress": string,
      "manufactureCity": string,
      "manufactureState": string,
      "manufactureZipcode": string,
      "manufactureName": string,
    }
    "instructions": {
      "otherInstruction": string[],
      "consumerStorageInstructions": string[],
      "cookingInstructions": string[],
      "usageInstructions": string[], 
    },
  },
}

The Most Important rule:
+ Only get data that visibly seen by normal eyes not from other sources on internet
+ Only get ingredients data that visibly seen by normal eyes not from other sources on internet.
+ Remind you again only provide the data visibly on provided image, and must be detected by human eyes not from other source on internet.

Some common rules:
+ content in prompt can be similar to typescript and nodejs syntax.
+ do not return json in format [{product: {...}}] since the result is only for one product

Some rules for you:
1) "ingredients_groups":
+ "ingredients_groups" is the list of ingredients list since a product can have many ingredient list
+ "ingredients_groups.ingredients" content start right after a prefix text such as "ingredients:" or "Ingredients:" or "INGREDIENTS:".
+ "ingredients_groups.ingredients" usually appear below or next to the nutrition panel.
Ex 1: "Ingredients: Flour, Eggs." =  ingredients_groups: [{ingredients: ["Flour", "Eggs"]}, ...]

2) "other_ingredients_group":
+ "other_ingredients_group" is the list of ingredients list since a product can have many ingredient list. And it is only for supplement product.
+ "other_ingredients_group.ingredients" content start right after a prefix text such as "other ingredients".
+ "other_ingredients_group.ingredients" usually appear below or next to the nutrition panel.
Ex 1: "Other ingredients: Flour, Eggs."=  other_ingredients_groups: [{ingredients: ["Flour", "Eggs"]}, ...]

3) "marketingAll" rules:
a) "marketingAll.website":
+ find website link
+ website link exclude "nongmoproject.org"
+ be careful the content after slash could be phone number
Ex 1: text "www.test.com/999.444.3344" should be recorded as {website: "www.test.com", ...} since the number after slash is phone number

b) "marketingAll.socialMedia":
+ "socialMedia.socailList" is the name list of all social media info provided on product image such as facebook, pinterest, instagram, twitter, threads,... carefully check the social media logo/icon or social media link.
keep asking yourself question like "Do I see Pinterest logo?" to find all social media methods and add to "socialMedia.socailList"
+ "socialMedia.socialMediaText" is a list of text usually start with "@" that can be used to search the product on social media. Hint, it is usually next to social media icons
Ex: "@cocacola" 


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
a) "allergen.contain" rules:
+ "allergen.contain" is a list of allergen ingredients could make customer allergen.
+ the list from enum ALLERGEN_LIST
+ "allergen.contain" list usually start after text "contain:", or "contain".
Ex 1: "May contain milk" should be recorded as {"contain": ["milk"]} 
Ex 2: "Contain: Corn, Milk." should be recorded as {"contain": ["Corn", "Milk"]}

b) "allergen.freeOf" rules:
+ "allergen.freeOf" is a list of allergen ingredients could make customer allergen that is stated as free from product.
+ the list only from enum ALLERGEN_LIST
+ "allergen.freeOf" list usually start after text "free of ..."
Ex 1: "free of soy" should be recorded as {"freeOf": ["soy"]} 
Ex 2: "No Milk, Corn" should be recorded as {"freeOf": ["Milk", "Corn"]}

c) "allergen.containOnEquipment" rules:
+ "containOnEquipment.allergenList" is a list of allergen ingredients that is said they may be contained in/on manufacturing equipments.
+ "containOnEquipment.statement" is the context about manufacturing equipment may contain allergen ingredient list.

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

b) "attributesAndCertifiers.containInfo.attribute__contain":
+ is a list thing that cotain in product
+ the list from enum ATTRIBUTE_CONTAIN_LIST

c) "attributesAndCertifiers.containInfo.attribute__doesNotContain":
+ is a list thing that does not cotain in product
+ the list from enum ATTRIBUTE_CONTAIN_LIST

d)"attributesAndCertifiers.otherClaims.highOrRichInOrExcellentSourceOf":
+ is the list of the text such as "Rich in Vitamin D", "Excellent Source of Vitamin D", "High Vitamin D",.. the text that emphasize that product have something in high amount and found on provided image.
Ex 1: texts "high protein" and "rich in vitamin D" found should be recorded as {"highOrRichInOrExcellentSourceOf": ["high protein", "rich in vitamin D"]}

e) "attributesAndCertifiers.otherClaims.fatContentClaims":
+ is string array from enum FAT_CONTAIN_CLAIM
+ text "0g trans fat", or "0 Gram trans fat" found so recorded as {"fatContentClaims": ["zero gram trans fat per serving"]},

f) "attributesAndCertifiers.otherClaims.saltOrSodiumClaims":
+ is string array from enum SALT_OR_SODIUM_CLAIMS
+ text "low sodium" found so recorded as {"saltOrSodiumClaims": ["low sodium"]}

g) "attributesAndCertifiers.otherClaims.sugarAndSweetenerClaims" rules:
+ is string array from enum SUGAR_AND_SWEET_CLAIMS
+ text "no sugar alcohol" found so recorded as {"sugarAndSweetenerClaims": ["no sugar alcohol"]}

h) attributesAndCertifiers.otherClaims.usdaInspectionMark":
+ if USDA inspection mark found on provided image, return full words on that inspection mark
  `;
};

// d) "slogan" rules:
// + "slogan" is a highlight text to praise product.

// "slogan": fstring,
