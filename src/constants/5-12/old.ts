export const NEW_PROMPT_3 = `Carefully examine the image provided and created a neatly formatted JSON output containing a list of objects only if info available on image and Each object should contain:
json
{
  "product": {
    "isFactPanelOnImage": boolean,
  }
}

Some rules for you:

1) "product.isFactPanelOnImage"
+ "product.isFactPanelOnImage" is the answer for question "Do you see nutrition fact panel on the image? return true or false"
`;
// + priority measurement for liquid is "fl. oz." or "fl oz".
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
export const NEW_PROMPT_1 =
  'Do you see nutrition fact panel on the image? return true or false';

export const NEW_PROMPT_ORIGINAL = `Carefully examine the image provided and created a neatly formatted JSON output containing a list of objects only if info available on image and Each object should contain:
json
{
  "product": {
    "isFactPanelOnImage": boolean,
    "productName": string?,
    "website": string?,
    "upc12": number?,
    "manufacturerName": string?,
    "manufacturerAddress": string?,
    "manufactureDate": string?,
    "primarySize": string?,
    "sizeUom": string?,
    "primarySizeText": string?,
    "factPanels": null or [
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
    ],

  }
}

Some rules for you:

1) "product.isFactPanelOnImage"
+ "product.isFactPanelOnImage" is the answer for question "Do you see nutrition fact panel on the image? return true or false"

2) panelName: if there is text on image contain "Nutrition Facts" or "Supplement Facts". If not it should be null

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
+ FOOTNOTE_INDICATORS = ["*", "**", "" "†"]
`;

// 17) "servingSize" rules:
// + "servingSize" content's first format = "servingSize.value" + "servingSize.uom"
// + "servingSize" content's second format = "servingSize.description" + ("servingSize.value" + "servingSize.uom")
// + if "servingSize" content contains the parentheses so the "servingSize.value" and "servingSize.uom" will be closed inside by the parentheses.
// + if "servingSize" content do not contains the parentheses so the the "servingSize" content only includes "servingSize.value" + "servingSize.uom" and "servingSize.description" is Null
// Ex 1: "10 tablespoons(80g)" should be recorded as "servingSize": {"description": "10 tablespoons", "value": "80", "uom": "g"}
// Ex 2: "10 tablespoons" should be recorded as "servingSize": {"value": 10, "uom": "tablespoons"}

// 18) "amountPerServing.name" rules:
// + is a text and usually stay above the "calories value number",
// Ex 1: "Per container", "Per serving"

// 19) "nutrient.quantityComparisonOperator" and "nutrient.dailyPercentComparisonOperator" rules:
// + "nutrient.quantityComparisonOperator" is a comparison operator at the left side of "nutrient.value" and "nutrient.uom"
// + "nutrient.dailyPercentComparisonOperator" is a comparison operator at the left side of "nutrient.percentDailyValue".
// + "nutrient.dailyPercentComparisonOperator" is not "nutrient.quantityComparisonOperator".
// Ex 1: "10g    <10%" should be recorded as {"quantityComparisonOperator": null, "dailyPercentComparisonOperator": "<", ...}
// Ex 2: "<10g    10%" should be recorded as {"quantityComparisonOperator": "<", "dailyPercentComparisonOperator": null, ...}
// Ex 3: "<10g    <10%" should be recorded as {"quantityComparisonOperator": "<", "dailyPercentComparisonOperator": "<", ...}

// 20) "footnote" rules:
// + "footnote" section is in the bottom part of fact panel (the note may contain some special characters from FOOTNOTE_INDICATORS).
// + "footnote.footnoteIndicatorList" is a list of special characters found in "footnote.value"
// + "footnote.value" contains all specials symbol from "footnote.footnoteIndicatorList"
// + "footnote.footnoteIndicatorList" only contain character from FOOTNOTE_INDICATORS
// Ex 1: "**Percent Value *Based on" should be recorded as  "footnote.value":"**Percent Value *Based on", "footnote.footnoteIndicatorList": ["*", "**"].
// Ex 2: "*Daily Value not established." should be recorded as "footnote.value": "*Daily Value not established.", "footnote.footnoteIndicatorList": ["*"].
// Ex 3: "†Daily Value not established." should be recorded as "footnote.value": "†Daily Value not established.", "footnote.footnoteIndicatorList": ["†"].
// Ex 4: "Not a significant source of saturated fat, trans fat." should be recorded as "footnote.value": "Not a significant source of saturated fat, trans fat.", "footnote.footnoteIndicatorList": null.

