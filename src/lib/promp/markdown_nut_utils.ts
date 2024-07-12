export const make_markdown_nut_prompt = ({
  ocrText,
  imageCount,
}: {
  ocrText?: string;
  imageCount?: number;
}) => {
  return `
OCR texts from ${imageCount} provided images:
${ocrText}  

VALIDATION AND FIX BUGS:
1) why you keep not separating the dual-column nutrition fact panel? please please help me always separated into multiple table of info for dual-column nutrition fact panel.
2) only give me the information visibly seen on provided images and do not assume the values.

IMPORTANT REQUIREMENTS:
1) do not provide data that you cannot see it by human eyes on provided images.
2) "added sugar"/ "include n gram of added sugar" is a separated nutrient (its "nutrient name" is "added sugar")
3) text "include [number]g added sugars" should be recorded as "nutrient name" = "added sugars" and "amount per serving" = "[number]g" with number is the amount per serving value.
4) do not provide me the info not seen on provided images
5) only provide me the info that visibly seen from provided images 
7) There are some cases to recognized an dual-column nutrition fact panel format:
+ case 1 - see nutrition fact panel with two or more than two percent daily value columns and quantity columns for different serving sizes or different amount per serving name 
+ case 2 - see nutrition fact panel with two or more than two percent daily value columns for different age groups
+ case 3 - see nutrition fact panel with two daily value columns for "per serving" and "per container".

8) A dual-column nutrition fact panel must be separated into two nutrition fact markdown tables with their own HEADER and FOOTNOTE (with their own index number as well). THIS IS COMPULSORY. And combining into single table is prohibited for dual-column nutrition fact panel.

9) Dual-column nutrition fact format could share the same "footnote" statement, or have different "footnote" statements.

10) sometimes nutrients could be put vertically and separated by • symbol and • symbol is not the nutrient symbol. They are not type of dual-column nutrition fact format. They are just simply put in dual-column display to save space.

11) footnote content is mostly about %Daily Value....", or "Not a significant source...", or "the % daily value..." 
12) result must not closed with '''markdown" and '''
13) be careful the last "nutrient row" could be misread to be a part of "footnote". Remember "footnote" content usually about "Daily value" or "percent daily value" note.
14) 2 nutrition fact tables in provided image could be the same one, just from different angles of product. So you must read it as only one nutrition fact tables only.
15) example for result table must be in the order:
NUTRITION_FACT_TABLE [1]
HEADER_TABLE [1] 
FOOTNOTE_TABLE [1]
NUTRITION_FACT_TABLE [2]
HEADER_TABLE [2]
FOOTNOTE_TABLE [2]
....
DEBUG_TABLE

remember they are put in orders from low index [1] to higher index like [2] and [3]

16) "Serving Size" example 10 tablespoons (20g) => serving size is 10 tablespoons and equivalent = 20g
17) some "Amount Per Serving name" such as "per serving", "per container", "for children > 18 years", "for adult",...
18) all markdown tables must have its table name on top 
19) [INDEX_NUMBER] is nutrition fact markdown table order (such as [1], [2])
20) some time footnote content could be displayed in multiple languages, the "footnote content in english" is the content in english only, and remember "footnote content in english" still include special symbols if they are available
21) blend ingredients could be also a list of sub-blends and each sub-blend could also display a list of sub-ingredients of those sub-blends. So you should record info of all sub-blends to a table cell of "blend ingredients"
22) if a nutrient name spans multiple lines and includes additional information like brand names or descriptions, consider it as a single nutrient and combine the information into a single cell for 'nutrient name'
23) only give me actual info visibly by human eyes from provided product image
24) only return me the product info if you see image i provided
25) "parenthetical statement about amount per serving" is the descriptor for amount per serving (or nutrient quantity) only

27) do not add ingredients from ingredient list to nutrient list. Ingredient list usually start with "ingredient:" or "other ingredients:" 

specific rules:
1) "nutrient name descriptor" rules:
+ is descriptor of nutrient name ( with text look like "as something", "naturally occurring from something", or other equivalent name of nutrient, ...)  
+ nutrient could be a type of Extract so its nutrition name must contain "Extract". And the "parenthetical statement about nutrient name" will be the remaining text after word "Extract".
+ nutrient could be a type of Concentrate so its nutrition name must contain "Concentrate". And the "parenthetical statement about nutrient name" will be the remaining text after word "Extract".
+ nutrient info could have text "standardized to something ..." so the text start with "standardized to" should be recorded as "nutrient name descriptor"
Ex 1: "Potato (young) Extract standardized to 20% multi-vitamin" recorded as
nutrient name = Potato (young) Extract
nutrient name descriptor = standardized to 20% multi-vitamin

Ex 2: "Potato (young) Concentrate standardized to 20% multi-vitamin" recorded as
nutrient name = Potato (young) Concentrate
nutrient name descriptor = standardized to 20% multi-vitamin

Ex 3: "yogurt (29 billions living cultures)" recorded as
nutrient name = yogurt
nutrient name descriptor = 29 billions living cultures

2) total sugar rules:
+ total sugars do not have % Daily Value number, but it can have footnote symbol (such as **, *, +, ...) at "% Daily Value" column

MARKDOWN RULES:
1) do not bold nutrient name
2) all nutrients must return all markdown defined columns above
3) do not use bold or heading markdown syntax for table_name
4) content in a markdown table cell can only use <br> as line break instead of "\n"

IMPORTANT NOTES:
1) dual-column nutrition panel must be always separated into two different markdown tables. 

RESULT THAT I NEED:
Carefully examine provided images above. They are captured images of one product, and return info from provided images that meet all listed requirements and rules above with markdown tables format below


1) Nutrition fact info recorded in table
+ TABLE_NAME = "NUTRITION_FACT_TABLE [index number] " (example: NUTRITION_FACT_TABLE [1])
+ Table format:
TABLE_NAME
| Nutrient Name | nutrient name descriptor | Amount per Serving | parenthetical statement about amount per serving | % Daily Value and footnote symbol if avail | blend ingredients (if nutrient is a blend/mix) (nullable) | 
| ------- | -------- | -------- | -------- | -------- | -------- | 

2) Header info of each nutrition fact recorded in a sub-table
+ TABLE_NAME = "HEADER_TABLE [index number]" (example: HEADER [1])
+ Table format:
TABLE_NAME
Serving Per Container | Serving Size | Equivalent Serving Size | Amount Per Serving name | Calories
| ------- | -------- | -------- | -------- | -------- |

3) Footnote of each nutrition fact recorded in a sub-table
+ TABLE_NAME = "FOOTNOTE_TABLE [index number]" (example: FOOTNOTE_TABLE [1] )
+ table format:
TABLE_NAME
| footnote content at bottom of nutrition fact | footnote content in english only (include footnote symbol if avail) |
| ------- | -------- |

4) Debug table is gemini answer recorded in table
+ TABLE_NAME = "DEBUG_TABLE"
+ Table format:
TABLE_NAME
| question (question from debug list below) | gemini answer |
| ------- | -------- |

debug list:
1) gemini answer me how many nutrition fact tables from provided images? are they the same one ?
2) are they in dual-column format? and tell me why? tell me why you create only one nutrition fact table for dual-column nutrition fact panel format ? remember dual-column label format must be recorded as multiple nutrition fact markdown tables.
`;
};

