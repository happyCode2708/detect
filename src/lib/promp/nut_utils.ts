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

// "answerOfDebug_4": your answer gemini (help me list all nutrients with their quantity and oum, and percent daily value as well as a long string here at this field "answerOfDebug_4". Please combine the given OCR text and what you see to make sure the result is correct),
// "answerOfDebug_4": your answer gemini (Lis?),
// "answerOfDebug_4": your answer gemini (what is  "(240 mcg Folic Acid)" in the fact panel?),
// "answerOfDebug_4": your answer gemini (be careful sometimes you can see the "nutrients.quantityDescription" in the parentheses at the bottom of "nutrients.quantity"),

// "answerOfDebug_5": "your answer gemini" (help me list all nutrient in type of Extract as string to this field "answerOfDebug_5"),
// "answerOfDebug_6": your answer gemini (Why i see "Extract" word in descriptor? I told you if you see a nutrient Extract the descriptor must be the text after word "Extract"? Look at Value of "answerOfDebug_5" for reference),
export const make_nut_prompt = ({
  ocrText,
  imageCount,
}: {
  ocrText?: string;
  imageCount?: number;
}) => {
  return `
  Some common constants:
  + FOOTNOTE_INDICATORS = ["*", "**", "†", "¥", "‡", "†††"]
  
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
      "answerOfDebug_3": your answer gemini (why i see you keep removing the mix of ingredients out of nutrients list ? remember nutrient could be also an ingredient, or a mix of ingredient, or a blend of something),
      "answerOfDebug_4": your answer gemini (Are you sure you see percent daily value of Protein is 0%?),
      "answerOfDebug_5": your answer gemini (I told you if you see a nutrient in type of Extract so its descriptor must be the text after word "Extract"?),
      "answerOfDebug_6": your answer gemini (why you keep read info as new nutrient but the content info is not separated by line?),
      "answerOfDebug_7": your answer gemini (remember "total sugar" and "added sugar" are separated nutrient"),
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
            "value": string, 
            "uom": string,
            "equivalent": {
              "value": string, 
              "uom": string,
            }, 
          },
          "servingPerContainer":" {"value": float? or number?, "uom": string},
          "nutrients": [
            {
              "fullNutrientInfo": string, // include quantity information, percent daily value
              "name": string,
              "descriptor": string,
              "have_intended_nutrient_row_below": boolean,
              "contain_sub_ingredients": [{
                 full_name: string,
                 quantity: string,
                 uom: string,
              },...],
              "quantityComparisonOperator": string?, value: float?, uom: string, 
              "quantityEquivalent": string?,
              "dailyPercentComparisonOperator": string?, 
              "percentDailyValue": float?,  
              "footnoteIndicator": string?, // value must be choosen from FOOTNOTE_INDICATORS,
              "intended_level": number, // from 0 to 3
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
+ Read "Fact Panel" from left to right and from top to bottom. If the nutrient in vertical layout just start to read with the first nutrient which is at below the header of "Nutrition Facts" or "Supplement Facts".
+ content in prompt can be similar to typescript and nodejs syntax.
+ be careful the last "nutrient row" could be misread to be a part of "footnote". Remember "footnote" content ususally about "Daily value" or "percent daily value" note.
+ do not return json in format [{product: {...}}] since the result is only for one product

Nutrient rule:
1) sometimes nutrients could be put vertically and separated by • symbol and • symbol is not the 'nutrients.footnoteIndicator'

2) The nutrition fact panel could be in the "dual-column" layout showing both "per serving" and "per container" information, or different "% Daily value" by age. Let's to break down and separate into two different fact panels one is for 'per serving'
and other for 'per container' just if "amoutPerServing.percentDailyValueFor" of them are different or "servingSize" of them are different. These two fact panels have the same value of "servingPerContainer", "footnote', "nutrients" but each "nutrients" could have different "footnoteIndicator".

3) "factPanels.panelName":
+ if there is text on image contain "Nutrition Facts" or "Supplement Facts". If not it should be null

4) "nutrients" rules: 
+ some nutrients such as ("Total Carbohydrate", "total sugar", "Includes... Added Sugars", ...) and they are must be separated nutrients
+ Most of the time the each nutrient will be seperated by horizontal line for vertical layout. So that the content between two line is definitely belong to one nutrient and the content could be multiple lines of info. So be careful when you list the nutrient.

6) "nutrients.servingSize":
+ is info about serving size on nutrition fact panel. if serving size info have the parentheses the "servingsize.value" and "servingSize.uom" will be between the parentheses
Ex 1: "10 tablespoons(80g)" = {servingSize: { "value": 10, "uom": "tablespoons", equivalent: {"value": 80, "uom": "g"}}}
Ex 2: "10 tablespoons" = {servingSize: {"value": 10, "uom": "tablespoons"}}
Ex 3: "10 bars(200g)" = {servingSize: { "value": 10, "uom": "bars"}, equivalent: {"value": 200, "uom": "g"}}
Ex 4: "10 cups(10 ml)" = {servingSize: {"value": 10, "uom": "cups"}, equivalent: {"value": 10, "uom": "ml"}}
Ex 5: "1 cup(4 fl oz/120ml)" = {servingSize: {"value": 1, "uom": "cup"}, equivalent: {"value": 4, "uom": "fl oz"}}
Ex 6: "3 tbsp(60ml)" = {servingSize: {"value": 3, "uom": "tbsp"}, equivalent: {"value": 60, "uom": "ml"}}

7) "nutrient.descriptor":
+ "nutrient.descriptor" is very complicated to extract so please follow all example below to learn how to extract
+ "nutrient.descriptor" could be the content in parentheses start with "as"
Ex: Vitamin D3 (as cholecalciferol) = {"descriptor": "(as cholecalciferol)"}

+ "nutrient.descriptor" could be the content in parentheses show up equivalent chemical subtance, equivalent ingredient, or equivalent extract
Ex 1: Folate (660 mcg L-5-methyltetrahydrofolate) = {"descriptor": "(660 mcg L-5-methyltetrahydrofolate)"}
Ex 2: aloesorb (aloe leaf) = {"descriptor": "(aloe leaf)"}

+ "nutrient.descriptor" could be the content in parentheses show the explaination for nutrient.
Ex: Calcium (extract from egg) = {"descriptor": "(extract from egg)"}

+ "nutrient.descriptor" could be the content in parentheses show the a phrase that could be the other name of nutrient
Ex: One Day complex® (fruits blend) = {"descriptor": "(fruits blend)"}

+ "nutrient.descriptor" could be all a content that below the nutrient name and a very detail explaination for that nutrient
Ex: Lavender flower (Lavandula angustifolia) O extract 593 mg = {"descriptor": "(Lavandula angustifolia) O extract 593 mg"}

+ "nutrient.descriptor" could be the content right after the main nutrient name. (you could easily recognized by the consecutive parentheses with content inside)
Ex: L-5 Hydroxytryptophan (5-HTP) (from Griffonia simplicifolia seed) = {"descriptor": "(5-HTP) (from Griffonia simplicifolia seed)"}

+ Be careull the nutrient could be an Extract so its name must contain "Extract" in nutrient name. And the "nutrient.descriptor" will be the remaining text after word "Extract".
Ex 1: "Holy Basil (Ocimum sanctum) (herb) Extract" ={name: "Holy Basil (Ocimum sanctum) (herb) Extract", descriptor": null}
Ex 2: "Holy Basil (Ocimum sanctum) (herb) Extract standardized to banana 20gram" ={name: "Holy Basil (Ocimum sanctum) (herb) Extract", descriptor": "standardized to banana 20gram"}

8) "contain_sub_ingredients" rules:
+ is the list of sub-ingredients of a nutrient.
+ There are two ways to recoginize sub-ingredients of a nutrient:
  - 1st: the list of sub-ingredients can be list as consecutive intended nutrient rows at below the nutrient name
  - 2nd: the list of sub-ingredients is the statement with a lot of sub-ingredient at below the nutrient name

9) "footnote":
+ "footnote" must be the last part of fact panel (the note may contain some special characters from FOOTNOTE_INDICATORS),
and usually start with "%Daily Value....", "Not a significant source...", or "the % daily value...".
+ "footnote" is only one section, and is not multiple sections.
+ "footnote" may contain multiple languages. Please only provide "footnote" in english only. Do not include spanish text on footnote 

Ex 1: "**Not a significant source of saturated fat, trans fat. *Daily Value not established. = {footnote: {value :"**Not a significant source of saturated fat, trans fat. *Daily Value not established."}}
Ex 2: "*Daily Value not established." = {footnote: "*Daily Value not established."}
Ex 3: "†Daily Value not established." = {footnote: "†Daily Value not established."}
Ex 4: "Not a significant source of saturated fat, trans fat." = {footnote: "Not a significant source of saturated fat, trans fat."}

10) "nutrients.footnoteIndicator":
+ "nutrients.footnoteIndicator" is a special symbol such as "*", "†" or is a group of special symbol such as "**" beside the nutrient percent value. Sometimes nutrient percent value is left empty but still have footnoteIndicator right there.

11) "amountPerServing.percentDailyValueFor" rules:
+ "amountPerServing.percentDailyValueFor" is a text and usually stay above the "calories value number".
+ "amountPerServing.percentDailyValueFor" could be also a text below "%Daily Value" title or below "%DV" title such as "for children...", or "for aldults..."
Ex 1: "Per container" = {amountPerServing: {percentDailyValueFor: "Per container"}}
Ex 2: "Per serving" = {amountPerServing: {percentDailyValueFor: "Per serving"}}
Ex 3: "%dv for children > 18 years" = {amountPerServing: {percentDailyValueFor: "for children > 18 years"}}
Ex 4: "%dv for adults" = {amountPerServing: {percentDailyValueFor: "for adults"}}

12) "nutrient.quantityComparisonOperator" and "nutrient.dailyPercentComparisonOperator" rules:
+ "nutrient.quantityComparisonOperator" is a comparison operator at the left side of "nutrient.value" and "nutrient.uom"
+ "nutrient.dailyPercentComparisonOperator" is a comparison operator at the left side of "nutrient.percentDailyValue".
+ "nutrient.dailyPercentComparisonOperator" is not "nutrient.quantityComparisonOperator".
Ex 1: "10g    <10%" = {quantityComparisonOperator: null, dailyPercentComparisonOperator: "<", ...}
Ex 2: "<10g    10%" = {quantityComparisonOperator: "<", dailyPercentComparisonOperator: null, ...}
Ex 3: "<10g    <10%" ={quantityComparisonOperator: "<", dailyPercentComparisonOperator: "<", ...}

13) "nutrients.quantityEquivalent":
+ "nutrients.quantityEquivalent" is usually additional text right next to "nutrient.uom" and inside the parentheses.
+ "nutrients.quantityEquivalent" is sometimes additional text below "nutrient.quantity" to perform equivalent meaning.
Ex 1: "20mcg(800 IU)" = {quantityEquivalent: "800 IU", ...}
Ex 2: "20mcg DFE(800mcg L-5-MTHF) = {quantityEquivalent: "800mcg L-5-MTHF", ...}
Ex 3: Found Content:
  "20mcg DFE   10%
(800mcg L-5-MTHF)"
should be recorded as {quantityEquivalent: "800mcg L-5-MTHF", ...} since the "800mcg L-5-MTHF" is description about amount of L-5-MTHF in "20mcg DFE" of a nutrient.

14) "nutrients.name" rule:
+ "nutrients.name" is a name of nutrient sometimes include the text closed inside the parentheses.
+ "nutrients.name" sometimes start with a special symbol or its name is bold and maybe a note just like name of an ingredient
Ex 1: "Vitamin K2(as Naturally Derived MK-7 [Menaquinone-7])" should be recorded as {"name": "Vitamin K2", "descriptor": "(as Naturally Derived MK-7 [Menaquinone-7])" ,...}
Ex 2: "Molybdenum(as fermented molybdenum bisglycinate)" should be recorded as {"name": "Molybdenum", "descriptor": "(as fermented molybdenum bisglycinate)" ,...}
Ex 3: "Medium Chain Triglyceride (MCT) Oil" should be recorded as {"name": "Medium Chain Triglyceride (MCT) Oil", "descriptor": null, ...} 

15) "nutrients.uom" rules:
+ some possible "nutrients.uom" such as "MCG DFE"

16) "nutrients.percentDailyValue"
+ could be null or empty. if its value is empty or null just left it value "null"
+ nutrient "trans fat" do not have "percent daily value" and its "nutrients.percentDailyValue" must be null 
Ex 1: "100g 10%" should be recorded as {"percentDailyValue": 10, ...}
Ex 2: "100g    " should be recorded as {"percentDailyValue": null, ...}
Ex 2: "1g  <1%" should be recorded as {"percentDailyValue": 1, ...}

17) nutrient of "added sugars" rules": 
if you see a nutrient text like 'Includes Xg of Added Sugars  10%' this is the nutrient name = "added sugar" and "X" is its "value" and "g" is its "uom".
and it should be recorded as a nutrient =  {"name": "Added Sugars", "value": 7, "uom": "g", "percentDailyValue": 10,...}

`;
};

