const test_1 = `
Carefully examine the image provided and created a neatly formatted JSON output containing a list of objects only if info available on image and Each object must have format:
json
{
"doYouSee": {question: "do you see the fact panels on the provide image?", value: "your answer (gemini)"},
"whatYouSee": {question: "what you see in the provided image , please check if i have inserted image for you to check?", value: "your 
answer (gemini)"},
"doYouSeeFactPanel": {question: "Do you see fact panel on inserted image? and where is it on the image? Do you see it clearly?", value: "your answer (gemini)"},
"canYouReadWholeFactPanel": {question: "if you can't see the entire side panel due to the image crop just answer no, on the other hand you can answer yes", value: "your answer (gemini)"
"isFactPanelGoodToRead": "if you can't see the entire side panel due to the image crop exclude ingredients just answer no, on the other hand you can answer yes. Return Yes or No only",
product: {
factPanelsDebug:  "your answer gemini",
factPanels:  [
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

3) "prodservingSize":
+ servingSize text = servingSize.description + "("+ servingSize.value + servingSize.uom+ ")"
+ or servingSize text = servingSize.value + servingSize.uom
`;

const test2 = `
Carefully examine the image provided and created a neatly formatted JSON output containing a list of objects only if info available on image and Each object must have format:
json
{
"doYouSee": {question: "do you see the fact panels on the provide image?", value: "your answer (gemini)"},
"whatYouSee": {question: "what you see in the provided image , please check if i have inserted image for you to check?", value: "your 
answer (gemini)"},
"doYouSeeFactPanel": {question: "Do you see fact panel on inserted image? and where is it on the image? Do you see it clearly?", value: "your answer (gemini)"},
"canYouReadWholeFactPanel": {
question: "if you can't see the entire fact panels (the part contain nutrition for supplement info) just answer no, on the other hand you can answer yes (Remember that ingredients and manufacturing is different section from the fact panels ). And please tell me which part of fact panel you cannot see the whole", 
value: "your answer (gemini)"
},
"isFactPanelGoodToRead": "if you can't see the entire side panel due to the image crop exclude ingredients and parts which does not contain nutrition facts just answer no, on the other hand you can answer yes. Return Yes or No only",
product: {
factPanelsDebug:  "your answer gemini",
factPanels:  [
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

3) "prodservingSize":
+ servingSize text = servingSize.description + "("+ servingSize.value + servingSize.uom+ ")"
+ or servingSize text = servingSize.value + servingSize.uom
`;

const test3 = `
Carefully examine the image provided and created a neatly formatted JSON output containing a list of objects only if info available on image and Each object must have format:
json
{
"doYouSee": {question: "do you see the fact panels on the provide image?", value: "your answer (gemini)"},
"whatYouSee": {question: "what you see in the provided image , please check if i have inserted image for you to check?", value: "your 
answer (gemini)"},
"doYouSeeFactPanel": {question: "Do you see fact panel on inserted image? and where is it on the image? Do you see it clearly?", value: "your answer (gemini)"},
"isFactPanelGoodToRead": "if you can't see the entire side panel due to the image crop exclude ingredients and parts which does not contain nutrition facts just answer no, on the other hand you can answer yes. Return Yes or No only",
product: {
factPanelsDebug:  "your answer gemini",
factPanels:  [
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
+ if servingSize's text contain "(" and ")" so  servingSize = servingSize.description + "("+ servingSize.value + servingSize.uom+ ")" 
ex: "2 bottles (200mg)" = {servingSize: {description: "2 bottles", value: 200, uom: "mg"}
+ if servingSize's text do not contain "(" and ")" so servingSize text = servingSize.value + servingSize.uom
ex: "10 tablespoons" equivalent {servingSize: {description: null, value: 10, uom: "tablespoons"}}
`;

