export const NEW_PROMPT_1 = `you you know me?`;

// export const NEW_PROMPT = `
// Some common constants:
// + FOOTNOTE_INDICATORS = ["*", "**", "†", "★★", "★"]
// + FAT_CONTAIN_CLAIM = ["zero grams trans fat per serving", "fat free"]
// + SALT_OR_SODIUM_CLAIMS = ["low sodium", "low salt"]
// + SUGAR_AND_SWEET_CLAIMS = ["no sugar alcohol"]
// + ATTRIBUTE_CONTAIN_LIST = ["1,4-dioxane", "active yeast", "added antibiotics", "added colors", "added dyes", "added flavors", "added fragrances", "added hormones", "added nitrates", "added nitrites", "added preservatives", "additives", "alcohol", "allergen", "aluminum", "amino acids", "ammonia", "animal by-products", "animal derivatives", "animal ingredients", "animal products", "animal rennet", "antibiotics", "artificial additives", "artificial colors", "artificial dyes", "artificial flavors", "artificial fragrance", "artificial ingredients", "artificial preservatives", "binders and/or fillers", "bleach", "bpa (bisphenol-a)", "butylene glycol", "by-products", "caffeine", "carrageenan", "casein", "cbd / cannabidiol", "chemical additives", "chemical colors", "chemical dyes", "chemical flavors", "chemical fragrances", "chemical ingredients", "chemical preservatives", "chemical sunscreens", "chemicals", "chlorine", "cholesterol", "coatings", "corn fillers", "cottonseed oil", "dyes", "edta", "emulsifiers", "erythorbates", "expeller-pressed oils", "fillers", "fluoride", "formaldehyde", "fragrances", "grain", "hexane", "hormones", "hydrogenated oils", "kitniyos / kitniyot (legumes)", "lactose", "latex", "msg", "natural additives", "natural colors", "natural dyes", "natural flavors", "natural ingredients", "natural preservatives", "nitrates/nitrites", "omega fatty acids", "paba", "palm oil", "parabens", "pesticides", "petro chemical", "petrolatum", "petroleum byproducts", "phosphates", "phosphorus", "phthalates", "pits", "preservatives", "rbgh/bst", "rennet", "salicylates", "sea salt", "shells/ shell pieces", "silicone", "sles ( sodium laureth sulfate)", "sls ( sodium lauryl sulfate )", "stabilizers", "probiotics", "starch", "sulfates", "sulfides", "sulfites / sulphites", "sulfur dioxide", "synthetic additives", "synthetic colors", "synthetic dyes", "synthetic flavors", "synthetic fragrance", "synthetic ingredients", "synthetic preservatives", "synthetics", "thc / tetrahydrocannabinol", "toxic pesticides", "triclosan", "vegan ingredients", "vegetarian ingredients", "yeast", "yolks"]
// + NON_CERTIFIED_CLAIMS = ["100% natural", "100% natural ingredients", "100% pure", "acid free", "aeroponic grown", "all natural", "all natural ingredients", "aquaponic/aquaculture grown", "baked", "biodegradable", "cage free", "cold-pressed", "direct trade", "dolphin safe", "dry roasted", "eco-friendly", "farm raised", "filtered", "free range", "freeze-dried", "from concentrate", "grade a", "greenhouse grown", "heat treated", "heirloom", "homeopathic", "homogenized", "hydroponic grown", "hypo-allergenic", "irradiated", "live food", "low acid", "low carbohydrate", "low cholesterol", "macrobiotic", "minimally processed", "natural", "natural botanicals", "natural fragrances", "natural ingredients", "no animal testing", "no sulfites added", "non gebrokts", "non-alcoholic", "non-irradiated", "non-toxic", "not fried", "not from concentrate", "pasteurized", "pasture raised", "prairie raised", "raw", "responsibly sourced palm oil", "sprouted", "un-filtered", "un-pasteurized", "unscented", "vegetarian or vegan diet/feed", "wild", "wild caught"]
// + ALLERGEN_LIST=["corn", "crustacean shellfish", "dairy", "egg", "fish", "milk", "oats", "peanuts / peanut oil", "phenylalanine", "seeds", "sesame", "soy / soybeans", "tree nuts", "wheat"]

// Remember (important):
// + the provided images could contain or could not contain nutrition fact/supplement fact.
// + nutrition info must be visibly seen by human eyes not from other source data
// + do not provide data that you cannot see it by human eyes on provided images.

// Carefully examine the provided image and and created JSON output in given format:

