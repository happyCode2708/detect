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

// + allergen table only must have one row data so the list must be recorded in one cell and split by ", "

// + "break-down list about allergen things product does not contain"
// example 1: "milk and peanut free" should be recorded as "milk/peanut"

// PHYSICAL_TABLE

// 12) Physical info with table format below

// PHYSICAL_TABLE
// | upc code on the barcode  | The lot number is located on the left side of the UPC code (only one digit number inside the barcode) | all numbers on the right side of lot number |
// | ------- | ------- | ------- |

// + "text on images that tell allergens product does not contain" are the exact contexts that you found on provided images about allergen info, that product claim to not contain or free of or free.
// example 1: "contain no wheat, milk"
// example 2: "does not contain wheat, milk"
// example 3: "free of wheat, milk"
// example 4: "non-dairy" text mean does not contain allergen ingredient of "dairy"
// example 5: "no egg"

// + "allergen contain statements" are the exact contexts that you found on provided images about allergen info, usually start with "contains:", "contain", "may contain", "may contain:", "allergen statement:, ... NOT due to sharing manufacturing equipments or in same facility with other products.
// Example 1: "allergen statement: contains milk"
// Example 2: "may contain: milk, peanut"

// + "allergen contain break-down list" is the allergen ingredients from "allergen contain statement" and do not collect from product ingredient list.

// + "statement about allergen contain on manufacturing equipments or in facility or due to shared equipments" are the exact contexts that you found on provided images about list of allergen ingredients that is said they could present on the product since manufacturing equipments are also used to make other products or in the same facility .
// ex 1: "manufactured on equipment that also processes product containing ..."
// ex 2: "made in a facility that also processes ... "
// ex 3: "tree nuts, wheat present in facility"

// + "break-down list of allergens for statement about allergen contain on manufacturing equipments or in facility or due to shared equipments" is the break-down list of all ingredients that is stated to present in facility or manufacturing equipments. Do not include ingredients that say is not present on facility or manufacturing equipment.
// Example 1: "Manufactured in a egg and milk free facility that also processes peanut, wheat products" should be recorded as "peanut/wheat" since text "in a egg and milk free facility" mean the egg and milk is not present in facility.

// + "allergen break-down list from that statement" is a string list
// ex 1: "oats/milk"

///* LABELING
// IMPORTANT NOTE:
// + LABELING_INFO_TABLE only have one row data, the multiple values must split by "/"
// + labeling info could be easily detected by some icons with text on provided images.
// + remember when product state "something free" it mean product free of that thing (such as soy free, dairy free, ...)
// Example 1: "gluten free" mean product not contain "gluten"
// Example 2: "nuts free" mean product not contain "nuts"

// TABLE FORMAT:
// LABELING_INFO_TABLE
// | things that labels/logos indicate product free of (multiple things name split by "/") | things that labels/logos indicate product contain (multiple things name split by "/")|
// | ------- | -------- |
// END__LABELING__INFO__TABLE

// conclude from label item what product say it does not contain (split by "/") | conclude from label item what product say it contain ? (split by "/") |

// Q_AND_A_TABLE;

// 1) Q_AND_A TABLE recorded in markdown TABLE FORMAT below

// TABLE FORMAT:
// Q_AND_A_TABLE
// | question | short answer |
// | ------- | -------- |
// | do product state soy free ? |
// END__Q__AND__A__TABLE

// + "cooking instructions" are all statements, paragraphs, or phrases about cooking with product (such as recipes, or all steps to cook product with kitchen devices, ...)

// + "usage instructions" are all instruction sentences about how to use product excluding all "cooking instructions"
// Example 1: "suggested use: 2 cups at one time."
// Example 1: "enjoy within 20 days for best taste"

// + "storage instruction" are all instruction sentences about how to storage product.
// Example 1: "reseal for freshness"
// Example 2: "keep refrigerated"

// 1) To avoid any deduction and ensure accuracy.