const test4 = `
Carefully examine the image provided and created a neatly formatted JSON output containing a list of objects only if info available on image and Each object must have format:
json
{
"doYouSee": {question: "do you see the fact panels on the provide image?", value: "your answer (gemini)"},
"whatYouSee": {question: "what you see in the provided image , please check if i have inserted image for you to check?", value: "your 
answer (gemini)"},
"doYouSeeFactPanel": {question: "Do you see fact panel on inserted image? and where is it on the image? Do you see it clearly?", value: "your answer (gemini)"},
"canYouReadWholeFactPanel": {
question: "if you can't see the entire fact panels (the part contain nutrition for supplement info) just answer no, on the other hand you can answer yes (Remember that ingredients and manufacturing is different section from the fact panels ). And please tell me which part of fact panel you cannot see the whole", 
value: "your answer (gemini)"
},
"isFactPanelGoodToRead": "your answer gemini",
product: {
factPanelsDebug:  "your answer gemini",
factPanels:  [
  {
  "panelName": string ,
  "amountPerServing": {"name": string?},
  "calories": {"value": float?, "uom": "calories"}
  "servingSize": {"description": string?, "value": string, "uom": string, servingSizeDebug: "your answer gemini"},
  "servingPerContainer": {"value": float? or number?, "uom": string},
  "nutrients": [{"name": string, "quantityComparisonOperator": string?, "value": float?, "uom": string, "quantityDescription": string?, "dailyPercentComparisonOperator": string?, "percentDailyValue": float,  "footnoteIndicator": string?, "footnoteIndicatorDebug": "your answer gemini" }],
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
1) "isFactPanelGoodToRead"
+ if you can't see the entire side fact panel due to the image crop answer no, on the other hand you can answer yes. And Tell me the reason why no or yes, and the possible missing part
+ ingredients info, and manufacturing info is not required to answer "yes"
+ required fields to answer "yes" are "servingSize" 


2) "product.factPanels":
+ if "isFactPanelGoodToRead" is "No" so "product.factPanels" = null else factPanels in JSON format

3) "product.panelName":
+ if there is text on image contain "Nutrition Facts" or "Supplement Facts". If not it should be null

4) "servingSize":
+ if servingSize's text contain "(" and ")" so  servingSize = servingSize.description + "("+ servingSize.value + servingSize.uom+ ")" 
ex: "2 bottles (200mg)" = {servingSize: {description: "2 bottles", value: 200, uom: "mg"}
+ if servingSize's text do not contain "(" and ")" so servingSize text = servingSize.value + servingSize.uom
ex: "10 tablespoons" equivalent {servingSize: {description: null, value: 10, uom: "tablespoons"}}
`;

const test5 = `
Carefully examine the image provided and created a neatly formatted JSON output containing a list of objects only if info available on image and Each object must have format:
json
{
"doYouSee": {question: "do you see the fact panels on the provide image?", value: "your answer (gemini)"},
"whatYouSee": {question: "what you see in the provided image , please check if i have inserted image for you to check?", value: "your 
answer (gemini)"},
"doYouSeeFactPanel": {question: "Do you see fact panel on inserted image? and where is it on the image? Do you see it clearly?", value: "your answer (gemini)"},
"canYouReadWholeFactPanel": {
question: "if you can't see the entire fact panels (the part contain nutrition for supplement info) just answer no, on the other hand you can answer yes (Remember that ingredients and manufacturing is different section from the fact panels ). And please tell me which part of fact panel you cannot see the whole", 
value: "your answer (gemini)"
},
"isFactPanelGoodToRead": "your answer gemini",
product: {
factPanelsDebug:  "your answer gemini",
factPanels:  [
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


some define:
1) common constants:
+ FOOTNOTE_INDICATORS = ["*", "**", "†"]

Some rule for you:
1) "isFactPanelGoodToRead"
+ if you can't see the entire side fact panel due to the image crop answer no, on the other hand you can answer yes. And Tell me the reason why no or yes, and the possible missing part
+ ingredients info, and manufacturing info is not required to answer "yes"
+ required fields to answer "yes" are "servingSize" 


2) "product.factPanels":
+ if "isFactPanelGoodToRead" is "No" so "product.factPanels" = null else factPanels in JSON format

3) "product.panelName":
+ if there is text on image contain "Nutrition Facts" or "Supplement Facts". If not it should be null

4) "servingSize":
+ if "servingSize" content contains the parentheses so "servingSize" format = servingSize.description + "("+ servingSize.value + servingSize.uom+ ")" 
+ else "servingSize" format = servingSize.value + servingSize.uom
Ex 1: "10 tablespoons(80g)" = {servingSize: {"description": "10 tablespoons", "value": "80", "uom": "g"}}
Ex 2: "10 tablespoons" = {servingSize: {"value": 10, "uom": "tablespoons"}}

5) "footnote":
+ "footnote" section is in the bottom part of fact panel (the note may contain some special characters from FOOTNOTE_INDICATORS).
+ "footnote.footnoteIndicatorList" is a list of special characters found in "footnote.value"
+ "footnote.value" contains all specials symbol from "footnote.footnoteIndicatorList"
+ "footnote.footnoteIndicatorList" only contain character from FOOTNOTE_INDICATORS
Ex 1: "**Percent Value *Based on" = {footnote: {value :"**Percent Value *Based on", footnoteIndicatorList: ["*", "**"]}}
Ex 2: "*Daily Value not established." = {footnote: {value: "*Daily Value not established.", footnoteIndicatorList": ["*"]}}
Ex 3: "†Daily Value not established." = {footnote: {value: "†Daily Value not established.", footnoteIndicatorList": ["†"]}}
Ex 4: "Not a significant source of saturated fat, trans fat." = {footnote:{value: "Not a significant source of saturated fat, trans fat.", footnoteIndicatorList: null}}

6) "nutrient.footnoteIndicator":
+ "footnote.footnoteIndicatorList" is a list of special character or a group of special characters such as "*", "**", "+"
+ "footnote.footnoteIndicatorList" must contain "nutrient.footnoteIndicator",
+ "footnote.footnoteIndicatorList" is only get from list FOOTNOTE_INDICATORS.
Ex 1: "10g <10%**" = {"footnoteIndicator": "**", ...}
Ex 2: "10mg ***" = {"footnoteIndicator": "***", ...}
Ex 3: "15mg 0%†" = {"footnoteIndicator": "†", ...}
Ex 4: "30mg(400 UI)  **" = {"footnoteIndicator": "**", ...}
Ex 5: correct the mistake "150mg 20% ★★"= {"footnoteIndicator": "**", ...} so "**" replace for "★★" since the "footnoteIndicator" is only from FOOTNOTE_INDICATORS. The blurry image could lead to misreading indicator.
debug: "footnoteIndicatorDebug" = "print the whole while text of nutrient including footnote indicator".
`;

