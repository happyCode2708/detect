import logger from '../logger/index';

export const mapMarkdownNutToObject = (markdown: string) => {
  const nutritionSections = markdown.split('NUTRITION_FACT_TABLE').slice(1);
  return nutritionSections.map((section) => {
    const [nutrientSection, headerToRest] = section.split('HEADER_TABLE');
    const [nutHeader, footnoteToRest] = headerToRest.split('FOOTNOTE_TABLE');
    const [footnoteSection, debugSection] = footnoteToRest.split('DEBUG_TABLE');
    // logger.error('debug section');
    // logger.info(debugSection);

    const headerSections = headerToRest
      ?.split('HEADER_TABLE')?.[1]
      ?.split('END__MARKETING__TEXT__TABLE')?.[0];

    const [headerTitle, ...nutritionLines] = nutrientSection
      .trim()
      .split('\n')
      .filter((line) => line.trim().length > 0);

    const nutrients = nutritionLines
      .slice(2)
      .map((line) => {
        const [
          nutrientName,
          parenthesesDescriptor,
          amountPerServing,
          amountPerServingDescriptor,
          dailyValue,
          blendIngredients,
        ] = line
          .split('|')
          .filter((item) => item !== '')
          .map((item) => item.trim());

        return {
          nutrientName,
          parenthesesDescriptor: parenthesesDescriptor || null,
          amountPerServing,
          amountPerServingDescriptor,
          dailyValue,
          blendIngredients: blendIngredients || null,
        };
      })
      .filter((nutrient) => {
        if (
          nutrient?.nutrientName !== '-------' &&
          nutrient?.nutrientName !== '**'
        ) {
          return true;
        }
        return false;
      });

    console.log('nut header --', JSON.stringify(nutHeader));

    const headerLines = nutHeader
      .trim()
      .split('\n')
      .filter((item) => item !== '')
      .slice(3)
      .map((line) =>
        line
          .split('|')
          .filter((item) => item !== '')
          .map((item) => item.trim())
      );

    const [
      servingPerContainer,
      servingSize,
      equivalentServingSize,
      amountPerServingName,
      calories,
    ] = headerLines[0];

    let servingInfo = {
      servingPerContainer,
      servingSize,
      equivalentServingSize,
      amountPerServingName,
      calories,
    };

    // logger.error('footnote');
    // logger.info(footnoteSection);

    const footnoteLines = footnoteSection
      .trim()
      .split('\n')
      .filter((item) => item !== '')
      .slice(3)
      .filter((line) => line.trim().length > 0);

    const footnoteData = footnoteLines.map((line) => {
      const [footnoteContent, footnoteContentEnglish] = line
        .split('|')
        .filter((item) => item !== '')
        .map((item) => item.trim());

      return {
        footnoteContent: footnoteContent || null,
        footnoteContentEnglish: footnoteContentEnglish || null,
      };
    });

    let debugTable;

    // logger.error('debug');
    // logger.info(debugSection);

    if (debugSection) {
      const debugLines = debugSection
        .trim()
        .split('\n')
        .filter((item) => item !== '')
        .slice(1)
        .filter((line) => line.trim().length > 0);

      debugTable = debugLines.map((line) => {
        const [question, geminiAnswer] = line
          .split('|')
          .filter((item) => item !== '')
          .map((item) => item.trim());
        return {
          question,
          geminiAnswer,
        };
      });
    }

    // logger.error('debug table');
    // logger.info(debugTable);

    let result: any = {
      title: headerTitle.trim(),
      servingInfo,
      nutritionFacts: nutrients,
      footnotes: footnoteData,
    };

    if (process.env.NODE_ENV !== 'production') {
      if (debugTable) {
        result = { ...result, debugTable: debugTable, markdown };
      }
    }

    // console.log('result ---', JSON.stringify(result));

    return result;
  });
};

// const replaceSpecialCharacters = (text: string) => {
//   if (!text) {
//     return text;
//   }
//   let newString = text;

//   newString = text.replace(/<br>/g, '\n');

//   return newString;
// };
