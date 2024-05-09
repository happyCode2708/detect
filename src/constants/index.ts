export const NEW_PROMPT = `Carefully examine the image provided and created a neatly formatted JSON output containing a list of objects only if info available on image and Each object should contain:
json
{
  "product": {
    "productName": string?,
    "website": string?,
    "upc12": string?,
    "manufacturerName": string?,
    "manufacturerAddress": string?,
    "manufactureDate": string?,
    "primarySize": string?,
    "sizeUom": string?,
    "primarySizeText" string?,
    "factPanels": [
      {
      "panelName": string ,
      "amountPerServing": {"name": string?},
      "calories": {"value": float?, "uom": "calories"}
      "servingSize": {"description": string?, "value": string, "uom": string},
      "servingPerContainer": {"value": float? or number?, "uom": string},
      "nutrients": [{"name": string, "quantityComparisonOperator": string?, "value": float?, "uom": string, "quantityDescription": string?, "dailyPercentComparisonOperator": string?, "percentDailyValue": float,  "footnoteIndicator": string? }],
      "footnote": {
        "value": string?,
        "footnoteIndicatorList": string[],
      }
      "ingredients": string?,
      "contain": string?,
      "totalSugars": string?,
      }
    ]
  }
}

Some rules for you:

1) panelName: if there is text on image contain "Nutrition Facts" or "Supplement Facts". If not it should be null

2) Extract exact numbers provided. No calculations or approximations are permitted.

3) Notations like 'Includes 7g of Added Sugars' should be recorded as "name": "Added Sugars", "value": 7, "uom": "g".

4) Each nutritional line's values must stay unique. Do not interchange numbers between lines or make false inferences. For instance, "total sugar 18g, included 5g added sugar 4%," should create two objects: one as "name": "total sugar", "value": 18, "uom": "g", "percentDailyValue": null, and another as "name": "added sugar", "value": 5, "uom": "g", "percentDailyValue": 14%.

5) The fields 'value', 'uom' (unit of measure), and 'percentDailyValue' can be empty or null. The 'value' is a float number, 'uom' is a string with no numeric characters, and 'percentDailyValue' is a float (without the percentage symbol).

6) Be cautious of potential typos and characters that may look similar but mean different (e.g., '8g' may appear as 'Bg', '0mg' as 'Omg').

8) In case of multiple panels in the image, create separate panel objects for each. Attempt to decipher the panel name from the adjacent text. It might be challenging to find it sometimes.

9) If there is only the name of the nutrient and the percentage, then it is considered the 'percentDailyValue', and 'value' and 'uom' are both null.

10) Ingredients usually appear below or next to the nutrition panel and start right after "ingredients:" or "Ingredients:" or "INGREDIENTS:" or "Other Ingredients:". 

11) if you do not detect the value please leave it null

12) Notations like "10 serving per container" should be recorded as "name": "servingPerContainer", "value": 10, "uom": "serving per container"

13) Notations like "Contain" or "May Contain" or "contains: string."  should be recorded as "name": "contain", "value": string. For example: "May contain milk" should be recorded as "name": "contain", "value": "May contain milk". For Example: "Contain: Coconut, Milk." should be recorded as "name": "contain", "value": "Coconut, Milk."

14) The fact panel could be in the "dual-column" layout showing both "per serving" and "per container" information. Let's to break down and separate into two different fact panels one is for 'per serving'
 and other for 'per container' just if "amoutPerServing.name" of them are different. These two fact panels have the same value of "servingPerContainer", "footnote', "ingredients" and "contain".

15) common constants:
+ FOOTNOTE_INDICATORS = ["*", "**", "†"]

16) common rules:
+ "nutrients" is an array that usually start with some nutrients such as "Total Carbohydrate", "Vitamin A", ... Let's list nutrient from them first if possible.
+ Read "Fact Panel" from left to right and from top to bottom.
+ content in prompt can be similar to typescript and nodejs syntax.

17) "servingSize" rules:
+ "servingSize" content's first format = "servingSize.value" + "servingSize.uom"
+ "servingSize" content's second format = "servingSize.description" + ("servingSize.value" + "servingSize.uom")
+ if "servingSize" content contains the parentheses so the "servingSize.value" and "servingSize.uom" will be closed inside by the parentheses.
+ if "servingSize" content do not contains the parentheses so the the "servingSize" content only includes "servingSize.value" + "servingSize.uom" and "servingSize.description" is Null
Ex 1: "10 tablespoons(80g)" should be recorded as "servingSize": {"description": "10 tablespoons", "value": "80", "uom": "g"}
Ex 2: "10 tablespoons" should be recorded as "servingSize": {"value": 10, "uom": "tablespoons"}

18) "amountPerServing.name" rules:
+ is a text and usually stay above the "calories value number",
Ex 1: "Per container", "Per serving"

19) "nutrient.quantityComparisonOperator" and "nutrient.dailyPercentComparisonOperator" rules:
+ "nutrient.quantityComparisonOperator" is a comparison operator at the left side of "nutrient.value" and "nutrient.uom"
+ "nutrient.dailyPercentComparisonOperator" is a comparison operator at the left side of "nutrient.percentDailyValue".
+ "nutrient.dailyPercentComparisonOperator" is not "nutrient.quantityComparisonOperator".
Ex 1: "10g    <10%" should be recorded as {"quantityComparisonOperator": null, "dailyPercentComparisonOperator": "<", ...}
Ex 2: "<10g    10%" should be recorded as {"quantityComparisonOperator": "<", "dailyPercentComparisonOperator": null, ...}
Ex 3: "<10g    <10%" should be recorded as {"quantityComparisonOperator": "<", "dailyPercentComparisonOperator": "<", ...}

20) "footnote" rules: 
+ "footnote" section is in the bottom part of fact panel (the note may contain some special characters from FOOTNOTE_INDICATORS). 
+ "footnote.footnoteIndicatorList" is a list of special characters found in "footnote.value"
+ "footnote.value" contains all specials symbol from "footnote.footnoteIndicatorList"
+ "footnote.footnoteIndicatorList" only contain character from FOOTNOTE_INDICATORS
Ex 1: "**Percent Value *Based on" should be recorded as  "footnote.value":"**Percent Value *Based on", "footnote.footnoteIndicatorList": ["*", "**"].
Ex 2: "*Daily Value not established." should be recorded as "footnote.value": "*Daily Value not established.", "footnote.footnoteIndicatorList": ["*"]. 
Ex 3: "†Daily Value not established." should be recorded as "footnote.value": "†Daily Value not established.", "footnote.footnoteIndicatorList": ["†"].  
Ex 4: "Not a significant source of saturated fat, trans fat." should be recorded as "footnote.value": "Not a significant source of saturated fat, trans fat.", "footnote.footnoteIndicatorList": null.

21) "nutrient.footnoteIndicator" rules:
+ "footnote.footnoteIndicatorList" is a list of special character or a group of special characters such as "*", "**", "+"
+ "footnote.footnoteIndicatorList" must contain "nutrient.footnoteIndicator",
+ "footnote.footnoteIndicator" is only get from list FOOTNOTE_INDICATORS.  
Ex 1: "10g <10%**" should be recorded as {"footnoteIndicator": "**", ...}
Ex 2: "10mg ***" should be recorded as {"footnoteIndicator": "***", ...}
Ex 3: "15mg 0%†" should be recorded as {"footnoteIndicator": "†", ...}
Ex 4: "30mg(400 UI)  **" should be recorded as {"footnoteIndicator": "**", ...}
Ex 5: correct the mistake "150mg 20% ★★" should be record as {"footnoteIndicator": "**", ...} so "**" replace for "★★" since the "footnoteIndicator" is only from FOOTNOTE_INDICATORS. The blurry image could lead to misreading indicator.

22) "nutrient.name" rules:
Ex 1: "Vitamin K2(as Naturally Derived MK-7 [Menaquinone-7)" should be recorded as "name": Vitamin K2(as Naturally Derived MK-7 [Menaquinone-7)

23) "nutrient.quantityDescription" rules:
+ "nutrient.quantityDescription" is additional text right next to "nutrient.uom" and inside the parentheses, and does not include parentheses.
Ex 1: "20mcg(800 IU)" should be recorded as "nutrient.quantityDescription": "800 IU".

24) "product.productName" rules:
+ extract possible name of product from given image.

25) "product.upc12" rules:
+ extract possible "upc12" or "UPC-A" 's barcode number (with 12 digit)  of product from given image.

26) "product.website" rules:
+ find website link

27) "product.manufacturerName" rules:
+ find manufacturer name

28) "product.manufacturerAddress" rules:
+ find manufacturer's address

29) "product.manufactureDate" rules:
+ find manufacture date of the product image
+ "product.manufactureDate" is usually in date format
Ex 1: "AUGUST/1990" should be recorded as "product.manufactureDate":"AUGUST/1990"

30) "product.primarySize" and "product.sizeUom" and "product.primarySizeText"
+ "product.primarySize" is size of a unit
+ "product.primarySize" is a quantity measurement of product
+ priority measurement for liquid is "fl. oz." or "fl oz".
Ex 1: "Net 3 Qt. (96 fl. oz.) 2.835L" should be recorded as {"primarySize": 96, "sizeUom": "fl. oz.", "primarySizeText": "Net 3 Qt."}
Ex 2: "64 FL OZ(2QTs) 1.89L should be recorded as {"primarySize": 64, "sizeUom": "FL OZ", "primarySizeText": "64 FL OZ"}
Ex 3: "Net WT 5.25 OZ 150g should be recorded as {"primarySize": 5.25, "sizeUom": "OZ", "primarySizeText": "5.25 OZ"}
`;
// 26) Validation Process:
// + Please compare "ocrText.factPanel.ocrNutrients[number].oCompletedPhrase" and "nutrients[number].concat" when they have the same field value of "name" to correct possible reading mistakes.
// And Result from "ocrText.factPanel.ocrNutrients[number].oCompletedPhrase" is more reliable than "nutrients[number].concat".

