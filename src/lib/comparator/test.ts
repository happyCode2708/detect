import { compareWithTDC } from './compareWithTDC';

const mappedData = {
  ProductDescription: 'STIR FRIED RICE-NOODLE YAKI BE-FUN',
  BrandName: 'KENMIN FOODS',
  PrimarySize: '2.29',
  PrimarySizeUOM: 'OUNCE',
  PrimarySizeText: '2.29 OUNCE',
  SecondarySize: '65',
  SecondarySizeUOM: 'GRAM',
  NutritionPanel: [
    {
      Property: [
        {
          PropertyName: 'PANEL LABEL',
          PropertySource: 'NUTRITION FACTS',
          Amount: '',
          AmountUOM: '',
        },
        {
          PropertyName: 'PRIMARY SERVING SIZE',
          PropertySource: '',
          Amount: '1 pack (65g)',
          AmountUOM: '',
        },
        {
          PropertyName: 'CALORIES',
          PropertySource: '',
          AnalyticalValue: '230',
          Amount: '230',
          AmountUOM: '',
        },
        {
          PropertyName: 'TOTAL FAT',
          PropertySource: '',
          AnalyticalValue: 1,
          Amount: 1,
          AmountUOM: 'GRAM',
          Percent: '1',
        },
        {
          PropertyName: 'SATURATED FAT',
          PropertySource: '',
          AnalyticalValue: 0.5,
          Amount: 0.5,
          AmountUOM: 'GRAM',
          Percent: '3',
        },
        {
          PropertyName: 'TRANS FAT',
          PropertySource: '',
          AnalyticalValue: 0,
          Amount: 0,
          AmountUOM: 'GRAM',
        },
        {
          PropertyName: 'CHOLESTEROL',
          PropertySource: '',
          AnalyticalValue: 0,
          Amount: 0,
          AmountUOM: 'MILLIGRAM',
          Percent: '0',
        },
        {
          PropertyName: 'SODIUM',
          PropertySource: '',
          AnalyticalValue: 1190,
          Amount: 1190,
          AmountUOM: 'MILLIGRAM',
          Percent: '52',
        },
        {
          PropertyName: 'TOTAL CARBOHYDRATE',
          PropertySource: '',
          AnalyticalValue: 51,
          Amount: 51,
          AmountUOM: 'GRAM',
          Percent: '19',
        },
        {
          PropertyName: 'DIETARY FIBER',
          PropertySource: '',
          AnalyticalValue: 1,
          Amount: 1,
          AmountUOM: 'GRAM',
          Percent: '4',
        },
        {
          PropertyName: 'TOTAL SUGARS',
          PropertySource: '',
          AnalyticalValue: 0,
          Amount: 0,
          AmountUOM: 'GRAM',
        },
        {
          PropertyName: 'ADDED SUGARS',
          PropertySource: '',
          AnalyticalValue: 0,
          Amount: 0,
          AmountUOM: 'GRAM',
          Percent: '0',
        },
        {
          PropertyName: 'PROTEIN',
          PropertySource: '',
          AnalyticalValue: 4,
          Amount: 4,
          AmountUOM: 'GRAM',
        },
        {
          PropertyName: 'VITAMIN D',
          PropertySource: '',
          AnalyticalValue: 0,
          Amount: 0,
          AmountUOM: 'MICROGRAM',
          Percent: '0',
        },
        {
          PropertyName: 'CALCIUM',
          PropertySource: '',
          AnalyticalValue: 20,
          Amount: 20,
          AmountUOM: 'MILLIGRAM',
          Percent: '2',
        },
        {
          PropertyName: 'IRON',
          PropertySource: '',
          AnalyticalValue: 1,
          Amount: 1,
          AmountUOM: 'MILLIGRAM',
          Percent: '6',
        },
        {
          PropertyName: 'POTASSIUM',
          PropertySource: '',
          AnalyticalValue: 120,
          Amount: 120,
          AmountUOM: 'MILLIGRAM',
          Percent: '2',
        },
      ],
    },
  ],
  SupplementPanel: null,
  ManufacturerNamePackaging: 'KENMIN FOODS CO., LTD.',
  ManufacturerCityPackaging: '',
  ManufacturerPhoneNumberPackaging: '',
  ManufacturerStatePackaging: '',
  ManufacturerStreetPackaging: '',
  ManufacturerZipCodePackaging: '',
  CountryOfOriginName: 'THAILAND',
  UsageInstructions: '',
  Allergens: ['SOYBEANS', 'SULFITES', 'FISH', 'TREE NUTS'],
  FreeOf: [''],
  AllergensAncillary: [
    'CONTAINS: SOYBEANS, SULFITES, FISH AND TREE NUTS (COCONUT)',
  ],
  ProcessedOnEquipment: '',
  ProcessedManufacturedInFacilityStatement: '',
  UPC12: '50009312013',
  Website: ['HTTP://WWW.KENMIN.CO.JP'],
  QRCode: 'false',
  Process: ['not fried'],
};