export const make_markdown_attr_2_prompt = ({
  ocrText,
  imageCount,
}: {
  ocrText?: string;
  imageCount?: number;
}) => {
  return `OCR texts from ${imageCount} provided images:
${ocrText}

VALIDATION AND FIX BUGS:
1) Product info could contain multiple languages info. Only return provided info in english.

2) all table names must be in capital letters.

3) do not collect phone number to website list data. 

4) do not bold letter with ** and ** tag 

5) Each table have its own assert item list or claim list. Do not interchange item/claim between tables.

6) result must be in order and include all tables below (note their formats right below TABLE FORMAT:)
SUGAR_CLAIM_TABLE
FAT_CLAIM_TABLE


without any number like 1) or 2) before table names
without \`\`\` or \`\`\`markdown closing tag

7) result must include all footer TEXT (such as END_THIRD_EXTRA_CLAIM_TABLE,...) at the end of table.

IMPORTANT RULES:
1) return result rules:
+ just only return table with table header and table row data. do not include any other things in the output.

RESULT THAT I NEED:
Carefully examine all text infos, all icons, all logos  from provided images and help me return output with all markdown tables format below remember that all provided images are captured pictured of one product only from different angles.

1) SUGAR CLAIM TABLE info recorded in markdown table format below:

IMPORTANT NOTE:
+ only process with all provided sugar claims below

+ "all found texts" are all exact texts, or sentences, or phrases visibly seen by human eyes from provided images about sugar claim. (do not assume texts not from provided images)

+ "SUGAR_CLAIM_TABLE" must includes all sugar claims listed below.

+ must return result for all sugar claims provided below.

TABLE FORMAT:
SUGAR_CLAIM_TABLE
[
  {
    "sugar claim": "acesulfame k",
    "all found texts": str[]
  },
  {
    "sugar claim": "agave",
    "all found texts": str[]
  },
  {
    "sugar claim": "allulose",
    "all found texts": str[]
  },
  {
    "sugar claim": "artificial sweetener",
    "all found texts": str[]
  },
  {
    "sugar claim": "aspartame",
    "all found texts": str[]
  },
  {
    "sugar claim": "beet sugar",
    "all found texts": str[]
  },
  {
    "sugar claim": "cane sugar",
    "all found texts": str[]
  },
  {
    "sugar claim": "coconut/coconut palm sugar",
    "all found texts": str[]
  },
  {
    "sugar claim": "fruit juice",
    "all found texts": str[]
  },
  {
    "sugar claim": "high fructose corn syrup",
    "all found texts": str[]
  },
  {
    "sugar claim": "honey",
    "all found texts": str[]
  },
  {
    "sugar claim": "low sugar",
    "all found texts": str[]
  },
  {
    "sugar claim": "lower sugar",
    "all found texts": str[]
  },
  {
    "sugar claim": "monk fruit",
    "all found texts": str[]
  },
  {
    "sugar claim": "natural sweeteners",
    "all found texts": str[]
  },
  {
    "sugar claim": "no acesulfame k",
    "all found texts": str[]
  },
  {
    "sugar claim": "no added sugar",
    "all found texts": str[]
  },
  {
    "sugar claim": "no agave",
    "all found texts": str[]
  },
  {
    "sugar claim": "no allulose",
    "all found texts": str[]
  },
  {
    "sugar claim": "no artificial sweetener",
    "all found texts": str[]
  },
  {
    "sugar claim": "no aspartame",
    "all found texts": str[]
  },
  {
    "sugar claim": "no cane sugar",
    "all found texts": str[]
  },
  {
    "sugar claim": "no coconut/coconut palm sugar",
    "all found texts": str[]
  },
  {
    "sugar claim": "no corn syrup",
    "all found texts": str[]
  },
  {
    "sugar claim": "no high fructose corn syrup",
    "all found texts": str[]
  },
  {
    "sugar claim": "no refined sugars",
    "all found texts": str[]
  },
  {
    "sugar claim": "no saccharin",
    "all found texts": str[]
  },
  {
    "sugar claim": "no splenda/sucralose",
    "all found texts": str[]
  },
  {
    "sugar claim": "no stevia",
    "all found texts": str[]
  },
  {
    "sugar claim": "no sugar",
    "all found texts": str[]
  },
  {
    "sugar claim": "no sugar added",
    "all found texts": str[]
  },
  {
    "sugar claim": "no sugar alcohol",
    "all found texts": str[]
  },
  {
    "sugar claim": "no tagatose",
    "all found texts": str[]
  },
  {
    "sugar claim": "no xylitol",
    "all found texts": str[]
  },
  {
    "sugar claim": "reduced sugar",
    "all found texts": str[]
  },
  {
    "sugar claim": "refined sugar",
    "all found texts": str[]
  },
  {
    "sugar claim": "saccharin",
    "all found texts": str[]
  },
  {
    "sugar claim": "splenda/sucralose",
    "all found texts": str[]
  },
  {
    "sugar claim": "stevia",
    "all found texts": str[]
  },
  {
    "sugar claim": "sugar alcohol",
    "all found texts": str[]
  },
  {
    "sugar claim": "sugar free",
    "all found texts": str[]
  },
  {
    "sugar claim": "sugars added",
    "all found texts": str[]
  },
  {
    "sugar claim": "tagatose",
    "all found texts": str[]
  },
  {
    "sugar claim": "unsweetened",
    "all found texts": str[]
  },
  {
    "sugar claim": "xylitol",
    "all found texts": str[]
  }
]
END_SUGAR_CLAIM_TABLE

2) FAT_CLAIM_TABLE info of product images recorded in markdown table format below:

IMPORTANT NOTE:
+ only process with all provided fat claims below

+ "all found texts" are all exact texts, or sentences, or phrases visibly seen by human eyes from provided images about fat claim. (do not assume texts not from provided images)

+ "FAT_CLAIM_TABLE" must includes all fat claims listed below.

+ must return result for all fat claims provided below.

TABLE FORMAT:
FAT_CLAIM_TABLE
[
  {
    "fat claim": "fat free",
    "all found texts": str[]
  },
  {
    "fat claim": "free of saturated fat",
    "all found texts": str[]
  },
  {
    "fat claim": "low fat",
    "all found texts": str[]
  },
  {
    "fat claim": "low in saturated fat",
    "all found texts": str[]
  },
  {
    "fat claim": "no fat",
    "all found texts": str[]
  },
  {
    "fat claim": "no trans fat",
    "all found texts": str[]
  },
  {
    "fat claim": "reduced fat",
    "all found texts": str[]
  },
  {
    "fat claim": "trans fat free",
    "all found texts": str[]
  },
  {
    "fat claim": "zero grams trans fat per serving",
    "all found texts": str[]
  },
  {
    "fat claim": "zero trans fat",
    "all found texts": str[]
  }
]
END_FAT_CLAIM_TABLE


3) PROCESS_CLAIM_TABLE info recorded in markdown table format below:

IMPORTANT NOTE:
+ only process with all provided process claims below

+ "all found texts" are all exact texts, or sentences, or phrases visibly seen by human eyes from provided images about process claim. (do not assume texts not from provided images)

+ "PROCESS_CLAIM_TABLE" must includes all process claims listed below.

+ must return result for all process claims provided below.

TABLE FORMAT:
PROCESS_CLAIM_TABLE
[
  {
    "process claim": "100% natural",
    "all found texts": str[]
  },
  {
    "process claim": "100% natural ingredients",
    "all found texts": str[]
  },
  {
    "process claim": "100% pure",
    "all found texts": str[]
  },
  {
    "process claim": "acid free",
    "all found texts": str[]
  },
  {
    "process claim": "aeroponic grown",
    "all found texts": str[]
  },
  {
    "process claim": "all natural",
    "all found texts": str[]
  },
  {
    "process claim": "all natural ingredients",
    "all found texts": str[]
  },
  {
    "process claim": "aquaponic/aquaculture grown",
    "all found texts": str[]
  },
  {
    "process claim": "aquaponic grown",
    "all found texts": str[]
  },
  {
    "process claim": "aquaculture grown",
    "all found texts": str[]
  },
  {
    "process claim": "baked",
    "all found texts": str[]
  },
  {
    "process claim": "bake",
    "all found texts": str[]
  },
  {
    "process claim": "biodegradable",
    "all found texts": str[]
  },
  {
    "process claim": "cage free",
    "all found texts": str[]
  },
  {
    "process claim": "cold-pressed",
    "all found texts": str[]
  },
  {
    "process claim": "direct trade",
    "all found texts": str[]
  },
  {
    "process claim": "dolphin safe",
    "all found texts": str[]
  },
  {
    "process claim": "dry roasted",
    "all found texts": str[]
  },
  {
    "process claim": "eco-friendly",
    "all found texts": str[]
  },
  {
    "process claim": "farm raised",
    "all found texts": str[]
  },
  {
    "process claim": "filtered",
    "all found texts": str[]
  },
  {
    "process claim": "free range",
    "all found texts": str[]
  },
  {
    "process claim": "freeze-dried",
    "all found texts": str[]
  },
  {
    "process claim": "from concentrate",
    "all found texts": str[]
  },
  {
    "process claim": "grade a",
    "all found texts": str[]
  },
  {
    "process claim": "greenhouse grown",
    "all found texts": str[]
  },
  {
    "process claim": "heat treated",
    "all found texts": str[]
  },
  {
    "process claim": "heirloom",
    "all found texts": str[]
  },
  {
    "process claim": "homeopathic",
    "all found texts": str[]
  },
  {
    "process claim": "homogenized",
    "all found texts": str[]
  },
  {
    "process claim": "hydroponic grown",
    "all found texts": str[]
  },
  {
    "process claim": "hypo-allergenic",
    "all found texts": str[]
  },
  {
    "process claim": "irradiated",
    "all found texts": str[]
  },
  {
    "process claim": "live food",
    "all found texts": str[]
  },
  {
    "process claim": "low acid",
    "all found texts": str[]
  },
  {
    "process claim": "low carbohydrate or low-carb",
    "all found texts": str[]
  },
  {
    "process claim": "low cholesterol",
    "all found texts": str[]
  },
  {
    "process claim": "macrobiotic",
    "all found texts": str[]
  },
  {
    "process claim": "minimally processed",
    "all found texts": str[]
  },
  {
    "process claim": "natural",
    "all found texts": str[]
  },
  {
    "process claim": "natural botanicals",
    "all found texts": str[]
  },
  {
    "process claim": "natural fragrances",
    "all found texts": str[]
  },
  {
    "process claim": "natural ingredients",
    "all found texts": str[]
  },
  {
    "process claim": "no animal testing",
    "all found texts": str[]
  },
  {
    "process claim": "no sulfites added",
    "all found texts": str[]
  },
  {
    "process claim": "non gebrokts",
    "all found texts": str[]
  },
  {
    "process claim": "non-alcoholic",
    "all found texts": str[]
  },
  {
    "process claim": "non-irradiated",
    "all found texts": str[]
  },
  {
    "process claim": "non-toxic",
    "all found texts": str[]
  },
  {
    "process claim": "non-fried",
    "all found texts": str[]
  },
  {
    "process claim": "not from concentrate",
    "all found texts": str[]
  },
  {
    "process claim": "pasteurized",
    "all found texts": str[]
  },
  {
    "process claim": "pasture raised",
    "all found texts": str[]
  },
  {
    "process claim": "prairie raised",
    "all found texts": str[]
  },
  {
    "process claim": "raw",
    "all found texts": str[]
  },
  {
    "process claim": "responsibly sourced palm oil",
    "all found texts": str[]
  },
  {
    "process claim": "sprouted",
    "all found texts": str[]
  },
  {
    "process claim": "un-filtered",
    "all found texts": str[]
  },
  {
    "process claim": "un-pasteurized",
    "all found texts": str[]
  },
  {
    "process claim": "unscented",
    "all found texts": str[]
  },
  {
    "process claim": "vegetarian or vegan diet/feed",
    "all found texts": str[]
  },
  {
    "process claim": "vegetarian",
    "all found texts": str[]
  },
  {
    "process claim": "vegan diet",
    "all found texts": str[]
  },
  {
    "process claim": "vegan feed",
    "all found texts": str[]
  },
  {
    "process claim": "wild",
    "all found texts": str[]
  },
  {
    "process claim": "wild caught",
    "all found texts": str[]
  }
]
END_PROCESS_CLAIM_TABLE

4) CALORIE CLAIM TABLE info recorded in markdown table format below:

TABLE FORMAT:
CALORIE_CLAIM_TABLE
[
  {
    "calorie claim": "have low calorie",
    "all found texts": str[]
  },
  {
    "calorie claim": "have reduced calorie",
    "all found texts": str[]
  },
  {
    "calorie claim": "have zero calorie",
    "all found texts": str[]
  }
]
END_CALORIE_CLAIM_TABLE

5) FIRST EXTRA ITEM TABLE info recorded in markdown table format below:

IMPORTANT NOTE:

TABLE FORMAT:
FIRST_EXTRA_ITEM_TABLE
[
  {
    "item": "additives",
    "all found texts": str[]
  },
  {
    "item": "artificial additives",
    "all found texts": str[]
  },
  {
    "item": "chemical additives",
    "all found texts": str[]
  },
  {
    "item": "synthetic additives",
    "all found texts": str[]
  },
  {
    "item": "natural additives",
    "all found texts": str[]
  },
  {
    "item": "added colors",
    "all found texts": str[]
  },
  {
    "item": "artificial colors",
    "all found texts": str[]
  },
  {
    "item": "chemical colors",
    "all found texts": str[]
  },
  {
    "item": "synthetic colors",
    "all found texts": str[]
  },
  {
    "item": "natural colors",
    "all found texts": str[]
  },
  {
    "item": "dyes",
    "all found texts": str[]
  },
  {
    "item": "added dyes",
    "all found texts": str[]
  },
  {
    "item": "artificial dyes",
    "all found texts": str[]
  },
  {
    "item": "chemical dyes",
    "all found texts": str[]
  },
  {
    "item": "synthetic dyes",
    "all found texts": str[]
  },
  {
    "item": "natural dyes",
    "all found texts": str[]
  },
  {
    "item": "added flavors",
    "all found texts": str[]
  },
  {
    "item": "artificial flavors",
    "all found texts": str[]
  },
  {
    "item": "chemical flavors",
    "all found texts": str[]
  },
  {
    "item": "synthetic flavors",
    "all found texts": str[]
  },
  {
    "item": "natural flavors",
    "all found texts": str[]
  },
  {
    "item": "naturally flavored",
    "all found texts": str[]
  },
  {
    "item": "added fragrances",
    "all found texts": str[]
  },
  {
    "item": "artificial fragrance",
    "all found texts": str[]
  },
  {
    "item": "chemical fragrances",
    "all found texts": str[]
  },
  {
    "item": "synthetic fragrance",
    "all found texts": str[]
  },
  {
    "item": "preservatives",
    "all found texts": str[]
  },
  {
    "item": "added preservatives",
    "all found texts": str[]
  },
  {
    "item": "artificial preservatives",
    "all found texts": str[]
  },
  {
    "item": "chemical preservatives",
    "all found texts": str[]
  },
  {
    "item": "synthetic preservatives",
    "all found texts": str[]
  },
  {
    "item": "natural preservatives",
    "all found texts": str[]
  },
  {
    "item": "artificial ingredients",
    "all found texts": str[]
  },
  {
    "item": "chemical ingredients",
    "all found texts": str[]
  },
  {
    "item": "synthetic ingredients",
    "all found texts": str[]
  },
  {
    "item": "natural ingredients",
    "all found texts": str[]
  },
  {
    "item": "animal ingredients",
    "all found texts": str[]
  },
  {
    "item": "chemical sunscreens",
    "all found texts": str[]
  },
  {
    "item": "animal by-products",
    "all found texts": str[]
  },
  {
    "item": "animal derivatives",
    "all found texts": str[]
  },
  {
    "item": "animal products",
    "all found texts": str[]
  },
  {
    "item": "animal rennet",
    "all found texts": str[]
  },
  {
    "item": "antibiotics",
    "all found texts": str[]
  },
  {
    "item": "added antibiotics",
    "all found texts": str[]
  },
  {
    "item": "synthetics",
    "all found texts": str[]
  },
  {
    "item": "chemicals",
    "all found texts": str[]
  },
  {
    "item": "hormones",
    "all found texts": str[]
  },
  {
    "item": "added hormones",
    "all found texts": str[]
  },
  {
    "item": "nitrates",
    "all found texts": str[]
  },
  {
    "item": "nitrites",
    "all found texts": str[]
  },
  {
    "item": "added nitrates",
    "all found texts": str[]
  },
  {
    "item": "added nitrites",
    "all found texts": str[]
  },
  {
    "item": "yeast",
    "all found texts": str[]
  },
  {
    "item": "active yeast",
    "all found texts": str[]
  }
]
END_FIRST_EXTRA_ITEM_TABLE

7) SECOND EXTRA ITEM TABLE info recorded in markdown table format below:

IMPORTANT NOTE:

TABLE FORMAT:
SECOND_EXTRA_ITEM_TABLE
[
  {
    "item": "omega fatty acids",
    "all found texts": str[]
  },
  {
    "item": "pesticides",
    "all found texts": str[]
  },
  {
    "item": "1,4-dioxane",
    "all found texts": str[]
  },
  {
    "item": "alcohol",
    "all found texts": str[]
  },
  {
    "item": "allergen",
    "all found texts": str[]
  },
  {
    "item": "gluten",
    "all found texts": str[]
  },
  {
    "item": "aluminum",
    "all found texts": str[]
  },
  {
    "item": "amino acids",
    "all found texts": str[]
  },
  {
    "item": "ammonia",
    "all found texts": str[]
  },
  {
    "item": "cholesterol",
    "all found texts": str[]
  },
  {
    "item": "coatings",
    "all found texts": str[]
  },
  {
    "item": "corn fillers",
    "all found texts": str[]
  },
  {
    "item": "cottonseed oil",
    "all found texts": str[]
  },
  {
    "item": "edta",
    "all found texts": str[]
  },
  {
    "item": "emulsifiers",
    "all found texts": str[]
  },
  {
    "item": "erythorbates",
    "all found texts": str[]
  },
  {
    "item": "expeller-pressed oils",
    "all found texts": str[]
  },
  {
    "item": "fillers",
    "all found texts": str[]
  },
  {
    "item": "fluoride",
    "all found texts": str[]
  },
  {
    "item": "formaldehyde",
    "all found texts": str[]
  },
  {
    "item": "fragrances",
    "all found texts": str[]
  },
  {
    "item": "grain",
    "all found texts": str[]
  },
  {
    "item": "hexane",
    "all found texts": str[]
  },
  {
    "item": "hydrogenated oils",
    "all found texts": str[]
  },
  {
    "item": "kitniyos",
    "all found texts": str[]
  },
  {
    "item": "kitniyot",
    "all found texts": str[]
  },
  {
    "item": "lactose",
    "all found texts": str[]
  },
  {
    "item": "latex",
    "all found texts": str[]
  },
  {
    "item": "msg",
    "all found texts": str[]
  },
  {
    "item": "paba",
    "all found texts": str[]
  },
  {
    "item": "palm oil",
    "all found texts": str[]
  },
  {
    "item": "parabens",
    "all found texts": str[]
  }
]
END_SECOND_EXTRA_ITEM_TABLE

8) THIRD EXTRA ITEM TABLE info recorded in markdown table format below:

IMPORTANT NOTE:

TABLE FORMAT:
THIRD_EXTRA_ITEM_TABLE
[
  {
    "item": "petro chemical",
    "all found texts": str[]
  },
  {
    "item": "petrolatum",
    "all found texts": str[]
  },
  {
    "item": "petroleum byproducts",
    "all found texts": str[]
  },
  {
    "item": "phosphates",
    "all found texts": str[]
  },
  {
    "item": "phosphorus",
    "all found texts": str[]
  },
  {
    "item": "phthalates",
    "all found texts": str[]
  },
  {
    "item": "pits",
    "all found texts": str[]
  },
  {
    "item": "probiotics",
    "all found texts": str[]
  },
  {
    "item": "rbgh",
    "all found texts": str[]
  },
  {
    "item": "rbst",
    "all found texts": str[]
  },
  {
    "item": "rennet",
    "all found texts": str[]
  },
  {
    "item": "salicylates",
    "all found texts": str[]
  },
  {
    "item": "sea salt",
    "all found texts": str[]
  },
  {
    "item": "shells pieces",
    "all found texts": str[]
  },
  {
    "item": "shell pieces",
    "all found texts": str[]
  },
  {
    "item": "silicone",
    "all found texts": str[]
  },
  {
    "item": "sles (sodium laureth sulfate)",
    "all found texts": str[]
  },
  {
    "item": "sls (sodium lauryl sulfate)",
    "all found texts": str[]
  },
  {
    "item": "stabilizers",
    "all found texts": str[]
  },
  {
    "item": "starch",
    "all found texts": str[]
  },
  {
    "item": "sulfates",
    "all found texts": str[]
  },
  {
    "item": "sulfides",
    "all found texts": str[]
  },
  {
    "item": "sulfites",
    "all found texts": str[]
  },
  {
    "item": "sulphites",
    "all found texts": str[]
  },
  {
    "item": "sulfur dioxide",
    "all found texts": str[]
  },
  {
    "item": "thc",
    "all found texts": str[]
  },
  {
    "item": "tetrahydrocannabinol",
    "all found texts": str[]
  },
  {
    "item": "toxic pesticides",
    "all found texts": str[]
  },
  {
    "item": "triclosan",
    "all found texts": str[]
  },
  {
    "item": "vegan ingredients",
    "all found texts": str[]
  },
  {
    "item": "vegetarian ingredients",
    "all found texts": str[]
  },
  {
    "item": "yolks",
    "all found texts": str[]
  },
  {
    "item": "binders and/or fillers",
    "all found texts": str[]
  },
  {
    "item": "bleach",
    "all found texts": str[]
  },
  {
    "item": "bpa (bisphenol-a)",
    "all found texts": str[]
  },
  {
    "item": "butylene glycol",
    "all found texts": str[]
  },
  {
    "item": "by-products",
    "all found texts": str[]
  },
  {
    "item": "caffeine",
    "all found texts": str[]
  },
  {
    "item": "carrageenan",
    "all found texts": str[]
  },
  {
    "item": "casein",
    "all found texts": str[]
  },
  {
    "item": "cbd / cannabidiol",
    "all found texts": str[]
  },
  {
    "item": "chlorine",
    "all found texts": str[]
  }
]
END_THIRD_EXTRA_ITEM_TABLE
`;
};

