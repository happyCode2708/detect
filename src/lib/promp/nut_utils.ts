// "have_intended_nutrient_row_below": boolean,
// "intended_level": number, // from 0 to 3
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
  
Requirements:
+ gemini avoid adding spanish contents to JSON Object (such as 'footnote').
+ gemini remember 'trans fat', 'total sugar' and 'added sugar/include added sugar' are separated nutrient even though they could be intended row.
+ percent daily value of total sugars is always null.
+ protein does not have percent daily value.
+ added sugar is not sub ingredient of total sugar. Added sugar is considered as a separated nutrient.
+ always consider intended nutrient row as sub ingredient of nutrient.
+ sub-ingredient's full name of nutrient must not contain text about quantity or percent daily value info.

Questions And Fix bugs:
+ why i see you keep adding 0% of percent daily value to trans fat or total sugars? trans fat, and total sugars do not have percent daily value.
+ why i see you keep removing the mix of ingredients out of nutrients list ? remember nutrient could be also an ingredient, or a mix of ingredient, or a blend of something.
+ I told you if you see a nutrient in type of Extract so its descriptor must be the text after word "Extract"?
+ why you keep read info as new nutrient but the content info is not separated by line?

Carefully examine the provided image and and created JSON output in given format:
  
json
{
  "validatorAndFixBug": {
    "answerOfQuestionsAboutNutritionFact": your answer gemini (Do you see nutrition facts panel on provided images? why? where is it on product?"),
    "answerOfQuestionAboutNutritionFactTitle": your answer gemini (Do you see fully "Supplement Fact" title or "Nutrition Fact" title  on provided images ? ),
    "answerOfQuestionAboutValidator": your answer gemini ( why do you  keep providing me the info that is not visibly seen on provided image? I only need info that you can see on provided image please compare with OCR texts and check if your info add to JSON is correct),
    "end": true,
  },
  "product": {
    "readAllConstants": your answer gemini (please help me read carefully all constant above carefully. they are important and will be used to create the json output. And answer me did you read them?),
    "content_in_spanish_must_be_prohibited": true,
    "factPanels": [
      {
        "panelName": string ,
        "amountPerServing": {
          "percentDailyValueFor": string
        },
        "calories": {
          "value": float, 
          "uom": "calories"
        },
        "servingSize": {
          "value": string, 
          "uom": string,
          "equivalent": {
            "value": string, 
            "uom": string,
          }, 
        },
        "servingPerContainer":" {
          "value": float | number, 
          "uom": string
        },
        "nutrients": [
          {
            "fullNutrientInfo": string, // include quantity information, percent daily value
            "name": string,
            "descriptor": string,
            "contain_sub_ingredients": [
              {
                full_name: string, // exclude quantity information, percent daily info
                quantity: string,
                uom: string,
              },
              ...
            ],
            "quantityComparisonOperator": string?, 
            "value": float?, 
            "uom": string, 
            "quantityEquivalent": string?,
            "dailyPercentComparisonOperator": string?, 
            "percentDailyValue": float?,  
            "footnoteIndicator": string?, // value must be chosen from FOOTNOTE_INDICATORS,
          }
        ],
        "footnote": string,
        "footnote_english_only": string,
      },
      ...
    ],
  },
}

The Most Important rule:
+ Only get data that visibly seen by normal eyes not from other sources on internet
+ Remind again if you see fact panel just give detail data that could be seen by human eyes not from other source like internet.
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

+ Be careful the nutrient could be an Extract so its name must contain "Extract" in nutrient name. And the "nutrient.descriptor" will be the remaining text after word "Extract".
Ex 1: "Holy Basil (Ocimum sanctum) (herb) Extract" ={name: "Holy Basil (Ocimum sanctum) (herb) Extract", descriptor": null}
Ex 2: "Holy Basil (Ocimum sanctum) (herb) Extract standardized to banana 20gram" ={name: "Holy Basil (Ocimum sanctum) (herb) Extract", descriptor": "standardized to banana 20gram"}

8) "contain_sub_ingredients" rules:
+ is the list of sub-ingredients of a nutrient.
+ There are two ways to recognize sub-ingredients of a nutrient:
  - 1st: the list of sub-ingredients can be list as consecutive intended nutrient rows at below the nutrient name
  - 2nd: the list of sub-ingredients is the statement with a lot of sub-ingredient at below the nutrient name

9) "footnote":
+ "footnote" must be the last part of fact panel (the note may contain some special characters from FOOTNOTE_INDICATORS),
and usually start with "%Daily Value....", "Not a significant source...", or "the % daily value...".
+ "footnote" is only one section, and is not multiple sections.

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
Ex 4: "less than 1g" ={quantityComparisonOperator: "less than", ...}


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

// 2nd - total sugar and added sugar are two separated nutrient
// "intended_level": number, // from 0 to 3
