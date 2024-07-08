// | extra item | is mentioned on product ?  | mentioned on which text on product ? | do you know it through which source of info ? (answer are  "ingredient list"/ "marketing text on product"/ "nutrition fact"/ "others") (multiple string) | product contain it ? (answer is yes/no) |
// MARKETING_TEXT_TABLE

// 10) "marketing text table" rules:
// + is the list of all texts or paragraphs to marketing for products that appeal customer to buy

// IMPORTANT DEFINITIONS:
// + "added color" is not "artificial color".
// + "vegan" is not mean "vegan ingredients".
// + "natural" is not mean "natural ingredients".
// + "gluten free" is not mean "allergen".
// + "Gluten Free" is not mean "colors".
// + "real ingredient" not mean "natural flavor" or "naturally flavored".
// + "pesticide" is not mean "antibiotics".
// + "Organic" not mean "no animal ingredients"
// + "vegan certifier" not mean "vegan ingredient"
// + "international ingredients" not mean "chemical ingredient"
// + "allergen" claim detected from text such as "allergen free", "do not contain allergen", "product contain allergen", ...

// CONDITION FOR ROW TO SHOW IN TABLE BELOW:
// + only return row items that its "sugar item explicitly and directly state in a text on product  without implying from other text" value = "yes" and remove all unqualified rows from table)

// CONDITION FOR ROWS TO SHOW FOR TABLE BELOW:
// + only return row items if its answer of "item explicitly and directly state in a text on product  without implying from other text" = "yes" and remove all unqualified rows from table below

// + "ingredient break-down" is the break-down list of ingredients statement. Remember that sub-ingredients in the parenthesis or bracket of main ingredient item is recorded as one ingredient item info.
// Ex1: "STARCH (TAPIOCA, POTATO, CORN)" is an ingredient item in the list