// PROCESS_CLAIM_TABLE
// CALORIE_CLAIM_TABLE
// SALT_CLAIM_TABLE
// FIRST_EXTRA_CLAIM_TABLE
// SECOND_EXTRA_CLAIM_TABLE
// THIRD_EXTRA_CLAIM_TABLE

// 3) PROCESS_CLAIM_TABLE info recorded in markdown table format below:

// IMPORTANT NOTE:in
// + "live food" is living animals used as food for pet.

// TABLE FORMAT:
// PROCESS_CLAIM_TABLE
// | processing text | do the processing text present on provided images? (answer is yes/no/unknown) (answer is yes/no/unknown)? | do you know it through which info ? (answer are "ingredient list"/ "nutrition fact panel"/ "marketing text on product"/ "others") (answer could be multiple string from many sources) | return exact sentence or phrase on provided image that prove it |
// | ------- | -------- | -------- | -------- |
// | 100% natural | ...
// | 100% natural ingredients | ...
// | 100% pure | ...
// | acid free | ...
// | aeroponic grown | ...
// | all natural | ...
// | all natural ingredients | ...
// | aquaponic/aquaculture grown | ...
// | aquaponic grown | ...
// | aquaculture grown | ...
// | baked | ...
// | bake | ...
// | biodegradable | ...
// | cage free | ...
// | cold-pressed | ...
// | direct trade | ...
// | dolphin safe | ...
// | dry roasted | ...
// | eco-friendly | ...
// | farm raised | ...
// | filtered | ...
// | free range | ...
// | freeze-dried | ...
// | from concentrate | ...
// | grade a | ...
// | greenhouse grown | ...
// | heat treated | ...
// | heirloom | ...
// | homeopathic | ...
// | homogenized | ...
// | hydroponic grown | ...
// | hypo-allergenic | ...
// | irradiated | ...
// | live food | ...
// | low acid | ...
// | low carbohydrate or low-carb | ...
// | low cholesterol | ...
// | macrobiotic | ...
// | minimally processed | ...
// | natural | ...
// | natural botanicals | ...
// | natural fragrances | ...
// | natural ingredients | ...
// | no animal testing | ...
// | no sulfites added | ...
// | non gebrokts | ...
// | non-alcoholic | ...
// | non-irradiated | ...
// | non-toxic | ...
// | non-fried | ...
// | not from concentrate | ...
// | pasteurized | ...
// | pasture raised | ...
// | prairie raised | ...
// | raw | ...
// | responsibly sourced palm oil | ...
// | sprouted | ...
// | un-filtered | ...
// | un-pasteurized | ...
// | unscented | ...
// | vegetarian or vegan diet/feed | ...
// | vegetarian | ...
// | vegan diet | ...
// | vegan feed | ...
// | wild | ...
// | wild caught | ...
// END_PROCESS_CLAIM_TABLE

