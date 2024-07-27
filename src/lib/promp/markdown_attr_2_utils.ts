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
1) To avoid any deduction and ensure accuracy.

2) Only be using the information explicitly provided in the product images and not drawing conclusions based on the ingredient list. I will focus on directly extracting product claims from the text on the packaging and avoid making deductions based on the presence or absence of specific ingredients.
Ex 1: if product have something in ingredient list. That cannot conclude that product claim to have this thing. Claim must be a statement or texts on the packaging make claim on a thing.

4) Product info could contain multiple languages info. Only return provided info in english.

5) There are some tables that i require return row items with specific given condition. Please check it carefully.

6) text such as "Contain: ...", "Free of ...", ... are "marketing text on product".

7) all table names must be in capital letters.

8) Each table have its own assert item list or claim list. Do not interchange item/claim between tables.

9) inferred info is not accepted for claim:
Ex: you are not allow to infer "no animal ingredients" from "organic certifier"

10) do not collect phone number to website list data. 

11) do not bold letter with ** and ** tag 

12) result must be in order and include all tables below (note their formats right below TABLE FORMAT:)
SUGAR_CLAIM_TABLE
FAT_CLAIM_TABLE
PROCESS_CLAIM_TABLE
CALORIE_CLAIM_TABLE
SALT_CLAIM_TABLE
FIRST_EXTRA_CLAIM_TABLE
SECOND_EXTRA_CLAIM_TABLE
THIRD_EXTRA_CLAIM_TABLE
INGREDIENT_TABLE
MARKETING_TABLE
SUPPLY_CHAIN_TABLE
ATTRIBUTE_TABLE

