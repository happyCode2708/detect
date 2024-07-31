import logger from '../logger/index';

export const mapMarkdownNutToObject = (markdown: string) => {
  const nutritionSections = markdown.split('NUTRITION_FACT_TABLE').slice(1);
  return nutritionSections.map((section: any) => {
    const nutrientSection = section?.split('END__NUTRITION__FACT__TABLE')?.[0];

    const nutHeaderSection = section
      ?.split('HEADER_TABLE')?.[1]
      ?.split('END__HEADER__TABLE')?.[0];

    const footnoteSection = section
      ?.split('FOOTNOTE_TABLE')?.[1]
      ?.split('END__FOOTNOTE__TABLE')?.[0];

    // console.log('nutrient', JSON.stringify(nutrientSection));

    const [nutritionIdx, nutritionTitle, nutDivider, ...nutritionLines] =
      nutrientSection
        .trim()
        .split('\n')
        .filter((line: string) => line.trim().length > 0);

    const nutrients = nutritionLines
      .map((line: string) => {
        const [
          nutrientName,
          parenthesesDescriptor,
          amountPerServing,
          amountPerServingDescriptor,
          dailyValue,
          blendIngredients,
        ] = line
          .split('|')
          .filter((item: string) => item !== '')
          .map((item: string) => item.trim());

        return {
          nutrientName,
          parenthesesDescriptor: parenthesesDescriptor || null,
          amountPerServing,
          amountPerServingDescriptor,
          dailyValue,
          blendIngredients: blendIngredients || null,
        };
      })
      .filter((nutrient: any) => {
        if (
          nutrient?.nutrientName !== '-------' &&
          nutrient?.nutrientName !== '**'
        ) {
          return true;
        }
        return false;
      });

    // console.log('nut header --', JSON.stringify(nutHeaderSection));

    const [index, headerTitle, headerDivider, ...headerLines] = nutHeaderSection
      .trim()
      .split('\n')
      .filter((item: any) => item !== '')
      // .slice(3)
      .map((line: any) =>
        line
          .split('|')
          .filter((item: any) => item !== '')
          .map((item: any) => item.trim())
      );
    // console.log('header lines --', JSON.stringify(headerLines));

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

    const [footnoteIdx, footnoteTitle, footnoteDivider, ...footnoteLines] =
      footnoteSection
        .trim()
        .split('\n')
        .filter((item: string) => item !== '')
        // .slice(3)
        .filter((line: string) => line.trim().length > 0);

    const footnoteData = footnoteLines.map((line: string) => {
      const [footnoteContent, footnoteContentEnglish] = line
        .split('|')
        .filter((item: string) => item !== '')
        .map((item: string) => item.trim());

      return {
        footnoteContent: footnoteContent || null,
        footnoteContentEnglish: footnoteContentEnglish || null,
      };
    });

    let debugTable;

    // logger.error('debug');
    // logger.info(debugSection);

    // if (debugSection) {
    //   const debugLines = debugSection
    //     .trim()
    //     .split('\n')
    //     .filter((item) => item !== '')
    //     .slice(1)
    //     .filter((line) => line.trim().length > 0);

    //   debugTable = debugLines.map((line) => {
    //     const [question, geminiAnswer] = line
    //       .split('|')
    //       .filter((item) => item !== '')
    //       .map((item) => item.trim());
    //     return {
    //       question,
    //       geminiAnswer,
    //     };
    //   });
    // }

    // logger.error('debug table');
    // logger.info(debugTable);

    let result = {
      title: nutritionIdx?.trim(),
      servingInfo,
      nutritionFacts: nutrients,
      footnotes: footnoteData,
    } as any;

    if (process.env.NODE_ENV !== 'production') {
      if (debugTable) {
        result = { ...result, markdown };
      }
    }

    // if (process.env.NODE_ENV !== 'production') {
    //   if (debugTable) {
    //     result = { ...result, debugTable: debugTable, markdown };
    //   }
    // }

    // console.log('result ---', JSON.stringify(result));

    return result;
  });
};