// 4) CALORIE CLAIM TABLE info recorded in markdown table format below:

// TABLE FORMAT:
// CALORIE_CLAIM_TABLE
// | calorie claim | does product explicitly claim the calorie claim? (answer are yes/no/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are "ingredient list"/ "nutrition fact panel"/ "marketing text on product"/ "others") (answer could be multiple string from many sources) |
// | ------- | -------- | -------- |
// | have low calorie | ...
// | have reduced calorie | ...
// | have zero calorie | ...
// END_CALORIE_CLAIM_TABLE

// 5) SALT CLAIM TABLE info recorded in markdown table format below:

// TABLE FORMAT:
// SALT_CLAIM_TABLE
// | salt claim | does product explicitly claim this claim? (answer are yes/no/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are "ingredient list"/ "nutrition fact panel"/ "marketing text on product"/ "others") (answer could be multiple string from many sources) |
// | ------- | -------- | -------- |
// | lightly salted | ...
// | low sodium | ...
// | no salt | ...
// | no salt added | ...
// | reduced sodium | ...
// | salt free | ...
// | sodium free | ...
// | unsalted | ...
// | very low sodium | ...
// END_SALT_CLAIM_TABLE

// 6) FIRST EXTRA CLAIM TABLE info recorded in markdown table format below:

