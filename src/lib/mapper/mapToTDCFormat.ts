const mapToTDCformat = (extractData: any) => {
  const productData = extractData?.product;

  const {
    ingredients,
    marketing,
    supplyChain,
    instructions,
    factPanels,
    header,
    allergens,
    attributes,
  } = productData;

  let mappingResult = {
    //* header
    ProductDescription: header?.productName,
    BrandName: header?.brandName,
    PrimarySize: header?.primarySizeValue,
    PrimarySizeUOM: header?.primarySizeUOM,
    PrimarySizeText: header?.fullSizeTextDescription,
    SecondarySize: header?.secondarySizeValue,
    SecondarySizeUOM: header?.secondarySizeUOM,

    //* panel
    NutritionPanel: mapToNutritionPanels(factPanels),
    SupplementPanel: mapToNutritionPanels(factPanels),

    //* supply chain
    ManufacturerNamePackaging: supplyChain?.manufacturerName || 'Unknown',
    ManufacturerCityPackaging: supplyChain?.manufacturerCity,
    ManufacturerPhoneNumberPackaging: supplyChain?.manufacturerPhoneNumber,
    ManufacturerStatePackaging: supplyChain?.manufacturerState,
    ManufacturerStreetPackaging: supplyChain?.manufacturerStreetAddress,
    ManufacturerZipCodePackaging: supplyChain?.manufactureZipCode,
    DistributedBy: supplyChain?.distributedBy, //? in progress
    CountryOfOriginText: supplyChain?.countryOfOriginText,
    CountryOfOriginName: supplyChain?.countryOfOrigin,

    //* instructions
    UsageInstructions: instructions?.usageInstruction,

    //* allergen
    Allergens: allergens?.containList,
    FreeOf: allergens?.notContainList,
    AllergensAncillary: allergens?.containStatement,
    ProcessedOnEquipment: allergens?.containOnEquipmentList,
    ProcessedManufacturedInFacilityStatement:
      allergens?.containOnEquipmentStatement,

    //* marketing
    Website: marketing?.website,
    QRCode: marketing?.haveQrCode,

    //* additional
    // HasSupplementPanel:
    //   factPanels?.some((panel) => panel.type === 'supplement') || false,
    // HasNutritionPanel:
    //   factPanels?.some((panel) => panel.type === 'nutrition') || false,

    //* attribute
    SugarSweetener: attributes?.format_validated_sugarClaims,
    Process: attributes?.format_validated_nonCertificateClaims,
    Contains: attributes?.format_validated_contain,
    DoesNotContain: attributes?.format_validated_notContain,
  };

  const mappingFormat = {
    //* header
    ProductDescription: 'header.productName',
    BrandName: 'header.brandName',
    PrimarySize: 'header.primarySizeValue', //? in progress
    PrimarySizeUOM: 'header.primarySizeUOM', //? in progress
    PrimarySizeText: 'header.fullSizeTextDescription', //? in progress - need recheck
    SecondarySize: 'header.secondarySizeValue', //? in progress
    SecondarySizeUOM: 'header.secondarySizeUOM', //? in progress

    //* panel
    SupplementPanel: [],

    //* supply chain
    ManufacturerNamePackaging: '??',
    ManufacturerCityPackaging: 'supplyChain.manufacturerCity',
    ManufacturerPhoneNumberPackaging: 'supplyChain.manufacturerPhoneNumber',
    ManufacturerStatePackaging: 'supplyChain.manufacturerState',
    ManufacturerStreetPackaging: 'supplyChain.manufacturerStreetAddress',
    ManufacturerZipCodePackaging: 'supplyChain.manufactureZipCode',
    DistributedBy: 'supplyChain.distributedBy', //? in progress
    CountryOfOriginText: 'supplyChain.countryOfOriginText',
    CountryOfOriginName: 'supplyChain.countryOfOrigin',

    //* instructions
    UsageInstructions: 'usageInstruction',

    //* allergen
    Allergens: 'allergens.containList',
    FreeOf: 'allergens.notContainList',
    AllergensAncillary: 'allergens.containStatement',
    ProcessedOnEquipment: 'allergens.containOnEquipmentList',
    ProcessedManufacturedInFacilityStatement:
      'allergens.containOnEquipmentStatement',

    //* marketing
    Website: 'marketing.website',
    QRCode: 'marketing.haveQrCode',

    //* additional
    HasSupplementPanel: '???', //? in progress,
    HasNutritionPanel: '???', //? in progress,

    //* attribute
    SugarSweetener: 'attributes.format_validated_sugarClaims',
    Process: 'attributes.format_validated_nonCertificateClaims',
    Contains: 'attributes.format_validated_contain',
    DoesNotContain: 'attributes.format_validated_notContain',
    NutritionPanel: mapToNutritionPanels(factPanels),
  };
};

const mapToNutritionPanels = (factPanels: any) => {
  return factPanels.map((factPanelItem: any) => {
    let formatFactPanelPropertyList = [];
    const { servingInfo, nutritionFacts } = factPanelItem;
    const {
      servingPerContainer,
      servingSize,
      equivalentServingSize,
      amountPerServingName,
      calories,
    } = servingInfo;

    formatFactPanelPropertyList.push({
      PropertyName: 'PANEL LABEL',
      PropertySource: 'NUTRITION FACTS',
      Amount: '',
      AmountUOM: '',
    });

    if (servingSize) {
      formatFactPanelPropertyList.push({
        PropertyName: 'PRIMARY SERVING SIZE',
        PropertySource: '',
        Amount: servingSize,
        AmountUOM: '',
      });
    }

    if (equivalentServingSize) {
      formatFactPanelPropertyList.push({
        PropertyName: 'SECONDARY SERVING SIZE',
        PropertySource: '',
        Amount: equivalentServingSize,
        AmountUOM: '',
      });
    }
    if (calories) {
      formatFactPanelPropertyList.push({
        PropertyName: 'CALORIES',
        PropertySource: '',
        AnalyticalValue: calories,
        Amount: calories,
        AmountUOM: '',
      });
    }

    nutritionFacts.forEach((nutrientItem: any) => {
      formatFactPanelPropertyList.push({
        PropertyName: nutrientItem?.['validated_nutrientName'],
        PropertySource: '',
        AnalyticalValue: calories,
        Amount: nutrientItem?.['amount'],
        AmountUOM: nutrientItem?.['uom'],
        Percent: nutrientItem?.['percent'],
      });
    });

    return formatFactPanelPropertyList;
  });
};