const productTdcData = {
  NutritionPanel: [
    {
      Property: [
        {
          PropertyName: 'SODIUM',
          PropertySource: '',
          AnalyticalValue: 1190,
          Amount: '1190',
          AmountUOM: 'MILLIGRAM',
          Percent: 52,
        },
        {
          PropertyName: 'POTASSIUM',
          PropertySource: '',
          AnalyticalValue: 120,
          Amount: '120',
          AmountUOM: 'MILLIGRAM',
          Percent: 2,
        },
        {
          PropertyName: 'VITAMIN D',
          PropertySource: '',
          AnalyticalValue: 0,
          Amount: '0',
          AmountUOM: 'MICROGRAM',
          Percent: 0,
        },
        {
          PropertyName: 'IRON',
          PropertySource: '',
          AnalyticalValue: 1,
          Amount: '1',
          AmountUOM: 'MILLIGRAM',
          Percent: 6,
        },
        {
          PropertyName: 'TRANS FAT',
          PropertySource: '',
          AnalyticalValue: 0,
          Amount: '0',
          AmountUOM: 'GRAM',
        },
        {
          PropertyName: 'DIETARY FIBER',
          PropertySource: '',
          AnalyticalValue: 1,
          Amount: '1',
          AmountUOM: 'GRAM',
          Percent: 4,
        },
        {
          PropertyName: 'PRIMARY SERVING SIZE',
          PropertySource: '',
          Amount: '1 PACK (65G)',
          AmountUOM: '',
        },
        {
          PropertyName: 'PROTEIN',
          PropertySource: '',
          AnalyticalValue: 4,
          Amount: '4',
          AmountUOM: 'GRAM',
        },
        {
          PropertyName: 'TOTAL FAT',
          PropertySource: '',
          AnalyticalValue: 1,
          Amount: '1',
          AmountUOM: 'GRAM',
          Percent: 1,
        },
        {
          PropertyName: 'ADDED SUGAR',
          PropertySource: '',
          AnalyticalValue: 0,
          Amount: '0',
          AmountUOM: 'GRAM',
          Percent: 0,
        },
        {
          PropertyName: 'CALCIUM',
          PropertySource: '',
          AnalyticalValue: 20,
          Amount: '20',
          AmountUOM: 'MILLIGRAM',
          Percent: 2,
        },
        {
          PropertyName: 'CHOLESTEROL',
          PropertySource: '',
          AnalyticalValue: 0,
          Amount: '0',
          AmountUOM: 'MILLIGRAM',
          Percent: 0,
        },
        {
          PropertyName: 'DAILY VALUE STATEMENT',
          PropertySource:
            '* THE % DAILY VALUE (DV) TELLS YOU HOW MUCH A NUTRIENT IN A SERVING OF FOOD CONTRIBUTES TO A DAILY DIET. 2,000 CALORIES A DAY IS USED FOR GENERAL NUTRITION ADVICE.',
          Amount: '',
          AmountUOM: '',
        },
        {
          PropertyName: 'PANEL LABEL',
          PropertySource: 'NUTRITION FACTS',
          Amount: '',
          AmountUOM: '',
        },
        {
          PropertyName: 'TOTAL SUGARS',
          PropertySource: '',
          AnalyticalValue: 0,
          Amount: '0',
          AmountUOM: 'GRAM',
        },
        {
          PropertyName: 'CALORIES',
          PropertySource: '',
          AnalyticalValue: 230,
          Amount: '230',
          AmountUOM: '',
        },
        {
          PropertyName: 'TOTAL CARBOHYDRATES',
          PropertySource: '',
          AnalyticalValue: 51,
          Amount: '51',
          AmountUOM: 'GRAM',
          Percent: 19,
        },
        {
          PropertyName: 'SATURATED FAT',
          PropertySource: '',
          AnalyticalValue: 0.5,
          Amount: '0.5',
          AmountUOM: 'GRAM',
          Percent: 3,
        },
      ],
    },
  ],
  BrandName: 'KENMIN',
  IXOneId: 'SNL564100',
  Status: 'ACTIVE',
  ProductType: 'STANDARD',
  Allergens: ['FISH', 'SOY / SOYBEANS', 'TREE NUTS'],
  AllergensAncillary: [
    'CONTAINS: SOYBEANS, SULFITES, FISH AND TREE NUTS (COCONUT)',
  ],
  Contains: ['SULFITES / SULPHITES'],
  GlutenFreeYN: true,
  GlutenFreeCertifier: ['GLUTEN FREE CERTIFICATION ORGANIZATION'],
  InProduction: true,
  ManufacturerNameHeader: 'JFC INTERNATIONAL, INC.',
  PrimarySize: 2.29,
  PrimarySizeText: '2.29 OUNCE 65.00 GRAM',
  PrimarySizeUOM: 'OUNCE',
  ProductDescription: 'NOODLES STIR FRIED',
  SecondarySize: 65,
  SecondarySizeUOM: 'GRAM',
  ServingSuggestionPresent: true,
  IngredientBreakout: [
    'RICE',
    'STARCH',
    'TAPIOCA',
    'POTATO',
    'CORN',
    'SOY SAUCE',
    'WATER',
    'SOYBEANS',
    'SALT',
    'KELP EXTRACT',
    'MONOSODIUM GLUTAMATE',
    'FISH EXTRACT',
    'MALTODEXTRIN',
    'BONITO EXTRACT',
    'FISH EXTRACT POWDER',
    'EASTERN LITTLE TUNA',
    'FRIGATE MACKEREL',
    'LONGTAIL TUNA',
    'YEAST EXTRACT',
    'SUGAR',
    'GINGER PASTE',
    'MONO-AND DIGLYCERIDES OF FATTY ACIDS',
    'SODIUM METAPHOSPHATE',
    'SODIUM TRIPOLYPHOSPHATE',
    'TETRASODIUM PYROPHOSPHATE',
    'CARBOXYMETHYL CELLULOSE',
    'GARLIC POWDER',
    'ONION POWDER',
    "DISODIUM 5'-RIBONUCLEOTIDE",
    'CARAMEL COLOR',
    'PEPPER',
    'SUCROSE ESTERS OF FATTY ACIDS',
    'COLOR',
    'RIBOFLAVIN',
    'ROSEMARY EXTRACT',
  ],
  IngredientsStatement: [
    "RICE, STARCH(TAPIOCA, POTATO, CORN), SOY SAUCE(WATER, SOYBEANS, RICE,SALT), SALT, KELP EXTRACT, MONOSODIUM GLUTAMATE, FISH EXTRACT(MALTODEXTRIN, BONITO EXTRACT, SALT, FISH EXTRACT POWDER(EASTERN LITTLE TUNA, FRIGATE MACKEREL, LONGTAIL TUNA), YEAST EXTRACT), SUGAR, GINGER PASTE, MONO-AND DIGLYCERIDES OF FATTY ACIDS, SODIUM METAPHOSPHATE, SODIUM TRIPOLYPHOSPHATE, TETRASODIUM PYROPHOSPHATE, CARBOXYMETHYL CELLULOSE, GARLIC POWDER, ONION POWDER, DISODIUM 5'-RIBONUCLEOTIDE, CARAMEL COLOR, YEAST EXTRACT, PEPPER, SUCROSE ESTERS OF FATTY ACIDS, COLOR(RIBOFLAVIN), ROSEMARY EXTRACT.",
  ],
  MarketingClaims: [
    '230KCAL SEASONED & NON-FRIED RICE NOODLE',
    'JAPANESE DASHI SOUP STOCK & SOY SAUCE FLAVOR',
    'MICROWAVABLE 3 MINUTES WITH PAN',
    'NO.1 RICE-NOODLE RICE-NOODLE, BUN, PHO, SEN MEE, KWAY TEOW, MEE HOON, BIHUN, MIHUN, BIHON, BIJON ETC) IS EVERY POPULAR FOOD IN ASIAN COUNTRIES. KENMIN YAKI BE-FUN IS NO.1 SELLING STIR FRIED RICE-NOODLE IN JAPAN. IT IS ALREADY SEASONED WITH JAPANESE DASHI(SOUP STOCK WITH BONITO AND KELP) AND SOY SAUCE, SO NO MORE SEASONINGS ARE REQUIRED. ENJOY EASY AND TASTY STIR FRIED RICE-NOODLE WITH LOTS OF VEGETABLES!',
    'STIR FRIED RICE-NOODLE',
    'YAKI BE-FUN™',
  ],
  Website: ['HTTP://WWW.KENMIN.CO.JP'],
  Cube: 0.033,
  Depth: 1.5,
  Height: 6.9,
  UPC10: '5000931201',
  UPC11: '85000931201',
  UPC12: '850009312013',
  UPC13: '0085000931201',
  Weight: 0.165,
  Width: 5.5,
  CodeDateExample: '10.16.2020',
  CodeDateFormula: 'MM.DD.YYYY',
  CodeDatePosition: 'BACK OF UNIT',
  CodeDateStamp: 'OPEN',
  CodeDateType: 'EXPIRES',
  ContainerType: 'BAG',
  CountryOfOriginName: ['THAILAND'],
  CountryOfOriginText: ['PRODUCT OF THAILAND'],
  ImportedBy: 'IMPORTED BY: JFC INTERNATIONAL INC. LOS ANGELES, CA 90040',
  ManufacturerNamePackaging: 'KENMIN FOODS CO., LTD.',
  MerchandisedInTray: true,
  IxOneCertificationLevel: 'IX-STANDARD',
  ContainerAndMaterialTypes: 'PLASTIC - OTHER',
  HasPanel: true,
  HasSupplementPanel: false,
  HasAminoAcidPanel: false,
  HasNutritionPanel: true,
  ImperialSize: 2.29,
  ImperialUOM: 'OUNCE',
  MetricSize: 65,
  MetricUOM: 'GRAM',
  IxOneCoreDate: '2021-01-05T09:00:35.64',
  BrickCode: '10000302',
  BrickCodeDescription:
    'DOUGH BASED PRODUCTS / MEALS - NOT READY TO EAT - SAVOURY (SHELF STABLE)',
  MemberRenewalValidated: true,
  MemberRenewalValidatedDate: '2024-02-27T00:00:00',
};