// carefully read from provided images of one product and return info from provided images in markdown tables format

// 1) Nutrition fact info recorded in table
// Table name format = Nutrition Fact for + NAME + [INDEX_NUMBER]
// with 5 given columns
// Nutrient Name  | Amount per Serving | % Daily Value | parentheses descriptor (nullable) | blend ingredients (if nutrient is a blend/mix) (nullable) | symbol
// | ------- | -------- | -------- | -------- | -------- | -------- |
// 2) Footnote of each nutrition fact recorded in a sub-table
// Table name format = Footnote + [INDEX_NUMBER]
// with 2 given columns:
// footnote symbol (nullable) | footnote content at bottom of nutrition fact (nullable)
// | ------- | -------- |

// important requirements:
// 1) do not provide data that you cannot see it by human eyes on provided images.
// 2) "added sugar"/ "include n gram of added sugar" is a separated nutrient (its "nutrient name" is "added sugar")
// 3) do not provide me the info not seen on provided images
// 4) only provide me the info that visibly seen from provided images
// 5) total sugars do not have % Daily Value
// 6) dual-column nutrition facts format need to be recorded to two nutrition fact tables. Dual column nutrition fact format can be recognized if they have two different columns for percent daily value or different amount per serving (sometimes all separated nutrition fact labels actually use the same footnote content but you must separated the individual footnote for each nutrition fact)
// 7) sometimes nutrients could be put vertically and separated by • symbol and • symbol is not the nutrient symbol. They are not type of dual-column nutrition fact format. They are just simply put in dual-column display to save space.
// 8)  footnote content is mostly about %Daily Value....", or "Not a significant source...", or "the % daily value..."
// 9) result must not closed with '''markdown" and '''
// 10) be careful the last "nutrient row" could be misread to be a part of "footnote". Remember "footnote" content usually about "Daily value" or "percent daily value" note.

// markdown rules:
// 1) do not bold nutrient name
// 2) all nutrients must return all markdown defined columns above

//!
// carefully read from provided images of one product and return info from provided images in markdown tables format