const test6 = `Carefully examine the image provided and created a neatly formatted JSON output containing a list of objects only if info available on image and Each object must have format:
json
{
"doYouSee": {question: "do you see the fact panels on the provide image?", value: "your answer (gemini)"},
"whatYouSee": {question: "what you see in the provided image , please check if i have inserted image for you to check?", value: "your 
answer (gemini)"},
"doYouSeeFactPanel": {question: "Do you see fact panel on inserted image? and where is it on the image? Do you see it clearly?", value: "your answer (gemini)"},
"canYouReadWholeFactPanel": {
question: "if you can't see the entire fact panels (the part contain nutrition for supplement info) just answer no, on the other hand you can answer yes (Remember that ingredients and manufacturing is different section from the fact panels ). And please tell me which part of fact panel you cannot see the whole", 
value: "your answer (gemini)"
},
"isFactPanelGoodToRead": "your answer gemini",
product: {
factPanelsDebug:  "your answer gemini",
factPanels:  [
  {
  panelName: string ,
  amountPerServing: {name: string?},
  calories: {value: float?, uom: "calories"}
  servingSize: {description: string?, value: string, uom: string, servingSizeDebug: "your answer gemini"},
  servingPerContainer: {value: float? or number?, uom: string},
  nutrients: [{name: string, quantityComparisonOperator: string?, value: float?, uom: string, quantityDescription: string?,
dailyPercentComparisonOperator: string?, percentDailyValue: float,  footnoteIndicator: string?,  footnoteIndicatorDebug: "your answer gemini"}],
  footnote: {
    value: string?,
    footnoteIndicatorList: string[],
  }
  ingredients: string?,
  contain: string?,
  }
]
}
}

some common constants:
+ FOOTNOTE_INDICATORS = ["*", "**", "†", "★★", "★"]

Some rule for you:
1) "isFactPanelGoodToRead"
+ if you can't see the entire side fact panel due to the image crop answer no, on the other hand you can answer yes. And Tell me the reason why no or yes, and the possible missing part
+ ingredients info, and manufacturing info is not required to answer "yes"
+ required fields to answer "yes" are "servingSize" 


2) "product.factPanels":
+ if "isFactPanelGoodToRead" is "No" so "product.factPanels" = null else factPanels in JSON format

3) "product.panelName":
+ if there is text on image contain "Nutrition Facts" or "Supplement Facts". If not it should be null

4) "servingSize":
+ if "servingSize" content contains the parentheses so "servingSize" format = servingSize.description + "("+ servingSize.value + servingSize.uom+ ")" 
+ else "servingSize" format = servingSize.value + servingSize.uom
Ex 1: "10 tablespoons(80g)" = {servingSize: {"description": "10 tablespoons", "value": "80", "uom": "g"}}
Ex 2: "10 tablespoons" = {servingSize: {"value": 10, "uom": "tablespoons"}}

5) "footnote":
+ "footnote" section is in the bottom part of fact panel (the note may contain some special characters from FOOTNOTE_INDICATORS).
+ "footnote.footnoteIndicatorList" is a list of special characters found in "footnote.value"
+ "footnote.value" contains all specials symbol from "footnote.footnoteIndicatorList"
+ "footnote.footnoteIndicatorList" only contain character from FOOTNOTE_INDICATORS
Ex 1: "**Percent Value *Based on" = {footnote: {value :"**Percent Value *Based on", footnoteIndicatorList: ["*", "**"]}}
Ex 2: "*Daily Value not established." = {footnote: {value: "*Daily Value not established.", footnoteIndicatorList": ["*"]}}
Ex 3: "†Daily Value not established." = {footnote: {value: "†Daily Value not established.", footnoteIndicatorList": ["†"]}}
Ex 4: "Not a significant source of saturated fat, trans fat." = {footnote:{value: "Not a significant source of saturated fat, trans fat.", footnoteIndicatorList: null}}

6) "nutrient.footnoteIndicator":
+ "footnote.footnoteIndicatorList" is a list of special character or a group of special characters such as "*", "**", "+"
+ "footnote.footnoteIndicatorList" must contain "nutrient.footnoteIndicator",
+ "footnote.footnoteIndicatorList" is only get from list FOOTNOTE_INDICATORS.
Ex 1: "10g <10%**" = {"footnoteIndicator": "**", ...}
Ex 2: "10mg ***" = {"footnoteIndicator": "***", ...}
Ex 3: "15mg 0%†" = {"footnoteIndicator": "†", ...}
Ex 4: "30mg(400 UI)  **" = {"footnoteIndicator": "**", ...}
Ex 5: correct the mistake "150mg 20% ★★"= {"footnoteIndicator": "**", ...} so "**" replace for "★★" since the "footnoteIndicator" is only from FOOTNOTE_INDICATORS. The blurry image could lead to misreading indicator.
debug: "footnoteIndicatorDebug" = "print the whole line of info text of current nutrient eventhough footnoteIndicator is null".
`;

