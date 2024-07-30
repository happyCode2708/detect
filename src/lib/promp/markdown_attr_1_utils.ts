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

// VALIDATION AND FIX BUGS:
// 1) To avoid any deduction and ensure accuracy.

// 2) Product info could contain multiple languages info. Only return provided info in english.

// 3) There are some tables that i require return row items with specific given condition. Please check it carefully.

// 4) text such as "Contain: ...", "Free of ...", ... are "marketing text on product".

// 5) all table names must be in capital letters.

// 6) result must be in order and include all tables below (note their formats right below TABLE FORMAT: or INFO FORMAT:)
// COOKING_INSTRUCTION
// STORAGE_INSTRUCTION

// without any number like 1) or 2) before table names
// without \`\`\` or \`\`\`markdown closing tag

// 13) result must include all footer TEXT (such as END__COOKING__INSTRUCTION,...) at the end of table.

// "recipe name": str,
// "ingredients: str[],
// "introduction of cooking instructions": str[],

export const make_markdown_attr_1_prompt = ({
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

2) Product info could contain multiple languages info. Only return provided info in english.

3) result must be in order and include all tables content below (note their formats right below TABLE FORMAT: or INFO FORMAT:)
COOKING_INSTRUCTION_OBJECT
STORAGE_INSTRUCTION
USAGE_INSTRUCTION
INFORMATION_INSTRUCTION
LABELING_INFO_TABLE
LABELING_INFO_ANALYSIS_TABLE
ALLERGEN_OBJECT
HEADER_OBJECT
BASE_CERTIFIER_CLAIM_TABLE
INGREDIENT_TABLE
MARKETING_OBJECT
SUPPLY_CHAIN_OBJECT
ATTRIBUTE_TABLE

