const mock = {
  queryController: {
    TotalRecords: 1,
    PageNumber: 1,
    PageSize: 10,
    DataFilters: [
      {
        EntityName: 'Product',
        PropertyName: 'IXOneId',
        Operator: 'in',
        Comparator: "'SNL745854'",
      },
    ],
    PropertyListing: [
      {
        EntityName: 'Product',
        PropertyName: 'BrandName',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BrookshiresBrandName',
      },
      {
        EntityName: 'Product',
        PropertyName: 'IXOneId',
      },
      {
        EntityName: 'Product',
        PropertyName: 'Status',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ProductType',
      },
      {
        EntityName: 'Product',
        PropertyName: 'Allergens',
      },
      {
        EntityName: 'Product',
        PropertyName: 'AllergensAncillary',
      },
      {
        EntityName: 'Product',
        PropertyName: 'FreeOf',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ProcessedOnEquipment',
      },
      {
        EntityName: 'Product',
        PropertyName: 'Acidity',
      },
      {
        EntityName: 'Product',
        PropertyName: 'PlantBasedDerivedClaim',
      },
      {
        EntityName: 'Product',
        PropertyName: 'PlantBasedDerivedCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'AttributesAncillary',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BioBasedYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BioDynamicYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'CalorieClaim',
      },
      {
        EntityName: 'Product',
        PropertyName: 'CarbonFootprintYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'Contains',
      },
      {
        EntityName: 'Product',
        PropertyName: 'CradleToCradleYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'CrueltyFreeYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'DiabeticFriendlyYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'DoesNotContain',
      },
      {
        EntityName: 'Product',
        PropertyName: 'EcoFisheryYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'FairTradeYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'FatContent',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ForLifeYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'GlutenFreeYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'GMPYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'GrassFedYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'HalalYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'HeartHealthyYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'HighPotency',
      },
      {
        EntityName: 'Product',
        PropertyName: 'JuicePercent',
      },
      {
        EntityName: 'Product',
        PropertyName: 'KosherYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'LiveAndActiveCulture',
      },
      {
        EntityName: 'Product',
        PropertyName: 'LowGlycemicYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'OrganicIngredientsMadeWith',
      },
      {
        EntityName: 'Product',
        PropertyName: 'MilkType',
      },
      {
        EntityName: 'Product',
        PropertyName: 'NonGMOYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'NPAYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'OrganicYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'PACAYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'PaleoYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'PASAYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'PHLevel',
      },
      {
        EntityName: 'Product',
        PropertyName: 'Process',
      },
      {
        EntityName: 'Product',
        PropertyName: 'RainForestAllianceYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'RealSealYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ReleaseNotation',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SaltContent',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SugarSweetener',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SustainabilityYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'VeganYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'VegetarianYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ViticultureYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WaterQualityAssociationCertified',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WERCSRegistered',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WfEcoScaleRatingClaim',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WfEcoScaleRatingClaimLevel',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WfGlobalAnimalPartnershipRatingClaim',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WfGlobalAnimalPartnershipRatingClaimLevel',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WholeFoodsWholeTradeGuaranteeCertified',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WholeGrainYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'USDAStatement',
      },
      {
        EntityName: 'Product',
        PropertyName: 'StateRegionCertification',
      },
      {
        EntityName: 'Product',
        PropertyName: 'Grade',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BioBasedCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BioDynamicCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'CarbonFootprintCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'CertificationsAncillary',
      },
      {
        EntityName: 'Product',
        PropertyName: 'CertifiedBCorporation',
      },
      {
        EntityName: 'Product',
        PropertyName: 'CradleToCradleCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'CrueltyFreeCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'DiabeticFriendlyCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'EcoFisheryCertification',
      },
      {
        EntityName: 'Product',
        PropertyName: 'FairTradeCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'FoodGradePlasticsCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ForLifeCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'GlutenFreeCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'GMPCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'GrassFedCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'HalalCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'HeartHealthyCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'KosherCertification',
      },
      {
        EntityName: 'Product',
        PropertyName: 'KosherType',
      },
      {
        EntityName: 'Product',
        PropertyName: 'LiveAndActiveCultureCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'LowGlycemicCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'NonGMOCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'NPACertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'OrganicCertifyingBody',
      },
      {
        EntityName: 'Product',
        PropertyName: 'OrganicPercentage',
      },
      {
        EntityName: 'Product',
        PropertyName: 'OrganicPercentageText',
      },
      {
        EntityName: 'Product',
        PropertyName: 'OnePercentForThePlanetCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'OnePercentForThePlanetClaim',
      },
      {
        EntityName: 'Product',
        PropertyName: 'PACACertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'PaleoCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'PASACertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'RainForestAllianceCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'RealSealCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SustainabilityCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SustainableFisheriesPartnership_SFP',
      },
      {
        EntityName: 'Product',
        PropertyName: 'VeganCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'VegetarianCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ViticultureCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WaterQualityAssociationCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WholeFoodsWholeTradeGuaranteeCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WholeGrainCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'DrainedWeight',
      },
      {
        EntityName: 'Product',
        PropertyName: 'DrainedWeightUOM',
      },
      {
        EntityName: 'Product',
        PropertyName: 'eSymbolPresent',
      },
      {
        EntityName: 'Product',
        PropertyName: 'InProduction',
      },
      {
        EntityName: 'Product',
        PropertyName: 'IsMultiPack',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ManufacturerNameHeader',
      },
      {
        EntityName: 'Product',
        PropertyName: 'PrimarySize',
      },
      {
        EntityName: 'Product',
        PropertyName: 'UnitCount',
      },
      {
        EntityName: 'Product',
        PropertyName: 'PrimarySizeText',
      },
      {
        EntityName: 'Product',
        PropertyName: 'PrimarySizeUOM',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ProductDescription',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SecondaryDrainedWeight',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SecondaryDrainedWeightUOM',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SecondaryProductDescription',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ProductFlavor',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ProductStyle',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ProductScent',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SecondarySize',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SecondarySizeUOM',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ServingSuggestionPresent',
      },
      {
        EntityName: 'Product',
        PropertyName: 'TertiaryDescription',
      },
      {
        EntityName: 'Product',
        PropertyName: 'TertiarySize',
      },
      {
        EntityName: 'Product',
        PropertyName: 'TertiarySizeUOM',
      },
      {
        EntityName: 'Product',
        PropertyName: 'VendorItemNumber',
      },
      {
        EntityName: 'Product',
        PropertyName: 'GDSNProvidedCertifications',
      },
      {
        EntityName: 'Product',
        PropertyName: 'IngredientBreakout',
      },
      {
        EntityName: 'Product',
        PropertyName: 'IngredientsAncillary',
      },
      {
        EntityName: 'Product',
        PropertyName: 'IngredientsChina',
      },
      {
        EntityName: 'Product',
        PropertyName: 'IngredientsStatement',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SupplementIngredientStatement',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ConsumerStorage',
      },
      {
        EntityName: 'Product',
        PropertyName: 'CookingInstructions',
      },
      {
        EntityName: 'Product',
        PropertyName: 'InstructionsAncillary',
      },
      {
        EntityName: 'Product',
        PropertyName: 'OpeningInstructions',
      },
      {
        EntityName: 'Product',
        PropertyName: 'UsageInstructions',
      },
      {
        EntityName: 'Product',
        PropertyName: 'UseOrFreezeBy',
      },
      {
        EntityName: 'Product',
        PropertyName: 'CopyrightTrademarkRegistered',
      },
      {
        EntityName: 'Product',
        PropertyName: 'EnlargedtoShowTexture',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ItemRomanceDescription',
      },
      {
        EntityName: 'Product',
        PropertyName: 'LabelsForEducation',
      },
      {
        EntityName: 'Product',
        PropertyName: 'MarketingClaims',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ProductWarningStatement',
      },
      {
        EntityName: 'Product',
        PropertyName: 'QRCode',
      },
      {
        EntityName: 'Product',
        PropertyName: 'Slogan',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SocialMedia',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SocialMediaAddresses',
      },
      {
        EntityName: 'Product',
        PropertyName: 'Website',
      },
      {
        EntityName: 'Product',
        PropertyName: 'AncillaryPackagingInformation',
      },
      {
        EntityName: 'Product',
        PropertyName: 'Biodegradable',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BPAFreeLiner',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BPAFreePackaging',
      },
      {
        EntityName: 'Product',
        PropertyName: 'Compostable',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ContainsBPA',
      },
      {
        EntityName: 'Product',
        PropertyName: 'FoodGradePlastic',
      },
      {
        EntityName: 'Product',
        PropertyName: 'FoodserviceBulkPack',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ForestStewardshipCouncil',
      },
      {
        EntityName: 'Product',
        PropertyName: 'PackagingDescriptors',
      },
      {
        EntityName: 'Product',
        PropertyName: 'PrintOnPricing',
      },
      {
        EntityName: 'Product',
        PropertyName: 'RecycledMaterial',
      },
      {
        EntityName: 'Product',
        PropertyName: 'RecycledMaterialStatement',
      },
      {
        EntityName: 'Product',
        PropertyName: 'RecycledMaterialType',
      },
      {
        EntityName: 'Product',
        PropertyName: 'RecycleStatement',
      },
      {
        EntityName: 'Product',
        PropertyName: 'CatchWeightItem',
      },
      {
        EntityName: 'Product',
        PropertyName: 'Cube',
      },
      {
        EntityName: 'Product',
        PropertyName: 'Depth',
      },
      {
        EntityName: 'Product',
        PropertyName: 'EANNumber',
      },
      {
        EntityName: 'Product',
        PropertyName: 'GTIN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'Height',
      },
      {
        EntityName: 'Product',
        PropertyName: 'CaseasEach',
      },
      {
        EntityName: 'Product',
        PropertyName: 'TareWeight',
      },
      {
        EntityName: 'Product',
        PropertyName: 'UPC10',
      },
      {
        EntityName: 'Product',
        PropertyName: 'UPC11',
      },
      {
        EntityName: 'Product',
        PropertyName: 'UPC12',
      },
      {
        EntityName: 'Product',
        PropertyName: 'UPC13',
      },
      {
        EntityName: 'Product',
        PropertyName: 'UPC8',
      },
      {
        EntityName: 'Product',
        PropertyName: 'Weight',
      },
      {
        EntityName: 'Product',
        PropertyName: 'Width',
      },
      {
        EntityName: 'Product',
        PropertyName: 'PLU',
      },
      {
        EntityName: 'Product',
        PropertyName: 'PlanogramHeight',
      },
      {
        EntityName: 'Product',
        PropertyName: 'PlanogramDepth',
      },
      {
        EntityName: 'Product',
        PropertyName: 'PlanogramWidth',
      },
      {
        EntityName: 'Product',
        PropertyName: 'AncillaryInformation',
      },
      {
        EntityName: 'Product',
        PropertyName: 'AlcoholContentPercent',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ContainerColor',
      },
      {
        EntityName: 'Product',
        PropertyName: 'MSDS',
      },
      {
        EntityName: 'Product',
        PropertyName: 'RedemptionValues',
      },
      {
        EntityName: 'Product',
        PropertyName: 'RulesAndRegulationsAncillary',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SulfitesPPM',
      },
      {
        EntityName: 'Product',
        PropertyName: 'TransportationRestrictions',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WarningLabels',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WICEligible',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BottledBy',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BottledIn',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BrokenSealWarningPresent',
      },
      {
        EntityName: 'Product',
        PropertyName: 'CodeDateExample',
      },
      {
        EntityName: 'Product',
        PropertyName: 'CodeDateFormula',
      },
      {
        EntityName: 'Product',
        PropertyName: 'CodeDatePosition',
      },
      {
        EntityName: 'Product',
        PropertyName: 'CodeDateStamp',
      },
      {
        EntityName: 'Product',
        PropertyName: 'CodeDateType',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ContainerType',
      },
      {
        EntityName: 'Product',
        PropertyName: 'CountryOfOriginName',
      },
      {
        EntityName: 'Product',
        PropertyName: 'CountryOfOriginText',
      },
      {
        EntityName: 'Product',
        PropertyName: 'DistributedBy',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ImportedBy',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ManufacturerCityPackaging',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ManufacturerCodeExample',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ManufacturerCodeFormula',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ManufacturerCodePosition',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ManufacturerCodeSupplementaryInformation',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ManufacturerCountryPackaging',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ManufacturerEmailAddressFromPackage',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ManufacturerNamePackaging',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ManufacturerPhoneNumberPackaging',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ManufacturerStatePackaging',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ManufacturerStreetPackaging',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ManufacturerZipCodePackaging',
      },
      {
        EntityName: 'Product',
        PropertyName: 'MerchandisedInTray',
      },
      {
        EntityName: 'Product',
        PropertyName: 'PegHole',
      },
      {
        EntityName: 'Product',
        PropertyName: 'Perishable',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ShelfLifeAfterOpening',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ShelfLifeDaysAtProduction',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ShelfLifeDaysGuarantee',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SupplementaryCodeDateInformation',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SupplyChainAncillary',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ContractManufacturer',
      },
      {
        EntityName: 'Product',
        PropertyName: 'RegionsSoldIn',
      },
      {
        EntityName: 'Product',
        PropertyName: 'RenewableEnergyClaim',
      },
      {
        EntityName: 'Product',
        PropertyName: 'RenewableEnergyCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ItalCertifiedSealClaim',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ItalCertifiedSealCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ItalConsciousSealClaim',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ItalConsciousSealCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ItalSacramentSealClaim',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ItalSacramentSealCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BeeBetterClaim',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BeeBetterCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'GlyphosateResidueFreeClaim',
      },
      {
        EntityName: 'Product',
        PropertyName: 'GlyphosateResidueFree',
      },
      {
        EntityName: 'Product',
        PropertyName: 'GlyphosateInTransitionClaim',
      },
      {
        EntityName: 'Product',
        PropertyName: 'GlyphosateInTransition',
      },
      {
        EntityName: 'Product',
        PropertyName: 'NaturalPersonalCareCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'REALCertifiedClaim',
      },
      {
        EntityName: 'Product',
        PropertyName: 'REALCertified',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ADASealofAcceptanceClaim',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ADASealofAcceptance',
      },
      {
        EntityName: 'Product',
        PropertyName: 'NewYorkStateGrownCertifierClaim',
      },
      {
        EntityName: 'Product',
        PropertyName: 'NewYorkStateGrownCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WholeFoodsMarketPremiumBodyCare',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WholeFoodsMarketResponsiblyFarmed3rdPartyVerified',
      },
      {
        EntityName: 'Product',
        PropertyName: 'GMO',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ManufacturedForAndDistributedBy',
      },
      {
        EntityName: 'Product',
        PropertyName: 'GMOStatement',
      },
      {
        EntityName: 'Product',
        PropertyName: 'NonGMOStatement',
      },
      {
        EntityName: 'Product',
        PropertyName: 'FormatFoodServiceProductName',
      },
      {
        EntityName: 'Product',
        PropertyName: 'FormatFoodServiceProductDescription',
      },
      {
        EntityName: 'Product',
        PropertyName: 'FormatFoodServiceFeatures',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ECommerceNameA',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ECommerceLongDescriptionA',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ECommerceFeatures',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ECommerceSearchTerms',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ECommerceNameW',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ECommerceShelfDescription',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ECommerceShortDescription',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ECommerceProductDescription',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ECommerceLongDescriptionB',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ECommerceGordonFoodservice',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ECommerceGordonFoodserviceBullet1',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ECommerceGordonFoodserviceBullet2',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ECommerceGordonFoodserviceBullet3',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ECommerceGordonFoodserviceBullet4',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ECommerceGordonFoodserviceBullet5',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ECommerceRiteAidProductTitle',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ECommerceRiteAidProductDescription',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ProcessedManufacturedInFacilityStatement',
      },
      {
        EntityName: 'Product',
        PropertyName: 'InFacilityOnEquipmentIncluding',
      },
      {
        EntityName: 'Product',
        PropertyName: 'InFacilityOnEquipmentStatement',
      },
      {
        EntityName: 'Product',
        PropertyName: 'RenewableEnergyClaimCertifierStatement',
      },
      {
        EntityName: 'Product',
        PropertyName: 'RbghBstStatement',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WholeFoodsMarket365GmoStatement',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WholeFoodsSourcedForGood',
      },
      {
        EntityName: 'Product',
        PropertyName: 'PatentInformation',
      },
      {
        EntityName: 'Product',
        PropertyName: 'MarkedReturnable',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SustainableForestryInitiativeSFIProgram',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BrokenSealWarningStatement',
      },
      {
        EntityName: 'Product',
        PropertyName: 'GlycemicIndexClaim',
      },
      {
        EntityName: 'Product',
        PropertyName: 'GlycemicIndexCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'RegenerativeOrganicClaim',
      },
      {
        EntityName: 'Product',
        PropertyName: 'RegenerativeOrganicCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'CaliforniaProp65Compliant',
      },
      {
        EntityName: 'Product',
        PropertyName: 'VistarItemNumber',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ImportedBottledBy',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ProducedBy',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ProducedBottledBy',
      },
      {
        EntityName: 'Product',
        PropertyName: 'VintageYear',
      },
      {
        EntityName: 'Product',
        PropertyName: 'FlavorTastingNotes',
      },
      {
        EntityName: 'Product',
        PropertyName: 'AlcoholByVolumeStatement',
      },
      {
        EntityName: 'Product',
        PropertyName: 'AlcoholProofStatement',
      },
      {
        EntityName: 'Product',
        PropertyName: 'Winery',
      },
      {
        EntityName: 'Product',
        PropertyName: 'Brewery',
      },
      {
        EntityName: 'Product',
        PropertyName: 'IxOneCertificationLevel',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SignificantSource_P',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ExcellentSource_P',
      },
      {
        EntityName: 'Product',
        PropertyName: 'HighPressureCertifiedClaim',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BioengineeredYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BioengineeredStatement',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BioengineeredType',
      },
      {
        EntityName: 'Product',
        PropertyName: 'HighPressureCertifiedCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ColdPressureVerified',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ColdPressuredProtectedClaim',
      },
      {
        EntityName: 'Product',
        PropertyName: 'HighPressureColdPressureColdPressuredStatement',
      },
      {
        EntityName: 'Product',
        PropertyName: 'CaliforniaProp65WarningSymbolPresent',
      },
      {
        EntityName: 'Product',
        PropertyName: 'CaliforniaProp65WarningStatement',
      },
      {
        EntityName: 'Product',
        PropertyName: 'Discontinued',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ContainerAndMaterialTypes',
      },
      {
        EntityName: 'Product',
        PropertyName: 'InkTypes',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ExciseTaxes',
      },
      {
        EntityName: 'Product',
        PropertyName: 'CBDHempClaim',
      },
      {
        EntityName: 'Product',
        PropertyName: 'CBDHempCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'THCContentPercent',
      },
      {
        EntityName: 'Product',
        PropertyName: 'GDSNProvidedNutClaim',
      },
      {
        EntityName: 'Product',
        PropertyName: 'HasPanel',
      },
      {
        EntityName: 'Product',
        PropertyName: 'HasSupplementPanel',
      },
      {
        EntityName: 'Product',
        PropertyName: 'HasAminoAcidPanel',
      },
      {
        EntityName: 'Product',
        PropertyName: 'HasNutritionPanel',
      },
      {
        EntityName: 'Product',
        PropertyName: 'OrganicStandardsAgency',
      },
      {
        EntityName: 'Product',
        PropertyName: 'OrganicStandardsAgencyLogo',
      },
      {
        EntityName: 'Product',
        PropertyName: 'FairTradeStatement',
      },
      {
        EntityName: 'Product',
        PropertyName: 'NotForRetailSale',
      },
      {
        EntityName: 'Product',
        PropertyName: 'InternationalPackagedIceAssociation',
      },
      {
        EntityName: 'Product',
        PropertyName: 'KetoYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'KetoCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'AlcoholProof',
      },
      {
        EntityName: 'Product',
        PropertyName: 'PercentAlcoholByVolume',
      },
      {
        EntityName: 'Product',
        PropertyName: 'FinishedAndBottledIn',
      },
      {
        EntityName: 'Product',
        PropertyName: 'GovernmentWarning',
      },
      {
        EntityName: 'Product',
        PropertyName: 'DistilledIn',
      },
      {
        EntityName: 'Product',
        PropertyName: 'DistilledFrom',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SulfitesPPC',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WineCategory',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WineVarietal',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WineSweetness',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WineOrigin',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WineRegion',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WineCorkType',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WinePairsWellWith',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WineComplements',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WineYear',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WineVintage',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WineTaste',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WineBody',
      },
      {
        EntityName: 'Product',
        PropertyName: 'WineCharacter',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SpiritsYearsAged',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SpiritsBarrelType',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SpiritsFlavor',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SpiritsCategory',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SpiritsSubCategory',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SpiritsStyle',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SpiritsRegion',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SpiritsTaste',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BeerBrewery',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BeerRegion',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BeerCategory',
      },
      {
        EntityName: 'Product',
        PropertyName: 'IBUs',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BeerStyle',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BeerTaste',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BeerBody',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BeerFinalGravity',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BWSProducedBy',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BWSDistributedBy',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BWSBottledIn',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BWSImportedBy',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BWSBottledBy',
      },
      {
        EntityName: 'Product',
        PropertyName: 'DistilledBy',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BioengineeredClaims',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BWSMemberSuppliedProduct',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BusinessOwnerManufacturerYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BusinessOwnerManufacturerCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ImperialSize',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ImperialUOM',
      },
      {
        EntityName: 'Product',
        PropertyName: 'MetricSize',
      },
      {
        EntityName: 'Product',
        PropertyName: 'MetricUOM',
      },
      {
        EntityName: 'Product',
        PropertyName: 'IxOneCoreDate',
      },
      {
        EntityName: 'Product',
        PropertyName: 'DamageNote',
      },
      {
        EntityName: 'Product',
        PropertyName: 'DamageApproved',
      },
      {
        EntityName: 'Product',
        PropertyName: 'NonFoodProduct',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BrickCode',
      },
      {
        EntityName: 'Product',
        PropertyName: 'BrickCodeDescription',
      },
      {
        EntityName: 'Product',
        PropertyName: 'MemberRenewalValidated',
      },
      {
        EntityName: 'Product',
        PropertyName: 'MemberRenewalValidatedDate',
      },
      {
        EntityName: 'Product',
        PropertyName: 'ProvidedWeight',
      },
      {
        EntityName: 'Product',
        PropertyName: 'TargetMarket',
      },
      {
        EntityName: 'Product',
        PropertyName: 'RegenerativeAgricultureYN',
      },
      {
        EntityName: 'Product',
        PropertyName: 'RegenerativeAgricultureCertifier',
      },
      {
        EntityName: 'Product',
        PropertyName: 'NutritionPanel',
      },
      {
        EntityName: 'NutritionPanel',
        PropertyName: 'Property',
      },
      {
        EntityName: 'Property',
        PropertyName: 'PropertyName',
      },
      {
        EntityName: 'Property',
        PropertyName: 'Amount',
      },
      {
        EntityName: 'Property',
        PropertyName: 'AmountUOM',
      },
      {
        EntityName: 'Property',
        PropertyName: 'Percent',
      },
      {
        EntityName: 'Property',
        PropertyName: 'AnalyticalValue',
      },
      {
        EntityName: 'Product',
        PropertyName: 'SupplementPanel',
      },
      {
        EntityName: 'SupplementPanel',
        PropertyName: 'Property',
      },
      {
        EntityName: 'Property',
        PropertyName: 'PropertySource',
      },
      {
        EntityName: 'Property',
        PropertyName: 'Indicators',
      },
    ],
    EntityName: 'QueryController',
  },
  Products: [
    {
      SupplementPanel: [
        {
          Property: [
            {
              PropertyName: 'DAILY VALUE STATEMENT',
              PropertySource: '† DAILY VALUE (DV) NOT ESTABLISHED',
              Amount: '',
              AmountUOM: '',
            },
            {
              PropertyName: 'OTHER INGREDIENTS',
              PropertySource:
                'NATURAL FLAVORS, CITRIC ACID (FROM CASSAVA), L-MALIC ACID, STEVIA (REBAUDIOSIDE M) EXTRACT, MONK FRUIT (LUO HAN GUO), HIMALAYAN PINK SALT, KATEMFE FRUIT (THAUMATOCOCCUS DANIELLII) EXTRACT.',
              Amount: '',
              AmountUOM: '',
            },
            {
              PropertyName: 'PRIMARY SERVINGS PER CONTAINER',
              PropertySource: '',
              Amount: '20',
              AmountUOM: '',
            },
            {
              PropertyName: 'BLEND1',
              PropertySource:
                "PERFECT AMINO EAA & NA PROPRIETARY BLEND L-LEUCINE, L-VALINE, L-ISOLEUCINE, L-LYSINE HCL, L- PHENYLALANINE, L-THREONINE, L-METHIONINE, L-TRYPTOPHAN, L-HISTIDINE, URIDINE, ADENOSINE TRIPHOSPHATE, THYMIDINE, ADENINE, 2'-DEOXYADENOSINE, 2'-DEOXYGUANOSINE, 2'-DEOXYCYTIDINE",
              AnalyticalValue: 5.0,
              Amount: '5',
              AmountUOM: 'GRAM',
              Indicators: ['†'],
            },
            {
              PropertyName: 'PANEL LABEL',
              PropertySource: 'SUPPLEMENT FACTS',
              Amount: '',
              AmountUOM: '',
            },
            {
              PropertyName: 'PRIMARY SERVING SIZE',
              PropertySource: '',
              Amount: '1 SCOOP (6.58G)',
              AmountUOM: '',
            },
          ],
        },
      ],
      BrandName: 'BODYHEALTH',
      IXOneId: 'SNL745854',
      Status: 'ACTIVE',
      ProductType: 'STANDARD',
      FreeOf: ['DAIRY'],
      AttributesAncillary: ['VEGAN DIETARY SUPPLEMENT'],
      Contains: ['AMINO ACIDS'],
      GlutenFreeYN: true,
      GMPYN: true,
      PaleoYN: true,
      InProduction: true,
      ManufacturerNameHeader: 'BODYHEALTH LLC',
      PrimarySize: 4.64,
      UnitCount: 20.0,
      PrimarySizeText: 'NET WT 4.64 OZ (131.6G) 20 SERVINGS',
      PrimarySizeUOM: 'OUNCE',
      ProductDescription: 'PERFECT AMINO® POWDER',
      ProductFlavor: 'MIXED BERRY',
      SecondarySize: 131.6,
      SecondarySizeUOM: 'GRAM',
      VendorItemNumber: 'BHPAMB20-1',
      SupplementIngredientStatement: [
        "BLEND1 PERFECT AMINO EAA & NA PROPRIETARY BLEND L-LEUCINE, L-VALINE, L-ISOLEUCINE, L-LYSINE HCL, L- PHENYLALANINE, L-THREONINE, L-METHIONINE, L-TRYPTOPHAN, L-HISTIDINE, URIDINE, ADENOSINE TRIPHOSPHATE, THYMIDINE, ADENINE, 2'-DEOXYADENOSINE, 2'-DEOXYGUANOSINE, 2'-DEOXYCYTIDINE 5 GRAM",
        'DAILY VALUE STATEMENT † DAILY VALUE (DV) NOT ESTABLISHED  ',
        'OTHER INGREDIENTS NATURAL FLAVORS, CITRIC ACID (FROM CASSAVA), L-MALIC ACID, STEVIA (REBAUDIOSIDE M) EXTRACT, MONK FRUIT (LUO HAN GUO), HIMALAYAN PINK SALT, KATEMFE FRUIT (THAUMATOCOCCUS DANIELLII) EXTRACT.  .',
      ],
      UsageInstructions: [
        'SUGGESTED USE: TAKE 1 SCOOP, 1-3 TIMES DAILY. MIX WITH 8-12 OZ. OF COLD WATER.',
      ],
      MarketingClaims: [
        '1 SCOOP PROVIDES 5 GRAMS WITH UTILIZATION COMPARABLE TO DIETARY PROTEIN CONSUMPTION OF (ON AVERAGE):* 29G WHEY • SOY • DAIRY • NUTS 15G MEAT • POULTRY • FISH 10G EGGS',
        'BUILD LEAN MUSCLE* BOOST PERFORMANCE* SPEED RECOVERY*',
        'ESSENTIAL AMINO ACIDS OPTIMIZED FOR MAXIMUM UTILIZATION* CONTAINS NUCLEIC ACID BUILDING BLOCKS',
        'MIXED BERRY',
        'PALEO & KETO-FRIENDLY',
        'PERFECT AMINO DIETARY SUPPLEMENT IS UTILIZED UP TO 99% TO HELP BUILD NEW PROTEIN, MUSCLE & COLLAGEN WITHOUT THE CALORIC IMPACT & WITHOUT BREAKING A FAST.* IT IS SUPPLEMENTED WITH NUCLEIC ACID BUILDING BLOCKS TO HELP DIRECT THE PROCESS OF PROTEIN SYNTHESIS.* VISIT PERFECTAMINO.COM FOR MORE INFORMATION.',
        'THE TRUE SCIENCE OF PROTEIN*',
      ],
      ProductWarningStatement: [
        'THESE STATEMENTS HAVE NOT BEEN EVALUATED BY THE FOOD AND DRUG ADMINISTRATION.',
        'THIS PRODUCT IS NOT INTENDED TO DIAGNOSE, TREAT, CURE, OR PREVENT ANY DISEASE.',
      ],
      QRCode: true,
      Website: ['BODYHEALTH.COM', 'PERFECTAMINO.COM'],
      AncillaryPackagingInformation: ['501-1', 'V2.042224'],
      RecycledMaterialType: ['2 (HDPE)'],
      Cube: 0.022,
      Depth: 3.625,
      Height: 2.9,
      UPC10: '5005575608',
      UPC11: '85005575608',
      UPC12: '850055756083',
      UPC13: '0085005575608',
      Weight: 0.43,
      Width: 3.65,
      CodeDateExample: '06/2026',
      CodeDateFormula: 'MM/YYYY',
      CodeDatePosition: 'BOTTOM OF UNIT',
      CodeDateStamp: 'OPEN',
      CodeDateType: 'BEST BY',
      ContainerType: 'JAR',
      ManufacturerCityPackaging: 'DUNEDIN',
      ManufacturerCodeExample: 'LOT#:240605-4A',
      ManufacturerCodePosition: 'BOTTOM OF UNIT',
      ManufacturerNamePackaging:
        'MANUFACTURED IN A CGMP CERTIFIED FACILITY FOR BODYHEALTH.COM , LLC',
      ManufacturerPhoneNumberPackaging: '877-804-3258',
      ManufacturerStatePackaging: 'FLORIDA',
      ManufacturerStreetPackaging: '745 MAIN STREET',
      ManufacturerZipCodePackaging: '34698',
      IxOneCertificationLevel: 'IX-STANDARD',
      ContainerAndMaterialTypes: 'PLASTIC - 2 HDPE',
      HasPanel: true,
      HasSupplementPanel: true,
      HasAminoAcidPanel: false,
      HasNutritionPanel: false,
      KetoYN: true,
      ImperialSize: 4.64,
      ImperialUOM: 'OUNCE',
      MetricSize: 131.6,
      MetricUOM: 'GRAM',
      IxOneCoreDate: '2024-06-25T17:00:19.447',
      BrickCode: '10000468',
      BrickCodeDescription: 'NUTRITIONAL SUPPLEMENTS',
    },
  ],
};
export default mock;