// json
// {
//   "answerOfQuestionsAboutNutritionFact": "your answer gemini" (Do you see the whole nutrition fact panel on provided image? why? where is it on product?"),
//   "answerOfQuestionAboutNutritionFactTitle": "your answer gemini" (Do you see fully "Supplement Fact" title or "Nutrition Fact" title  on provided image ? ),
//   "answerOfQuestion": "your answer gemini" ( why do you  keep providing me the info that is not visibly seen on provided image? I only need info that you can see on provided image please do OCR text and check if your info add to JSON is correct),
//   "answerOfRemindQuestion": "your answer gemini"(The product images may include multiple languages; Could you please only provide information in English please, I do not want to see information in Spanish?)
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
//       "contain": string[],
//       "containOnEquipment": {"statement": string, "allergenList: string[] },
//       "freeOf": string[],
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
//       "packagingDescriptors": string[],
//       "recyclingAdvice": string[],
//       "forestStewardshipCouncilClaim": boolean,
//       "packaging_ancillaryInformation": string[],
//     },
//     "attributesAndCertifiers": {
//       "claims": {
//         "beeFriendly": {
//           "beeFriendly__Certifier": string,
//           "beeFriendlyClaim": boolean,
//         },
//         "bioBased": {
//           "bioBased__Certifier": string,
//           "bioBasedClaim": boolean,
//         },
//         "bioDynamic": {
//           "bioDynamic__Certifier": string,
//           "bioDynamicClaim": boolean
//         },
//         "gmp": {
//           "gmp__Certifier": string,
//           "gmpClaim": boolean
//         },
//         "glutenFree": {
//           "glutenFree__Certifier": string,
//           "glutenFreeClaim": boolean,
//         },
//         "italCertifiedSeal": {
//           "italCertifiedSeal__Certifier": string,
//           "italCertifiedSealClaim": boolean,
//         },
//         "italCertifiedConsious": {
//           "italCertifiedConsious__Certifier": string,
//           "italCertifiedConsiousClaim": boolean,
//         },
//         "kosher": {
//           "kosher__Certifier": string,
//           "kosherClaim": boolean,
//         },
//         "liveAndActiveCulture": {
//           "liveAndActiveCulture__Certifier": string,
//           "liveAndActiveCultureClaim": boolean,
//         },
//         "lowGlycemic": {
//           "lowGlycemic__Certifier": string,
//           "lowGlycemicClaim": boolean,
//         },
//         "npa": {
//           "npa__Certifier": string,
//           "npaClaim": boolean,
//         },
//         "newYorkStateGrownAndCertified": {
//           "newYorkStateGrownAndCertified__Certifier": string,
//           "newYorkStateGrownAndCertifiedClaim": boolean,
//         },
//         "nonGmo": {
//           "nonGmo__Certifier": string,
//           "nonGmoClaim": boolean
//         },
//         "organic": {
//           "organic__Certifier": string,
//           "organicClaim": boolean,
//         },
//         "glyphosateResidueFree": {
//           "glyphosateResidueFree__Certifier": string,
//           "glyphosateResidueFreeClaim": boolean,
//         },
//         "vegan": {
//           "vegan__Certifier": string,
//           "veganClaim": boolean, //hint - plant-based is not vegan claim
//         },
//         "plantBasedOrPlantDerived": {
//           "plantBasedOrPlantDerived__Certifier": string,
//           "plantBasedOrPlantDerivedClaim": boolean,
//         },
//       },
//       "containInfo": {
//         "attribute__contain": string[],
//         "attribute__doesNotContain": string[],
//       },
//       "otherClaims:{
//         "fatContentClaims": string[],
//         "saltOrSodiumClaims": string[],
//         "sugarAndSweetenerClaims": string[],
//         "highOrRichInOrExcellentSourceOf": string[],
//         "usdaInspectionMark": string,
//       },
//     },
//     "physical": {
//       "upc12": number,
//     },
//     "marketingAll": {
//       "marketingContents": string[],
//       "copyrightOrTradeMark": string,
//       "slogan": fstring,
//       "website": string,
//       "socialMedia": {
//         "socialList": string[],
//         "socialMediaText": string[],
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
//       "otherInstruction": string[],
//       "consumerStorageInstructions": string[],
//       "consumerStorageInstructions_debug": string,
//       "cookingInstructions": string[],
//       "usageInstructions": string[],
//     },
//   },
// }

// The Most Important rule:
// + Only get data that visibly seen by normal eyes not from other sources on internet
// + Remind again if you see fact panel just give detail data that could be seen by human eyes not from other source like internet.
// + Only get ingredients data that visibly seen by normal eyes not from other sources on internet.
// + Remind you again only provide the data visibly on provided image, and must be detected by human eyes not from other source on internet.

// Some definitions:
// 1) about the "Fact Panel"
// + is a list of nutrient or substance info
// + must have a Big Text like a Header such as "Nutrition Facts" or "Supplement Facts" visible on it
// + be careful when you (gemini) confirm to see something since curvature of container or cropped image can make content obscured.

// Some common rules:
// + "nutrients" is an array that usually start with some nutrients such as "Total Carbohydrate", "Vitamin A", ... Let's list nutrient from them first if possible.
// + Read "Fact Panel" from left to right and from top to bottom.
// + content in prompt can be similar to typescript and nodejs syntax.
// + be careful the last "nutrient row" could be misread to be a part of "footnote". Remember "footnote" content ususally about "Daily value" or "percent daily value" note.
// + do not return json in format [{product: {...}}] since the result is only for one product

// Some rules for you:
// 2) Notations like 'Includes 7g of Added Sugars' should be recorded as "name": "Added Sugars", "value": 7, "uom": "g".

