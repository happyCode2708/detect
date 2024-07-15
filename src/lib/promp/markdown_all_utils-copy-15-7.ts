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

// 11) "marketing text table" rules:
//  + is the list of all texts or paragraphs to marketing for products that appeal customer to buy

// + "all other instructions" are all other instructions see examples
// Ex 1: SEE NUTRITION INFORMATION FOR FAT AND SATURATED FAT ...

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
1) To avoid any deduction and ensure accuracy.

2) Only be using the information explicitly provided in the product images and not drawing conclusions based on the ingredient list. I will focus on directly extracting product claims from the text on the packaging and avoid making deductions based on the presence or absence of specific ingredients.
Ex 1: if product have something in ingredient list. That cannot conclude that product claim to have this thing. Claim must be a statement or texts on the packaging make claim on a thing.

4) Product info could contain multiple languages info. Only return provided info in english.

5) Only return all markdown tables that i require you to return.

6) There are some tables that i require return row items with specific given condition. Please check it carefully.

7) text such as "Contain: ...", "Free of ...", ... are "marketing text on product".

8) all table names must be in capital letters.

9) "gluten" is not allergen.

10) Each table have its own assert item list or claim list. Do not interchange item/claim between tables.

11) inferred info is not accepted for claim:
Ex: you are not allow to infer "no animal ingredients" from "organic certifier"

12) do not collect phone number to website list data. 

13) do not collect number near the UPC barcode it is not UPC code number. Only get number inside the barcode for UPC code. 

14) result must be in order and include all tables below
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
BASE_CERTIFIER_CLAIM_TABLE
ATTRIBUTE_TABLE