// 21) "nutrient.footnoteIndicator" rules:
// + "footnote.footnoteIndicatorList" is a list of special character or a group of special characters such as "*", "**", "+"
// + "footnote.footnoteIndicatorList" must contain "nutrient.footnoteIndicator",
// + "footnote.footnoteIndicator" is only get from list FOOTNOTE_INDICATORS.
// Ex 1: "10g <10%**" should be recorded as {"footnoteIndicator": "**", ...}
// Ex 2: "10mg ***" should be recorded as {"footnoteIndicator": "***", ...}
// Ex 3: "15mg 0%†" should be recorded as {"footnoteIndicator": "†", ...}
// Ex 4: "30mg(400 UI)  **" should be recorded as {"footnoteIndicator": "**", ...}
// Ex 5: correct the mistake "150mg 20% ★★" should be record as {"footnoteIndicator": "**", ...} so "**" replace for "★★" since the "footnoteIndicator" is only from FOOTNOTE_INDICATORS. The blurry image could lead to misreading indicator.

// 22) "nutrient.name" rules:
// Ex 1: "Vitamin K2(as Naturally Derived MK-7 [Menaquinone-7)" should be recorded as "name": Vitamin K2(as Naturally Derived MK-7 [Menaquinone-7)

// 23) "nutrient.quantityDescription" rules:
// + "nutrient.quantityDescription" is additional text right next to "nutrient.uom" and inside the parentheses, and does not include parentheses.
// Ex 1: "20mcg(800 IU)" should be recorded as "nutrient.quantityDescription": "800 IU".

// 24) "product.productName" rules:
// + extract possible name of product from given image.

// 25) "product.upc12" rules:
// + extract possible "upc12" or "UPC-A" 's barcode number (with 12 digit)  of product from given image.

// 26) "product.website" rules:
// + find website link

// 27) "product.manufacturerName" rules:
// + find manufacturer name

// 28) "product.manufacturerAddress" rules:
// + find manufacturer's address

// 29) "product.manufactureDate" rules:
// + find manufacture date of the product image
// + "product.manufactureDate" is usually in date format
// Ex 1: "AUGUST/1990" should be recorded as "product.manufactureDate":"AUGUST/1990"

// 30) "product.primarySize" and "product.sizeUom" and "product.primarySizeText" rules:
// + "product.primarySize" is a quantity measurement of product
// + "product.sizeUom" is "Units of Liquid Measurement" (such as "Fl OZ", "L", ...) or "Weight Units of Measure" (such as "Gram", "Kg", ...)
// + "product.sizeUom" exclude "calories"
// Ex 1: "Net 3 Qt. (96 fl. oz.) 2.835L" should be recorded as {"primarySize": 96 , "sizeUom": "fl. oz." , "primarySizeText":  "value": "Net 3 Qt."}
// Ex 2: "64 FL OZ(2QTs) 1.89L" should be recorded as {"primarySize": 64 , "sizeUom": "FL OZ" , "primarySizeText": "64 FL OZ"}
// Ex 3: "Net WT 5.25 OZ 150g" should be recorded as {"primarySize": 5.25 , "sizeUom": "OZ" , "primarySizeText": "5.25 OZ"}
// "ocrText":   {
//   "oFactPanels": [
//     {
//       oPanelName: string?
//       oNutrients: [{"oName": string, "oCompletedPhrase": string}]
//     }
//   ]
// }
// 31) "ocrText.oFactPanels" rules:
// +"ocrText.oFactPanels" is read by OCR.space
// + "ocrText.oFactPanels" is a list of fact panels that is read by OCR from provided image
// + "ocrText.oFactPanels[number].oNutrients" is all text info of nutrients in side fact panel (nutrition facts or supplement facts)
// + "ocrText.oFactPanel[number].oNutrients[number].oCompletedPhrase" is a whole text info of a nutrient.
// Ex 1: "Total Sugars 1000mg <1%**" recorded as "ocrText.oFactPanels[number].oNutrients" = [{"oName":"Total Sugars",  "oCompletedPhrase": "Total Sugars 1000mg <1%**"},...] .

// 16) common and important rules:
// + "nutrients" is an array that usually start with some nutrients such as "Total Carbohydrate", "Vitamin A", ... Let's list nutrient from them first if possible.
// + Read "Fact Panel" from left to right and from top to bottom.
// + content in prompt can be similar to typescript and nodejs syntax.

// 17) "product.factPanels" rules:
// + "product.factPanels" info  must be observable on provided image if not it must be recorded as "product.factPanels": null.
// + if the "fact Panel" is too small the extract data could be wrong so it must be recorded as "product.factPanels": null