// 6) "nutrient.footnoteIndicator" rules:
// + "footnote.footnoteIndicatorList" is a list of special character or a group of special characters such as "*", "**", "+"
// + "footnote.footnoteIndicatorList" must contain "nutrient.footnoteIndicator",
// + "footnote.footnoteIndicator" is only get from list FOOTNOTE_INDICATORS.
// Ex 1: "10g <10%**" should be recorded as {"footnoteIndicator": "**", ...}
// Ex 2: "10mg ***" should be recorded as {"footnoteIndicator": "***", ...}
// Ex 3: "15mg 0%†" should be recorded as {"footnoteIndicator": "†", ...}
// Ex 4: "30mg(400 UI)  **" should be recorded as {"footnoteIndicator": "**", ...}
// Ex 5: correct the mistake "150mg 20% ★★" should be record as {"footnoteIndicator": "**", ...} so "**" replace for "★★" since the "footnoteIndicator" is only from FOOTNOTE_INDICATORS. The blurry image could lead to misreading indicator.

const test7 = `
Carefully examine the image provided and created a neatly formatted JSON output containing a list of objects only if info available on image and Each object must have format:
json
{
"doYouSee": {question: "do you see the fact panels on the provide image?", value: "your answer (gemini)"},
"whatYouSee": {question: "what you see in the provided image , please check if i have inserted image for you to check?", value: "your 
answer (gemini)"},
"doYouSeeFactPanel": {question: "Do you see fact panel on inserted image? and where is it on the image? Do you see it clearly?", value: "your answer (gemini)"},
"canYouReadWholeFactPanel": {
question: "if you can't see the entire fact panels (the part contain nutrition for supplement info) just answer no, on the other hand you can answer yes (Remember that ingredients and manufacturing is different section from the fact panels ). And please tell me which part of fact panel you cannot see the whole", 
value: "your answer (gemini)"
},
"isFactPanelGoodToRead": "your answer gemini",
product: {
factPanelsDebug:  "your answer gemini",
factPanels:  [
  {
  panelName: string ,
  amountPerServing: {name: string?},
  calories: {value: float?, uom: "calories"}
  servingSize: {description: string?, value: string, uom: string, servingSizeDebug: "your answer gemini"},
  servingPerContainer: {value: float? or number?, uom: string},
  nutrients: [{name: string, quantityComparisonOperator: string?, value: float?, uom: string, quantityDescription: string?,
dailyPercentComparisonOperator: string?, percentDailyValue: float,  footnoteIndicator: string?, footnoteIndicatorDebug: "your answer gemini"
}],
  footnote: {
    value: string?,
    footnoteIndicatorList: string[],
  }
  ingredients: string?,
  contain: string?,
  }
]
}
}

some common constants:
+ FOOTNOTE_INDICATORS = ["*", "**", "†", "★★", "★"]

Some rule for you:
1) "isFactPanelGoodToRead"
+ if you can't see the entire side fact panel due to the image crop answer no, on the other hand you can answer yes. And Tell me the reason why no or yes, and the possible missing part
+ ingredients info, and manufacturing info is not required to answer "yes"
+ required fields to answer "yes" are "servingSize" 


2) "product.factPanels":
+ if "isFactPanelGoodToRead" is "No" so "product.factPanels" = null else factPanels in JSON format

3) "product.panelName":
+ if there is text on image contain "Nutrition Facts" or "Supplement Facts". If not it should be null

4) "servingSize":
+ if "servingSize" content contains the parentheses so "servingSize" format = servingSize.description + "("+ servingSize.value + servingSize.uom+ ")" 
+ else "servingSize" format = servingSize.value + servingSize.uom
Ex 1: "10 tablespoons(80g)" = {servingSize: {"description": "10 tablespoons", "value": "80", "uom": "g"}}
Ex 2: "10 tablespoons" = {servingSize: {"value": 10, "uom": "tablespoons"}}

5) "footnote":
+ "footnote" section is in the bottom part of fact panel (the note may contain some special characters from FOOTNOTE_INDICATORS).
+ "footnote.footnoteIndicatorList" is a list of special characters found in "footnote.value"
+ "footnote.value" contains all specials symbol from "footnote.footnoteIndicatorList"
+ "footnote.footnoteIndicatorList" only contain character from FOOTNOTE_INDICATORS
Ex 1: "**Percent Value *Based on" = {footnote: {value :"**Percent Value *Based on", footnoteIndicatorList: ["*", "**"]}}
Ex 2: "*Daily Value not established." = {footnote: {value: "*Daily Value not established.", footnoteIndicatorList": ["*"]}}
Ex 3: "†Daily Value not established." = {footnote: {value: "†Daily Value not established.", footnoteIndicatorList": ["†"]}}
Ex 4: "Not a significant source of saturated fat, trans fat." = {footnote:{value: "Not a significant source of saturated fat, trans fat.", footnoteIndicatorList: null}}

6) "nutrient.footnoteIndicator":
+ "footnote.footnoteIndicatorList" is a list of special character or a group of special characters such as "*", "**", "+"
+ "footnote.footnoteIndicatorList" must contain "nutrient.footnoteIndicator",
+ "footnote.footnoteIndicatorList" is only get from list FOOTNOTE_INDICATORS.
Ex 1: "10g <10%**" = {"footnoteIndicator": "**", ...}
Ex 2: "10mg ***" = {"footnoteIndicator": "***", ...}
Ex 3: "15mg 0%†" = {"footnoteIndicator": "†", ...}
Ex 4: "30mg(400 UI)  **" = {"footnoteIndicator": "**", ...}
Ex 5: correct the mistake "150mg 20% ★★"= {"footnoteIndicator": "**", ...} so "**" replace for "★★" since the "footnoteIndicator" is only from FOOTNOTE_INDICATORS. The blurry image could lead to misreading indicator.

"footnoteIndicatorDebug" =  " answer for help me print the whole line of info text of current nutrient eventhough footnoteIndicator is null".
`;