export const make_markdown_all_prompt = ({
  ocrText,
  imageCount,
}: {
  ocrText?: string;
  imageCount?: number;
}) => {
  return `OCR texts from ${imageCount} provided images:
${ocrText}

VALIDATION AND FIX BUGS:
1) To avoid any deduction and ensure accuracy, if the product explicitly states that it "does not contain [specific ingredient]" or "is free from [specific ingredient]". Do not infer or deduce information from similar phrases. For example, if the product says "free from artificial flavors," do not assume it also means "does not contain added flavors." Only report what the text directly states.

2) Only be using the information explicitly provided in the product images and not drawing conclusions based on the ingredient list. I will focus on directly extracting product claims from the text on the packaging and avoid making deductions based on the presence or absence of specific ingredients.
Ex 1: if product have something in ingredient list. That cannot conclude that product claim to have this thing. Claim must be a statement or texts on the packaging make claim on a thing.

3) "NON GMO Project VERIFIED" does not claim "not fried". It is about non-GMO food and products.

4) Product info could contain multiple languages info. Only return provided info in english.

5) Only return all markdown tables that i require you to return.

6) There are some tables that i require return row items with specific given condition. Please check it carefully.

7) you keep return only 10 or 11 digits for upc-12. It is wrong. 

8) text such as "Contain: ...", "Free of ...", ... are "marketing text on product".

9) all table names must be in capital letters.

10 "gluten" is not allergen.

11) Each table have its own assert item list or claim list. Do not interchange item/claim between tables.

12) inferred info is not accepted for claim:
Ex: you are not allow to infer "no animal ingredients" from "organic certifier"

13) result must be in order and include all tables below
SUGAR_CLAIM_TABLE
FAT_CLAIM_TABLE
PROCESS_CLAIM_TABLE
CALORIE_CLAIM_TABLE
SALT_CLAIM_TABLE
FIRST_EXTRA_CLAIM_TABLE
SECOND_EXTRA_CLAIM_TABLE
THIRD_EXTRA_CLAIM_TABLE
ALLERGEN_TABLE
HEADER_TABLE
INGREDIENT_TABLE
PHYSICAL_TABLE
MARKETING_TABLE
INSTRUCTION_TABLE
SUPPLY_CHAIN_TABLE

without any number like 1) or 2) before table names

IMPORTANT RULES:
1) return result rules:
+ just only return table with table header and table row data. do not include any other things in the output.

2) "allergen" rules:
+ below is the standardized allergen list: 
"corn"
"crustacean shellfish"
"dairy"
"egg"
"fish"
"milk"
"oats"
"peanuts / peanut oil"
"phenylalanine", "seeds"
"sesame"
"soy / soybeans"
"tree nuts"
"wheat".

+ "allergen does-not-contain statement" is the exact context that you found on provided images about allergen info, that product claim not to contain.
Ex 1: "non-dairy" text mean does not contain allergen ingredient of "dairy"

+ "allergen contain statement" is the exact context that you found on provided images about allergen info, ususally start with "contains", "contains:", "may contains:", ....

+ "allergen contain on equipment statement" is the exact context that you found on provided images about list of allergen ingredients that is said they may be contained in/on manufacturing equipments.
ex 1: "manufactured on equipment that also processes product containing ..."
ex 2: "made in a facility that also processes ... "

+ "allergen break-down list" is a string list
ex 1: "oats, milk"

3) "SUGAR_CLAIM_TABLE" rules:
+ "how product state about it ?" only have return exact answers such as "free of", "free from", "made without", "no contain", "contain", "lower", "low", "0g", "zero", "other", "does not contain".

4) "header" table rules:
+ header table only have 1 row item so you must carefully examine the images.
+ "primary size" and "secondary size" and "third size" is a quantity measurement of product in two different unit of measurement. They are not info from "serving size" in nutrition fact.
Ex: "primary size" = "100gram"
+ "count" is the count number of smaller unit inside a package, or a display shipper, or a case, or a box.
+ "full size text description" is the whole quantity measurement description statement of the product on image. It is usually appear on the front face of product.
Ex: "Net WT 9.28oz(260g) 10 cups"

5) "ingredient" table rules:
+ is the list of statements about ingredients of product (since product can have many ingredients list)
+ "ingredient statement" is content start right after a prefix text such as "ingredients:" or "Ingredients:" or "INGREDIENTS:" or "other ingredients:".
+ "ingredient break-down list" is the list of ingredient in ingredient statement split by ", "

6) "marketing" table rules:
+ "youtube icon type" have 2 types (answer is type_1/type_2)
type_1 is youtube icon have two text "you" and "tube" on it.
type_2 is youtube icon of youtube logo with play button without text

+ "social media list" is the list of social media method mentioned on product images (such as "facebook", "google", "instagram", "pinterest", "snapchat", "tiktok", "youtube", "twitter", ...).
+ "website list" are all website links found on product (website link exclude "nongmoproject.org") and be careful the content after slash could be phone number.
Ex 1: www.cocacola.com, www.cocacola.com/policy, www.cocacola.com/fanpage, cocacola.com

+ "social media text" is a list of text usually start with "@", or "#" those can be used to search the product on social media. Hint, it is usually next to social media icons.
+ "enlarge to show" is true if statement such as "enlarged to show..." seen on product image.

7) "physical" rules:
+ "upc-12 or gtin-12" is a code contain 12 digit numbers, it usually appear on product image with structure that have 10 digit numbers at between two other digit numbers.
Ex: "0   4562342221   5" as you can see there are two digit numbers at the start is 0 and at the end is 5. And the "upc-12 or gtin-12" here = 045623422215

8) "instruction" table rules:
+ "other instruction" such as
ex 1: "best if consumed ..."
ex 2: "use it with lemon..."

+ "storage instruction" such as "keep refrigerated"

+ "usage instructions"
Ex 1: "suggested use: 2 cups at one time."

+ "usage time instruction / freeze by instruction" such "use by a time", "use within a time", "use before a time"
Ex 1: "use within 30 days ..."
Ex 2: "freeze after open ..."

9) "supply chain" table rules:
+ "country of origin text" example
Ex 1: "manufactured in Canada"
Ex 2: "made in Brazil"

+ "country of origin" example
Ex 1: "Canada"
Ex 2: "Brazil"

+ "manufacture name"
Ex 1: "MANUFACTURED IN A CGMP CERTIFIED FACTORY FOR AMAZON".

+ "distributed by" usually include address of distributor and text "distributed by".
Ex 1: "distributed by: boiron inc. newtown square, PA 19073"

RESULT THAT I NEED:
Carefully examine provided images above. They are captured images of one product, and return info from provided images that match all listed requirements and rules above with all markdown tables format below:

1) SUGAR_CLAIM_TABLE info recorded in markdown table format below:

IMPORTANT NOTE:
+ only process with provided sugar items below.
+ "not too sweet" not mean a sugar claim.

SUGAR_CLAIM_TABLE
| sugar item | sugar item explicitly and directly state in a text on product  without implying from other text? (answer is yes/no/unknown) | How product state about it ?  | do you know it through which info ? (answer are "ingredient list"/ "nutrition fact"/ "marketing text on product"/ "others") (answer could be multiple string from many sources) | how do you know ? |
| ------- | -------- | ------- | ------- | ------- |
| acesulfame k |
| acesulfame potassium |
| agave |
| allulose |
| artificial sweetener |
| aspartame |
| beet sugar |
| cane sugar |
| coconut sugar |
| coconut palm sugar |
| fruit juice |
| corn syrup |
| high fructose corn syrup |
| honey |
| low sugar |
| lower sugar |
| monk fruit |
| natural sweeteners |
| added sugar |
| refined sugars |
| saccharin |
| splenda/sucralose |
| splenda |
| sucralose |
| stevia |
| sugar |
| sugar added |
| sugar alcohol |
| tagatose |
| xylitol |
| reduced sugar |
| sugar free |
| unsweetened |
| xylitol |

2) FAT_CLAIM_TABLE info of product images recorded in markdown table format below:

CONDITION FOR ROW TO SHOW IN TABLE BELOW: 
+ only return row items if its answer of "does product claim that fat claim" value = "yes" and remove all rows with "does product claim that fat claim" value = "unknown" or "no" )

FAT_CLAIM_TABLE
| fat claim | does product claim that fat claim? (answer are yes/no/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are "ingredient list"/ "nutrition fact"/ "marketing text on product"/ "others") (answer could be multiple string from many sources) | how do you know that ? and give me you explain (answer in string) |
| ------- | -------- | -------- | -------- |
| is fat free | ...
| is free of saturated fat | ...
| is low fat | ...
| is low in saturated fat | ...
| have no fat | ...
| have no trans fat | ...
| is reduced fat | ...
| is trans fat free | ...
| have zero grams trans fat per serving | ...
| have zero trans fat | ...

3) PROCESS_CLAIM_TABLE info recorded in markdown table format below:

CONDITION FOR ROW TO SHOW IN TABLE BELOW: 
+ only return row items that its "does product explicitly claim this claim" value = "yes" and remove all rows with "does product explicitly claim this claim" value = "unknown" or "no")

PROCESS_CLAIM_TABLE
| other claim | does product explicitly claim this claim? (answer are yes/no/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are "ingredient list"/ "nutrition fact"/ "marketing text on product"/ "others") (answer could be multiple string from many sources) | how do you know that ? and give me you explain (answer in string) |
| ------- | -------- | -------- | -------- |
| 100% natural | ...
| 100% natural ingredients | ...
| 100% pure | ...
| acid free | ...
| aeroponic grown | ...
| all natural | ...
| all natural ingredients | ...
| aquaponic/aquaculture grown | ...
| baked | ...
| biodegradable | ...
| cage free | ...
| cold-pressed | ...
| direct trade | ...
| dolphin safe | ...
| dry roasted | ...
| eco-friendly | ...
| farm raised | ...
| filtered | ...
| free range | ...
| freeze-dried | ...
| from concentrate | ...
| grade a | ...
| greenhouse grown | ...
| heat treated | ...
| heirloom | ...
| homeopathic | ...
| homogenized | ...
| hydroponic grown | ...
| hypo-allergenic | ...
| irradiated | ...
| live food | ...
| low acid | ...
| low carbohydrate or low-carb | ...
| low cholesterol | ...
| macrobiotic | ...
| minimally processed | ...
| natural | ...
| natural botanicals | ...
| natural fragrances | ...
| natural ingredients | ...
| no animal testing | ...
| no sulfites added | ...
| non gebrokts | ...
| non-alcoholic | ...
| non-irradiated | ...
| non-toxic | ...
| not fried | ...
| not from concentrate | ...
| pasteurized | ...
| pasture raised | ...
| prairie raised | ...
| raw | ...
| responsibly sourced palm oil | ...
| sprouted | ...
| un-filtered | ...
| un-pasteurized | ...
| unscented | ...
| vegetarian or vegan diet/feed | ...
| wild | ...
| wild caught | ...

4) CALORIE_CLAIM_TABLE info recorded in markdown table format below:

CONDITION FOR ROW TO SHOW FOR TABLE BELOW: 
+ only return row items that its "does product explicitly claim the calorie claim" value = "yes" and remove all rows with "does product explicitly claim the calorie claim" value = "unknown" or "no")

CALORIE_CLAIM_TABLE
| calorie claim | does product explicitly claim the calorie claim? (answer are yes/no/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are "ingredient list"/ "nutrition fact"/ "marketing text on product"/ "others") (answer could be multiple string from many sources) |
| ------- | -------- | -------- |
| have low calorie | ...
| have reduced calorie | ...
| have zero calorie | ...

5) SALT_CLAIM_TABLE info recorded in markdown table format below:

CONDITION FOR ROW TO SHOW FOR TABLE BELOW: 
+ only return row items that its "does product explicitly claim this claim" value = "yes" and remove all rows with "does product explicitly claim this claim" value  = "unknown" or "no" )

SALT_CLAIM_TABLE
| salt claim | does product explicitly claim this claim? (answer are yes/no/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are "ingredient list"/ "nutrition fact"/ "marketing text on product"/ "others") (answer could be multiple string from many sources) |
| ------- | -------- | -------- |
| lightly salted | ...
| low sodium | ...
| no salt | ...
| no salt added | ...
| reduced sodium | ...
| salt free | ...
| sodium free | ...
| unsalted | ...
| very low sodium | ...

6) FIRST EXTRA CLAIM TABLE info recorded in markdown table format below:

IMPORTANT NOTE:
+ "artificial color" DO NOT mean "added color"
+ "artificial flavor", "chemical flavors" DO NOT mean "added flavor"
 
FIRST_EXTRA_CLAIM_TABLE
| extra item | item explicitly and directly state in a text on product  without implying from other text? (answer is yes/no/unknown) | How product state about it ? (return short answer like "free from" / "made without" / "no contain" / "contain" / "free of" / "no" / "other") |  do you know it through which info ? (answer are  "ingredient list"/ "marketing text on product"/ "nutrition fact"/ "NA") (answer could be multiple string since the info can appeared in multiple sources) | how do you know ? |
| ------- | -------- | ------- | ------- | ------- |
| additives | ...
| artificial additives | ...
| chemical additives | ...
| synthetic additives | ...
| natural additives | ...
| added colors | ...
| artificial colors | ...
| chemical colors | ...
| synthetic colors | ...
| natural colors | ...
| dyes | ...
| added dyes | ...
| artificial dyes | ...
| chemical dyes | ...
| synthetic dyes | ...
| natural dyes | ...
| added flavors | ...
| artificial flavors | ...
| chemical flavors | ...
| synthetic flavors | ...
| natural flavors | ...
| naturally flavored | ...
| added fragrances | ...
| artificial fragrance | ...
| chemical fragrances | ...
| synthetic fragrance | ...
| preservatives | ...
| added preservatives | ...
| artificial preservatives | ...
| chemical preservatives | ...
| synthetic preservatives | ...
| natural preservatives | ...
| artificial ingredients | ...
| chemical ingredients | ...
| synthetic ingredients | ...
| natural ingredients | ...
| animal ingredients | ...
| chemical sunscreens | ...
| animal by-products | ...
| animal derivatives | ...
| animal products | ...
| animal rennet | ...
| antibiotics | ...
| added antibiotics | ...
| synthetics | ...
| chemicals | ...
| hormones | ...
| added hormones | ...
| nitrates/nitrites | ...
| added nitrates | ...
| added nitrites | ...
| yeast | ...
| active yeast | ...

7) SECOND_EXTRA_CLAIM_TABLE info recorded in markdown table format below:

CONDITION FOR ROW TO SHOW FOR TABLE BELOW: 
+ only return row items if its answer of "item explicitly and directly state in a text on product  without implying from other text" = "yes" and remove all unqualified rows from table below

SECOND_EXTRA_CLAIM_TABLE
| extra item | item explicitly and directly state in a text on product  without implying from other text? (answer is yes/no/unknown) | How product state about it ? (return short answer like "free from" / "made without" / "no contain" / "contain" / "free of" / "no" / "other") |  do you know it through which info ? (answer are  "ingredient list"/ "marketing text on product"/ "nutrition fact"/ "NA") (answer could be multiple string since the info can appeared in multiple sources) | how do you know ? |
| ------- | -------- | ------- | ------- | ------- |
| 1,4-dioxane | ...
| alcohol | ...
| allergen | ...
| gluten | ...
| aluminum | ...
| amino acids | ...
| ammonia | ...
| cholesterol | ...
| coatings | ...
| corn fillers | ...
| cottonseed oil | ...
| edta | ...
| emulsifiers | ...
| erythorbates | ...
| expeller-pressed oils | ...
| fillers | ...
| fluoride | ...
| formaldehyde | ...
| fragrances | ...
| grain | ...
| hexane | ...
| hydrogenated oils | ...
| kitniyos / kitniyot (legumes) | ...
| lactose | ...
| latex | ...
| msg | ...
| omega fatty acids | ...
| paba | ...
| palm oil | ...
| parabens | ...
| pesticides | ...

8) THIRD_EXTRA_CLAIM_TABLE info recorded in markdown table format below: 

CONDITION FOR ROWS TO SHOW FOR TABLE BELOW: 
+ only return row items if its answer of "item explicitly and directly state in a text on product  without implying from other text" = "yes" and remove all unqualified rows from table below

THIRD_EXTRA_CLAIM_TABLE
| extra item | item explicitly and directly state in a text on product  without implying from other text? (answer is yes/no/unknown) | How product state about it ? (return short answer like "free from" / "made without" / "no contain" / "contain" / "free of" / "no" / "other") |  do you know it through which info ? (answer are  "ingredient list"/ "marketing text on product"/ "nutrition fact"/ "NA") (answer could be multiple string since the info can appeared in multiple sources) | how do you know ? |
| ------- | -------- | ------- | ------- | ------- |
| petro chemical | ...
| petrolatum | ...
| petroleum byproducts | ...
| phosphates | ...
| phosphorus | ...
| phthalates | ...
| pits | ...
| probiotics | ...
| rbgh/bst | ...
| rennet | ...
| salicylates | ...
| sea salt | ...
| shells/ shell pieces | ...
| silicone | ...
| sles (sodium laureth sulfate) | ...
| sls (sodium lauryl sulfate) | ...
| stabilizers | ...
| starch | ...
| sulfates | ...
| sulfides | ...
| sulfites / sulphites | ...
| sulfur dioxide | ...
| thc / tetrahydrocannabinol | ...
| toxic pesticides | ...
| triclosan | ...
| vegan ingredients | ...
| vegetarian ingredients | ...
| yolks | ...
| binders and/or fillers | ...
| bleach | ...
| bpa (bisphenol-a) | ...
| butylene glycol | ...
| by-products | ...
| caffeine | ...
| carrageenan | ...
| casein | ...
| cbd / cannabidiol | ...
| chlorine | ...


9) Allergen info recorded in markdown table format below:
 
IMPORTANT NOTE:
+ allergen table only must have one row data so the list must be recorded in one cell and split by ", "

ALLERGEN_TABLE
| allergen contain statement | allergen contain break-down list | allergen does-not-contain statement | allergen does-not-contain statement break-down list | allergen contain on equipment statement | allergen contain on equipment break-down list| 
| ------- | -------- | -------- | ------- | -------- | -------- |

10) Header info with table format below:
(IMPORTANT NOTE: remember header table only have one row item)

HEADER_TABLE
| product name | brand name | primary size | secondary size | third size | full size text description | count |
| ------- | -------- | -------- | ------- | -------- | -------- | -------- |

11) Ingredient info with table format below:

INGREDIENT_TABLE
| is product supplement ? (answer is boolean) | ingredient statement |  ingredient break-down list |
| ------- | -------- | -------- |

12) Physical info with table format below

PHYSICAL_TABLE
| upc-12 or gtin-12 |
| ------- |

13) Marketing info with table format below:

MARKETING_TABLE
| have QR code (answer is boolean) | have Instagram icon ? | have Pinterest icon ? | have Youtube icon ? |type | have Facebook icon ? | have twitter icon ? | social media list | website list (multiple) | social media text list | enlarged to show (answer is boolean) |
| ------- | -------- | -------- | ------- | ------- | ------- | -------- | -------- | ------- | ------- | ------- |

14) Instruction info with table format below:

IMPORTANT NOTE:
+ each type of instruction could have multiple value

INSTRUCTION_TABLE
| instruction type | value 1  | value 2 | value 3 | ... (more columns if needed)
| ------- | -------- | -------- | ------- | ...
| storage instructions | 
| cooking instructions | 
| usage instructions | 
| usage time instruction / freeze by instruction | 
| other instructions |

15) supply chain info with table format below:

SUPPLY_CHAIN_TABLE
| country of origin text | country of origin | distributed by | manufacture name | manufacture date | manufacture phone number | manufacture street address | manufacture city | manufacture state | manufacture zipCode |
| ------- | -------- | -------- | -------- | ------- | ------- | -------- | -------- | ------- | ------- |

`;
};

