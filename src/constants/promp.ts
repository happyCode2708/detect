// export const ORIGINAL_PROMPT = `Carefully examine the image provided and created a neatly formatted JSON output containing a list of objects. Each object should contain:
// json
// [
//  {
//  "panelName": string ,
//  "amountPerServing": {"value": float?, "uom": string},
//  "servingSize": {"value": string, "uom": string},
//  "servingPerContainer": {"value": float?, "uom": string},
//  "nutrients": [{"name": string, "value": float?, "uom": string, "percentDailyValue": float}],
//  "note": string,
//  "ingredients": string
//  }
// ]

// Some rules for you:

// 1) Extract exact numbers provided. No calculations or approximations are permitted.

// 2) Notations like 'Includes 7g of Added Sugars' should be recorded as "name": "Added Sugars", "value": 7, "uom": "g".

// 3) Each nutritional line's values must stay unique. Do not interchange numbers between lines or make false inferences. For instance, "total sugar 18g, included 5g added sugar 4%," should create two objects: one as "name": "total sugar", "value": 18, "uom": "g", "percentDailyValue": null, and another as "name": "added sugar", "value": 5, "uom": "g", "percentDailyValue": 14%.

// 4) The fields 'value', 'uom' (unit of measure), and 'percentDailyValue' can be empty or null. The 'value' is a float number, 'uom' is a string with no numeric characters, and 'percentDailyValue' is a float (without the percentage symbol).

// 5) Be cautious of potential typos and characters that may look similar but mean different (e.g., '8g' may appear as 'Bg', '0mg' as 'Omg').

// 6) Special characters like *, +, ., before the note section are crucial - they usually have specific implications.

// 7) In case of multiple panels in the image, create separate panel objects for each. Attempt to decipher the panel name from the adjacent text. It might be challenging to find it sometimes.

// 8) If there is only the name of the nutrient and the percentage, then it is considered the 'percentDailyValue', and 'value' and 'uom' are both null.

// 9) Ingredients usually appear below or next to the nutrition panel and start with "ingredients:".

// 10) The fact info could be put side by side and may need to be extract data just like we are reading a table

// 11) The fact panel has two or more than two different nutrition info for two different sizes of serving. Please read the image carefully to check how many sizes of serving on the the fact panel
// `;

export const NEW_PROMPT = `Carefully examine the image provided and created a neatly formatted JSON output containing a list of objects only if info available on image and Each object should contain:
json
[
{
"panelName": string ,
"amountPerServing": {"name": string?},
"calories": {"value": float?, "uom": "calories"}
"servingSize": {"value": string, "uom": string},
"servingPerContainer": {"value": float? or number?, "uom": string},
"nutrients": [{"name": string, "value": float?, "uom": string, "percentDailyValue": float,  "footnoteIndicator": string? }],
"footnote": string,
"ingredients": string
'contain': string?,pro
}page
]

Some rules for you:
1) panelName: if there is text on image contain "Nutrition Facts" or "Supplement Facts". If not it should be null

2) Extract exact numbers provided. No calculations or approximations are permitted.

3) Notations like 'Includes 7g of Added Sugars' should be recorded as "name": "Added Sugars", "value": 7, "uom": "g".

4) Each nutritional line's values must stay unique. Do not interchange numbers between lines or make false inferences. For instance, "total sugar 18g, included 5g added sugar 4%," should create two objects: one as "name": "total sugar", "value": 18, "uom": "g", "percentDailyValue": null, and another as "name": "added sugar", "value": 5, "uom": "g", "percentDailyValue": 14%.

5) The fields 'value', 'uom' (unit of measure), and 'percentDailyValue' can be empty or null. The 'value' is a float number, 'uom' is a string with no numeric characters, and 'percentDailyValue' is a float (without the percentage symbol).

6) Be cautious of potential typos and characters that may look similar but mean different (e.g., '8g' may appear as 'Bg', '0mg' as 'Omg').

7) "footnote" section is in the bottom part of fact panel (the note contain some special charactor "*", "+", "**")

8) In case of multiple panels in the image, create separate panel objects for each. Attempt to decipher the panel name from the adjacent text. It might be challenging to find it sometimes.

9) If there is only the name of the nutrient and the percentage, then it is considered the 'percentDailyValue', and 'value' and 'uom' are both null.

10) Ingredients usually appear below or next to the nutrition panel and start right after "ingredients:" or "Ingredients:" or "INGREDIENTS:" or "Other Ingredients:". 

11) if you do not detect the value please leave it null

12) Notations like "10 serving per container" should be recorded as "name": "servingPerContainer", "value": 10, "uom": "serving per container"

13) Notations like "Contain" or "May Contain" or "contains: string."  should be recorded as "name": "contain", "value": string. For example: "May contain milk" should be recorded as "name": "contain", "value": "May contain milk". For Example: "Contain: Coconut, Milk." should be recorded as "name": "contain", "value": "Coconut, Milk."

14) For "Supplement Fact" there may be a special symbol such as "*" or "**" or "+" or "***", ... and the symbol exclude "%" right at position of "percentDailyValue". That symbol should be recorded as "footnoteIndicator", For example "5%**" or "**" should be recorded as "endSymbol": "**".

15) The fact panel could be in the "dual-column" layout showing both "per serving" and "per container" information. Let's break down and separate into two different fact panels one is for 'per serving'
 and other for 'per container'. These two fact panels have the same "nutrients" and have the same value of "servingPerContainer", "footnote', "ingredients" and "contain". If these two fact panels does not have the same "nutrients" they are not in "dual-column" layout and should be read as one fact panel.

16) the "name" of "amountPerServing" is a text and usually stay above the "calories value number". For example "Per container", "Per serving".
`;
