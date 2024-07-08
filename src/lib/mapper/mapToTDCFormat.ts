import { AnyARecord } from 'dns';
import { lowerCase, toLower, toUpper } from 'lodash';

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

  const productType = toLower(ingredients?.[0]?.productType);

  const mappedResult = {
    //* header
    ProductDescription: toUpper(header?.[0]?.productName),
    BrandName: toUpper(header?.[0]?.brandName),
    PrimarySize: toUpper(header?.[0]?.primarySizeValue),
    PrimarySizeUOM: toUpper(header?.[0]?.primarySizeUOM),
    PrimarySizeText: toUpper(header?.[0]?.fullSizeTextDescription),
    SecondarySize: toUpper(header?.[0]?.secondarySizeValue),
    SecondarySizeUOM: toUpper(header?.[0]?.secondarySizeUOM),
    UnitCount: header?.[0]?.count,

    //* panel
    NutritionPanel:
      productType === 'nutrition facts' && factPanels?.length > 0
        ? mapToNutritionPanels(factPanels, 'NUTRITION FACTS', ingredients)
        : null,
    SupplementPanel:
      productType === 'supplement facts' && factPanels?.length > 0
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
    CountryOfOriginText: toUpper(supplyChain?.[0]?.countryOfOriginText),
    CountryOfOriginName: toUpper(supplyChain?.[0]?.validated_countryOfOrigin),

    //* instructions
    UsageInstructions: instructions?.[0]?.usageInstruction,
    ConsumerStorage: instructions?.[0]?.storageInstruction,
    CookingInstructions: instructions?.[0]?.cookingInstruction,

    //* allergen
    Allergens: allergens?.[0]?.validated_containList,

    FreeOf: allergens?.[0]?.validated_notContainList,
    AllergensAncillary: [toUpper(allergens?.[0]?.containStatement)], //? in progress
    ProcessedOnEquipment: allergens?.[0]?.validated_containOnEquipmentList,
    ProcessedManufacturedInFacilityStatement:
      allergens?.[0]?.containOnEquipmentStatement,

    //* ingredients
    SupplementIngredientStatement:
      productType === 'supplement facts' &&
      ingredients?.[0]?.ingredientStatement
        ? [toUpper(ingredients[0].ingredientStatement)]
        : undefined,

    IngredientsStatement:
      productType === 'nutrition facts' && ingredients?.length > 0
        ? ingredients?.map((ingredientItem: any) => {
            return toUpper(ingredientItem?.ingredientStatement);
          })
        : undefined,
    IngredientBreakout:
      ingredients?.length > 0
        ? ingredients?.map((ingredientItem: any) => {
            return ingredientItem?.ingredientBreakdown
              ?.split(', ')
              .filter((item: string) => item !== '')
              .map((item: string) => toUpper(item?.trim()));
          })
        : undefined,

    //* additional
    HasSupplementPanel:
      productType === 'supplement facts' && factPanels?.length > 0,
    HasNutritionPanel:
      productType === 'nutrition facts' && factPanels?.length > 0,
    HasPanel: factPanels?.length > 0,

    //* Physical
    UPC12: physical?.[0]?.upc12,

    //* marketing
    Website: marketing?.[0]?.website
      ?.split(', ')
      .filter((item: string) => item !== '')
      .map((item: string) => toUpper(item?.trim())),
    QRCode: marketing?.[0]?.haveQrCode,
    SocialMedia: marketing?.[0]?.socialMediaList
      ?.split(', ')
      .filter((item: string) => item !== '')
      .map((item: string) => {
        if (item === 'youtube' && marketing?.[0]?.youtubeType === 'type_2') {
          return 'YOUTUBE2 or YOUTUBE3';
        }

        return toUpper(item?.trim());
      }),
    MarketingClaims: marketing?.[0]?.marketingClaims?.map((item: string) =>
      toUpper(item)
    ),
    SocialMediaAddresses: marketing?.[0]?.socialMediaText
      ?.split(', ')
      .filter((item: string) => item !== '')
      .map((item: any) => toUpper(item)),

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
  return factPanels
    ?.map((factPanelItem: any) => {
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

      console.log('title', title);

      if (ingredients?.length > 0) {
        ingredients?.forEach((ingredientItem: any) => {
          if (ingredientItem?.ingredientPrefix?.includes('other')) {
            formatFactPanelPropertyList.push({
              PropertyName: 'OTHER INGREDIENTS',
              PropertySource: ingredientItem.ingredientStatement,
              Amount: '',
              AmountUOM: '',
            });
          }
        });
      }

      if (servingPerContainer) {
        formatFactPanelPropertyList.push({
          PropertyName: 'PRIMARY SERVINGS PER CONTAINER',
          PropertySource: '',
          Amount: toUpper(servingPerContainer),
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
          PropertySource: toUpper(footnoteContentEnglish || footnoteContent),
          AnalyticalValue: '',
          Amount: calories,
          AmountUOM: '',
        });
      }

      nutritionFacts.forEach((nutrientItem: any) => {
        formatFactPanelPropertyList.push({
          PropertyName: toUpper(nutrientItem?.['validated_nutrientName']),
          PropertySource: toUpper(nutrientItem?.['blendIngredients'] || ''),
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
    })
    ?.reverse();
};