// 16) Marketing text with table format below:

// MARKETING_TEXT_TABLE
// | index | marketing text |
// | ------- | -------- |

// + "added color" does not mean product claim "artificial color".
// + "added color" claim does not mean product claim "artificial color".
// + "vegan" text only does not mean "vegan ingredients".
// + "natural" text only does not mean "natural ingredients".
// + "gluten free" not mean contain "allergen".
// + "Gluten Free" not mean "no added colors".
// + "allergen" claim detected from text such as "allergen free", "do not contain allergen", "product contain allergen", ...
// + "real ingredient" not mean "natural flavor" or "naturally flavored".
// + "pesticide" is not "antibiotics".
// + "Organic" not mean "no animal ingredients"
// + "vegan certifier" not mean "vegan ingredient"
// + "international ingredients" not mean "chemical ingredient"

// DEBUG_TABLE
// 16) Debug table is gemini answer recorded in markdown table format below:

// DEBUG_TABLE
// | question (question from DEBUG LIST below) | gemini answer |
// | ------- | -------- |

// DEBUG LIST:
// 1) i see you think too deeply for example when you see "free from artificial flavor" and you think product claim "does not contain added flavor". That is not what i want it must say that product claim "does not contain artificial flavor". I do not how to prompt and make you understand that so next time you will no make same mistake help me write prompt sentences to fix that
// 2) product does not say about antibiotics but you still include in extra claim list ? why ?

// 2) the problem is that some claim you concluded from ingredient list? but the product claim is not retrieved from ingredient list
// 3) i only require the result of table with nutrient row that match my conditions but i see you actually created row with initial data not provided by me ? i do not want that can you help me with write prompt to fix that?

//! | extra item |  item explicitly and directly state in a text on product  without implying from other text? (answer is true/false/unknown) | Does the product explicitly state contain it ? (answer is yes/no) |  Does the product explicitly state to not contain it ? (answer is yes/no)  |  do you know it through which info ? (answer are  "ingredient list"/ "marketing text on product"/ "nutrition fact"/ "others") (answer could be multiple string since the info can appeared in multiple sources) | how do you know that ? and give me you explain (answer in string) |
// (ROW RETURN CONDITION: only return row item if "explicitly and directly mentioned in product info without implied from other text" value = "true")