// 3) The fact panel could be in the "dual-column" layout showing both "per serving" and "per container" information, or different "% Daily value" by age. Let's to break down and separate into two different fact panels one is for 'per serving'
// and other for 'per container' just if "amoutPerServing.name" of them are different or "servingSize" of them are different. These two fact panels have the same value of "servingPerContainer", "footnote', "ingredients", and "contain".

// 4) "factPanels.panelName":
// + if there is text on image contain "Nutrition Facts" or "Supplement Facts". If not it should be null

// 5) "servingSize":
// + if "servingSize" content contains the parentheses so "servingSize" format = servingSize.description + "("+ servingSize.value + servingSize.uom ")"
// + else "servingSize" format = servingSize.value + servingSize.uom
// Ex 1: "10 tablespoons(80g)" = {servingSize: {"description": "10 tablespoons", "value": "80", "uom": "g"}}
// Ex 2: "10 tablespoons" = {servingSize: {"value": 10, "uom": "tablespoons"}}

// 6) "footnote":
// + "footnote" must be the last part of fact panel (the note may contain some special characters from FOOTNOTE_INDICATORS),
// and usually start with "%Daily Value....", "Not a significant source...", or "the % daily value...".
// + "footnote" is only one section, and is not multiple sections.

// Ex 1: "**Not a significant source of saturated fat, trans fat. *Daily Value not established. = {footnote: {value :"**Not a significant source of saturated fat, trans fat. *Daily Value not established."}}
// Ex 2: "*Daily Value not established." = {footnote: {value: "*Daily Value not established."}}
// Ex 3: "†Daily Value not established." = {footnote: {value: "†Daily Value not established."}}
// Ex 4: "Not a significant source of saturated fat, trans fat." = {footnote:{value: "Not a significant source of saturated fat, trans fat."}}

// 7) "nutrients.footnoteIndicator":
// + "nutrients.footnoteIndicator" is a special symbol such as "*", "†" or is a group of special symbol such as "**" beside the nutrient percent value. Sometimes nutrient percent value is left empty but still have footnoteIndicator right there.

// 8) "amountPerServing.name":
// + is a text and usually stay above the "calories value number",
// Ex 1: "Per container", "Per serving"

// 9) "nutrient.quantityComparisonOperator" and "nutrient.dailyPercentComparisonOperator" rules:
// + "nutrient.quantityComparisonOperator" is a comparison operator at the left side of "nutrient.value" and "nutrient.uom"
// + "nutrient.dailyPercentComparisonOperator" is a comparison operator at the left side of "nutrient.percentDailyValue".
// + "nutrient.dailyPercentComparisonOperator" is not "nutrient.quantityComparisonOperator".
// Ex 1: "10g    <10%" = {quantityComparisonOperator: null, dailyPercentComparisonOperator: "<", ...}
// Ex 2: "<10g    10%" = {quantityComparisonOperator: "<", dailyPercentComparisonOperator: null, ...}
// Ex 3: "<10g    <10%" ={quantityComparisonOperator: "<", dailyPercentComparisonOperator: "<", ...}

// 10) "nutrients.quantityDescription":
// + is additional text right next to "nutrient.uom" and inside the parentheses, and does not include parentheses.
// Ex 1: "20mcg(800 IU)" = {quantityDescription: "800 IU"}
// Ex 2: "20mcg DFE(800mcg L-5-MTHF) = {quantityDescription: "800mcg L-5-MTHF"}

// 11) "ingredientsGroup.ingredients":
// + usually appear below or next to the nutrition panel and start right after a prefix text such as "ingredients:" or "Ingredients:" or "INGREDIENTS:" or "Other Ingredients:".
// + "ingredientsGroup.ingredients" must remove "prefix text" from its value if have
// Ex 1: "Ingredients: Flour, Eggs,"= {ingredients: "Flour, Eggs."}

// 12) "physical.upc12" rules:
// + extract possible "upc12" or "UPC-A" 's barcode number (with 12 digits)  of product from given image.
// + "physical.upc12" must have 12 digit number if you do not get enough 12 gigits just look around the nearest area you may find some missing digit number.
// + upc12 could be easily detected at the bottom of the barcode
// Ex 1: "0    33445   44421    5" =  {"upc12": "033445444215"}

// 13) "marketingAll" rules:
// a) "marketingAll.website":
// + find website link
// + website link exclude "nongmoproject.org"
// + be careful the content after slash could be phone number
// Ex 1: text "www.test.com/999.444.3344" should be recorded as {website: "www.test.com", ...} since the number after slash is phone number

// b) "marketingAll.socialMedia":
// + "socialMedia.socailList" is the name list of all social media info provided on product image such as facebook, pinterest, instagram, twitter, threads,... carefully check the social media logo/icon or social media link.
// keep asking yourself question like "Do I see Pinterest logo?" to find all social media methods and add to "socialMedia.socailList"
// + "socialMedia.socialMediaText" is a list of text usually start with "@" that can be used to search the product on social media. Hint, it is usually next to social media icons
// Ex: "@cocacola"