// Ex 3: "Total Sugars 1000mg 50%*" recorded as "totalSugars": "Total Sugars 1000mg 50%*"
// 18) "nutrient.quantityComparisonOperator":
// + "nutrient.quantityComparisonOperator" is a comparion operator at the left side of "nutrient.value" and "nutrient.uom"
// Ex 1: "<1g" should be recoreded as "nutrient.quantityComparisonOperator": "<".

// 19) "nutrient.dailyPercentComparisonOperator" rules:
// + "nutrient.dailyPercentComparisonOperator" is a comparion operator at the left side of "nutrient.percentDailyValue".
// + "nutrient.dailyPercentComparisonOperator" is not "nutrient.quantityComparisonOperator".
// Ex 1:"<1%" should be recoreded as "nutrient.dailyPercentComparisonOperator": "<".

// 19) "nutrient.dailyPercentComparisonOperator" rules:
// Ex 1:"<1%" should be recoreded as "nutrient.dailyPercentComparisonOperator": "<".

// + compare "ocrText.factPanel.ocrNutrients[number].completedPhrase" and "nutrients[number].completedPhrase" when they have the same field value of "name" to correct possible reading mistakes.
// And Result from "ocrText.factPanel.ocrNutrients[number].completedPhrase" is more reliable than "nutrients[number].completedPhrase".