// "productName": string?,
// "website": string?,
// "upc12": number?,
// "manufacturerName": string?,
// "manufacturerAddress": string?,
// "manufactureDate": string?,
// "primarySize": string?,
// "sizeUom": string?,
// "primarySizeText": string?,
// "factPanels": null or  [
//   {
//   "panelName": string ,
//   "amountPerServing": {"name": string?},
//   "calories": {"value": float?, "uom": "calories"}
//   "servingSize": {"description": string?, "value": string, "uom": string},
//   "servingPerContainer": {"value": float? or number?, "uom": string},
//   "nutrients": [{"name": string, "quantityComparisonOperator": string?, "value": float?, "uom": string, "quantityDescription": string?, "dailyPercentComparisonOperator": string?, "percentDailyValue": float,  "footnoteIndicator": string? }],
//   "footnote": {
//     "value": string?,
//     "footnoteIndicatorList": string[],
//   }
//   "ingredients": string?,
//   "contain": string?,
//   "totalSugars": string?,
//   }
// ],
// "ocrText":   {
//   "oFactPanels": [
//     {
//       oPanelName: string?
//       oNutrients: [{"oName": string, "oCompletedPhrase": string}]
//     }
//   ]
// }

// 1) panelName: if there is text on image contain "Nutrition Facts" or "Supplement Facts". If not it should be null

// 2) Extract exact numbers provided. No calculations or approximations are permitted.

// 3) Notations like 'Includes 7g of Added Sugars' should be recorded as "name": "Added Sugars", "value": 7, "uom": "g".

// 4) Each nutritional line's values must stay unique. Do not interchange numbers between lines or make false inferences. For instance, "total sugar 18g, included 5g added sugar 4%," should create two objects: one as "name": "total sugar", "value": 18, "uom": "g", "percentDailyValue": null, and another as "name": "added sugar", "value": 5, "uom": "g", "percentDailyValue": 14%.

// 5) The fields 'value', 'uom' (unit of measure), and 'percentDailyValue' can be empty or null. The 'value' is a float number, 'uom' is a string with no numeric characters, and 'percentDailyValue' is a float (without the percentage symbol).

// 6) Be cautious of potential typos and characters that may look similar but mean different (e.g., '8g' may appear as 'Bg', '0mg' as 'Omg').

// 8) In case of multiple panels in the image, create separate panel objects for each. Attempt to decipher the panel name from the adjacent text. It might be challenging to find it sometimes.

// 9) If there is only the name of the nutrient and the percentage, then it is considered the 'percentDailyValue', and 'value' and 'uom' are both null.

// 10) Ingredients usually appear below or next to the nutrition panel and start right after "ingredients:" or "Ingredients:" or "INGREDIENTS:" or "Other Ingredients:".

// 11) if you do not detect the value please leave it null

// 12) Notations like "10 serving per container" should be recorded as "name": "servingPerContainer", "value": 10, "uom": "serving per container"

// 13) Notations like "Contain" or "May Contain" or "contains: string."  should be recorded as "name": "contain", "value": string. For example: "May contain milk" should be recorded as "name": "contain", "value": "May contain milk". For Example: "Contain: Coconut, Milk." should be recorded as "name": "contain", "value": "Coconut, Milk."

// 14) The fact panel could be in the "dual-column" layout showing both "per serving" and "per container" information. Let's to break down and separate into two different fact panels one is for 'per serving'
//  and other for 'per container' just if "amoutPerServing.name" of them are different. These two fact panels have the same value of "servingPerContainer", "footnote', "ingredients" and "contain".

// 15) common constants:
// + FOOTNOTE_INDICATORS = ["*", "**", "†"]

// 16) common and important rules:
// + "nutrients" is an array that usually start with some nutrients such as "Total Carbohydrate", "Vitamin A", ... Let's list nutrient from them first if possible.
// + Read "Fact Panel" from left to right and from top to bottom.
// + content in prompt can be similar to typescript and nodejs syntax.

// 17) "product.factPanels" rules:
// + "product.factPanels" info  must be observable on provided image if not it must be recorded as "product.factPanels": null.
// + if the "fact Panel" is too small the extract data could be wrong so it must be recorded as "product.factPanels": null

// 17) "servingSize" rules:
// + "servingSize" content's first format = "servingSize.value" + "servingSize.uom"
// + "servingSize" content's second format = "servingSize.description" + ("servingSize.value" + "servingSize.uom")
// + if "servingSize" content contains the parentheses so the "servingSize.value" and "servingSize.uom" will be closed inside by the parentheses.
// + if "servingSize" content do not contains the parentheses so the the "servingSize" content only includes "servingSize.value" + "servingSize.uom" and "servingSize.description" is Null
// Ex 1: "10 tablespoons(80g)" should be recorded as "servingSize": {"description": "10 tablespoons", "value": "80", "uom": "g"}
// Ex 2: "10 tablespoons" should be recorded as "servingSize": {"value": 10, "uom": "tablespoons"}