// IMPORTANT NOTE:
// + text like "contain ..." or "contain no ..." is "marketing text on product" and NOT "ingredient list"

// + "do you know it through those sources info ?" could be multiple sources splitted by "/". Please prioritize read data from the source of "marketing text on product" over other sources.

// TABLE FORMAT:
// FIRST_EXTRA_CLAIM_TABLE
// | extra item | is text about item present on provided images ? (answer is yes/no/unknown) | How product state about it ? (answer are "free from" / "made without" / "no contain" / "contain" / "free of" / "no" / "free" / "flavor with" / "other" / "do not use" / "may contain" )  |  do you know it through those sources info ? (answer are  "ingredient list"/ "marketing text on product"/ "nutrition fact panel"/ "NA") | how do you know that? |
// | ------- | -------- | ------- | ------- | ------- |
// | additives | ...
// | artificial additives | ...
// | chemical additives | ...
// | synthetic additives | ...
// | natural additives | ...
// | added colors | ...
// | artificial colors | ...
// | chemical colors | ...
// | synthetic colors | ...
// | natural colors | ...
// | dyes | ...
// | added dyes | ...
// | artificial dyes | ...
// | chemical dyes | ...
// | synthetic dyes | ...
// | natural dyes | ...
// | added flavors | ...
// | artificial flavors | ...
// | chemical flavors | ...
// | synthetic flavors | ...
// | natural flavors | ...
// | naturally flavored | ...
// | added fragrances | ...
// | artificial fragrance | ...
// | chemical fragrances | ...
// | synthetic fragrance | ...
// | preservatives | ...
// | added preservatives | ...
// | artificial preservatives | ...
// | chemical preservatives | ...
// | synthetic preservatives | ...
// | natural preservatives | ...
// | artificial ingredients | ...
// | chemical ingredients | ...
// | synthetic ingredients | ...
// | natural ingredients | ...
// | animal ingredients | ...
// | chemical sunscreens | ...
// | animal by-products | ...
// | animal derivatives | ...
// | animal products | ...
// | animal rennet | ...
// | antibiotics | ...
// | added antibiotics | ...
// | synthetics | ...
// | chemicals | ...
// | hormones | ...
// | added hormones | ...
// | nitrates | ...
// | nitrites | ...
// | added nitrates | ...
// | added nitrites | ...
// | yeast | ...
// | active yeast | ...
// END_FIRST_EXTRA_CLAIM_TABLE