// c) "marketingContents" rules:
// + "marketingContents" is texts to introduce or marketing features or benefits of product, and usually appear on the front face of product or some marketing pharagraph to appeal customer.
// + there could be also marketing contents which are texts about nutrients appear on the main face of product to appeal customer to buy product

// d) "slogan" rules:
// + "slogan" is a highlight text to praise product.

// e) "copyrightOrTradeMarkOrRegistration" rules:
// + "copyrightOrTradeMarkOrRegistration" is trademark, copyright or registration statement of product may contain some symbols below:
// ™ - stands for a trademark;
// ® - stands for a registered trademark;
// © - stands for copyright.
// + the "copyrightOrTradeMarkOrRegistration" usually contain strings such as "...is/are registered trademark...", "copyright..."

// f) "enlargedToShow" rules:
// Ex: if statement such as "enlarged to show..." = {"enlargedToShowTexture": true}

// 15) "header" rules:
// a) "header.productName" :
// + extract possible name of product from given image.

// b) "header.brandName":
// + find brand name

// c) "header.primarySize" and "header.secondarySize" and "header.thirdSize" rules:
// + "header.primarySize" and "header.secondarySize" and "header.thirdSize" is a quantity measurement of product in two different unit of measurement
// + "primarySizeUom" and "secondarySizeUom" and "thirdSizeUom" is "Units of Liquid Measurement" (such as "Fl OZ", "L", ...) or "Weight Units of Measure" (such as "Gram", "Kg", ...)
// + "primarySizeUom" and "secondarySizeUom" and "thirdSizeUom" exclude "calories"
// Ex 1: "Net 3 Qt. (96 fl. oz.) 2.835L" should be recorded as
// {
//   "primarySize": {"primarySizeValue": 3, "primarySizeUom": "Qt." , "primarySizeText": "3 Qt." },
//   "secondarySize": {"secondarySizeValue": 96, "secondarySizeUom": "fl. oz." , "secondarySizeText": "96 fl. oz." },
//   "thirdSize": {"thirdSizeValue": 2.835, "thirdSizeUom": "L", "thirdSizeText": "2.835L" }
// }
// Ex 2: "64 FL OZ(2QTs) 1.89L" should be recorded as
// {
//   "primarySize": {"primarySizeValue": 64 , "primarySizeUom": "FL OZ" , "primarySizeText": "64 FL OZ"},
//   "secondarySize": {"secondarySizeValue": 2  , "secondarySizeUom": "QTs" , "secondarySizeText": "2QTs" }
//   "thirdSize": {"thirdSizeValue": 1.89  , "thirdSizeUom": "L" , "thirdSizeText": "1.89L" }
// }
// Ex 3: "Net WT 5.25 OZ 150g" should be recorded as
// {
//   "primarySize": {"primarySizeValue": 5.25 , "primarySizeUom": "OZ" , "primarySizeText": "5.25 OZ"},
//   "secondarySize": {"secondarySizeValue": 150  , "secondarySizeUom": "g" , "secondarySizeText": "150g" },
// }
// Ex 4: "22 - 2.52 OZ (73g) BARS NET WT 2.14 LB (800g)" should be recorded as
// {
//   "primarySize": {"primarySizeValue": 2.14 , "primarySizeUom": "LB" , "primarySizeText": "2.14 LB"},
//   "secondarySize": {"secondarySizeValue": 800  , "secondarySizeUom": "g" , "secondarySizeText": "800g" },
// }

// d) "header.count":
// + is the count number of smaller unit inside a packagge, or a display shipper, or a case, or a box.
// Ex: there are 15 cookies in the packages so {"count": 15}

// e) "header.sizeTextDescription":
// + is the whole quantity measurement description statement of the product on image. It is usually appear on the front face of product.

// 16) "packaging" rules:
// a) "containerMaterialType":
// + is the type of material is used to make the package such as "paper", "plastic", or "metal", ...

// b) "containerType":
// + is the type of package such as "box", "bottle", "bag", "tube", or "shrink wrapped"

// c) "packagingDescriptors"
// + is a list statements of packaing materials.

// d) "recyclingAdvice":
// + is a list statements related to recyling. They are statements to encourage consumer to recycle the box or container it is really an advice for recycling
// + is usually texts near recyling symbols
// + the statement could be written vertically next recyling logo
// Ex: found text "recycle this bottle" next to a recycling logo so it should be recorded as
// {
//   "recyclingAdvice": ["recycle this bottle"]
// }

// e) "forestStewardshipCouncilClaim":
// + return true if "forest stewardship council FSC" logo found

// f) "packaging_ancillaryInformation":
// + is a list of text
// + text could be the code near upc bar code
// Ex: "22222-22-A4433"

// 17) "allergen" rules:
// a) "allergen.contain" rules:
// + "allergen.contain" is a list of allergen ingredients could make customer allergen.
// + the list from enum ALLERGEN_LIST
// + "allergen.contain" list usually start after text "contain:", or "contain".
// Ex 1: "May contain milk" should be recorded as {"contain": ["milk"]}
// Ex 2: "Contain: Corn, Milk." should be recorded as {"contain": ["Corn", "Milk"]}

