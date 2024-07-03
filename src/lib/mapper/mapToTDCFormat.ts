const mapToTDCformat = (extractData: any) => {
  const productData = extractData?.product;

  const { ingredients, marketing, supplyChain, instructions } = productData;

  let result = {
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
  };

  if (ingredients?.['ingredientStatement']) {
    // result['SupplementPanel'] =
  }
};