// 7) SECOND_EXTRA_CLAIM_TABLE info recorded in markdown table format below:

// IMPORTANT NOTE:
// + no note

// TABLE FORMAT:
// SECOND_EXTRA_CLAIM_TABLE
// | extra item | is text about item present on provided images? (answer is yes/no/unknown) | How product state about it ? (answer are "free from" / "made without" / "no contain" / "contain" / "free of" / "no" / "free" / "flavor with" / "other" / "do not use" / "may contain") |  do you know it through which info ? (answer are  "ingredient list"/ "marketing text on product"/ "nutrition fact panel"/ "NA") (answer could be multiple string since the info can appeared in multiple sources) | how do you know that ? |
// | ------- | -------- | ------- | ------- | ------- |
// | omega fatty acids | ...
// | pesticides | ...
// | 1,4-dioxane | ...
// | alcohol | ...
// | allergen | ...
// | gluten | ...
// | aluminum | ...
// | amino acids | ...
// | ammonia | ...
// | cholesterol | ...
// | coatings | ...
// | corn fillers | ...
// | cottonseed oil | ...
// | edta | ...
// | emulsifiers | ...
// | erythorbates | ...
// | expeller-pressed oils | ...
// | fillers | ...
// | fluoride | ...
// | formaldehyde | ...
// | fragrances | ...
// | grain | ...
// | hexane | ...
// | hydrogenated oils | ...
// | kitniyos | ...
// | kitniyot | ...
// | lactose | ...
// | latex | ...
// | msg | ...
// | paba | ...
// | palm oil | ...
// | parabens | ...
// END_SECOND_EXTRA_CLAIM_TABLE