// b) "allergen.freeOf" rules:
// + "allergen.freeOf" is a list of allergen ingredients could make customer allergen that is stated as free from product.
// + the list only from enum ALLERGEN_LIST
// + "allergen.freeOf" list usually start after text "free of ..."
// Ex 1: "free of soy" should be recorded as {"freeOf": ["soy"]}
// Ex 2: "No Milk, Corn" should be recorded as {"freeOf": ["Milk", "Corn"]}

// c) "allergen.containOnEquipment" rules:
// + "containOnEquipment.allergenList" is a list of allergen ingredients on manufacturing equipments.
// + "containOnEquipment.statement" is the context about manufacturing equipment contain allergen ingredient list.

// 18) "nutrients" rules:
// a) "nutrients.descriptor" rules:
// + "nutrients.descriptor" could be the text that is intended and appear on the row below a nutrient.
// + "nutrients.descriptor" could also be the text inside the parentheses right next to "nutrients.name"
// + sometimes nutrients could be put vertically and separated by • symbol and • symbol is not the 'nutrients.footnoteIndicator'

// b) "nutrients.name" rule:
// + "nutrients.name" is a name of nutrient sometimes include the text closed inside the parentheses.
// + "nutrients.name" sometimes start with a special symbol or its name is bold and maybe a note just like name of an ingredient
// Ex 1: "Vitamin K2(as Naturally Derived MK-7 [Menaquinone-7)" should be recorded as {"name": "Vitamin K2", "descriptor": "as Naturally Derived MK-7 [Menaquinone-7": ,...}
// Ex 2: "Medium Chain Triglyceride (MCT) Oil" should be recorded as {"name": "Medium Chain Triglyceride (MCT) Oil", ...}

// c) "nutrients.uom" rules:
// + some possible "nutrients.uom" such as "MCG DFE"

// 19) "amountPerServing.name" rules:
// + is a text and usually stay above the "calories value number".
// + "amountPerServing.name" could be a text below "%Daily Value" Header such as "for children...", or "for aldults..."
// Ex 1: "Per container", "Per serving"

// 20) "supplyChain":
// +  "supplyChain.countryOfOrigin" is the country name in where product was made. Ex: "USA".

// 21) "instructions" rules:
// a) "instructions.otherInstruction" is a list of text that guide user to do something.
// Ex: "read instruction for...", "see nutrition fact for..."

// b) "consumerStorageInstructions_debug": tell me why you give the value? where is the value? why you put translated content from spanish to value ? is see "KEEP IN A COOL, DRY PLACE" twice. Do you see it twice in english? tell me where you found them ?

// 22) "attributesAndCertifiers" rules:
// a) "attributesAndCertifiers.claims" rules:
// + for "attributesAndCertifiers.claims" gemini you are allowed to access the external source from internet to verfiy if detected "certified logo" is valid. Some product may use a logo for a claim but it could be invalid "certified logo"
// + field name with format string__Certifier such as  "nonGmo__Certifier", "npa__Certifier",... please give these field the name of certifier from detected "certifier logo" which is visibly seen by human eye on provided image.
// Ex 1: The Non-GMO valid certifier is visibly seen by human eyes on the provided image so it should be recorded as
// {
//   "nonGmo": {
//     "nonGmo__Certifier": "gemini return the name of Certifier",
//     "nonGmoClaim": true
//   }
// }
// Ex 2: If you see statement like "Non-gmo" but do not found the "Non-GMO" certifier logo on the image so it should be recorded as
// {
//   "nonGmo": {
//     "nonGmo__Certifier": null,
//     "nonGmoClaim": true
//   }
// }

// b) "attributesAndCertifiers.containInfo.attribute__contain":
// + is a list thing that cotain in product
// + the list from enum ATTRIBUTE_CONTAIN_LIST

// c) "attributesAndCertifiers.containInfo.attribute__doesNotContain":
// + is a list thing that does not cotain in product
// + the list from enum ATTRIBUTE_CONTAIN_LIST

// d)"attributesAndCertifiers.otherClaims.highOrRichInOrExcellentSourceOf":
// + is the list of the text such as "Rich in Vitamin D", "Excellent Source of Vitamin D", "High Vitamin D",.. the text that emphasize that product have something in high amount and found on provided image even it could be found in "marketingContents"
// Ex 1: texts "high protein" and "rich in vitamin D" found should be recorded as {"highOrRichInOrExcellentSourceOf": ["high protein", "rich in vitamin D"]}

// e) "attributesAndCertifiers.otherClaims.fatContentClaims":
// + is string array from enum FAT_CONTAIN_CLAIM
// + text "0g trans fat", or "0 Gram trans fat" found so recorded as {"fatContentClaims": ["zero gram trans fat per serving"]},

// f) "attributesAndCertifiers.otherClaims.saltOrSodiumClaims":
// + is string array from enum SALT_OR_SODIUM_CLAIMS
// + text "low sodium" found so recorded as {"saltOrSodiumClaims": ["low sodium"]}

// g) "attributesAndCertifiers.otherClaims.sugarAndSweetenerClaims" rules:
// + is string array from enum SUGAR_AND_SWEET_CLAIMS
// + text "no sugar alcohol" found so recorded as {"sugarAndSweetenerClaims": ["no sugar alcohol"]}