// 15) "nutrients[number].concat" rules:
// + "nutrients[number].contact" is the sum of all field's values in a nutrient item.
// + "nutrients[number].concat" = String.concat("nutrients[number].name" ," ", "nutrients[number].quantityComparisonOperator", "nutrients[number].value", "nutrients[number].uom", " ", "nutrients[number].dailyPercentComparisonOperator", "nutrients[number].percentDailyValue", "nutrients[number].footnoteIndicator") with null = ""
// Ex 1: "nutrients[number]" = {
//     "name": "Vitamin F",
//     "quantityComparisonOperator": null,
//     "value": 20,
//     "uom": "mg",
//     "dailyPercentComparisonOperator": "<",
//     "percentDailyValue": 10,
//     "footnoteIndicator": "*"
//   } will be changed to "nutrients[number] = {...nutrients[number], "concat": "Vitamin F  20mg  <10%*"},
// 25) "ocrText.ofactPanel.oNutrients" rules:
// + "ocrText.ofactPanel.oNutrients" is all text info of nutrients in side fact panel (nutrition facts or supplement facts)
// + "ocrText.ofactPanel.oNutrients[number].oCompletedPhrase" is a whole text info of a nutrient.
// Ex 1: "Total Sugars 1000mg <1%**" recorded as "ocrText.ofactPanel.oNutrients" = [{"oName":"Total Sugars",  "oCompletedPhrase": "Total Sugars 1000mg <1%**"},...] .

// "ocrText":
//   {"ofactPanel":
//     {
//       "oNutrient": [{"oName": string, "oCompletedPhrase": string}]
//     }
//   },

// 24) "totalSugars" rules:
// + "totalSugars" is the whole line of content in the fact panel
// Ex 1: "Total Sugars 1000mg 50%**" recorded as "totalSugars": "Total Sugars 1000mg 50%**"