without any number like 1) or 2) before table names
without \`\`\` or \`\`\`markdown closing tag

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

+ "allergen does-not-contain statement" are the exact contexts that you found on provided images about allergen info, that product claim not to contain.
Ex 1: "contain no wheat, milk"
Ex 2: "does not contain wheat, milk"
Ex 3: "free of wheat, milk"
Ex 4: "non-dairy" text mean does not contain allergen ingredient of "dairy"
Ex 5:  "no soy"

+ "allergen contain statement" are the exact contexts that you found on provided images about allergen info, usually start with "contains", "contains:", "may contains:", ....

+ "allergen contain break-down list" is the allergen ingredients from "allergen contain statement" and do not collect from product ingredient list.

+ "allergen contain on equipment statement" are the exact contexts that you found on provided images about list of allergen ingredients that is said they may be contained in/on manufacturing equipments.
ex 1: "manufactured on equipment that also processes product containing ..."
ex 2: "made in a facility that also processes ... "
ex 3: "tree nuts, wheat present in facility"

+ "allergen break-down list" is a string list
ex 1: "oats, milk"

3) "SUGAR_CLAIM_TABLE" rules:
+ possible answers of "how product state about it ?" are "free of"/  "free from" / "made without" / "no contain" / "contain" / "lower" / "low" / "0g" / "zero" / "other" / "does not contain" / "not too sweet" / "low sweet" / "sweetened" / "other".

4) "header" table rules:
+ header table only have 1 row item so you must carefully examine the images.
+ "primary size" and "secondary size" and "third size" are a quantity measurement of product in there different unit of measurement. They are not info from "serving size" in nutrition fact.
Ex 1: "primary size" = "100 gram"
Ex 3: "WT 2.68 OZ (40g) should recorded as "primary size" = "2.68 OZ" and "secondary size" = "40g"
Ex 2: "32 fl oz ( 2 pt ) 946 mL" should recorded as "primary size" = "32 fl oz" and "secondary size" = "2 pt" and "third size" = "946 mL"
Ex 4: "100 capsules"  should recorded as "primary size" = "100 capsules"

+ just collect size in order. If production mention three type of uom it will have third size

+ "primary size" must content quantity value number and its oum (same for primary size, and third size)

+ "count" is the count number of smaller unit inside a package, or a display shipper, or a case, or a box.

+ "full size statement" is the whole size statement text found on product images that might includes all texts about primary size, secondary size,  third size and serving amounts if exits  but not info from nutrition panel
Ex 1: "Net WT 9.28oz(260g) 10 cups"
Ex 2: "16 FL OZ (472 ML)
Ex 3: "900 CAPSULES 400 servings"
Ex 4: "24 K-CUP PODS - 0.55 OZ (5.2)G/EA NET WT 4.44 OZ (38g)"

5) "ingredient" table rules:
+ is the list of statements about ingredients of product (since product can have many ingredients list)
+ "ingredient statement" is content start right after a prefix text such as "ingredients:" or "Ingredients:" or "INGREDIENTS:" or "other ingredients:".
+ "ingredient break-down list" is the list of ingredient in ingredient statement split by ", "
+ "product type from nutrition panel" could be detected through nutrition panel text title which are NUTRITION FACTS or SUPPLEMENT FACTS

6) "marketing" table rules:
+ "youtube icon type" have 2 types (answer is type_1/type_2)
type_1 is youtube icon have two texts "you" and "tube" on it.
type_2 is youtube icon of youtube logo with play button without name youtube

+ "social media list" is the list of social media method mentioned on product images (such as "facebook", "google", "instagram", "pinterest", "snapchat", "tiktok", "youtube", "twitter", ...).
+ "website list" are all website links found on product (website link exclude "nongmoproject.org") and be careful the content after website could be phone number.
Ex 1: www.cocacola.com, www.cocacola.com/policy, www.cocacola.com/fanpage, cocacola.com
Ex 2: if text "coca.com . 555/200-3529" it seem that "555/200-3529" is a phone number or other number not belong to website link "coca.com"

+ "social media text" is a list of text usually start with "@", or "#" those can be used to search the product on social media. Hint, it is usually next to social media icons.
Ex 1: @cocacola

+ "enlarge to show" is true if statement such as "enlarged to show..." seen on product image.

7) "instruction" table rules:
+ "cooking instructions" are all statements or all steps how to cook using product

+ "usage instructions" are all instruction statement about how to use product but not about "cooking instructions" text (remember that extracted statements also include text before colon such as "suggested use:", "directions:",...)
Ex 1: "suggested use: 2 cups at one time." should be recorded as "usage instructions" = "suggested use: 2 cups at one time."

+ "storage instruction" are all storage instruction text that includes some phrases below:

if storage instruction include other point not mentioned in the list above that instructions must be put in "all other instructions" as well
Ex1: "STORE IN A COOL, DRY PLACE AWAY FROM KITCHEN" is valid for "storage instructions" but also valid for "all other instructions since it say "away from kitchen"

8) "supply chain" table rules:
+ "country of origin text" example
Ex 1: "manufactured in Canada"ingredient
Ex 2: "made in Brazil"

+ "country of origin" example
Ex 1: "Canada"
Ex 2: "Brazil"

+ "manufacturer" could not be "distributor"

+ "distributor name" is detected from the text statement MUST start after text such as "distributed by", "distributed by:", "distributor ...". If you do not see those texts the info of company must be about "manufacture info"

+ "manufacture name" is only the name of manufacturer could start after some text such as "manufactured in" without including address.
Ex 1 : "Coca cola .LLC"
Ex 2: "MANUFACTURED FOR: BEAUTY FARM, PBC"

+ if "manufacturer name" exits so its address info of that "manufacturer" is recorded in manufacture street address , manufacture city , manufacture state , manufacture zipCode.

9) "base certifier claim" rules:
+ carefully check for text or certifier logo that could indicate claim from provided image
Ex: logo U kosher found mean "kosher claim" = "yes" 


10) Three "extra claim table" rules:
+ text "make without: ..." is in type "marketing text on product".
+ "how product state about it ?" the possible answers of question are  "free from" / "made without" / "no contain" / "contain" / "free of" / "no" / "free" / "flavor with" / "other" / "do not use".

RESULT THAT I NEED:
Carefully examine all text infos, all icons, all logos  from provided images and help me return output with all markdown tables format below remember that all provided images are captured pictured of one product only from different angles.

1) SUGAR_CLAIM_TABLE info recorded in markdown table format below:

IMPORTANT NOTE:
+ only process with provided sugar items below.
+ possible answers of "how product state about it ?" for sugar claim table  are  "free of"/  "free from" / "made without" / "no contain" / "contain" / "lower" / "low" / "0g" / "zero" / "other" / "does not contain" / "not too sweet" / "low sweet" / "sweetened" / "other".

SUGAR_CLAIM_TABLE
| sugar item | sugar item explicitly and directly state in a text on product  without implying from other text? (answer is yes/no/unknown) | How product state about it ?  | do you know it through which info ? (answer are "ingredient list","marketing text on product", "nutrition fact", "others") (answer allow multiple sources split by comma) | how do you know ? |
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

IMPORTANT NOTE:
+ "live food" is living animals used as food for pet.

PROCESS_CLAIM_TABLE
| proces claim | does product explicitly claim this process claim? (answer are yes/no/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are "ingredient list"/ "nutrition fact"/ "marketing text on product"/ "others") (answer could be multiple string from many sources) | how do you know that ? and give me you explain (answer in string) |
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
| non-fried | ...
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

CONDITION FOR ROW TO SHOW FOR TABLE BELOW: 
+ have no rows return condition it means that you must return all rows items listed below


IMPORTANT NOTE:
+ "artificial color" DO NOT mean "added color"
+ "artificial flavor", "chemical flavors" DO NOT mean "added flavor"
+ "artificial sweeteners" not mean "artificial flavors"
+ "hormones" not mean "added hormones"
+ text like "contain ..." or "contain no ..." is "marketing text on product" and NOT "ingredient list"

FIRST_EXTRA_CLAIM_TABLE
| extra item | is item mentioned on provided images? (answer is yes/no/unknown) | How product state about it ? (answer are "free from" / "made without" / "no contain" / "contain" / "free of" / "no" / "free" / "flavor with" / "other" / "do not use" / "may contain" )  |  do you know it through which info ? (answer are  "ingredient list"/ "marketing text on product"/ "nutrition fact"/ "NA") (answer is multiple string if needed) | how do you know ? |  
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
| nitrates | ...
| nitrites | ...
| added nitrates | ...
| added nitrites | ...
| yeast | ...
| active yeast | ...

7) SECOND_EXTRA_CLAIM_TABLE info recorded in markdown table format below:

IMPORTANT NOTE:
+ "no dairy" DO NOT mean "no lactose"

SECOND_EXTRA_CLAIM_TABLE
| extra item | is item mentioned on provided images? (answer is yes/no/unknown) | How product state about it ? (answer are "free from" / "made without" / "no contain" / "contain" / "free of" / "no" / "free" / "flavor with" / "other" / "do not use" / "may contain") |  do you know it through which info ? (answer are  "ingredient list"/ "marketing text on product"/ "nutrition fact"/ "NA") (answer could be multiple string since the info can appeared in multiple sources) | how do you know ? |
| ------- | -------- | ------- | ------- | ------- |
| omega fatty acids | ...
| pesticides | ...
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
| kitniyos | ...
| kitniyot | ...
| lactose | ...
| latex | ...
| msg | ...
| paba | ...
| palm oil | ...
| parabens | ...

8) THIRD_EXTRA_CLAIM_TABLE info recorded in markdown table format below: 

IMPORTANT NOTE:
+ "vegan" not mean "vegan ingredients"

THIRD_EXTRA_CLAIM_TABLE
| extra item | is item mentioned on provided images? (answer is yes/no/unknown) |  How product state about it ? (answer are "free from" / "made without" / "no contain" / "contain" / "free of" / "no" / "free" / "flavor with" / "other" / "do not use" / "may contain") |  do you know it through which info ? (answer are  "ingredient list"/ "marketing text on product"/ "nutrition fact"/ "NA") (answer could be multiple string since the info can appeared in multiple sources) | how do you know ? |
| ------- | -------- | ------- | ------- | ------- |
| petro chemical | ...
| petrolatum | ...
| petroleum byproducts | ...
| phosphates | ...
| phosphorus | ...
| phthalates | ...
| pits | ...
| probiotics | ...
| rbgh | ...
| rbst | ...
| rennet | ...
| salicylates | ...
| sea salt | ...
| shells pieces | ...
| shell pieces | ...
| silicone | ...
| sles (sodium laureth sulfate) | ...
| sls (sodium lauryl sulfate) | ...
| stabilizers | ...
| starch | ...
| sulfates | ...
| sulfides | ...
| sulfites | ...
| sulphites | ...
| sulfur dioxide | ...
| thc | ...
| tetrahydrocannabinol | ...
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
+ tree nuts also includes "coconut"

ALLERGEN_TABLE
| allergen contain statement (allow multiple string split by comma) | allergen contain break-down list | allergen does-not-contain statement (allow multiple string split by comma) | allergen does-not-contain statement break-down list | allergen contain on equipment statement | allergen contain on equipment break-down list| 
| ------- | -------- | -------- | ------- | -------- | -------- |

10) Header info with table format below:
(IMPORTANT NOTE: remember header table only have one row item)

HEADER_TABLE
| product name | brand name | primary size | secondary size | third size | full size statement | count | count uom |
| ------- | -------- | -------- | ------- | -------- | -------- | -------- | -------- |

11) Ingredient info with table format below:

INGREDIENT_TABLE
| product type from nutrition panel ? (answer is "nutrition facts" / "supplement facts" / "unknown") | prefix text of ingredient list (answer are "other ingredients:" / "ingredients:") | ingredient statement |  ingredient break-down list (answer in multiple string splitted by comma) |
| ------- | ------- | -------- | -------- |

12) Physical info with table format below

PHYSICAL_TABLE
| upc code on the barcode  | The lot number is located on the left side of the UPC code (only one digit number inside the barcode) | all numbers on the right side of lot number |
| ------- | ------- | ------- |

13) Marketing info with table format below:

MARKETING_TABLE
| have QR code (answer is boolean) | have Instagram icon or info ? | have Pinterest icon or info ? | have Youtube icon or info ? | youtube icon type (if have youtube icon or info )  | have Facebook icon or info ? | have twitter icon or info ? | social media list | website list (multiple split by comma) | social media text list | enlarged to show (answer is boolean) |
| ------- | -------- | -------- | ------- | ------- | ------- | -------- | -------- | ------- | ------- | ------- |

14) Instruction info with table format below:

IMPORTANT NOTE:
+ each type of instruction could have multiple value
+

INSTRUCTION_TABLE
| instruction type | value 1  | value 2 | value 3 | ... (more columns if needed)
| ------- | -------- | -------- | ------- | ...
| storage instructions | 
| cooking instructions | 
| usage instructions | 

15) supply chain info with table format below:

SUPPLY_CHAIN_TABLE
| info item | value |
| ------- | -------- |
| country of origin text | ...
| country of origin | ...
| have text "distributed by" ? (answer is yes/no) | 
| distributor name | 
| distributor city | 
| distributor state |
| distributor zipCode |
| distributor phone number |
| full text about distributor |
| manufacture name | 
| manufacture date | 
| manufacture phone number | 
| manufacture street address | 
| manufacture city | 
| manufacture state 
| manufacture zipCode |

16) Base certifier claim info with table format below:

BASE_CERTIFIER_CLAIM_TABLE
| claim | is product claim that ? (answer is yes/no/unknown) |
| ------- | ------- |
| bee friendly claim |
| bio-based claim |
| biodynamic claim |
| bioengineered claim |
| cbd cannabidiol / help claim |
| carbon footprint claim |
| certified b corporation |
| certified by international packaged ice association |
| cold pressure verified |
| cold pressure protected claim |
| cradle to cradle claim |
| cruelty free claim |
| diabetic friendly claim |
| eco fishery claim |
| fair trade claim |
| for life claim |
| use GMO claim |
| gmp claim |
| gluten-free claim |
| glycemic index claim |
| glyphosate residue free claim |
| grass-fed claim |
| halal claim |
| hearth healthy claim |
| Keto/Ketogenic Claim |
| Kosher Claim |
| Live and Active Culture Claim |
| Low Glycemic Claim |
| New York State Grown & Certified Claim |
| Non-GMO Claim |
| Organic Claim |
| PACA Claim |
| PASA Claim |
| Paleo Claim |
| Plant Based/Derived Claim |
| Rain Forest Alliance Claim |
| Vegan Claim |
| Vegetarian Claim |
| Viticulture Claim |
| Whole Grain Claim |

17) some other attribute info recorded with table format below:

ATTRIBUTE_TABLE
| grade (answer are 'A'/ 'B') | juice percent (answer is number) |
| ------- | ------- |

`;
};