// 18) "amountPerServing.name" rules:
// + is a text and usually stay above the "calories value number",
// Ex 1: "Per container", "Per serving"

// 19) "nutrient.quantityComparisonOperator" and "nutrient.dailyPercentComparisonOperator" rules:
// + "nutrient.quantityComparisonOperator" is a comparison operator at the left side of "nutrient.value" and "nutrient.uom"
// + "nutrient.dailyPercentComparisonOperator" is a comparison operator at the left side of "nutrient.percentDailyValue".
// + "nutrient.dailyPercentComparisonOperator" is not "nutrient.quantityComparisonOperator".
// Ex 1: "10g    <10%" should be recorded as {"quantityComparisonOperator": null, "dailyPercentComparisonOperator": "<", ...}
// Ex 2: "<10g    10%" should be recorded as {"quantityComparisonOperator": "<", "dailyPercentComparisonOperator": null, ...}
// Ex 3: "<10g    <10%" should be recorded as {"quantityComparisonOperator": "<", "dailyPercentComparisonOperator": "<", ...}

// 20) "footnote" rules:
// + "footnote" section is in the bottom part of fact panel (the note may contain some special characters from FOOTNOTE_INDICATORS).
// + "footnote.footnoteIndicatorList" is a list of special characters found in "footnote.value"
// + "footnote.value" contains all specials symbol from "footnote.footnoteIndicatorList"
// + "footnote.footnoteIndicatorList" only contain character from FOOTNOTE_INDICATORS
// Ex 1: "**Percent Value *Based on" should be recorded as  "footnote.value":"**Percent Value *Based on", "footnote.footnoteIndicatorList": ["*", "**"].
// Ex 2: "*Daily Value not established." should be recorded as "footnote.value": "*Daily Value not established.", "footnote.footnoteIndicatorList": ["*"].
// Ex 3: "†Daily Value not established." should be recorded as "footnote.value": "†Daily Value not established.", "footnote.footnoteIndicatorList": ["†"].
// Ex 4: "Not a significant source of saturated fat, trans fat." should be recorded as "footnote.value": "Not a significant source of saturated fat, trans fat.", "footnote.footnoteIndicatorList": null.

// 21) "nutrient.footnoteIndicator" rules:
// + "footnote.footnoteIndicatorList" is a list of special character or a group of special characters such as "*", "**", "+"
// + "footnote.footnoteIndicatorList" must contain "nutrient.footnoteIndicator",
// + "footnote.footnoteIndicator" is only get from list FOOTNOTE_INDICATORS.
// Ex 1: "10g <10%**" should be recorded as {"footnoteIndicator": "**", ...}
// Ex 2: "10mg ***" should be recorded as {"footnoteIndicator": "***", ...}
// Ex 3: "15mg 0%†" should be recorded as {"footnoteIndicator": "†", ...}
// Ex 4: "30mg(400 UI)  **" should be recorded as {"footnoteIndicator": "**", ...}
// Ex 5: correct the mistake "150mg 20% ★★" should be record as {"footnoteIndicator": "**", ...} so "**" replace for "★★" since the "footnoteIndicator" is only from FOOTNOTE_INDICATORS. The blurry image could lead to misreading indicator.

// 22) "nutrient.name" rules:
// Ex 1: "Vitamin K2(as Naturally Derived MK-7 [Menaquinone-7)" should be recorded as "name": Vitamin K2(as Naturally Derived MK-7 [Menaquinone-7)

// 23) "nutrient.quantityDescription" rules:
// + "nutrient.quantityDescription" is additional text right next to "nutrient.uom" and inside the parentheses, and does not include parentheses.
// Ex 1: "20mcg(800 IU)" should be recorded as "nutrient.quantityDescription": "800 IU".

// 24) "product.productName" rules:
// + extract possible name of product from given image.

// 25) "product.upc12" rules:
// + extract possible "upc12" or "UPC-A" 's barcode number (with 12 digit)  of product from given image.

// 26) "product.website" rules:
// + find website link

// 27) "product.manufacturerName" rules:
// + find manufacturer name

// 28) "product.manufacturerAddress" rules:
// + find manufacturer's address

// 29) "product.manufactureDate" rules:
// + find manufacture date of the product image
// + "product.manufactureDate" is usually in date format
// Ex 1: "AUGUST/1990" should be recorded as "product.manufactureDate":"AUGUST/1990"