const compare = () => {
  try {
    return compareWithTDC({
      tdcFormattedExtractData: {
        ProductDescription: 'STIR FRIED RICE-NOODLE YAKI BE-FUN',
        BrandName: 'KENMIN FOODS',
        PrimarySize: '2.29',
        PrimarySizeUOM: 'OUNCE',
        PrimarySizeText: '2.29 OUNCE',
        SecondarySize: '65',
        SecondarySizeUOM: 'GRAM',
        NutritionPanel: [
          {
            Property: [
              {
                PropertyName: 'PANEL LABEL',
                PropertySource: 'NUTRITION FACTS',
                Amount: '',
                AmountUOM: '',
              },
              {
                PropertyName: 'PRIMARY SERVING SIZE',
                PropertySource: '',
                Amount: '1 pack (65g)',
                AmountUOM: '',
              },
              {
                PropertyName: 'CALORIES',
                PropertySource: '',
                AnalyticalValue: '230',
                Amount: '230',
                AmountUOM: '',
              },
              {
                PropertyName: 'TOTAL FAT',
                PropertySource: '',
                AnalyticalValue: 1,
                Amount: 1,
                AmountUOM: 'GRAM',
                Percent: '1',
              },
              {
                PropertyName: 'SATURATED FAT',
                PropertySource: '',
                AnalyticalValue: 0.5,
                Amount: 0.5,
                AmountUOM: 'GRAM',
                Percent: '3',
              },
              {
                PropertyName: 'TRANS FAT',
                PropertySource: '',
                AnalyticalValue: 0,
                Amount: 0,
                AmountUOM: 'GRAM',
              },
              {
                PropertyName: 'CHOLESTEROL',
                PropertySource: '',
                AnalyticalValue: 0,
                Amount: 0,
                AmountUOM: 'MILLIGRAM',
                Percent: '0',
              },
              {
                PropertyName: 'SODIUM',
                PropertySource: '',
                AnalyticalValue: 1190,
                Amount: 1190,
                AmountUOM: 'MILLIGRAM',
                Percent: '52',
              },
              {
                PropertyName: 'TOTAL CARBOHYDRATE',
                PropertySource: '',
                AnalyticalValue: 51,
                Amount: 51,
                AmountUOM: 'GRAM',
                Percent: '19',
              },
              {
                PropertyName: 'DIETARY FIBER',
                PropertySource: '',
                AnalyticalValue: 1,
                Amount: 1,
                AmountUOM: 'GRAM',
                Percent: '4',
              },
              {
                PropertyName: 'TOTAL SUGARS',
                PropertySource: '',
                AnalyticalValue: 0,
                Amount: 0,
                AmountUOM: 'GRAM',
              },
              {
                PropertyName: 'ADDED SUGARS',
                PropertySource: '',
                AnalyticalValue: 0,
                Amount: 0,
                AmountUOM: 'GRAM',
                Percent: '0',
              },
              {
                PropertyName: 'PROTEIN',
                PropertySource: '',
                AnalyticalValue: 4,
                Amount: 4,
                AmountUOM: 'GRAM',
              },
              {
                PropertyName: 'VITAMIN D',
                PropertySource: '',
                AnalyticalValue: 0,
                Amount: 0,
                AmountUOM: 'MICROGRAM',
                Percent: '0',
              },
              {
                PropertyName: 'CALCIUM',
                PropertySource: '',
                AnalyticalValue: 20,
                Amount: 20,
                AmountUOM: 'MILLIGRAM',
                Percent: '2',
              },
              {
                PropertyName: 'IRON',
                PropertySource: '',
                AnalyticalValue: 1,
                Amount: 1,
                AmountUOM: 'MILLIGRAM',
                Percent: '6',
              },
              {
                PropertyName: 'POTASSIUM',
                PropertySource: '',
                AnalyticalValue: 120,
                Amount: 120,
                AmountUOM: 'MILLIGRAM',
                Percent: '2',
              },
            ],
          },
        ],
        SupplementPanel: null,
        ManufacturerNamePackaging: 'KENMIN FOODS CO., LTD.',
        ManufacturerCityPackaging: '',
        ManufacturerPhoneNumberPackaging: '',
        ManufacturerStatePackaging: '',
        ManufacturerStreetPackaging: '',
        ManufacturerZipCodePackaging: '',
        CountryOfOriginName: 'THAILAND',
        UsageInstructions: '',
        Allergens: ['SOYBEANS', 'SULFITES', 'FISH', 'TREE NUTS'],
        FreeOf: [''],
        AllergensAncillary: [
          'CONTAINS: SOYBEANS, SULFITES, FISH AND TREE NUTS (COCONUT)',
        ],
        ProcessedOnEquipment: '',
        ProcessedManufacturedInFacilityStatement: '',
        UPC12: '50009312013',
        Website: ['HTTP://WWW.KENMIN.CO.JP'],
        QRCode: 'false',
        Process: ['not fried'],
      },
      tdcData: {
        NutritionPanel: [
          {
            Property: [
              {
                PropertyName: 'SODIUM',
                PropertySource: '',
                AnalyticalValue: 1190,
                Amount: '1190',
                AmountUOM: 'MILLIGRAM',
                Percent: 52,
              },
              {
                PropertyName: 'POTASSIUM',
                PropertySource: '',
                AnalyticalValue: 120,
                Amount: '120',
                AmountUOM: 'MILLIGRAM',
                Percent: 2,
              },
              {
                PropertyName: 'VITAMIN D',
                PropertySource: '',
                AnalyticalValue: 0,
                Amount: '0',
                AmountUOM: 'MICROGRAM',
                Percent: 0,
              },
              {
                PropertyName: 'IRON',
                PropertySource: '',
                AnalyticalValue: 1,
                Amount: '1',
                AmountUOM: 'MILLIGRAM',
                Percent: 6,
              },
              {
                PropertyName: 'TRANS FAT',
                PropertySource: '',
                AnalyticalValue: 0,
                Amount: '0',
                AmountUOM: 'GRAM',
              },
              {
                PropertyName: 'DIETARY FIBER',
                PropertySource: '',
                AnalyticalValue: 1,
                Amount: '1',
                AmountUOM: 'GRAM',
                Percent: 4,
              },
              {
                PropertyName: 'PRIMARY SERVING SIZE',
                PropertySource: '',
                Amount: '1 PACK (65G)',
                AmountUOM: '',
              },
              {
                PropertyName: 'PROTEIN',
                PropertySource: '',
                AnalyticalValue: 4,
                Amount: '4',
                AmountUOM: 'GRAM',
              },
              {
                PropertyName: 'TOTAL FAT',
                PropertySource: '',
                AnalyticalValue: 1,
                Amount: '1',
                AmountUOM: 'GRAM',
                Percent: 1,
              },
              {
                PropertyName: 'ADDED SUGAR',
                PropertySource: '',
                AnalyticalValue: 0,
                Amount: '0',
                AmountUOM: 'GRAM',
                Percent: 0,
              },
              {
                PropertyName: 'CALCIUM',
                PropertySource: '',
                AnalyticalValue: 20,
                Amount: '20',
                AmountUOM: 'MILLIGRAM',
                Percent: 2,
              },
              {
                PropertyName: 'CHOLESTEROL',
                PropertySource: '',
                AnalyticalValue: 0,
                Amount: '0',
                AmountUOM: 'MILLIGRAM',
                Percent: 0,
              },
              {
                PropertyName: 'DAILY VALUE STATEMENT',
                PropertySource:
                  '* THE % DAILY VALUE (DV) TELLS YOU HOW MUCH A NUTRIENT IN A SERVING OF FOOD CONTRIBUTES TO A DAILY DIET. 2,000 CALORIES A DAY IS USED FOR GENERAL NUTRITION ADVICE.',
                Amount: '',
                AmountUOM: '',
              },
              {
                PropertyName: 'PANEL LABEL',
                PropertySource: 'NUTRITION FACTS',
                Amount: '',
                AmountUOM: '',
              },
              {
                PropertyName: 'TOTAL SUGARS',
                PropertySource: '',
                AnalyticalValue: 0,
                Amount: '0',
                AmountUOM: 'GRAM',
              },
              {
                PropertyName: 'CALORIES',
                PropertySource: '',
                AnalyticalValue: 230,
                Amount: '230',
                AmountUOM: '',
              },
              {
                PropertyName: 'TOTAL CARBOHYDRATES',
                PropertySource: '',
                AnalyticalValue: 51,
                Amount: '51',
                AmountUOM: 'GRAM',
                Percent: 19,
              },
              {
                PropertyName: 'SATURATED FAT',
                PropertySource: '',
                AnalyticalValue: 0.5,
                Amount: '0.5',
                AmountUOM: 'GRAM',
                Percent: 3,
              },
            ],
          },
        ],
        BrandName: 'KENMIN',
        IXOneId: 'SNL564100',
        Status: 'ACTIVE',
        ProductType: 'STANDARD',
        Allergens: ['FISH', 'SOY / SOYBEANS', 'TREE NUTS'],
        AllergensAncillary: [
          'CONTAINS: SOYBEANS, SULFITES, FISH AND TREE NUTS (COCONUT)',
        ],
        Contains: ['SULFITES / SULPHITES'],
        GlutenFreeYN: true,
        GlutenFreeCertifier: ['GLUTEN FREE CERTIFICATION ORGANIZATION'],
        InProduction: true,
        ManufacturerNameHeader: 'JFC INTERNATIONAL, INC.',
        PrimarySize: 2.29,
        PrimarySizeText: '2.29 OUNCE 65.00 GRAM',
        PrimarySizeUOM: 'OUNCE',
        ProductDescription: 'NOODLES STIR FRIED',
        SecondarySize: 65,
        SecondarySizeUOM: 'GRAM',
        ServingSuggestionPresent: true,
        IngredientBreakout: [
          'RICE',
          'STARCH',
          'TAPIOCA',
          'POTATO',
          'CORN',
          'SOY SAUCE',
          'WATER',
          'SOYBEANS',
          'SALT',
          'KELP EXTRACT',
          'MONOSODIUM GLUTAMATE',
          'FISH EXTRACT',
          'MALTODEXTRIN',
          'BONITO EXTRACT',
          'FISH EXTRACT POWDER',
          'EASTERN LITTLE TUNA',
          'FRIGATE MACKEREL',
          'LONGTAIL TUNA',
          'YEAST EXTRACT',
          'SUGAR',
          'GINGER PASTE',
          'MONO-AND DIGLYCERIDES OF FATTY ACIDS',
          'SODIUM METAPHOSPHATE',
          'SODIUM TRIPOLYPHOSPHATE',
          'TETRASODIUM PYROPHOSPHATE',
          'CARBOXYMETHYL CELLULOSE',
          'GARLIC POWDER',
          'ONION POWDER',
          "DISODIUM 5'-RIBONUCLEOTIDE",
          'CARAMEL COLOR',
          'PEPPER',
          'SUCROSE ESTERS OF FATTY ACIDS',
          'COLOR',
          'RIBOFLAVIN',
          'ROSEMARY EXTRACT',
        ],
        IngredientsStatement: [
          "RICE, STARCH(TAPIOCA, POTATO, CORN), SOY SAUCE(WATER, SOYBEANS, RICE,SALT), SALT, KELP EXTRACT, MONOSODIUM GLUTAMATE, FISH EXTRACT(MALTODEXTRIN, BONITO EXTRACT, SALT, FISH EXTRACT POWDER(EASTERN LITTLE TUNA, FRIGATE MACKEREL, LONGTAIL TUNA), YEAST EXTRACT), SUGAR, GINGER PASTE, MONO-AND DIGLYCERIDES OF FATTY ACIDS, SODIUM METAPHOSPHATE, SODIUM TRIPOLYPHOSPHATE, TETRASODIUM PYROPHOSPHATE, CARBOXYMETHYL CELLULOSE, GARLIC POWDER, ONION POWDER, DISODIUM 5'-RIBONUCLEOTIDE, CARAMEL COLOR, YEAST EXTRACT, PEPPER, SUCROSE ESTERS OF FATTY ACIDS, COLOR(RIBOFLAVIN), ROSEMARY EXTRACT.",
        ],
        MarketingClaims: [
          '230KCAL SEASONED & NON-FRIED RICE NOODLE',
          'JAPANESE DASHI SOUP STOCK & SOY SAUCE FLAVOR',
          'MICROWAVABLE 3 MINUTES WITH PAN',
          'NO.1 RICE-NOODLE RICE-NOODLE, BUN, PHO, SEN MEE, KWAY TEOW, MEE HOON, BIHUN, MIHUN, BIHON, BIJON ETC) IS EVERY POPULAR FOOD IN ASIAN COUNTRIES. KENMIN YAKI BE-FUN IS NO.1 SELLING STIR FRIED RICE-NOODLE IN JAPAN. IT IS ALREADY SEASONED WITH JAPANESE DASHI(SOUP STOCK WITH BONITO AND KELP) AND SOY SAUCE, SO NO MORE SEASONINGS ARE REQUIRED. ENJOY EASY AND TASTY STIR FRIED RICE-NOODLE WITH LOTS OF VEGETABLES!',
          'STIR FRIED RICE-NOODLE',
          'YAKI BE-FUN™',
        ],
        Website: ['HTTP://WWW.KENMIN.CO.JP'],
        Cube: 0.033,
        Depth: 1.5,
        Height: 6.9,
        UPC10: '5000931201',
        UPC11: '85000931201',
        UPC12: '850009312013',
        UPC13: '0085000931201',
        Weight: 0.165,
        Width: 5.5,
        CodeDateExample: '10.16.2020',
        CodeDateFormula: 'MM.DD.YYYY',
        CodeDatePosition: 'BACK OF UNIT',
        CodeDateStamp: 'OPEN',
        CodeDateType: 'EXPIRES',
        ContainerType: 'BAG',
        CountryOfOriginName: ['THAILAND'],
        CountryOfOriginText: ['PRODUCT OF THAILAND'],
        ImportedBy: 'IMPORTED BY: JFC INTERNATIONAL INC. LOS ANGELES, CA 90040',
        ManufacturerNamePackaging: 'KENMIN FOODS CO., LTD.',
        MerchandisedInTray: true,
        IxOneCertificationLevel: 'IX-STANDARD',
        ContainerAndMaterialTypes: 'PLASTIC - OTHER',
        HasPanel: true,
        HasSupplementPanel: false,
        HasAminoAcidPanel: false,
        HasNutritionPanel: true,
        ImperialSize: 2.29,
        ImperialUOM: 'OUNCE',
        MetricSize: 65,
        MetricUOM: 'GRAM',
        IxOneCoreDate: '2021-01-05T09:00:35.64',
        BrickCode: '10000302',
        BrickCodeDescription:
          'DOUGH BASED PRODUCTS / MEALS - NOT READY TO EAT - SAVOURY (SHELF STABLE)',
        MemberRenewalValidated: true,
        MemberRenewalValidatedDate: '2024-02-27T00:00:00',
      },
      // tdcFormattedExtractData: mappedData,
      // tdcData: productTdcData,
    });
  } catch (e) {
    console.log(e, e);
    return {};
  }
};

let final = compare();

console.log('final', final);