//* second
// CONDITION FOR ROW TO SHOW FOR TABLE BELOW:
// + only return row items if its answer of "item explicitly and directly state in a text on product  without implying from other text" = "yes" and remove all unqualified rows from table below

//* third
// CONDITION FOR ROWS TO SHOW FOR TABLE BELOW:
// + only return row items if its answer of "item explicitly and directly state in a text on product  without implying from other text" = "yes" and remove all unqualified rows from table below

//* fat claim
// CONDITION FOR ROW TO SHOW IN TABLE BELOW:
// + only return row items if its answer of "does product claim that fat claim" value = "yes" and remove all rows with "does product claim that fat claim" value = "unknown" or "no" )

// 18) Marketing text with table format below:

// MARKETING_TEXT_TABLE
// | index | marketing text |
// | ------- | -------- |

// MARKETING_TEXT_TABLE

// | high potency |
// | ITAL CERTIFIED SEAL Claim |
// | ITAL CONSCIOUS SEAL Claim |
// | ITAL SACRAMENT SEAL Claim |

// 16) Attribute info with table format below:

// ATTRIBUTE_TABLE
// | juice percent (answer is number / NA) |
// | ------- |

// CONDITION FOR ROWS TO SHOW FOR TABLE BELOW:
// + only return row items if its answer of "is product claim that ?" = "yes" and remove all other rows with answer of "no" or "unknown"

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