// 30) "product.primarySize" and "product.sizeUom" and "product.primarySizeText" rules:
// + "product.primarySize" is a quantity measurement of product
// + "product.sizeUom" is "Units of Liquid Measurement" (such as "Fl OZ", "L", ...) or "Weight Units of Measure" (such as "Gram", "Kg", ...)
// + "product.sizeUom" exclude "calories"
// Ex 1: "Net 3 Qt. (96 fl. oz.) 2.835L" should be recorded as {"primarySize": 96 , "sizeUom": "fl. oz." , "primarySizeText":  "value": "Net 3 Qt."}
// Ex 2: "64 FL OZ(2QTs) 1.89L" should be recorded as {"primarySize": 64 , "sizeUom": "FL OZ" , "primarySizeText": "64 FL OZ"}
// Ex 3: "Net WT 5.25 OZ 150g" should be recorded as {"primarySize": 5.25 , "sizeUom": "OZ" , "primarySizeText": "5.25 OZ"}

// 31) "ocrText.oFactPanels" rules:
// +"ocrText.oFactPanels" is read by OCR.space
// + "ocrText.oFactPanels" is a list of fact panels that is read by OCR from provided image
// + "ocrText.oFactPanels[number].oNutrients" is all text info of nutrients in side fact panel (nutrition facts or supplement facts)
// + "ocrText.oFactPanel[number].oNutrients[number].oCompletedPhrase" is a whole text info of a nutrient.
// Ex 1: "Total Sugars 1000mg <1%**" recorded as "ocrText.oFactPanels[number].oNutrients" = [{"oName":"Total Sugars",  "oCompletedPhrase": "Total Sugars 1000mg <1%**"},...] .

// [
//   {
//   "panelName": string ,
//   "amountPerServing": {"name": string?},
//   "calories": {"value": float?, "uom": "calories"}
//   "servingSize": {"description": string?, "value": string, "uom": string},
//   "servingPerContainer": {"value": float? or number?, "uom": string},
//   "nutrients": [{"name": string, "quantityComparisonOperator": string?, "value": float?, "uom": string, "quantityDescription": string?, "dailyPercentComparisonOperator": string?, "percentDailyValue": float,  "footnoteIndicator": string? }],
//   "footnote": {
//     "value": string?,
//     "footnoteIndicatorList": string[],
//   }
//   "ingredients": string?,
//   "contain": string?,
//   "totalSugars": string?,
//   }
// ],

// "factPanels": [] or null

const big_update = `
Carefully examine the image provided and created a neatly formatted JSON output containing a list of objects only if info available on image and Each object must have format:
json
{
  "product": {
    isFactPanelOnImage?: boolean,
    productName?: string,
    website?: string,
    upc12?: number,
    manufacturerName?: string,
    manufacturerAddress?: string,
    manufactureDate?: string,
    primarySize?: string,
    sizeUom?: string,
    primarySizeText?: string,
    nutritionPanels:  null or [
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
  }
],

  }
}

Some rules for you:
1) common rules
+ json format in typescript format

3) "product.isFactPanelOnImage"
+ "product.isFactPanelOnImage" is the answer for question "Do you see professional nutrition fact panels on the image? return true or false"
+ some image may have advertisement for product's nutrients or its calories but it is not considered as a Fact Panel. The Fact Panel need a big header with text contain "Nutrition Facts" or "Supplement Facts" 

4. "product.nutritionPanels"
+ "product.nutritionPanels" only valid if it have panelName contain "Nutrition Facts"
 or "Supplement Facts" if not valid "product.nutritionPanels" must be null
`;

