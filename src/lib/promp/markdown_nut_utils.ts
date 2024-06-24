export const make_markdown_nut_prompt = ({
  ocrText,
  imageCount,
}: {
  ocrText?: string;
  imageCount?: number;
}) => {
  return `OCR texts from ${imageCount} provided images:
${ocrText}

carefully read from provided images of one product and return info from provided images in markdown tables format

1) Nutrition fact info recorded in table
+ TABLE_NAME = "NUTRITION_FACT_TABLE [index number] " (example: NUTRITION_FACT_TABLE [1])
+ Table format:
TABLE_NAME
| Nutrient Name  | Amount per Serving  |  parentheses content explain for amount per serving | % Daily Value | parentheses content for nutrition name (nullable) (such as "as something") | blend ingredients (if nutrient is a blend/mix)  (nullable) | symbol |
| ------- | -------- | -------- | -------- | -------- | -------- | -------- |

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
| footnote symbol (nullable) | footnote content at bottom of nutrition fact (nullable) (include footnote symbol if avail) | footnote content in english only (nullable) (include footnote symbol if avail) |
| ------- | -------- | -------- |

4) Debug table is gemini answer recorded in table
+ TABLE_NAME = "DEBUG_TABLE"
+ Table format:
TABLE_NAME
| question (question from debug list) | gemini answer |
| ------- | -------- |

important requirements:
1) do not provide data that you cannot see it by human eyes on provided images.
2) "added sugar"/ "include n gram of added sugar" is a separated nutrient (its "nutrient name" is "added sugar")
3) do not provide me the info not seen on provided images
4) only provide me the info that visibly seen from provided images
5) total sugars do not have % Daily Value
6) dual-column nutrition fact label format need to be recorded to two different nutrition fact with different [index number] (for example NUTRITION_FACT_TABLE [1], NUTRITION_FACT_TABLE [2],... ) . Dual-column nutrition fact format can be recognized if they have two different columns info for percent daily value, or two different columns info for different serving size, or have different amount per serving columns value.
7) sometimes nutrients could be put vertically and separated by • symbol and • symbol is not the nutrient symbol. They are not type of dual-column nutrition fact format. They are just simply put in dual-column display to save space.

8)  footnote content is mostly about %Daily Value....", or "Not a significant source...", or "the % daily value..." 
9) result must not closed with '''markdown" and '''
10) be careful the last "nutrient row" could be misread to be a part of "footnote". Remember "footnote" content usually about "Daily value" or "percent daily value" note.
11)  2 nutrition fact tables in provided image could be the same one, just from different angles of product. So you must read it as only one nutrition fact tables only.
12) example for result table  must be in the order NUTRITION_FACT_TABLE [1], HEADER_TABLE [1], FOOTNOTE_TABLE [1], NUTRITION_FACT_TABLE [2], HEADER_TABLE [2], FOOTNOTE_TABLE [2], .... As they are put in orders from low index [1] to higher index like [2] and [3]
13) "Serving Size" example 10 tablespoons (20g) => serving size is 10 tablespoons and equivalent = 20g
14) some "Amount Per Serving name" such as "per serving",  "per container", "for children > 18 years", "for adult",...
15) all markdown tables must have its table name on top 
16)  [INDEX_NUMBER] is nutrition fact markdown table order (such as [1], [2])
17) include [number]g added sugars should be recorded as "nutrient name" = "added sugars" and  "amount per serving" = "[number]g" with number is the amount per serving value.
18) some time footnote content could be displayed in multiple languages, the "footnote content in english" is the content in english only, and remember "footnote content in english" still include special symbols if they are available
19) blend ingredients could be also a list of sub-blends and each sub-blend could also display a list of sub-ingredients of those sub-blends. So you should record  info of all sub-blends to a table cell of "blend ingredients"

markdown rules:
1) do not bold nutrient name
2) all nutrients must return all markdown defined columns above

debug list:
1) gemini answer me  how many nutrition fact tables from provided images? are they the same one ?
2) are they in dual-column format?  and tell me why? remember dual-column label format must be recorded as multiple nutrition fact markdown tables. I see you do not separated nutrition fact label to multiple nutrition fact table for dual-column format panel
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