// 13) "nutrients.nutrient_sub_ingredients" rules:
// + "nutrients.nutrient_sub_ingredients" is the list of sub-ingredient below nutrient name (nutrient is usually blend, mix, compled, or a complex substance)
// Ex1 :  "Banana, Grape(from juice), Apple" = [{"info": "Banana",...}, {"info": "Grape(from juice)",...}, {"info"": "Apple",...}]

// NAME	QUANTITY	DAILY PERCENT	FOOTNOTE
// Total Carbohydrate	6g	2%	+
// Total Sugars	4g		**
// Includes 4 g Added Sugars

// "nutrient_sub_ingredients": [{
//   "info": string,
// },...],

// "answerOfDebug_5": your answer gemini (Why you put content like "(as ...)" beside nutrient name to nutrient_sub_ingredients? They are only considered as "nutrients.descriptor"),

// "answerOfDebug_6": your answer gemini (Why you keep add multiple sub-ingredients into one "nutrient_sub_ingredients.info"? Please record as an array of "nutrient_sub_ingredients" for sub-ingredients those separated by comma?),

// "answerOfDebug_7": your answer gemini (why you do not recognize sub-ingredients? some nutrients with intended ingredients rows below obviously have sub-ingredients, sometimes multiple sub-ingredients could be written in the same row but should be recorded separately.),