const super_update = `
Carefully examine the image provided and created a neatly formatted JSON output containing a list of objects only if info available on image and Each object must have format:
json
{
  "product": {
    isFactPanelOnImage?: boolean,
    productName?: string,
    website?: string,
    upc12?: number,
    manufacturerName?: string,
    manufacturerAddress?: string,
    manufactureDate?: string,
    primarySize?: string,
    sizeUom?: string,
    primarySizeText?: string,
    nutritionPanels:  null or [
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
],

  }
}

Some rules for you:
1) common rules
+ json format in typescript format

3) "product.isFactPanelOnImage"
+ "product.isFactPanelOnImage" is the answer for question "Do you see professional nutrition fact panels on the image? return true or false"
+ some image may have advertisement for product's nutrients or its calories but it is not considered as a Fact Panel. The Fact Panel need a big header with text contain "Nutrition Facts" or "Supplement Facts" 

4) "product.nutritionPanels"
+ "product.nutritionPanels" only valid if it have panelName contain "Nutrition Facts"
 or "Supplement Facts" if not valid "product.nutritionPanels" must be null

1) panelName: if there is text on image contain "Nutrition Facts" or "Supplement Facts". If not it should be null

2) Extract exact numbers provided. No calculations or approximations are permitted.

3) Notations like 'Includes 7g of Added Sugars' should be recorded as "name": "Added Sugars", "value": 7, "uom": "g".

4) Each nutritional line's values must stay unique. Do not interchange numbers between lines or make false inferences. For instance, "total sugar 18g, included 5g added sugar 4%," should create two objects: one as "name": "total sugar", "value": 18, "uom": "g", "percentDailyValue": null, and another as "name": "added sugar", "value": 5, "uom": "g", "percentDailyValue": 14%.

5) The fields 'value', 'uom' (unit of measure), and 'percentDailyValue' can be empty or null. The 'value' is a float number, 'uom' is a string with no numeric characters, and 'percentDailyValue' is a float (without the percentage symbol).

6) Be cautious of potential typos and characters that may look similar but mean different (e.g., '8g' may appear as 'Bg', '0mg' as 'Omg').

8) In case of multiple panels in the image, create separate panel objects for each. Attempt to decipher the panel name from the adjacent text. It might be challenging to find it sometimes.

9) If there is only the name of the nutrient and the percentage, then it is considered the 'percentDailyValue', and 'value' and 'uom' are both null.

10) 

11) if you do not detect the value please leave it null

12) Notations like "10 serving per container" should be recorded as "name": "servingPerContainer", "value": 10, "uom": "serving per container"

13) Notations like "Contain" or "May Contain" or "contains: string."  should be recorded as "name": "contain", "value": string. For example: "May contain milk" should be recorded as "name": "contain", "value": "May contain milk". For Example: "Contain: Coconut, Milk." should be recorded as "name": "contain", "value": "Coconut, Milk."

14) The fact panel could be in the "dual-column" layout showing both "per serving" and "per container" information. Let's to break down and separate into two different fact panels one is for 'per serving'
 and other for 'per container' just if "amoutPerServing.name" of them are different, or "servingSize" of them are different. These two fact panels have the same value of "servingPerContainer", "footnote', "ingredients" and "contain".

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

30) "product.primarySize" and "product.sizeUom" and "product.primarySizeText" rules:
+ "product.primarySize" is a quantity measurement of product
+ "product.sizeUom" is "Units of Liquid Measurement" (such as "Fl OZ", "L", ...) or "Weight Units of Measure" (such as "Gram", "Kg", ...)
+ "product.sizeUom" exclude "calories"
Ex 1: "Net 3 Qt. (96 fl. oz.) 2.835L" should be recorded as {"primarySize": 96 , "sizeUom": "fl. oz." , "primarySizeText":  "value": "Net 3 Qt."}
Ex 2: "64 FL OZ(2QTs) 1.89L" should be recorded as {"primarySize": 64 , "sizeUom": "FL OZ" , "primarySizeText": "64 FL OZ"}
Ex 3: "Net WT 5.25 OZ 150g" should be recorded as {"primarySize": 5.25 , "sizeUom": "OZ" , "primarySizeText": "5.25 OZ"}
`;

export const NEW_PROMPT_old = `
Carefully examine the image provided and created a neatly formatted JSON output containing a list of objects only if info available on image and Each object must have format:
json
{
"doYouSee": {question: "do you see the fact panels on the provide image?", value: "your answer (gemini)"},
"whatYouSee": {question: "what you see in the provided image , please check if i have inserted image for you to check?", value: "your 
answer (gemini)"},
"doYouSeeFactPanel": {question: "Do you see fact panel on inserted image? and where is it on the image? Do you see it clearly?", value: "your answer (gemini)"},
"canYouReadWholeFactPanel": {question: "if you can't see the entire side panel due to the image crop just answer no, on the other hand you can answer yes", value: "your answer (gemini)"
"isFactPanelGoodToRead": "if you can't see the entire side panel due to the image crop just answer no, on the other hand you can answer yes. Return Yes or No only",
product: {
factPanelsDebug:  "your answer gemini",
factPanels:  null or [
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
  }
]
}
}

Some rule for you:
1) "product.factPanels":
+ if "isFactPanelGoodToRead" is "No" so "product.factPanels" = null else factPanels in JSON format

2) "product.panelName":
+ if there is text on image contain "Nutrition Facts" or "Supplement Facts". If not it should be null
`;

