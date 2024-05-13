export const NEW_PROMPT = `
Carefully examine the image provided and created a neatly formatted JSON output containing a list of objects only if info available on image and Each object must have e format:
json
{
  "product": {
    "isFactPanelGoodToRead": [{"answer": string},...],
    "factPanelsDebug": string,
    "factPanels": null or  [
      {
        "panelName": string ,
        "amountPerServing": {"name": string?},
        "calories": {"value": float?, "uom": "calories"}
        "servingSize": {"description": string?, "value": string, "uom": string,},
        "servingPerContainer":" {"value": float? or number?, "uom": string},
        "nutrients": [
          {
            "name": string, 
            "descriptor": string,
            "quantityComparisonOperator": string?, value: float?, uom: string, 
            "quantityDescription": string?,
            "dailyPercentComparisonOperator": string?, 
            "percentDailyValue": float,  
            "footnoteIndicator": string?,
          }
        ],
        "dietaryIngredients": [
          {
            "name": string, 
            "ingredientDescriptor": string,
            "quantityComparisonOperator": string?, value: float?, uom: string, 
            "quantityDescription": string?,
            "dailyPercentComparisonOperator": string?, 
            "percentDailyValue": float,  
            "footnoteIndicator": string?,
          },
        ],
        "footnote": {
          "value": string?,
          "footnoteIndicatorList": string[],
        },
        "footnotedebug": "foot blend is a nutrient and you misread it as footnote. can you help me create a prompt sentences to tell yourself next time to know it not the footnote?,
      }
    ],
    "ingredientsGroup": [{"ingredients": string}],
    "contain": string?,
    "productName": string,
    "website": string,
    "upc12": number,
    "manufacturerName": string,
    "manufacturerAddress": string,
    "manufactureDate": string,
    "primarySize": string,
    "sizeUom": string,
    "primarySizeText": string,
  }
}
Some common constants:
+ FOOTNOTE_INDICATORS = ["*", "**", "†", "★★", "★"]

Some definitions:
1) Notations like 'Includes 7g of Added Sugars' should be recorded as "name": "Added Sugars", "value": 7, "uom": "g".

1) about the "Fact Panel"
+ is a list of nutrient or substance info
+ must have a Big Text like a Header such as "Nutrition Facts" or "Supplement Facts" visible on it
+ be careful when you (gemini) confirm to see something since curvature of container or cropped image can make content obscured.

Some common rules:
+ "nutrients" is an array that usually start with some nutrients such as "Total Carbohydrate", "Vitamin A", ... Let's list nutrient from them first if possible.
+ Read "Fact Panel" from left to right and from top to bottom.
+ content in prompt can be similar to typescript and nodejs syntax.
+ be careful the last "nutrient row" could be misread to be a part of "footnote". Remember "footnote" content ususally about "Daily value" or "percent daily value" note.
+ do not return json in format [{product: {...}}] since the result is only for one product

Some rule for you:
1) "product.isFactPanelGoodToRead" = array of answers of all below questions:
+ Carefully inspect the image and answer question Can you see the fact panel? return "yes" or "no" only
+ Can you see "serving size info" from fact panel? return "yes" or "no" only
+ is the exact text "Supplement Facts" or "Nutrition Facts" 100% visible on provided image. Carefully inspect the image and do not assume that text on the image ? return "yes" or "no" only
+ "dietaryIngredients" is completely separated with "nutrients" and "nutrients" does not include "dietaryIngredients" list.

2) The fact panel could be in the "dual-column" layout showing both "per serving" and "per container" information. Let's to break down and separate into two different fact panels one is for 'per serving'
and other for 'per container' just if "amoutPerServing.name" of them are different or "servingSize" of them are different. These two fact panels have the same value of "servingPerContainer", "footnote', "ingredients" and "contain".

3) "product.panelName":
+ if there is text on image contain "Nutrition Facts" or "Supplement Facts". If not it should be null

4) "servingSize":
+ if "servingSize" content contains the parentheses so "servingSize" format = servingSize.description + "("+ servingSize.value + servingSize.uom ")" 
+ else "servingSize" format = servingSize.value + servingSize.uom
Ex 1: "10 tablespoons(80g)" = {servingSize: {"description": "10 tablespoons", "value": "80", "uom": "g"}}
Ex 2: "10 tablespoons" = {servingSize: {"value": 10, "uom": "tablespoons"}}

5) "footnote":
+ "footnote" must be the last part of fact panel (the note may contain some special characters from FOOTNOTE_INDICATORS),
and must be a note contain "Daily Value....", or "Not a significant source...".
+ "footnote" is only one section, and is not multiple sections.
+ "footnote.footnoteIndicatorList" is a list of special characters found in "footnote.value"
+ "footnote.value" contains all specials symbol from "footnote.footnoteIndicatorList"
+ "footnote.footnoteIndicatorList" only contain character from FOOTNOTE_INDICATORS

Ex 1: "**Not a significant source of saturated fat, trans fat. *Daily Value not established. = {footnote: {value :"**Not a significant source of saturated fat, trans fat. *Daily Value not established.", footnoteIndicatorList: ["*", "**"]}}
Ex 2: "*Daily Value not established." = {footnote: {value: "*Daily Value not established.", footnoteIndicatorList": ["*"]}}
Ex 3: "†Daily Value not established." = {footnote: {value: "†Daily Value not established.", footnoteIndicatorList": ["†"]}}
Ex 4: "Not a significant source of saturated fat, trans fat." = {footnote:{value: "Not a significant source of saturated fat, trans fat.", footnoteIndicatorList: null}}

6) "nutrient.footnoteIndicator":
+ "nutrient.footnoteIndicator" is a special symbol such as "*", "†" or is a group of special symbol such as "**" beside the nutrient percent value. Sometimes nutrient percent value is left empty but still have footnoteIndicator right there.

7) "amountPerServing.name":
+ is a text and usually stay above the "calories value number",
Ex 1: "Per container", "Per serving"

8) "nutrient.quantityComparisonOperator" and "nutrient.dailyPercentComparisonOperator" rules:
+ "nutrient.quantityComparisonOperator" is a comparison operator at the left side of "nutrient.value" and "nutrient.uom"
+ "nutrient.dailyPercentComparisonOperator" is a comparison operator at the left side of "nutrient.percentDailyValue".
+ "nutrient.dailyPercentComparisonOperator" is not "nutrient.quantityComparisonOperator".
Ex 1: "10g    <10%" = {quantityComparisonOperator: null, dailyPercentComparisonOperator: "<", ...}
Ex 2: "<10g    10%" = {quantityComparisonOperator: "<", dailyPercentComparisonOperator: null, ...}
Ex 3: "<10g    <10%" ={quantityComparisonOperator: "<", dailyPercentComparisonOperator: "<", ...}

10) "nutrients.quantityDescription":
+ is additional text right next to "nutrient.uom" and inside the parentheses, and does not include parentheses.
Ex 1: "20mcg(800 IU)" = {quantityDescription: "800 IU"}
Ex 2: "20mcg DFE(800mcg L-5-MTHF) = {quantityDescription: "800mcg L-5-MTHF"}


11) "dietaryIngredients" rules:
+ "dietaryIngredients" is a list of ingredients or a list of ingredient group usually that each "dietaryIngredient" item include "dietaryIngredients.name" and "dietaryIngredients.ingredientDescriptor".
+ and "dietaryIngredients.ingredientDescriptor" usually a text show a list of ingredients that make up an "dietaryIngredient" item.

12) "dietaryIngredients.descriptor" rules:
+ "dietaryIngredients.descriptor" could be the text that is intended and appear on the row below a "dietaryIngredients" item.
+ "dietaryIngredients.descriptor" could also be the text inside the parentheses right next to "dietaryIngredients.name"

11) "ingredients":
+ usually appear below or next to the nutrition panel and start with "ingredients:" or "Ingredients:" or "INGREDIENTS:" or "Other Ingredients:".
Ex 1: "Ingredients: Flour, Eggs,"= {ingredients: "Flour, Eggs."}

12) "product.productName" rules:
+ extract possible name of product from given image.

13) "product.upc12" rules:
+ extract possible "upc12" or "UPC-A" 's barcode number (with 12 digit)  of product from given image.

14) "product.website" rules:
+ find website link

15) "product.manufacturerName" rules:
+ find manufacturer name

16) "product.manufacturerAddress" rules:
+ find manufacturer's address

17) "product.manufactureDate" rules:
+find manufacture date of the product image
+ "product.manufactureDate" is usually in date format
Ex 1: "AUGUST/1990" should be recorded as "product.manufactureDate":"AUGUST/1990"

18) "product.primarySize" and "product.sizeUom" and "product.primarySizeText" rules:
+ "product.primarySize" is a quantity measurement of product
+ "product.sizeUom" is "Units of Liquid Measurement" (such as "Fl OZ", "L", ...) or "Weight Units of Measure" (such as "Gram", "Kg", ...)
+ "product.sizeUom" exclude "calories"
Ex 1: "Net 3 Qt. (96 fl. oz.) 2.835L" should be recorded as {"primarySize": 96 , "sizeUom": "fl. oz." , "primarySizeText":  "value": "Net 3 Qt."}
Ex 2: "64 FL OZ(2QTs) 1.89L" should be recorded as {"primarySize": 64 , "sizeUom": "FL OZ" , "primarySizeText": "64 FL OZ"}
Ex 3: "Net WT 5.25 OZ 150g" should be recorded as {"primarySize": 5.25 , "sizeUom": "OZ" , "primarySizeText": "5.25 OZ"}

19) "product.contain" rules: 
Ex 1: "May contain milk" should be recorded as {"contain": "milk"} 
Ex 2: "Contain: Coconut, Milk." should be recorded as {"contain": "Coconut, Milk"}


20) "product.factPanels.nutrients.descriptor" rules:
+ "nutrients.descriptor" could be the text that is intended and appear on the row below a nutrient.
+ "nutrients.descriptor" could also be the text inside the parentheses right next to "nutrients.name"

21) "product.factPanels.nutrients.name" rule:
+ "nutrients.name" is a name of nutrient sometimes include the text closed inside the parentheses.
+ "nutrients.name" sometimes start with a special symbol or its name is bold and maybe a note just like name of an ingredient
Ex 1: "Vitamin K2(as Naturally Derived MK-7 [Menaquinone-7)" should be recorded as {"name": "Vitamin K2", "descriptor": "as Naturally Derived MK-7 [Menaquinone-7": ,...}
Ex 2: "Medium Chain Triglyceride (MCT) Oil" should be recorded as {"name": "Medium Chain Triglyceride (MCT) Oil", ...} 

22) "nutrients.uom" rules
+ some possible "nutrients.uom" such as "MCG DFE"
`;
