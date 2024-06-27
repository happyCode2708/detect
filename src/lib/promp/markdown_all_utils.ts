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
3) Only return all markdown tables that i require you to return.

IMPORTANT RULES:
1) "allergen" rules:
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

+ "allergen does-not-contain statement" is the statement about the allergen ingredient that product does not contain (such as "free of ...", "do not contain ...", "non-...", ...)
Ex 1: "non-dairy" text mean does not contain allergen ingredient of "dairy"

2) "extra claim list" rules:
+ "added color" claim does not mean product claim "artificial color".
+ "added color" claim does not mean product claim "artificial color".
+ "vegan" text only does not mean "vegan ingredients"
+ "natural" text only does not mean "natural ingredients"

3) "sugar claim list" rules:
+ "contain unsweetened" claim does not mean "no contain sugar added"

RESULT THAT I NEED:
Please carefully examine provided images above. They are captured images of one product, and return info from provided images that match all listed requirements and rules above with all markdown tables format below

1) extra claim list info recorded in markdown table format below (only return row item with "mentioned in product info" = true )

EXTRA_CLAIM_TABLE
| extra item |  explicitly and directly mentioned in product info without implied from other text (answer is true/false/unknown) | Does the product explicitly state contain it ? (answer is yes/no) |  Does the product explicitly state to not contain it ? (answer is yes/no)  |  do you know it through which info ? (answer are  "ingredient list"/ "marketing text on product"/ "nutrition fact"/ "others") (answer could be multiple string since the info can appeared in multiple sources) | how do you know that ? and give me you explain (answer in string) |
| ------- | -------- | ------- | ------- |
| 1,4-dioxane | ...
| active yeast | ...
| added antibiotics | ...
| added colors | ...
| added dyes | ...
| added flavors | ...
| added fragrances | ...
| added hormones | ...
| added nitrates | ...
| added nitrites | ...
| added preservatives | ...
| additives | ...
| alcohol | ...
| allergen | ...
| aluminum | ...
| amino acids | ...
| ammonia | ...
| animal by-products | ...
| animal derivatives | ...
| animal ingredients | ...
| animal products | ...
| animal rennet | ...
| antibiotics | ...
| artificial additives | ...
| artificial colors | ...
| artificial dyes | ...
| artificial flavors | ...
| artificial fragrance | ...
| artificial ingredients | ...
| artificial preservatives | ...
| binders and/or fillers | ...
| bleach | ...
| bpa (bisphenol-a) | ...
| butylene glycol | ...
| by-products | ...
| caffeine | ...
| carrageenan | ...
| casein | ...
| cbd / cannabidiol | ...
| chemical additives | ...
| chemical colors | ...
| chemical dyes | ...
| chemical flavors | ...
| chemical fragrances | ...
| chemical ingredients | ...
| chemical preservatives | ...
| chemical sunscreens | ...
| chemicals | ...
| chlorine | ...
| cholesterol | ...
| coatings | ...
| corn fillers | ...
| cottonseed oil | ...
| dyes | ...
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
| hormones | ...
| hydrogenated oils | ...
| kitniyos / kitniyot (legumes) | ...
| lactose | ...
| latex | ...
| msg | ...
| natural additives | ...
| natural colors | ...
| natural dyes | ...
| natural flavors or naturally flavored | ...
| natural ingredients | ...
| natural preservatives | ...
| nitrates/nitrites | ...
| omega fatty acids | ...
| paba | ...
| palm oil | ...
| parabens | ...
| pesticides | ...
| petro chemical | ...
| petrolatum | ...
| petroleum byproducts | ...
| phosphates | ...
| phosphorus | ...
| phthalates | ...
| pits | ...
| preservatives | ...
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
| synthetic additives | ...
| synthetic colors | ...
| synthetic dyes | ...
| synthetic flavors | ...
| synthetic fragrance | ...
| synthetic ingredients | ...
| synthetic preservatives | ...
| synthetics | ...
| thc / tetrahydrocannabinol | ...
| toxic pesticides | ...
| triclosan | ...
| vegan ingredients | ...
| vegetarian ingredients | ...
| yeast | ...
| yolks | ...