const new_1 = `

Carefully examine the image provided and created a neatly formatted JSON output containing a list of objects only if info available on image and Each object must have format:
json
{
"doYouSee": {question: "do you see the fact panels on the provide image?", value: "your answer (gemini)"},
"whatYouSee": {question: "what you see in the provided image , please check if i have inserted image for you to check?", value: "your 
answer (gemini)"},
"doYouSeeFactPanel": {question: "Do you see fact panel on inserted image? and where is it on the image? Do you see it clearly?", value: "your answer (gemini)"},
"canYouReadWholeFactPanel": {question: "if you can't see the entire side panel due to the image crop just answer no, on the other hand you can answer yes", value: "your answer (gemini)"
"isFactPanelGoodToRead": "if you can't see the entire side panel due to the image crop just answer no, on the other hand you can answer yes. Return Yes or No only",
product: {
factPanelsDebug:  "your answer gemini",
factPanels:  null or [
  {
  "panelName": string ,
  "amountPerServing": {"name": string?},
  "calories": {"value": float?, "uom": "calories"}
  "servingSize": {"description": string?, "value": string, "uom": string, servingSizeDebug: "your answer gemini"},
  "servingPerContainer": {"value": float? or number?, "uom": string},
  "nutrients": [{"name": string, "quantityComparisonOperator": string?, "value": float?, "uom": string, "quantityDescription": string?, "dailyPercentComparisonOperator": string?, "percentDailyValue": float,  "footnoteIndicator": string? }],
  "footnote": {
    "value": string?,
    "footnoteIndicatorList": string[],
  }
  "ingredients": string?,
  "contain": string?,
  }
]
}
}

Some rule for you:
1) "product.factPanels":
+ if "isFactPanelGoodToRead" is "No" so "product.factPanels" = null else factPanels in JSON format

2) "product.panelName":
+ if there is text on image contain "Nutrition Facts" or "Supplement Facts". If not it should be null

3) "servingSize":
+ servingSize text = servingSize.description (servingSize.value servingSize.uom)
+ or servingSize text = servingSize.value servingSize.uom

`;