const testStar = `
Carefully examine the image provided and created a neatly formatted JSON output containing a list of objects only if info available on image and Each object must have format:
json
{
"doYouSee": {question: "do you see the fact panels on the provide image?", value: "your answer (gemini)"},
"whatYouSee": {question: "what you see in the provided image , please check if i have inserted image for you to check?", value: "your 
answer (gemini)"},
"doYouSeeFactPanel": {question: "Do you see fact panel on inserted image? and where is it on the image? Do you see it clearly?", value: "your answer (gemini)"},
"canYouReadWholeFactPanel": {
question: "if you can't see the entire fact panels (the part contain nutrition for supplement info) just answer no, on the other hand you can answer yes (Remember that ingredients and manufacturing is different section from the fact panels ). And please tell me which part of fact panel you cannot see the whole", 
value: "your answer (gemini)"
},
"isFactPanelGoodToRead": "your answer gemini",
product: {
  totalSugars: "your answer gemini"
}
}

some common constants:
+ FOOTNOTE_INDICATORS = ["*", "**", "†", "★★", "★"]

Some rule for you:
1) "isFactPanelGoodToRead"
+ if you can't see the entire side fact panel due to the image crop answer no, on the other hand you can answer yes. And Tell me the reason why no or yes, and the possible missing part
+ ingredients info, and manufacturing info is not required to answer "yes"
+ required fields to answer "yes" are "servingSize" 


2) "product.factPanels":
+ if "isFactPanelGoodToRead" is "No" so "product.factPanels" = null else factPanels in JSON format

3) "totalSugars":
"totalSugar" = "gemini answer for question of 'Pleas write out ocr text of total sugars. Do you see ** at the end ?'"
`;

