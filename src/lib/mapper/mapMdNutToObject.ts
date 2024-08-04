export const mapMdNutToObject = (markdown: string) => {
  const nutritionSections = markdown.split('NUTRITION_FACT_TABLE').slice(1);
  return nutritionSections.map((section: any) => {
    const nutrientSection = section?.split('END__NUTRITION__FACT__TABLE')?.[0];

    const nutHeaderSection = section
      ?.split('HEADER_TABLE')?.[1]
      ?.split('END__HEADER__TABLE')?.[0];

    const footnoteSection = section
      ?.split('FOOTNOTE_TABLE')?.[1]
      ?.split('END__FOOTNOTE__TABLE')?.[0];

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

    let result = {
      title: nutritionIdx?.trim(),
      servingInfo,
      nutritionFacts: nutrients,
      footnotes: footnoteData,
    } as any;

    if (process.env.NODE_ENV !== 'production') {
      if (debugTable) {
        result = {
          ...result,
          markdown,
          // debugTable
        };
      }
    }

    return result;
  });
};