export const NEW_PROMPT_SINGLE = `
Carefully examine the image provided and created a neatly formatted JSON output containing a list of objects only if info available on image and Each object must have format:
json
{
  "isFactPanelGoodToRead": [{"answer": string},...],
  "isIngredientsGoodToRead": [{"answer": string},...],
  "product": {
    "factPanelsDebug":  "your answer gemini",
    "factPanels":  [
      {
        "panelName": string ,
        "amountPerServing": {"name": string?},
        "calories": {"value": float?, "uom": "calories"}
        "servingSize": {"description": string?, "value": string, "uom": string, "servingSizeDebug": "your answer gemini"},
        "servingPerContainer":" {"value": float? or number?, "uom": string},
        "nutrients": [
          {
            "name": string, 
            "quantityComparisonOperator": string?, value: float?, uom: string, 
            "quantityDescription": string?,
            "dailyPercentComparisonOperator": string?, 
            "percentDailyValue": float,  
            "footnoteIndicator": string?, 
            "footnoteIndicatorDebug": "your answer gemini"
          }
        ],
        "footnote": {
          "value": string?,
          "footnoteIndicatorList": string[],
        },
      }
    ],
    "ingredientsGroup": [{"ingredients": string}],
    "contain": string?,
  }
}
Some common constants:
+ FOOTNOTE_INDICATORS = ["*", "**", "†", "★★", "★"]

Some definitions:
1) about the "Fact Panel"
+ is a list of nutrient or substance info
+ must have a Big Text like a Header such as "Nutrition Facts" or "Supplement Facts" visible on it
+ be careful when you (gemini) confirm to see something since curvature of container or cropped image can make content obscured.

Some rule for you:

1) "isFactPanelGoodToRead" = array of answers of all below questions:
Q1: Can you see the entire side fact panel? why?
If any part of fact panel are  partially obscured or invisible by normal eyes by curvature of container the answer must be "No ....".
if any part of parts of fact panel are partially obscured or invisible by normal eyes  by image crop the answer must be "No ..."
if any part of fact panel are partially obscured or invisible by normal eyes  by something the answer must be "No ..."
Q2: Can you see "serving size info" from fact panel? Why?
If "serving size" is  partially obscured the answer must be "No .....".
Q3: is the exact text "Supplement Facts" or "Nutrition Facts" 100% visible on provided image ?
If the text is  partially obscured  or invisible by normal eyes the answer must be "No ...".
If the exact text "Supplement Facts" or "Nutrition Facts" is  partially obscured  or invisible by normal eyes by curvature of container the answer must be "No ....".

2) "isIngredientsGoodToRead" = array of answers of all below questions:
Q1: Can you  see the entire ingredient list?
If the text is  partially obscured  or invisible by normal eyes the answer must be "No ...".
Q2: is the exact text "ingredients:" or "other ingredients:" 100% visible on provided image?
If the text is  partially obscured  or invisible by normal eyes the answer must be "No ...".


3) "product.ingredientsGroup":
+ if "isIngredientsGoodToRead" have one answer is "No..." so "product.ingredientsGroup" = [] else ingredientsGroup in JSON format

4) "product.factPanels":
+ if "isFactPanelGoodToRead" have one answer is "No..." so "product.factPanels" = null else factPanels in JSON format

5) The fact panel could be in the "dual-column" layout showing both "per serving" and "per container" information. Let's to break down and separate into two different fact panels one is for 'per serving'
and other for 'per container' just if "amoutPerServing.name" of them are different or "servingSize" of them are different. These two fact panels have the same value of "servingPerContainer", "footnote', "ingredients" and "contain".

6) common rules:
+ "nutrients" is an array that usually start with some nutrients such as "Total Carbohydrate", "Vitamin A", ... Let's list nutrient from them first if possible.
+ Read "Fact Panel" from left to right and from top to bottom.
+ content in prompt can be similar to typescript and nodejs syntax.

7) "product.panelName":
+ if there is text on image contain "Nutrition Facts" or "Supplement Facts". If not it should be null

8) "servingSize":
+ if "servingSize" content contains the parentheses so "servingSize" format = servingSize.description + "("+ servingSize.value + servingSize.uom ")" 
+ else "servingSize" format = servingSize.value + servingSize.uom
Ex 1: "10 tablespoons(80g)" = {servingSize: {"description": "10 tablespoons", "value": "80", "uom": "g"}}
Ex 2: "10 tablespoons" = {servingSize: {"value": 10, "uom": "tablespoons"}}

9) "footnote":
+ "footnote" section is in the bottom part of fact panel (the note may contain some special characters from FOOTNOTE_INDICATORS).
+ "footnote.footnoteIndicatorList" is a list of special characters found in "footnote.value"
+ "footnote.value" contains all specials symbol from "footnote.footnoteIndicatorList"
+ "footnote.footnoteIndicatorList" only contain character from FOOTNOTE_INDICATORS
Ex 1: "**Percent Value *Based on" = {footnote: {value :"**Percent Value *Based on", footnoteIndicatorList: ["*", "**"]}}
Ex 2: "*Daily Value not establnished." = {footnote: {value: "*Daily Value not established.", footnoteIndicatorList": ["*"]}}
Ex 3: "†Daily Value not established." = {footnote: {value: "†Daily Value not established.", footnoteIndicatorList": ["†"]}}
Ex 4: "Not a significant source of saturated fat, trans fat." = {footnote:{value: "Not a significant source of saturated fat, trans fat.", footnoteIndicatorList: null}}

10) "nutrient.footnoteIndicator":
+ "nutrient.footnoteIndicator" is a special symbol such as "*", "†" or is a group of special symbol such as "**" beside the nutrient percent value. Sometimes nutrient percent value is left empty but still have footnoteIndicator right there.

11) "amountPerServing.name":
+ is a text and usually stay above the "calories value number",
Ex 1: "Per container", "Per serving"

12) "nutrient.quantityComparisonOperator" and "nutrient.dailyPercentComparisonOperator" rules:
+ "nutrient.quantityComparisonOperator" is a comparison operator at the left side of "nutrient.value" and "nutrient.uom"
+ "nutrient.dailyPercentComparisonOperator" is a comparison operator at the left side of "nutrient.percentDailyValue".
+ "nutrient.dailyPercentComparisonOperator" is not "nutrient.quantityComparisonOperator".
Ex 1: "10g    <10%" = {quantityComparisonOperator: null, dailyPercentComparisonOperator: "<", ...}
Ex 2: "<10g    10%" = {quantityComparisonOperator: "<", dailyPercentComparisonOperator: null, ...}
Ex 3: "<10g    <10%" ={quantityComparisonOperator: "<", dailyPercentComparisonOperator: "<", ...}

13) "nutrient.name":
Ex 1: "Vitamin K2(as Naturally Derived MK-7 [Menaquinone-7)" = {"name": "Vitamin K2(as Naturally Derived MK-7 [Menaquinone-7)"}

14) "nutrient.quantityDescription":
+ is additional text right next to "nutrient.uom" and inside the parentheses, and does not include parentheses.
Ex 1: "20mcg(800 IU)" = {quantityDescription: "800 IU"}

15) "ingredients":
+ usually appear below or next to the nutrition panel and start right after "ingredients:" or "Ingredients:" or "INGREDIENTS:" or "Other Ingredients:".
`;