const test8 = `
Carefully examine the image provided and created a neatly formatted JSON output containing a list of objects only if info available on image and Each object must have format:
json
{
"doYouSee": {question: "do you see the fact panels on the provide image?", value: "your answer (gemini)"},
"whatYouSee": {question: "what you see in the provided image , please check if i have inserted image for you to check?", value: "your 
answer (gemini)"},
"doYouSeeFactPanel": {question: "Do you see fact panel on inserted image? and where is it on the image? Do you see it clearly?", value: "your answer (gemini)"},
"canYouReadWholeFactPanel": {
question: "if you can't see the entire fact panels (the part contain nutrition for supplement info) just answer no, on the other hand you can answer yes (Remember that ingredients and manufacturing is different section from the fact panels ). And please tell me which part of fact panel you cannot see the whole", 
value: "your answer (gemini)"
},
"isFactPanelGoodToRead": "your answer gemini",
product: {
factPanelsDebug:  "your answer gemini",
factPanels:  [
  {
  panelName: string ,
  amountPerServing: {name: string?},
  calories: {value: float?, uom: "calories"}
  servingSize: {description: string?, value: string, uom: string, servingSizeDebug: "your answer gemini"},
  servingPerContainer: {value: float? or number?, uom: string},
  nutrients: [{name: string, quantityComparisonOperator: string?, value: float?, uom: string, quantityDescription: string?,
dailyPercentComparisonOperator: string?, percentDailyValue: float,  footnoteIndicator: string?, footnoteIndicatorDebug: "your answer gemini"
}],
  footnote: {
    value: string?,
    footnoteIndicatorList: string[],
  }
  ingredients: string?,
  contain: string?,
  }
]
}
}

some common constants:
+ FOOTNOTE_INDICATORS = ["*", "**", "†", "★★", "★"]

Some rule for you:
1) "isFactPanelGoodToRead"
+ if you can't see the entire side fact panel due to the image crop answer no, on the other hand you can answer yes. And Tell me the reason why no or yes, and the possible missing part
+ ingredients info, and manufacturing info is not required to answer "yes"
+ required fields to answer "yes" are "servingSize" 


2) "product.factPanels":
+ if "isFactPanelGoodToRead" is "No" so "product.factPanels" = null else factPanels in JSON format

3) common rules:
+ "nutrients" is an array that usually start with some nutrients such as "Total Carbohydrate", "Vitamin A", ... Let's list nutrient from them first if possible.
+ Read "Fact Panel" from left to right and from top to bottom.
+ content in prompt can be similar to typescript and nodejs syntax.

4) "product.panelName":
+ if there is text on image contain "Nutrition Facts" or "Supplement Facts". If not it should be null

5) "servingSize":
+ if "servingSize" content contains the parentheses so "servingSize" format = servingSize.description + "("+ servingSize.value + servingSize.uom+ ")" 
+ else "servingSize" format = servingSize.value + servingSize.uom
Ex 1: "10 tablespoons(80g)" = {servingSize: {"description": "10 tablespoons", "value": "80", "uom": "g"}}
Ex 2: "10 tablespoons" = {servingSize: {"value": 10, "uom": "tablespoons"}}

6) "footnote":
+ "footnote" section is in the bottom part of fact panel (the note may contain some special characters from FOOTNOTE_INDICATORS).
+ "footnote.footnoteIndicatorList" is a list of special characters found in "footnote.value"
+ "footnote.value" contains all specials symbol from "footnote.footnoteIndicatorList"
+ "footnote.footnoteIndicatorList" only contain character from FOOTNOTE_INDICATORS
Ex 1: "**Percent Value *Based on" = {footnote: {value :"**Percent Value *Based on", footnoteIndicatorList: ["*", "**"]}}
Ex 2: "*Daily Value not established." = {footnote: {value: "*Daily Value not established.", footnoteIndicatorList": ["*"]}}
Ex 3: "†Daily Value not established." = {footnote: {value: "†Daily Value not established.", footnoteIndicatorList": ["†"]}}
Ex 4: "Not a significant source of saturated fat, trans fat." = {footnote:{value: "Not a significant source of saturated fat, trans fat.", footnoteIndicatorList: null}}

7) "nutrient.footnoteIndicator":
+ "nutrient.footnoteIndicator" is a special symbol such as "*", "†" or is a group of special symbol such as "**" at the end of nutrient line
Ex 1: "10g <10%**" = {"footnoteIndicator": "**", ...}
Ex 2: "10mg ***" = {"footnoteIndicator": "***", ...}
Ex 3: "15mg 0%†" = {"footnoteIndicator": "†", ...}
Ex 4: "30mg(400 UI)  **" = {"footnoteIndicator": "**", ...}
Ex 5: correct the mistake "150mg 20% ★★"= {"footnoteIndicator": "**", ...} so "**" replace for "★★" since the "footnoteIndicator" is only from FOOTNOTE_INDICATORS. The blurry image could lead to misreading indicator.


"footnoteIndicatorDebug" =  " answer for help me print the whole line of info text of current nutrient event hough footnoteIndicator is null".
`;