2) Sugar claim info recorded in markdown table format below (only return row item with "does product claim that sugar claim" = true )

SUGAR_CLAIM_TABLE
| sugar claim | does product claim that sugar claim? (answer are true/false/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are "ingredient list"/ "nutrition fact"/ "marketing text on product"/ "others") (answer could be multiple string from many sources) (answer could be multiple string from many sources)| how do you know that ? and give me you explain (answer in string) |
| ------- | -------- | -------- |
| contain acesulfame k | ...
| contain agave | ...
| contain allulose | ...
| contain artificial sweetener | ...
| contain aspartame | ...
| contain beet sugar | ...
| contain cane sugar | ...
| contain coconut/coconut palm sugar | ...
| contain fruit juice | ...
| contain high fructose corn syrup | ...
| contain honey | ...
| contain low sugar | ...
| contain lower sugar | ...
| contain monk fruit | ...
| contain natural sweeteners | ...
| no contain acesulfame k | ...
| no contain added sugar | ...
| no contain agave | ...
| no contain allulallallose | ...
| no contain artificial sweetener | ...
| no contain aspartame | ...
| no contain cane sugar | ...
| no contain coconut/coconut palm sugar | ...
| no contain corn syrup | ...
| no contain high fructose corn syrup | ...
| no contain refined sugars | ...
| no contain saccharin | ...
| no contain splenda/sucralose | ...
| no contain stevia | ...
| no contain sugar | ...
| no contain sugar added | ...
| no contain sugar alcohol | ...
| no contain tagatose | ...
| no contain xylitol | ...
| contain reduced sugar | ...
| contain refined sugar | ...
| contain saccharin | ...
| contain splenda/sucralose | ...
| contain stevia | ...
| contain sugar alcohol | ...
| contain sugar free | ...
| contain sugars added | ...
| contain tagatose | ...
| contain unsweetened | ...
| contain xylitol | ...

3) Fat claim info of product images recorded in markdown table format below (only return row item with "does product claim that fat claim" = true )

FAT_CLAIM_TABLE
| fat claim | does product claim that fat claim? (answer are true/false/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are "ingredient list"/ "nutrition fact"/ "marketing text on product"/ "others") (answer could be multiple string from many sources) | how do you know that ? and give me you explain (answer in string) |
| ------- | -------- | -------- |
| fat free | ...
| free of saturated fat | ...
| low fat | ...
| low in saturated fat | ...
| no fat | ...
| no trans fat | ...
| reduced fat | ...
| trans fat free | ...
| zero grams trans fat per serving | ...
| zero trans fat | ...

4) other claim list info recorded in markdown table format below (only return row item with "does product explicitly claim this claim" = true )

OTHER_CLAIM_TABLE
| other claim | does product explicitly claim this claim? (answer are true/false/unknown) (unknown when not mentioned) | do you know it through which info ? (answer are "ingredient list"/ "nutrition fact"/ "marketing text on product"/ "others") (answer could be multiple string from many sources) | how do you know that ? and give me you explain (answer in string) |
| ------- | -------- | -------- |
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
| low carbohydrate | ...
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

5) Allergen info recorded in markdown table format below
 
ALLERGEN_TABLE
| allergen contain statement (usually text after "contain:") (answer is exact texts  on product)  | allergen does-not-contain statement (answer is exact texts on product) | allergen statement about things contain on manufacture equipments | 
| ------- | -------- | -------- |

6) Debug table is gemini answer recorded in markdown table format below

DEBUG_TABLE
| question (question from DEBUG LIST below) | gemini answer |
| ------- | -------- |

DEBUG LIST:
1) i see you think too deeply for example when you see "free from artificial flavor" and you think product claim "does not contain added flavor". That is not what i want it must say that product claim "does not contain artificial flavor". I do not how to prompt and make you understand that so next time you will no make same mistake help me write prompt sentences to fix that
2) the problem is that some claim you concluded from ingredient list? but the product claim is not retrieved from ingredient list
`;
};

// 3) i only require the result of table with nutrient row that match my conditions but i see you actually created row with initial data not provided by me ? i do not want that can you help me with write prompt to fix that?