// 8) THIRD_EXTRA_CLAIM_TABLE info recorded in markdown table format below:

// IMPORTANT NOTE:
// + "vegan" not mean "vegan ingredients"

// TABLE FORMAT:
// THIRD_EXTRA_CLAIM_TABLE
// | extra item | is text about item present on provided images? (answer is yes/no/unknown) |  How product state about it ? (answer are "free from" / "made without" / "no contain" / "contain" / "free of" / "no" / "free" / "flavor with" / "other" / "do not use" / "may contain") |  do you know it through which info ? (answer are  "ingredient list"/ "marketing text on product"/ "nutrition fact panel"/ "NA") (answer could be multiple string since the info can appeared in multiple sources) | how to you know that ? |
// | ------- | -------- | ------- | ------- | ------- |
// | petro chemical | ...
// | petrolatum | ...
// | petroleum byproducts | ...
// | phosphates | ...
// | phosphorus | ...
// | phthalates | ...
// | pits | ...
// | probiotics | ...
// | rbgh | ...
// | rbst | ...
// | rennet | ...
// | salicylates | ...
// | sea salt | ...
// | shells pieces | ...
// | shell pieces | ...
// | silicone | ...
// | sles (sodium laureth sulfate) | ...
// | sls (sodium lauryl sulfate) | ...
// | stabilizers | ...
// | starch | ...
// | sulfates | ...
// | sulfides | ...
// | sulfites | ...
// | sulphites | ...
// | sulfur dioxide | ...
// | thc | ...
// | tetrahydrocannabinol | ...
// | toxic pesticides | ...
// | triclosan | ...
// | vegan ingredients | ...
// | vegetarian ingredients | ...
// | yolks | ...
// | binders and/or fillers | ...
// | bleach | ...
// | bpa (bisphenol-a) | ...
// | butylene glycol | ...
// | by-products | ...
// | caffeine | ...
// | carrageenan | ...
// | casein | ...
// | cbd / cannabidiol | ...
// | chlorine | ...
// END_THIRD_EXTRA_CLAIM_TABLE