// 1) Nutrition fact info recorded in table
// + TABLE_NAME = Nutrition Fact for + NAME + [INDEX_NUMBER]
//  + Table format:
// TABLE_NAME
// | Nutrient Name  | Amount per Serving | % Daily Value | parentheses descriptor (nullable) | blend ingredients (if nutrient is a blend/mix)  (nullable) | symbol |
// | ------- | -------- | -------- | -------- | -------- | -------- |
// 2) Footnote of each nutrition fact recorded in a sub-table
// + TABLE_NAME = Footnote + [INDEX_NUMBER]
// + table format:
// TABLE_NAME
// | footnote symbol (nullable) | footnote content at bottom of nutrition fact (nullable) |
// | ------- | -------- |

// important requirements:
// 1) do not provide data that you cannot see it by human eyes on provided images.
// 2) "added sugar"/ "include n gram of added sugar" is a separated nutrient (its "nutrient name" is "added sugar")
// 3) do not provide me the info not seen on provided images
// 4) only provide me the info that visibly seen from provided images
// 5) total sugars do not have % Daily Value
// 6) dual-column nutrition facts format need to be recorded to two nutrition fact tables. Dual column nutrition fact format can be recognized if they have two different columns for percent daily value or different amount per serving (sometimes all separated nutrition fact labels actually use the same footnote content but you must separated the individual footnote for each nutrition fact)
// 7) sometimes nutrients could be put vertically and separated by • symbol and • symbol is not the nutrient symbol. They are not type of dual-column nutrition fact format. They are just simply put in dual-column display to save space.
// 8)  footnote content is mostly about %Daily Value....", or "Not a significant source...", or "the % daily value..."
// 9) result must not closed with '''markdown" and '''
// 10) be careful the last "nutrient row" could be misread to be a part of "footnote". Remember "footnote" content usually about "Daily value" or "percent daily value" note.

// markdown rules:
// 1) do not bold nutrient name
// 2) all nutrients must return all markdown defined columns above

//! 2

// carefully read from provided images of one product and return info from provided images in markdown tables format

// 1) Nutrition fact info recorded in table
// + TABLE_NAME = Nutrition Fact for + NAME + [INDEX_NUMBER]  ( example: Nutrition fact for cheese biscuit [1] )
//  + Table format:
// TABLE_NAME
// | Nutrient Name  | Amount per Serving | % Daily Value | parentheses descriptor (nullable) | blend ingredients (if nutrient is a blend/mix)  (nullable) | symbol |
// | ------- | -------- | -------- | -------- | -------- | -------- |
// 2) Footnote of each nutrition fact recorded in a sub-table
// + TABLE_NAME = Footnote + [INDEX_NUMBER]  ( example: Footnote [1] )
// + table format:
// TABLE_NAME
// | footnote symbol (nullable) | footnote content at bottom of nutrition fact (nullable) | footnote content in english only |
// | ------- | -------- | -------- |

// 3) debug table with given columns (questions from debug list)
// TABLE_NAME = Debug table
// | question | gemini answer |

// important requirements:
// 1) do not provide data that you cannot see it by human eyes on provided images.
// 2) "added sugar"/ "include n gram of added sugar" is a separated nutrient (its "nutrient name" is "added sugar")
// 3) do not provide me the info not seen on provided images
// 4) only provide me the info that visibly seen from provided images
// 5) total sugars do not have % Daily Value
// 6) dual-column nutrition facts format need to be recorded to two nutrition fact tables. Dual column nutrition fact format can be recognized if they have two different columns for percent daily value or different amount per serving (sometimes all separated nutrition fact labels actually use the same footnote content but you must separated the individual footnote for each nutrition fact)
// 7) sometimes nutrients could be put vertically and separated by • symbol and • symbol is not the nutrient symbol. They are not type of dual-column nutrition fact format. They are just simply put in dual-column display to save space.
// 8)  footnote content is mostly about %Daily Value....", or "Not a significant source...", or "the % daily value..."
// 9) result must not closed with '''markdown" and '''
// 10) be careful the last "nutrient row" could be misread to be a part of "footnote". Remember "footnote" content usually about "Daily value" or "percent daily value" note.
// 11)  2 nutrition fact tables in provided image could be the same one, just from different angles of product. So you must read it as only one nutrition fact tables only.
// 12) example for result table order ( Nutrition Fact for [1], Footnote [1], Nutrition Fact for [2], Footnote [2], ...)

// markdown rules:
// 1) do not bold nutrient name
// 2) all nutrients must return all markdown defined columns above

// debug list:
// 1) gemini answer me  how many nutrition fact tables from provided images? are they the same one ?
// 2) are they in dual-column format? remember dual-column label format need to record as multiple nutrition fact markdown table
// content in a markdown table cell can only use <br> as line break instead of \n
//? This nutrition label is not in dual-column format. Although it presents "per serving" and "per container" data, it does so for a single serving size. A dual-column format would involve different values for different serving sizes or different life stages/ages
//