without any number like 1) or 2) before table names
without \`\`\` or \`\`\`markdown closing tag

13) result must include all footer TEX (such as END__THIRD__EXTRA__CLAIM__TABLE,...) at the end of table.

IMPORTANT RULES:
1) return result rules:
+ just only return table with table header and table row data. do not include any other things in the output.

2) Three "extra claim table" rules:
+ text "make without: ..." is in type "marketing text on product".
+ "how product state about it ?" the possible answers of question are  "free from" / "made without" / "no contain" / "contain" / "free of" / "no" / "free" / "flavor with" / "other" / "do not use".

RESULT THAT I NEED:
Carefully examine all text infos, all icons, all logos  from provided images and help me return output with all markdown tables format below remember that all provided images are captured pictured of one product only from different angles.

1) SUGAR CLAIM TABLE info recorded in markdown table format below:

IMPORTANT NOTE:
+ only process with provided sugar items below.

+ possible answers of "how product state about it ?" for sugar claim table  are  "free of"/  "free from" / "made without" / "no contain" / "contain" / "lower" / "low" / "0g" / "zero" / "other" / "does not contain" / "not too sweet" / "low sweet" / "sweetened" / "other".

+ sugar item detected from nutrition fact panel is invalid for sugar claim. Only check sugar item from other sources.

+ possible answers of "how product state about it ?" are "free of"/  "free from" / "made without" / "no contain" / "contain" / "lower" / "low" / "0g" / "zero" / "other" / "does not contain" / "not too sweet" / "low sweet" / "sweetened" / "other".

TABLE FORMAT:
SUGAR_CLAIM_TABLE
| sugar item | is item mentioned on provided images? (answer is yes/no/unknown)? (answer is yes/no/unknown) | How product state about it ?  | do you know it through those sources of info ? (multiple sources allowed and split by "/") (answer are "ingredient list","marketing text on product", "nutrition fact panel", "others")| how do you know ? |
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
END__SUGAR__CLAIM__TABLE

2) FAT_CLAIM_TABLE info of product images recorded in markdown table format below:

TABLE FORMAT:
FAT_CLAIM_TABLE
| fat claim | does product claim that fat claim? (answer are yes/no/unknown) (unknown when not mentioned) | do you know it through those sources of info ? (multiple sources allowed) (answer are "ingredient list"/ "nutrition fact panel"/ "marketing text on product"/ "others") | how do you know that ? and give me you explain (answer in string) |
| ------- | -------- | -------- | -------- |
| is fat free |
| is free of saturated fat |
| is low fat |
| is low in saturated fat |
| have no fat | 
| nonfat |
| have no trans fat |
| is reduced fat |
| is trans fat free | 
| have zero grams trans fat per serving |
| have zero trans fat |
END__FAT__CLAIM__TABLE

3) PROCESS_CLAIM_TABLE info recorded in markdown table format below:

IMPORTANT NOTE:in
+ "live food" is living animals used as food for pet.

TABLE FORMAT:
PROCESS_CLAIM_TABLE
| processing text | do the processing text present on provided images? (answer is yes/no/unknown) (answer is yes/no/unknown)? | do you know it through which info ? (answer are "ingredient list"/ "nutrition fact panel"/ "marketing text on product"/ "others") (answer could be multiple string from many sources) | return exact sentence or phrase on provided image that prove it |
| ------- | -------- | -------- | -------- |
| 100% natural | ...
| 100% natural ingredients | ...
| 100% pure | ...
| acid free | ...
| aeroponic grown | ...
| all natural | ...
| all natural ingredients | ...
| aquaponic/aquaculture grown | ...
| aquaponic grown | ...
| aquaculture grown | ...
| baked | ...
| bake | ...
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
| vegetarian | ...
| vegan diet | ...
| vegan feed | ...
| wild | ...
| wild caught | ...
END__PROCESS__CLAIM__TABLE

4) CALORIE CLAIM TABLE info recorded in markdown table format below:

TABLE FORMAT:
CALORIE_CLAIM_TABLE
| calorie claim | does product explicitly claim the calorie claim? (answer are yes/no/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are "ingredient list"/ "nutrition fact panel"/ "marketing text on product"/ "others") (answer could be multiple string from many sources) |
| ------- | -------- | -------- |
| have low calorie | ...
| have reduced calorie | ...
| have zero calorie | ...
END__CALORIE__CLAIM__TABLE

5) SALT CLAIM TABLE info recorded in markdown table format below:

TABLE FORMAT:
SALT_CLAIM_TABLE
| salt claim | does product explicitly claim this claim? (answer are yes/no/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are "ingredient list"/ "nutrition fact panel"/ "marketing text on product"/ "others") (answer could be multiple string from many sources) |
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
END__SALT__CLAIM__TABLE

6) FIRST EXTRA CLAIM TABLE info recorded in markdown table format below:

IMPORTANT NOTE:
+ text like "contain ..." or "contain no ..." is "marketing text on product" and NOT "ingredient list"

+ "do you know it through those sources info ?" could be multiple sources splitted by "/". Please prioritize read data from the source of "marketing text on product" over other sources.

TABLE FORMAT:
FIRST_EXTRA_CLAIM_TABLE
| extra item | is text about item present on provided images? (answer is yes/no/unknown) | How product state about it ? (answer are "free from" / "made without" / "no contain" / "contain" / "free of" / "no" / "free" / "flavor with" / "other" / "do not use" / "may contain" )  |  do you know it through those sources info ? (answer are  "ingredient list"/ "marketing text on product"/ "nutrition fact panel"/ "NA") | how do you know that? |  
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
END__FIRST__EXTRA__CLAIM__TABLE

7) SECOND_EXTRA_CLAIM_TABLE info recorded in markdown table format below:

IMPORTANT NOTE:
+ no note

TABLE FORMAT:
SECOND_EXTRA_CLAIM_TABLE
| extra item | is text about item present on provided images? (answer is yes/no/unknown) | How product state about it ? (answer are "free from" / "made without" / "no contain" / "contain" / "free of" / "no" / "free" / "flavor with" / "other" / "do not use" / "may contain") |  do you know it through which info ? (answer are  "ingredient list"/ "marketing text on product"/ "nutrition fact panel"/ "NA") (answer could be multiple string since the info can appeared in multiple sources) | how do you know that ? |
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
END__SECOND__EXTRA__CLAIM__TABLE

8) THIRD_EXTRA_CLAIM_TABLE info recorded in markdown table format below: 

IMPORTANT NOTE:
+ "vegan" not mean "vegan ingredients"

TABLE FORMAT:
THIRD_EXTRA_CLAIM_TABLE
| extra item | is text about item present on provided images? (answer is yes/no/unknown) |  How product state about it ? (answer are "free from" / "made without" / "no contain" / "contain" / "free of" / "no" / "free" / "flavor with" / "other" / "do not use" / "may contain") |  do you know it through which info ? (answer are  "ingredient list"/ "marketing text on product"/ "nutrition fact panel"/ "NA") (answer could be multiple string since the info can appeared in multiple sources) | how to you know that ? |
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
END__THIRD__EXTRA__CLAIM__TABLE

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

+ "ingredient list info" could be obscured due to crop image since the photos of product was taken from different angles. Try to merge into one ingredient list statement if they are same ingredient info.  

TABLE FORMAT:
INGREDIENT_TABLE
| product type from nutrition panel ? (answer is "nutrition facts" / "supplement facts" / "unknown") | prefix text of ingredient list (answer are "other ingredients:" / "ingredients:") | ingredient statement | ingredient break-down list from ingredient statement (each ingredient splitted by "/") | live and active cultures list statement | live and active cultures break-down list (each item splitted by "/")  | 
| ------- | ------- | -------- | -------- | -------- | -------- |
END__INGREDIENT__TABLE

10) Marketing info with table format below:

IMPORTANT NOTES:
+ "youtube icon type" have 2 types (answer is type_1/type_2)
type_1 is youtube icon have two texts "you" and "tube" on it.
type_2 is youtube icon of youtube logo with play button without name youtube

+ "social media list" is the list of social media method mentioned on product images (such as "facebook", "google", "instagram", "pinterest", "snapchat", "tiktok", "youtube", "twitter", ...).

+ "website list" are all website links found on product (website link exclude "nongmoproject.org") and be careful the content after website could be phone number.
Example 1: www.cocacola.com, www.cocacola.com/policy, www.cocacola.com/fanpage, cocacola.com
Example 2: if text "coca.com . 555/200-3529" it seem that "555/200-3529" is a phone number or other number not belong to website link "coca.com"

+ "social media text" is a list of text usually start with "@", or "#" those can be used to search the product on social media. Hint, it is usually next to social media icons.
Example 1: @cocacola

+ "enlarge to show" is true if statement such as "enlarged to show..." seen on product image.

TABLE FORMAT:
MARKETING_TABLE
| have QR code (answer is boolean) | have Instagram icon or info ? | have Pinterest icon or info ? | have Youtube icon or info ? | youtube icon type (if have youtube icon or info )  | have Facebook icon or info ? | have twitter icon or info ? | social media list | website list (multiple split by comma) | social media text list | enlarged to show (answer is boolean) |
| ------- | -------- | -------- | ------- | ------- | ------- | -------- | -------- | ------- | ------- | ------- |
END__MARKETING__TABLE

11) supply chain info with table format below:

IMPORTANT NOTES:
+ "country of origin text" example
Ex 1: "manufactured in Canada"
Ex 2: "made in Brazil"
EX 3: "produced in Brazil"

+ "country of origin" example
Ex 1: "Canada"
Ex 2: "Brazil"

+ "manufacturer" is The company that makes the product.
+ "distributor" is The company that sells the product, but does not make it.

+ "distributor info" rules
Example 1: "distributed by Krogger 53 Cowsansview Road, ON N1R7L2, Canada"
Example 2: "distributor: Krogger 53 Cowsansview Road, ON N1R7L2, Canada"

+ "manufacturer info" rules
Example 1: "manufactured by Coca-cola 53 Cowsansview Road, ON N1R7L2, Canada"
Example 2: "produced by Coca-cola 53 Cowsansview Road, ON N1R7L2, Canada"

TABLE FORMAT:
SUPPLY_CHAIN_TABLE
| info item | value |
| ------- | -------- |
| country of origin text | ...
| country of origin | ...
| distributor info |
| manufacturer info |
| distributor name | 
| distributor city | 
| distributor state |
| distributor zipCode |
| distributor phone number |
| manufacture name | 
| manufacture date | 
| manufacture phone number | 
| manufacture street name | 
| manufacture city | 
| manufacture state 
| manufacture zipCode |
END__SUPPLY__CHAIN__TABLE

12) some other attribute info recorded with table format below:

TABLE FORMAT:
ATTRIBUTE_TABLE
| grade (answer are 'A'/ 'B') | juice percent (answer is number) |
| ------- | ------- |
END__ATTRIBUTE__TABLE

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
