export const mapMarkdownNutToObject = (markdown: string) => {
  const nutritionSections = markdown.split('NUTRITION_FACT_TABLE').slice(1);
  return nutritionSections.map((section) => {
    const [nutrientSection, headerToRest] = section.split('HEADER_TABLE');
    const [nutHeader, footnoteToRest] = headerToRest.split('FOOTNOTE_TABLE');
    const [footnoteSection, __] = footnoteToRest.split('DEBUG_TABLE');

    const [headerTitle, ...nutritionLines] = nutrientSection
      .trim()
      .split('\n')
      .filter((line) => line.trim().length > 0);

    const nutrients = nutritionLines
      .slice(2)
      .map((line) => {
        const [
          nutrientName,
          amountPerServing,
          amountPerSeringDescriptor,
          dailyValue,
          parenthesesDescriptor,
          blendIngredients,
          symbol,
        ] = line
          .split('|')
          .filter((item) => item !== '')
          .map((item) => item.trim());

        return {
          nutrientName,
          amountPerServing,
          amountPerSeringDescriptor,
          dailyValue,
          parenthesesDescriptor: parenthesesDescriptor || null,
          blendIngredients: blendIngredients || null,
          symbol: symbol || null,
        };
      })
      .filter((nutrient) => nutrient.nutrientName !== '-------');

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

    console.log('footnote section --', footnoteSection);

    const footnoteLines = footnoteSection
      .trim()
      .split('\n')
      .filter((item) => item !== '')
      .slice(3)
      .filter((line) => line.trim().length > 0);

    const footnoteData = footnoteLines.map((line) => {
      const [footnoteSymbol, footnoteContent, footnoteContentEnglish] = line
        .split('|')
        .filter((item) => item !== '')
        .map((item) => item.trim());

      console.log('footnote line', line);
      return {
        footnoteSymbol: footnoteSymbol || null,
        footnoteContent: footnoteContent || null,
        footnoteContentEnglish: footnoteContentEnglish || null,
      };
    });

    // const debugTableSection = section.split('Debug table')[1];

    // console.log('debug --', debugTableSection);

    // const debugLines = debugTableSection
    //   .trim()
    //   .split('\n')
    //   .filter((item) => item !== '')
    //   .slice(2)
    //   .filter((line) => line.trim().length > 0);

    // const debugTable = debugLines.map((line) => {
    //   const [question, geminiAnswer] = line
    //     .split('|')
    //     .filter((item) => item !== '')
    //     .map((item) => item.trim());
    //   return {
    //     question,
    //     geminiAnswer,
    //   };
    // });

    let result = {
      title: headerTitle.trim(),
      servingInfo,
      nutritionFacts: nutrients,
      footnotes: footnoteData,
      // debugTable,
    };

    console.log('result ---', JSON.stringify(result));

    return result;
  });
};