without any number like 1) or 2) before table names
without \`\`\` or \`\`\` closing tag

4) result must include all footer TEXT (such as END_SUPPLY_CHAIN_OBJECT,...) at the end of each table. 

5) do not add examples to return result. Please only return info that visibly seen from provided images.

RESULT THAT I NEED:
Carefully examine all text infos, all icons, all logos  from provided images and help me return output with all markdown tables format below (INFO FORMAT: or TABLE FORMAT:) remember that all provided images are captured pictured of one product only from different angles.

1) cooking instruction info recorded with format below:

IMPORTANT NOTE:
+ if no instruction found just left it empty.
+ "recipe ingredient list" only provide list info if recipe have ingredient list info.

INFO FORMAT:
COOKING_INSTRUCTION_OBJECT
[
{
  "recipes": [{
    "recipe name": str,
    "recipe ingredient list": str[] | null,
    "cooking steps": str[],
    }],
  "all other text or paragraph about cooking info": str[]
}
]
END_COOKING_INSTRUCTION_OBJECT

2) storage  instruction info recorded with format below:

IMPORTANT NOTES:
+ "storage instruction" are all instruction texts about how to storage product.
Example 1: "reseal for freshness", "keep refrigerated",...

INFO FORMAT:
STORAGE_INSTRUCTION
{
  "storage instructions": str[]
}
END_STORAGE_INSTRUCTION

3) usage instruction info recorded with format below:

IMPORTANT NOTES:
+ "usage instructions" are all instruction text about how to use product excluding all "cooking instructions" 
Example 1: "suggested use: 2 cups at one time."

INFO FORMAT:
USAGE_INSTRUCTION
{
  "usage instructions": str[]
}
END_USAGE_INSTRUCTION

4) information instruction info recorded with format below:

IMPORTANT NOTES:
+ "information instructions" are some kind of informative instructions for consumer.
Example 1: "See nutrition info for saturated fat"

INFO FORMAT:
INFORMATION_INSTRUCTION
{
  "information instructions": str[]
}
END_INFORMATION_INSTRUCTION


5) LABELING INFO TABLE info recorded in markdown TABLE FORMAT below

IMPORTANT NOTE:
+ "label item" could be easily detected by some icons or logos or label text provided images.

+ "label item" could be "certification label", or "label text" seen on provided images that indicate some attributes of product.
Example 1: "SOY FREE" label text
Example 2: "NUT FREE" label text

+ remember when product state "something free" it mean product free of that thing (such as soy free, dairy free, ...)
Example 1: "gluten free" mean product not contain "gluten"
Example 2: "nuts free" mean product not contain "nuts"

TABLE FORMAT:
LABELING_INFO_TABLE
| label item | label item type on product (answer is "certification label"/ "label text"/ "other") (if type "other" tell me what type you think it belong to) | what label item say ? |
| -------- | ------- | -------- |
END_LABELING_INFO_TABLE

6) LABELING INFO ANALYSIS TABLE recorded in markdown TABLE FORMAT below

IMPORTANT NOTE:
+ "label info analysis table" is the analyzing table for all label item in the table of LABELING_INFO_TABLE.

TABLE FORMAT:
LABELING_INFO_ANALYSIS_TABLE
| label item | do label indicate product does not contain something? (answer is yes/no) | what are exactly things that product say not contain from the label item (split things by "/" for multiple if needed) |
| ------- | -------- | -------- |
END_LABELING_INFO_ANALYSIS_TABLE

7) Allergen info recorded in the format below:
 
IMPORTANT NOTE:
+ tree nuts also includes "coconut"

+ "all statements about allergens product contain" are the all contexts that you found on provided images about allergen info, usually start with "contains:", "contain", "may contain", "may contain:", "allergen statement:, ... NOT due to sharing manufacturing equipments and NOT due to manufactured in same facility with other products.
"all statements about allergens product contain" is not from ingredient list or recipe
Example 1: "allergen statement: contains milk"
Example 2: "may contain: milk, peanut"
Example 3: "contain: milk, peanut"

+ "allergens contain statement break-down list" is the allergen ingredients list from "all statements about allergens product contain" and do not collect from product ingredient list.
+ "allergens contain statement break-down list" is a string list array (str[])
Example 1: ["oats", "milk"]
Example 2: ["peanut", "dairy", "tree nuts"]


+ "statement about allergens on manufacturing equipments or from facility" are the exact contexts that you found on provided images about allergens that said they present on the product since manufacturing equipments are also used to make other product, or in the same facility ,or shared machinery.
"statement about allergens on manufacturing equipments or from facility" could be easily detected with statements with some texts such as "produced in a facility ...", "Manufactured in facility that ... ", "Made on equipment that process ... "
Example 1: "produced in a facility that uses soy, and peanut"
Example 2: "Manufactured in facility that also processes peanut, milk"
Example 3: "Made on equipment that process peanut"

+ "allergens list from manufacturing equipments or from facility" is the break-down list of all ingredients that is claim to present in facility or manufacturing equipments. Do not include ingredients that say is not present on facility or manufacturing equipment.
Example 1: "Manufactured in a egg and milk free facility that also processes peanut, wheat products" should be recorded as "peanut/wheat" since text "in a egg and milk free facility" mean the egg and milk is not present in facility.

+ "exact text on images about allergens that product does not contain" are the exact contexts that you found on provided images about allergen info, that product claim to not contain or free of or free.
example 1: "contain no wheat, milk"
example 2: "does not contain wheat, milk"
example 3: "free of wheat, milk"
example 4: "non-dairy" text mean does not contain allergen ingredient of "dairy"
example 5: "no egg"
example 6: "soy free", "dairy-free"

INFO FORMAT:
ALLERGEN_OBJECT
{
  "allergens contain": 
  {
    "all statements about allergens product contain": str[],
    "allergens contain statement break-down list": str[]
  },
  "allergens on equipments or in facility":
  {
    "all statements about allergens on manufacturing equipments or from facility": str[],
    "allergens list from manufacturing equipments or from facility": str[],
    "allergens list not present in facility": str[],
  },
  "allergens product info state not contain": 
  {
    "exact all texts or statements on images about allergens that product does not contain": str[],
    "allergens product does not contain break-down list": str[]
  }
}
END_ALLERGEN_OBJECT

8) Header info with table format below:
IMPORTANT NOTE:
+ header table only have 1 row item so you must carefully examine the images.
+ "primary size" and "secondary size" and "third size" are a quantity measurement of product in there different unit of measurement. They are not info from "serving size" in nutrition fact panel.
Example 1: for "WT 2.68 OZ (40g)" should be recorded as
{
  "primary size": "2.68 OZ",
  "secondary size": "40g"
}
Example 2: for "32 fl oz ( 2 pt ) 946 mL" should recorded as
{
  "primary size": "32 fl oz",
  "secondary size" = "2 pt",
  "third size" = "946 mL"
}
Example 3: for "100 capsules" should recorded as
{
  "primary size" = "100 capsules"
}
Example 4: for "20-4 OZ ( 60G ) TUBES / NET WT . 3 LB ( 853G )" should recorded as
{
  "primary size": "3 LB",
  "secondary size" = "853G"
}
Example 5: for "NET WT 1LB 2.7OZ (0.53KG)" should recorded as
{
  "primary size": "0.53KG",
  "secondary size": null
}
because "1LB 2.7OZ" = "0.53KG" and "1LB 2.7OZ" have two different size uom so it is invalid to record as size value

Example 6: for "NET WT 26 OZ (1 LB 10 OZ) 737G" should recorded as
{
  "primary size": "26 OZ",
  "secondary size": "737G"
}
because "1 LB 10 OZ" = "26 OZ" and "1 LB 10 OZ" have two different size uom so it is invalid to record as size value



+ just collect size in order. If production mention three type of uom it will have third size

+ "primary size" must content quantity value number and its oum (same for primary size, and third size)

+ "count" is the count number of smaller unit inside a package, or a display shipper, or a case, or a box (such as count of servings, count of capsules, count of pills, ...).

+ "full statement about product size" is the whole size statement text found on product images that might includes all texts about primary size, secondary size,  third size and serving amounts if exits  but not info from nutrition panel
Ex 1: "Net WT 9.28oz(260g) 10 cups"
Ex 2: "16 FL OZ (472 ML)
Ex 3: "900 CAPSULES 400 servings"
Ex 4: "24 K-CUP PODS - 0.55 OZ (5.2)G/EA NET WT 4.44 OZ (38g)"

INFO FORMAT:
HEADER_OBJECT
{
  "product info": {
    "product name": str,
    "company name": str,
    "brand name": str
  },
  "product size": {
    "full statement about product size": str,
    "primary size": str,
    "secondary size": str,
    "third size": str,
    "count": str,
    "count uom": str
  }
}
END_HEADER_OBJECT


9) Base certifier claim info with table format below:

IMPORTANT_NOTES:
+ carefully check for text or certifier logo that could indicate "base certifier claim" from provided image
Ex: logo U kosher found mean "kosher claim" = "yes" 

TABLE FORMAT:
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
END_BASE_CERTIFIER_CLAIM_TABLE


9) Ingredient info with table format below:

IMPORTANT NOTE:
+ is the list of statements about ingredients of product (since product can have many ingredients list)

+ "ingredient statement" is content start right after a prefix text such as "ingredients:" or "Ingredients:" or "INGREDIENTS:" or "other ingredients:".

+ "ingredient break-down list from ingredient statement" is the list of ingredients in ingredient statement split by "/" (do not split sub-ingredients of an ingredient)
Example 1: "Cookies ( Gluten Free Oat Flour , Organic Coconut Sugar , Sustainable Palm Oil),  Creme Filling (milk, onion) , Potato" should be recorded as "Cookies ( Gluten Free Oat Flour , Organic Coconut Sugar , Sustainable Palm Oil)/Creme Filling (milk, onion)/Potato"
Example 2: "Noodle (flour, egg, water), Sauce(Tomato, water)" should be recorded as "Noodle (flour, egg, water)/Sauce(Tomato, water)"

+ "product type from nutrition panel" could be detected through nutrition panel text title which are NUTRITION FACTS or SUPPLEMENT FACTS

+ each ingredient in ingredient break-down list must be splitted by "/" character and NOT split by table cell

+ "live and active cultures list statement" is statement about list of living organisms (such as Lactobacillus bulgaricus and Streptococcus thermophilus—which convert pasteurized milk to yogurt)
Example 1: "CONTAINS 5 LIVE AND ACTIVE CULTURES S. THERMOPHILUSB, L. RHAMNOSUS, LACTOBACILLUS LACTIS, L. BULGARICUS"
Example 2: "CONTAINS 6 LIVE AND ACTIVE CULTURES S. THERMOPHILUSB, L. CASEI, L. BULGARICUS, L. RHAMNOSUS, LACTOBACILLUS LACTIS"

+ "ingredient list info" could be obscured due to crop image since the photos of product was taken from different angles. Try to merge into one ingredient list statement if they are same ingredient info.  

TABLE FORMAT:
INGREDIENT_TABLE
| product type from nutrition panel ? (answer is "nutrition facts" / "supplement facts" / "unknown") | prefix text of ingredient list (answer are "other ingredients:" / "ingredients:") | ingredient statement | ingredient break-down list from ingredient statement (each ingredient splitted by "/") | live and active cultures list statement | live and active cultures break-down list (each item splitted by "/")  | 
| ------- | ------- | -------- | -------- | -------- | -------- |
END_INGREDIENT_TABLE

10) Marketing info with format below:

IMPORTANT NOTES:
+ "website link" is website url link text visibly seen on product image.

+ "social media methods on product images" can only be detected through "social media method name" or "social media icon/logo".

INFO FORMAT:
MARKETING_OBJECT
{
  websites:[
    {
      "website link": str,
    }
  ]
}
END_MARKETING_OBJECT

11) supply chain info with format below:

IMPORTANT NOTES:
+ "statement indicate from which nation product was made in" is text about the nation where a product was manufactured, produced, or grown.
Example 1: "manufactured in Canada"
Example 2: "made in Brazil"
Example 3: "produced in Brazil"
Example 4: "product of France"

+ "country of origin from made in statement" is exact country name (found on product images) found on product images where the product was manufactured, produced, or grown.
Example 1: "Canada"
Example 2: "Brazil"
Example 2: "UK"

+ "full address statement" rules:
Example 1: "distributed by: Coca-cola 53 Cowsansview Road, ON N1R7L2, Canada"
Example 2: "Coca-cola 53 Cowsansview Road, ON N1R7L2, Canada"
Example 3: "Heneiken Inc 999 SE HILL COURT, Milwaukie, ON N1R7L2 Canada"
Example 4: "manufactured by Coca-cola 53 Cowsansview Road, ON N1R7L2, Canada"
Example 5: "produced by Coca-cola 53 Cowsansview Road, ON N1R7L2, Canada"
Example 6: "distributed by Coca-cola 53 Cowsansview Road, ON N1R7L2, Canada"
Example 7: "dist. by: Coca-cola 53 Cowsansview Road, ON N1R7L2, Canada"
Example 8: "MANUFACTURED FOR DISTRIBUTION BY: Coca-cola 53 Cowsansview Road, ON N1R7L2, Canada"
Example 9: 
"DISTRIBUTED BY: 
Coca-cola 53 Cowsansview Road, ON N1R7L2, Canada"

+ "prefix address" is a prefix text prior of address
Example 1: "MANUFACTURED FOR DISTRIBUTION BY:"
Example 2: "DISTRIBUTED BY:"
Example 3: "manufactured by"
Example 4: "DISTRIBUTED BY:"
Example 5: "manufacture for"

INFO FORMAT:
SUPPLY_CHAIN_OBJECT
{
  "address info": [
    {
      "address type": "distributor" | "other",
      "prefix address": str,
      "full address statement": str,
      "company name": str,
      "street number": str,
      "street name": str,
      "city": str,
      "state": str,
      "zipCode": str,
      "phone number": str
    }
  ],
  "country info": [
    {
      "statement indicate from which nation product was made in": str,
      "country of origin from made in statement": str
    }
  ],
}
END_SUPPLY_CHAIN_OBJECT

12) some other attribute info recorded with table format below:

TABLE FORMAT:
ATTRIBUTE_TABLE
| grade (answer are 'A'/ 'B') | juice percent (answer is number) |
| ------- | ------- |
END_ATTRIBUTE_TABLE
`;
};

