import { toUpper } from 'lodash';

export const mapToTDCformat = (extractData: any) => {
  const productData = extractData?.product;

  if (!productData) return {};

  const {
    ingredients,
    marketing,
    supplyChain,
    instructions,
    factPanels,
    header,
    allergens,
    attributes,
    physical,
  } = productData;

  const mappedResult = {
    //* header
    ProductDescription: toUpper(header?.[0].productName),
    BrandName: toUpper(header?.[0]?.brandName),
    PrimarySize: toUpper(header?.[0]?.primarySizeValue),
    PrimarySizeUOM: toUpper(header?.[0]?.primarySizeUOM),
    PrimarySizeText: toUpper(header?.[0].fullSizeTextDescription),
    SecondarySize: toUpper(header?.[0].secondarySizeValue),
    SecondarySizeUOM: toUpper(header?.[0].secondarySizeUOM),
    UnitCount: header?.[0]?.count,

    //* panel
    NutritionPanel:
      ingredients?.[0]?.isProductSupplement !== 'true' && factPanels
        ? mapToNutritionPanels(factPanels, 'NUTRITION FACTS')
        : null,
    SupplementPanel:
      ingredients?.[0]?.isProductSupplement === 'true' && factPanels
        ? mapToNutritionPanels(factPanels, 'SUPPLEMENT FACTS', ingredients)
        : null,

    //* supply chain
    ManufacturerNamePackaging: toUpper(supplyChain?.[0]?.manufacturerName),
    ManufacturerCityPackaging: toUpper(supplyChain?.[0]?.manufacturerCity),
    ManufacturerPhoneNumberPackaging: toUpper(
      supplyChain?.[0]?.manufacturerPhoneNumber
    ),
    ManufacturerStatePackaging: toUpper(
      supplyChain?.[0]?.validated_manufacturerState
    ),
    ManufacturerStreetPackaging: toUpper(
      supplyChain?.[0]?.manufacturerStreetAddress
    ),
    ManufacturerZipCodePackaging: toUpper(supplyChain?.[0]?.manufactureZipCode),
    DistributedBy: supplyChain?.[0]?.distributedBy, //? in progress
    // CountryOfOriginText: toUpper(supplyChain?.[0]?.countryOfOriginText),
    CountryOfOriginName: toUpper(supplyChain?.[0]?.countryOfOrigin),

    //* instructions
    UsageInstructions: toUpper(instructions?.[0]?.usageInstruction),

    //* allergen
    Allergens: allergens?.[0]?.validated_containList,

    FreeOf: allergens?.[0]?.validated_notContainList,
    AllergensAncillary: [toUpper(allergens?.[0]?.containStatement)], //? in progress
    ProcessedOnEquipment: allergens?.[0]?.containOnEquipmentList,
    ProcessedManufacturedInFacilityStatement:
      allergens?.[0]?.containOnEquipmentStatement,

    //* ingredients
    SupplementIngredientStatement:
      ingredients?.[0]?.isProductSupplement === 'true' &&
      ingredients?.[0]?.ingredientStatement
        ? [toUpper(ingredients[0].ingredientStatement)]
        : undefined,

    IngredientsStatement:
      ingredients?.[0]?.isProductSupplement !== 'true' &&
      ingredients?.[0]?.ingredientStatement
        ? [toUpper(ingredients[0].ingredientStatement)]
        : undefined,

    //* additional
    HasSupplementPanel:
      ingredients?.[0]?.isProductSupplement === 'true' &&
      factPanels?.length > 0,
    HasNutritionPanel:
      ingredients?.[0]?.isProductSupplement !== 'true' &&
      factPanels?.length > 0,
    HasPanel: factPanels?.length > 0,

    //* Physical
    UPC12: physical?.[0]?.upc12,

    //* marketing
    Website: marketing?.[0]?.website
      ?.split(', ')
      .map((item: string) => toUpper(item?.trim())),
    QRCode: marketing?.[0]?.haveQrCode,

    // //* attribute
    SugarSweetener: attributes?.validated_sugarClaims || [],
    Process: attributes?.validated_nonCertificateClaims || [],
    Contains: attributes?.validated_contain || [],
    DoesNotContain: attributes?.validated_notContain || [],
  };

  // console.log('result', JSON.stringify(mappedResult));
  return mappedResult;
};

const mapToNutritionPanels = (
  factPanels: any,
  title: string,
  ingredients?: any
) => {
  return factPanels.map((factPanelItem: any) => {
    let formatFactPanelPropertyList = [] as any;
    const { servingInfo, nutritionFacts, footnotes } = factPanelItem;
    const {
      servingPerContainer,
      servingSize,
      equivalentServingSize,
      amountPerServingName,
      calories,
    } = servingInfo || {};

    const { footnoteContentEnglish, footnoteContent } = footnotes?.[0] || {};

    formatFactPanelPropertyList.push({
      PropertyName: 'PANEL LABEL',
      PropertySource: title,
      Amount: '',
      AmountUOM: '',
    });

    if (
      title === 'SUPPLEMENT FACTS' &&
      !!ingredients?.[0]?.ingredientStatement
    ) {
      formatFactPanelPropertyList.push({
        PropertyName: 'OTHER INGREDIENTS',
        PropertySource: ingredients?.[0]?.ingredientStatement,
        Amount: '',
        AmountUOM: '',
      });
    }

    if (servingPerContainer) {
      formatFactPanelPropertyList.push({
        PropertyName: 'PRIMARY SERVINGS PER CONTAINER',
        PropertySource: '',
        Amount: servingPerContainer,
        AmountUOM: '',
      });
    }

    if (servingSize) {
      formatFactPanelPropertyList.push({
        PropertyName: 'PRIMARY SERVING SIZE',
        PropertySource: '',
        Amount:
          servingSize +
          (equivalentServingSize ? ` ${equivalentServingSize}` : ''),
        AmountUOM: '',
      });
    }

    // if (equivalentServingSize) {
    //   formatFactPanelPropertyList.push({
    //     PropertyName: 'SECONDARY SERVING SIZE',
    //     PropertySource: '',
    //     Amount: equivalentServingSize,
    //     AmountUOM: '',
    //   });
    // }
    if (calories) {
      formatFactPanelPropertyList.push({
        PropertyName: 'CALORIES',
        PropertySource: '',
        AnalyticalValue: calories,
        Amount: calories,
        AmountUOM: '',
      });
    }

    if (footnoteContentEnglish || footnoteContent) {
      formatFactPanelPropertyList.push({
        PropertyName: 'DAILY VALUE STATEMENT',
        PropertySource: footnoteContentEnglish || footnoteContent,
        AnalyticalValue: '',
        Amount: calories,
        AmountUOM: '',
      });
    }

    nutritionFacts.forEach((nutrientItem: any) => {
      formatFactPanelPropertyList.push({
        PropertyName: toUpper(nutrientItem?.['nutrientName']),
        PropertySource: nutrientItem?.['blendIngredients'] || '',
        AnalyticalValue: nutrientItem?.['amount'],
        Amount: nutrientItem?.['amount'],
        AmountUOM: nutrientItem?.['uom'],
        Percent: nutrientItem?.['percent'],
        Indicators: nutrientItem?.['indicator']
          ? [nutrientItem?.['indicator']]
          : '',
      });
    });

    return { Property: formatFactPanelPropertyList };
  });
};