// h) attributesAndCertifiers.otherClaims.usdaInspectionMark":
// + if USDA inspection mark found on provided image, return full words on that inspection mark
// `;

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
  "answerOfQuestion": "your answer gemini" ( why do you  keep providing me the info that is not visibly seen on provided image? I only need info that you can see on provided image please compare with OCR texts and check if your info add to JSON is correct),
  "answerOfRemindQuestion": "your answer gemini" (The product images may include multiple languages; Could you please only provide information in English please, I do not want to see information in Spanish?),
  "answerOfFoundBug": "your answer gemini" (Why you include translated content in JSON?),
  "product": {
    "certifierAndLogo":"your answer gemini" (help me list all certifiers logo(such as kosher U pareve, ...) and usda inspection marks on provided image),
    "readAllConstants": "your answer gemini"(please help me read carefully all constant above carefully. they are important and will be used to create the json output. And answer me did you read them?"),
    "ingredientsGroup": [{"ingredients": string[]}],
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
      "marketingContents": string[],
      "copyrightOrTradeMark": string,
      "slogan": fstring,
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
1) "ingredientsGroup.ingredients":
+ usually appear below or next to the nutrition panel and start right after a prefix text such as "ingredients:" or "Ingredients:" or "INGREDIENTS:" or "Other Ingredients:".
+ "ingredientsGroup.ingredients" must remove "prefix text" from its value if have
Ex 1: "Ingredients: Flour, Eggs,"= {ingredients: "Flour, Eggs."}

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

c) "marketingContents" rules:
+ "marketingContents" is texts to introduce or marketing features or benefits of product, and usually appear on the front face of product or some marketing pharagraph to appeal customer.
+ there could be also marketing contents which are texts about nutrients appear on the main face of product to appeal customer to buy product

d) "slogan" rules:
+ "slogan" is a highlight text to praise product.

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
+ is the list of the text such as "Rich in Vitamin D", "Excellent Source of Vitamin D", "High Vitamin D",.. the text that emphasize that product have something in high amount and found on provided image even it could be found in "marketingContents"
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

// "answerOfValidator": "your answer gemini" (
//   Can you tell me what you see from provided image?
//   What is the first three nutrients in the nutrition fact panel exclude "calories"?
//   the nutrient list order should be start from these item try to read from top to bottom and left to right of the nutrition fact.
//   Is the nutrient list in the nutrition fact panel too long so it split to left and right side?),

// "answerOfDebug": "your answer gemini" (could you help me list all footnote indicator of total sugars?),
// "answerOfDebug2":"your answer gemini" (i see two nutrition fact panel on iamges. Could you tell me total sugars info of two panel (include quantity and daily percent value) ?"),
// "answerOfDebug_4": "your answer gemini" (Do you think food blend is nutrient? and why?),
// "answerOfDebug_3": "your answer gemini" (why i see you keep adding last nutrient to "footnote" field? remember "footnote" does not contain specific information about quantiy in weight or amout (ex: 400g, or 250ml,..)),
// "answerOfDebug_6": "your answer gemini" (Are you sure you see that total fat have percent daily value of 0%?),
// "answerOfDebug_5": "your answer gemini" (tell me amount per serving name you see?),