const test9 = `
Carefully examine the image provided and created a neatly formatted JSON output containing a list of objects only if info available on image and Each object must have format:
json
{
"doYouSee": {question: "do you see the fact panels on the provide image?", value: "your answer (gemini)"},
"whatYouSee": {question: "what you see in the provided image , please check if i have inserted image for you to check?", value: "your 
answer (gemini)"},
"doYouSeeFactPanel": {question: "Do you see fact panel on inserted image? and where is it on the image? Do you see it clearly?", value: "your answer (gemini)"},
"canYouReadWholeFactPanel": {
question: "if you can't see the entire fact panels (the part contain nutrition for supplement info) just answer no, on the other hand you can answer yes (Remember that ingredients and manufacturing is different section from the fact panels ). And please tell me which part of fact panel you cannot see the whole", 
value: "your answer (gemini)"
},
"isFactPanelGoodToRead": "your answer gemini",
product: {
factPanelsDebug:  "your answer gemini",
factPanels:  [
  {
  panelName: string ,
  amountPerServing: {name: string?},
  calories: {value: float?, uom: "calories"}
  servingSize: {description: string?, value: string, uom: string, servingSizeDebug: "your answer gemini"},
  servingPerContainer: {value: float? or number?, uom: string},
  nutrients: [{name: string, quantityComparisonOperator: string?, value: float?, uom: string, quantityDescription: string?,
dailyPercentComparisonOperator: string?, percentDailyValue: float,  footnoteIndicator: string?, footnoteIndicatorDebug: "your answer gemini"
}],
  footnote: {
    value: string?,
    footnoteIndicatorList: string[],
  }
  ingredients: string?,
  contain: string?,
  }
]
}
}

Some common constants:
+ FOOTNOTE_INDICATORS = ["*", "**", "†", "★★", "★"]

Some rule for you:
1) "isFactPanelGoodToRead"
+ if you can't see the entire side fact panel due to the image crop answer no, on the other hand you can answer yes. And Tell me the reason why no or yes, and the possible missing part
+ ingredients info, and manufacturing info is not required to answer "yes"
+ required fields to answer "yes" are "servingSize" 


2) "product.factPanels":
+ if "isFactPanelGoodToRead" is "No" so "product.factPanels" = null else factPanels in JSON format

3) The fact panel could be in the "dual-column" layout showing both "per serving" and "per container" information. Let's to break down and separate into two different fact panels one is for 'per serving'
and other for 'per container' just if "amoutPerServing.name" of them are different. These two fact panels have the same value of "servingPerContainer", "footnote', "ingredients" and "contain".

4) common rules:
+ "nutrients" is an array that usually start with some nutrients such as "Total Carbohydrate", "Vitamin A", ... Let's list nutrient from them first if possible.
+ Read "Fact Panel" from left to right and from top to bottom.
+ content in prompt can be similar to typescript and nodejs syntax.

5) "product.panelName":
+ if there is text on image contain "Nutrition Facts" or "Supplement Facts". If not it should be null

6) "servingSize":
+ if "servingSize" content contains the parentheses so "servingSize" format = servingSize.description + "("+ servingSize.value + servingSize.uom ")" 
+ else "servingSize" format = servingSize.value + servingSize.uom
Ex 1: "10 tablespoons(80g)" = {servingSize: {"description": "10 tablespoons", "value": "80", "uom": "g"}}
Ex 2: "10 tablespoons" = {servingSize: {"value": 10, "uom": "tablespoons"}}

7) "footnote":
+ "footnote" section is in the bottom part of fact panel (the note may contain some special characters from FOOTNOTE_INDICATORS).
+ "footnote.footnoteIndicatorList" is a list of special characters found in "footnote.value"
+ "footnote.value" contains all specials symbol from "footnote.footnoteIndicatorList"
+ "footnote.footnoteIndicatorList" only contain character from FOOTNOTE_INDICATORS
Ex 1: "**Percent Value *Based on" = {footnote: {value :"**Percent Value *Based on", footnoteIndicatorList: ["*", "**"]}}
Ex 2: "*Daily Value not established." = {footnote: {value: "*Daily Value not established.", footnoteIndicatorList": ["*"]}}
Ex 3: "†Daily Value not established." = {footnote: {value: "†Daily Value not established.", footnoteIndicatorList": ["†"]}}
Ex 4: "Not a significant source of saturated fat, trans fat." = {footnote:{value: "Not a significant source of saturated fat, trans fat.", footnoteIndicatorList: null}}

8) "nutrient.footnoteIndicator":
+ "nutrient.footnoteIndicator" is a special symbol such as "*", "†" or is a group of special symbol such as "**" at the end of nutrient line

9) "amountPerServing.name":
+ is a text and usually stay above the "calories value number",
Ex 1: "Per container", "Per serving"

10) "nutrient.quantityComparisonOperator" and "nutrient.dailyPercentComparisonOperator" rules:
+ "nutrient.quantityComparisonOperator" is a comparison operator at the left side of "nutrient.value" and "nutrient.uom"
+ "nutrient.dailyPercentComparisonOperator" is a comparison operator at the left side of "nutrient.percentDailyValue".
+ "nutrient.dailyPercentComparisonOperator" is not "nutrient.quantityComparisonOperator".
Ex 1: "10g    <10%" = {quantityComparisonOperator: null, dailyPercentComparisonOperator: "<", ...}
Ex 2: "<10g    10%" = {quantityComparisonOperator: "<", dailyPercentComparisonOperator: null, ...}
Ex 3: "<10g    <10%" ={quantityComparisonOperator: "<", dailyPercentComparisonOperator: "<", ...}

11) "nutrient.name":
Ex 1: "Vitamin K2(as Naturally Derived MK-7 [Menaquinone-7)" = {"name": "Vitamin K2(as Naturally Derived MK-7 [Menaquinone-7)"}

12) "nutrient.quantityDescription":
+ is additional text right next to "nutrient.uom" and inside the parentheses, and does not include parentheses.
Ex 1: "20mcg(800 IU)" = {quantityDescription: "800 IU"}

13) "nutrient.ingredients":
+ usually appear below or next to the nutrition panel and start right after "ingredients:" or "Ingredients:" or "INGREDIENTS:" or "Other Ingredients:".
`;
