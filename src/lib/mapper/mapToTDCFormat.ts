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
    // PrimarySize: toUpper(header?.[0]?.primarySizeValue),
    // PrimarySizeUOM: toUpper(header?.[0]?.primarySizeUOM),
    ...mapPrimarySizeAndPrimarySizeUom(header),
    SecondarySize: toUpper(header?.[0]?.secondarySizeValue),
    SecondarySizeUOM: toUpper(header?.[0]?.secondarySizeUOM),
    TertiarySize: toUpper(header?.[0]?.thirdSizeValue),
    TertiarySizeUOM: toUpper(header?.[0]?.thirdSizeUOM),
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
    ManufacturerNamePackaging: toUpper(supplyChain?.[0]?.manufacturerName?.[0]),
    ManufacturerCityPackaging: toUpper(supplyChain?.[0]?.manufacturerCity?.[0]),
    ManufacturerPhoneNumberPackaging: toUpper(
      supplyChain?.[0]?.manufacturerPhoneNumber?.[0]
    ),
    ManufacturerStatePackaging: toUpper(
      supplyChain?.[0]?.validated_manufacturerState?.[0]
    ),
    ManufacturerStreetPackaging: toUpper(
      supplyChain?.[0]?.manufacturerStreetAddress?.[0]
    ),
    ManufacturerZipCodePackaging: toUpper(
      supplyChain?.[0]?.manufactureZipCode?.[0]
    ),
    // ...mapDistributedBy(supplyChain),
    DistributedBy: toUpper(supplyChain?.[0]?.fullTextDistributor?.[0]),
    CountryOfOriginText: toUpper(supplyChain?.[0]?.countryOfOriginText),
    CountryOfOriginName: toUpper(supplyChain?.[0]?.validated_countryOfOrigin),

    //* instructions
    UsageInstructions: instructions?.[0]?.usageInstruction,
    ConsumerStorage: instructions?.[0]?.validated_storageInstruction,
    CookingInstructions: instructions?.[0]?.cookingInstruction,
    UseOrFreezeBy: instructions?.[0]?.useOrFreezeBy,
    // InstructionsAncillary: instructions?.[0]?.otherInstructions,

    //* allergen
    Allergens: allergens?.[0]?.validated_containList,

    FreeOf: allergens?.[0]?.validated_notContainList,
    // AllergensAncillary: [
    //   toUpper(allergens?.[0]?.containStatement),
    //   toUpper(allergens?.[0]?.notContainStatement),
    // ], //? in progress
    ProcessedOnEquipment: allergens?.[0]?.validated_containOnEquipmentList,
    ProcessedManufacturedInFacilityStatement:
      allergens?.[0]?.containOnEquipmentStatement,
    InFacilityOnEquipmentStatement: allergens?.[0]?.containOnEquipmentStatement,
    InFacilityOnEquipmentIncluding:
      allergens?.[0]?.validated_containOnEquipmentList,

    //* ingredients
    // SupplementIngredientStatement:
    //   productType === 'supplement facts' &&
    //   ingredients?.[0]?.ingredientStatement
    //     ? [toUpper(ingredients[0].ingredientStatement)]
    //     : undefined,

    IngredientsStatement:
      ingredients?.[0]?.ingredientStatement && ingredients?.length > 0
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

        if (item === 'twitter') {
          return 'X FORMERLY TWITTER';
        }

        return toUpper(item?.trim());
      }),
    // MarketingClaims: marketing?.[0]?.marketingClaims?.map((item: string) =>
    //   toUpper(item)
    // ),
    SocialMediaAddresses:
      [
        ...(marketing?.[0]?.socialMediaText
          ?.split(', ')
          .filter((item: string) => item !== '')
          .map((item: any) => toUpper(item)) || []),
        ...(marketing?.[0]?.website
          ?.split(', ')
          .filter((item: string) => item !== '')
          .filter((item: string) => {
            if (
              item?.includes('facebook') ||
              item?.includes('twitter') ||
              item?.includes('youtube') ||
              item?.includes('instagram') ||
              item?.includes('snapchat')
            ) {
              return true;
            } else {
              return false;
            }
          }) || []),
      ] || [],

    // //* attribute
    SugarSweetener:
      attributes?.validated_sugarClaims?.filter((item: any) => !!item) || [],
    Process: attributes?.validated_nonCertificateClaims || [],
    Contains: attributes?.validated_contain || [],
    DoesNotContain: attributes?.validated_notContain || [],
    Grade: attributes?.otherAttribute?.[0]?.grade,
    JuicePercent: attributes?.otherAttribute?.[0]?.juicePercent,

    //* other attributes
    ...(attributes?.['validated_baseCertifierClaims']
      ? attributes?.['validated_baseCertifierClaims']
      : {}),
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
          AmountUOM: nutrientItem?.['uom']?.toString() || '',
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

const mapPrimarySizeAndPrimarySizeUom = (header: any) => {
  const {
    primarySizeValue,
    primarySizeUOM,
    count,
    countUom,
    fullSizeTextDescription,
  } = header?.[0] || {};
  if (primarySizeValue) {
    return {
      PrimarySize: toUpper(primarySizeValue),
      PrimarySizeUOM: toUpper(primarySizeUOM),
      PrimarySizeText: toUpper(fullSizeTextDescription),
    };
  }

  if (!primarySizeValue && count) {
    return {
      PrimarySize: toUpper(count),
      PrimarySizeUOM: 'COUNT',
      PrimarySizeText: toUpper(`${count} ${countUom}`),
    };
  }

  return {};
};

// const mapDistributedBy = (suppychain: any) => {
//   const {
//     distributorName,
//     distributorCity,
//     distributorState,
//     distributorZipCode,
//   } = suppychain?.[0] || {};

//   if (distributorName) {
//     return {
//       DistributedBy: toUpper(
//         [
//           distributorName,
//           distributorCity,
//           distributorState,
//           distributorZipCode,
//         ]?.join(', ')
//       ),
//     };
//   }

//   return {};
// };