export const make_nut_prompt = ({
  ocrText,
  imageCount,
}: {
  ocrText?: string;
  imageCount?: number;
}) => {
  return `
  Some common constants:
  + FOOTNOTE_INDICATORS = ["*", "**", "†", "★★", "★"]
  
  OCR texts from ${imageCount} provided images:
  ${ocrText}
  
  Remember (important):
  + the provided images could contain or could not contain nutrition fact/supplement fact.
  + nutrition info must be visibly seen by human eyes not from other source data
  + do not provide data that you cannot see it by human eyes on provided images.
  
  Carefully examine the provided image and and created JSON output in given format:
  
  json
  {
    "validatorAndFixBug": {
      "answerOfQuestionsAboutNutritionFact": your answer gemini (Do you see nutrition facts panel on provided images? why? where is it on product?"),
      "answerOfQuestionAboutNutritionFactTitle": your answer gemini (Do you see fully "Supplement Fact" title or "Nutrition Fact" title  on provided images ? ),
      "answerOfQuestionAboutValidator": your answer gemini ( why do you  keep providing me the info that is not visibly seen on provided image? I only need info that you can see on provided image please compare with OCR texts and check if your info add to JSON is correct),
      "answerOfQuestionAboutLanguage": your answer gemini (The product images may include multiple languages; Could you please only provide information in English please, I do not want to see information in Spanish? The OCR text result could contain spanish so do not provide me those information in spanish),
      "answerOfDebug": your answer gemini (why i see you keep adding spanish to "footnote" field?),
      "answerOfDebug_2": your answer gemini (why i see you keep adding 0% of percent daily value to trans fat or total sugars? trans fat, and total sugars do not have percent daily value),
      "answerOfDebug_3": your answer gemini (why i see you keep removeing the mix of ingredients out of nutrients list ? remember nutrient could be also an ingredient, or a mix of ingredient, or a blend of something)),
      "answerOfDebug_4": your answer gemini (help me list all nutrients with their quantity and oum, and percent daily value as well as a long string here at this field "answerOfDebug_4". Please combine the given OCR text and what you see to make sure the result is correct),
      "answerOfDebug_5": your answer gemini (Why you put content like "(as ...)" beside nutrient name to nutrient_sub_ingredients? They are only considered as "nutrients.descriptor"),
      "answerOfDebug_6": your answer gemini (Why you keep add multiple sub-ingredients into one "nutrient_sub_ingredients.info"? Please record as an array of "nutrient_sub_ingredients" for sub-ingredients those separated by comma?),
      "answerOfDebug_7": your answer gemini (why you do not recognize sub-ingredients? some nutrients with intended ingredients rows below obviously have sub-ingredients, sometimes multiple sub-ingredients could be written in the same row but should be recorded separately.),
      "end": true,
    },
    "product": {
      "readAllConstants": your answer gemini (please help me read carefully all constant above carefully. they are important and will be used to create the json output. And answer me did you read them?),
      "factPanels":null or [
        {
          "panelName": string ,
          "amountPerServing": {"percentDailyValueFor": string?},
          "calories": {"value": float?, "uom": "calories"}
          "servingSize": {
            "description": string?, 
            "value": number, 
            "uom": string,
          },
          "servingPerContainer":" {"value": float? or number?, "uom": string},
          "nutrients": [
            {
              "name": string, 
              "descriptor": string,
              "nutrient_sub_ingredients": [{
                "info": string,
              },...],
              "quantityComparisonOperator": string?, value: float?, uom: string, 
              "quantityDescription": string?,
              "dailyPercentComparisonOperator": string?, 
              "percentDailyValue": float?,  
              "footnoteIndicator": string?, // value must be choosen from FOOTNOTE_INDICATORS,
            }
          ],
          "footnote": string
        }
      ],
    },
  }

The Most Important rule:
+ Only get data that visibly seen by normal eyes not from other sources on internet
+ Remind again if you see fact panel just give detail data that could be seen by human eyes not from other source like internet.
+ Only get ingredients data that visibly seen by normal eyes not from other sources on internet.
+ Remind you again only provide the data visibly on provided image, and must be detected by human eyes not from other source on internet.

Some definitions:
1) about the "Fact Panel"
+ is a list of nutrient or substance info
+ must have a Big Text like a Header such as "Nutrition Facts" or "Supplement Facts" visible on it
+ be careful when you (gemini) confirm to see something since curvature of container or cropped image can make content obscured.

Some common rules:
+ "nutrients" is an array that usually start with some nutrients such as "Total Carbohydrate", "Sugar", "Vitamin A", ... Let's list nutrient from them first if possible.
+ each "nutrients" is separated by a thin line on nutrition fact panel.
+ "nutrients" and "footnote" are also separated by a line on nutrition fact panel.
+ Read "Fact Panel" from left to right and from top to bottom.
+ content in prompt can be similar to typescript and nodejs syntax.
+ be careful the last "nutrient row" could be misread to be a part of "footnote". Remember "footnote" content ususally about "Daily value" or "percent daily value" note.
+ do not return json in format [{product: {...}}] since the result is only for one product

Nutrient rule:
1) sometimes nutrients could be put vertically and separated by • symbol and • symbol is not the 'nutrients.footnoteIndicator'

2) some nutrients such as ("Total Carbohydrate", "total sugar", "Includes... Added Sugars", ...) and they are must be separated nutrients

2) Each nutritional line's values must stay unique. Do not interchange numbers between lines or make false inferences. For instance, "total sugar 18g, included 5g added sugar 4%," should create two objects: one as "name": "total sugar", "value": 18, "uom": "g", "percentDailyValue": null, and another as "name": "added sugar", "value": 5, "uom": "g", "percentDailyValue": 14%.

4) The nutrition fact panel could be in the "dual-column" layout showing both "per serving" and "per container" information, or different "% Daily value" by age. Let's to break down and separate into two different fact panels one is for 'per serving'
and other for 'per container' just if "amoutPerServing.percentDailyValueFor" of them are different or "servingSize" of them are different. These two fact panels have the same value of "servingPerContainer", "footnote', "nutrients" but each "nutrients" could have different "footnoteIndicator".

5) "factPanels.panelName":
+ if there is text on image contain "Nutrition Facts" or "Supplement Facts". If not it should be null

6) "nutrients.servingSize":
+ if "nutrients.servingSize" content contains the parentheses so "servingSize" format = servingSize.description + "("+ servingSize.value + servingSize.uom ")" 
+ else "nutrients.servingSize" format = servingSize.value + servingSize.uom
Ex 1: "10 tablespoons(80g)" = {servingSize: {"description": "10 tablespoons", "value": 80, "uom": "g"}}
Ex 2: "10 tablespoons" = {servingSize: {"value": 10, "uom": "tablespoons"}}
Ex 3: "10 bars(200g)" = {servingSize: {"description": "10 bars", "value": 200, "uom": "g"}}
Ex 4: "10 cups(10 ml)" = {servingSize: {"description": "10 cups", "value": 10, "uom": "ml"}}

7) "footnote":
+ "footnote" must be the last part of fact panel (the note may contain some special characters from FOOTNOTE_INDICATORS),
and usually start with "%Daily Value....", "Not a significant source...", or "the % daily value...".
+ "footnote" is only one section, and is not multiple sections.
+ "footnote" may contain multiple languages. Please only provide "footnote" in english only. Do not include spanish text on footnote 

Ex 1: "**Not a significant source of saturated fat, trans fat. *Daily Value not established. = {footnote: {value :"**Not a significant source of saturated fat, trans fat. *Daily Value not established."}}
Ex 2: "*Daily Value not established." = {footnote: "*Daily Value not established."}
Ex 3: "†Daily Value not established." = {footnote: "†Daily Value not established."}
Ex 4: "Not a significant source of saturated fat, trans fat." = {footnote: "Not a significant source of saturated fat, trans fat."}

8) "nutrients.footnoteIndicator":
+ "nutrients.footnoteIndicator" is a special symbol such as "*", "†" or is a group of special symbol such as "**" beside the nutrient percent value. Sometimes nutrient percent value is left empty but still have footnoteIndicator right there.

9) "amountPerServing.percentDailyValueFor" rules:
+ "amountPerServing.percentDailyValueFor" is a text and usually stay above the "calories value number".
+ "amountPerServing.percentDailyValueFor" could be also a text below "%Daily Value" title or below "%DV" title such as "for children...", or "for aldults..."
Ex 1: "Per container" = {amountPerServing: {percentDailyValueFor: "Per container"}}
Ex 2: "Per serving" = {amountPerServing: {percentDailyValueFor: "Per serving"}}
Ex 3: "%dv for children > 18 years" = {amountPerServing: {percentDailyValueFor: "for children > 18 years"}}
Ex 4: "%dv for adults" = {amountPerServing: {percentDailyValueFor: "for adults"}}

10) "nutrient.quantityComparisonOperator" and "nutrient.dailyPercentComparisonOperator" rules:
+ "nutrient.quantityComparisonOperator" is a comparison operator at the left side of "nutrient.value" and "nutrient.uom"
+ "nutrient.dailyPercentComparisonOperator" is a comparison operator at the left side of "nutrient.percentDailyValue".
+ "nutrient.dailyPercentComparisonOperator" is not "nutrient.quantityComparisonOperator".
Ex 1: "10g    <10%" = {quantityComparisonOperator: null, dailyPercentComparisonOperator: "<", ...}
Ex 2: "<10g    10%" = {quantityComparisonOperator: "<", dailyPercentComparisonOperator: null, ...}
Ex 3: "<10g    <10%" ={quantityComparisonOperator: "<", dailyPercentComparisonOperator: "<", ...}

11) "nutrients.quantityDescription":
+ is additional text right next to "nutrient.uom" and inside the parentheses, and does not include parentheses.
Ex 1: "20mcg(800 IU)" = {quantityDescription: "800 IU"}
Ex 2: "20mcg DFE(800mcg L-5-MTHF) = {quantityDescription: "800mcg L-5-MTHF"}

12) "nutrients.descriptor" rules:
+ "nutrients.descriptor" is the text inside the parentheses right next to "nutrients.name"

13) "nutrients.nutrient_sub_ingredients" rules:
+ "nutrients.nutrient_sub_ingredients" is the list of sub-ingredient below nutrient name (nutrient is usually blend, mix, compled, or a complex substance)
Ex1 :  "Banana, Grape(from juice), Apple" = [{"info": "Banana",...}, {"info": "Grape(from juice)",...}, {"info"": "Apple",...}]


15) "nutrients.name" rule:
+ "nutrients.name" is a name of nutrient sometimes include the text closed inside the parentheses.
+ "nutrients.name" sometimes start with a special symbol or its name is bold and maybe a note just like name of an ingredient
Ex 1: "Vitamin K2(as Naturally Derived MK-7 [Menaquinone-7)" should be recorded as {"name": "Vitamin K2", "descriptor": "as Naturally Derived MK-7 [Menaquinone-7": ,...}
Ex 2: "Medium Chain Triglyceride (MCT) Oil" should be recorded as {"name": "Medium Chain Triglyceride (MCT) Oil", ...} 

16) "nutrients.uom" rules:
+ some possible "nutrients.uom" such as "MCG DFE"

17) "nutrients.percentDailyValue"
+ could be null or empty. if its value is empty or null just left it value "null"
+ nutrient "trans fat" do not have "percent daily value" and its "nutrients.percentDailyValue" must be null 
Ex 1: "100g 10%" should be recorded as {"percentDailyValue": 10, ...}
Ex 2: "100g    " should be recorded as {"percentDailyValue": null, ...}
Ex 2: "1g  <1%" should be recorded as {"percentDailyValue": 1, ...}

18) nutrient of "added sugars" rules": 
Ex 1: 'Includes 7g of Added Sugars' = {"name": "Added Sugars", "value": 7, "uom": "g",...}

`;
};