// + list:contain
// "corn"
// "crustacean shellfish"
// "dairy"
// "egg"
// "fish"
// "milk"
// "oats"
// "peanuts / peanut oil"
// "phenylalanine", "seeds"
// "sesame"
// "soy / soybeans"
// "tree nuts"
// "wheat".

// and "statements that tell allergen things product does not contain" could be claim from a label text on product images about allergen thing that not contain or free of or free.

// + "allergen does-not-contain statement or label" are the exact contexts that you found on provided images about allergen info, that product claim to not contain or free of or free.
// ane "allergen does-not-contain statement or label" could be claim from a label on product images about allergen thing that not contain or free of or free.
// | statements or labels that tell allergen things product does not contain |

// | allergen info | value 1 | value 2 | ...
// | ------- | -------- | -------- | ...
// | allergen contain on equipment statement |
// | allergen contain on equipment break-down list for that statement (split by "/") |
// | allergen contain statement | allergen contain break-down list from that statement (split by "/") |
// | statements or labels that tell allergen things product does not contain |
// | break-down list from statements or label that about allergen things product does not contain  (split by "/") |

//* calorie
// CONDITION FOR ROW TO SHOW FOR TABLE BELOW:
// + only return row items that its "does product explicitly claim the calorie claim" value = "yes" and remove all rows with "does product explicitly claim the calorie claim" value = "unknown" or "no")

//* fat claim
// CONDITION FOR ROW TO SHOW FOR TABLE BELOW:
// + only return row items that its "does product explicitly claim this claim" value = "yes" and remove all rows with "does product explicitly claim this claim" value  = "unknown" or "no" )

//* first claim
// CONDITION FOR ROW TO SHOW FOR TABLE BELOW:
// + have no rows return condition it means that you must return all rows items listed below

//* proces
// CONDITION FOR ROW TO SHOW IN TABLE BELOW:
// + only return row items that its "does product explicitly claim this claim" value = "yes" and remove all rows with "does product explicitly claim this claim" value = "unknown" or "no")

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

// | full text about distributor |
//"all statements about allergens product contain" is not from ingredient list or recipe