// 12) "nutrients.descriptor_or_subIngredientList" rules:
// + "nutrients.descriptor_or_subIngredientList" could be the text inside the parentheses right next to "nutrients.name"
// + "nutrients.descriptor_or_subIngredientList" could be also the text that is intended and appear on the row below a nutrient. (the text is usually the ingredient list of the blend, mixture, a subtance or complex,...)

// 12) "nutrients.descriptor_or_subIngredientList" rules:
// + "nutrients.descriptor_or_subIngredientList" could be the text inside the parentheses right next to "nutrients.name"
// + "nutrients.descriptor_or_subIngredientList" could be also the text that is intended and appear on the row below a nutrient. (the text is usually the ingredient list of the blend, mixture, a subtance or complex,...)

// "Vitamin D3 (as cholecalciferol)",
// "Folate (660 mcg L-5-methyltetrahydrofolate)",
// "Vitamin B12 (as methylcobalamin)",
// "L-Tyrosine",
// "L-5 Hydroxytryptophan (5-HTP) (from Griffonia simplicifolia seed)",
// "Holy Basil (Ocimum sanctum) (herb) Extract",
// "Schisandra (Schisandra chinensis) (berry) Extract",
// "vegetarian capsule (hypromellose and water), microcrystalline cellulose, silicon dioxide"

// "fullName": string,

// 2) Each nutritional line's values must stay unique. Do not interchange numbers between lines or make false inferences. For instance, "total sugar 18g, included 5g added sugar 4%," should create two objects: one as "name": "total sugar", "value": 18, "uom": "g", "percentDailyValue": null, and another as "name": "added sugar", "value": 5, "uom": "g", "percentDailyValue": 14%.