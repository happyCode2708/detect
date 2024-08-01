export const headerValidate = async (modifiedProductDataPoints: any) => {
  let modifiedHeader = modifiedProductDataPoints?.['header'];

  if (!modifiedHeader) return;

  modifiedProductDataPoints['validated_header'] = {};

  validatePrimarySize(modifiedProductDataPoints);
  validateSecondarySize(modifiedProductDataPoints);
  validateThirdSize(modifiedProductDataPoints);
  validatePrimarySizeText(modifiedProductDataPoints);
  validateOthers(modifiedProductDataPoints);
};

const sizeMap = {
  g: 'GRAM',
  mg: 'MILLIGRAM',
  kg: 'KILOGRAM',
  mcg: 'MICROGRAM',
  oz: 'OUNCE',
  '0z': 'OUNCE',
  lb: 'POUND',
  ml: 'MILLILITER',
  l: 'LITER',
  tsp: 'TEASPOON',
  tbsp: 'TABLESPOON',
  cup: 'CUP',
  pint: 'PINT',
  pt: 'PINT',
  quart: 'QUART',
  gallon: 'GALLON',
  'fl oz': 'FLUID OUNCE',
  'fl.oz': 'FLUID OUNCE',
  'fl. oz': 'FLUID OUNCE',
  capsules: 'COUNT',
  caps: 'COUNT',
} as any;

const validatePrimarySize = (modifiedProductDataPoints: any) => {
  const { 'primary size': rawPrimarySize } =
    modifiedProductDataPoints?.['header']?.['product size'];

  if (!rawPrimarySize) return;

  const regex = /([\d.]+)\s*([a-zA-Z\s.]+)/;
  const match = rawPrimarySize.match(regex);

  if (match) {
    const sizeValue = parseFloat(match[1]);
    const sizeUnit = match[2].trim().toLowerCase().replace(/\./g, '');

    const fullUnit = sizeMap[sizeUnit] || sizeUnit.toUpperCase();

    // Replace the short form in the text with the full form
    const primarySizeText = rawPrimarySize.replace(
      new RegExp(sizeUnit, 'i'),
      fullUnit
    );

    modifiedProductDataPoints['validated_header']['primarySizeValue'] =
      sizeValue;
    modifiedProductDataPoints['validated_header']['primarySizeText'] =
      primarySizeText;
    modifiedProductDataPoints['validated_header']['primarySizeUOM'] = fullUnit;

    return;
  }

  modifiedProductDataPoints['validated_header']['primarySizeValue'] = null;
  modifiedProductDataPoints['validated_header']['primarySizeText'] =
    rawPrimarySize;
  modifiedProductDataPoints['validated_header']['primarySizeUOM'] = null;
};

const validateSecondarySize = (modifiedProductDataPoints: any) => {
  const { 'secondary size': rawSecondarySize } =
    modifiedProductDataPoints?.['header']?.['product size'];

  if (!rawSecondarySize) return;

  const regex = /([\d.]+)\s*([a-zA-Z\s.]+)/;
  const match = rawSecondarySize.match(regex);

  if (match) {
    const sizeValue = parseFloat(match[1]);
    const sizeUnit = match[2].trim().toLowerCase().replace(/\./g, '');

    const fullUnit = sizeMap[sizeUnit] || sizeUnit.toUpperCase();

    // Replace the short form in the text with the full form
    const primarySizeText = rawSecondarySize.replace(
      new RegExp(sizeUnit, 'i'),
      fullUnit
    );

    modifiedProductDataPoints['validated_header']['secondarySizeValue'] =
      sizeValue;
    modifiedProductDataPoints['validated_header']['secondarySizeText'] =
      primarySizeText;
    modifiedProductDataPoints['validated_header']['secondarySizeUOM'] =
      fullUnit;

    return;
  }

  modifiedProductDataPoints['validated_header']['secondarySizeValue'] = null;
  modifiedProductDataPoints['validated_header']['secondarySizeText'] =
    rawSecondarySize;
  modifiedProductDataPoints['validated_header']['secondarySizeUOM'] = null;
};

const validateThirdSize = (modifiedProductDataPoints: any) => {
  const { 'third size': rawThirdSize } =
    modifiedProductDataPoints?.['header']?.['product size'];

  if (!rawThirdSize) return;

  const regex = /([\d.]+)\s*([a-zA-Z\s.]+)/;
  const match = rawThirdSize.match(regex);

  if (match) {
    const sizeValue = parseFloat(match[1]);
    const sizeUnit = match[2].trim().toLowerCase().replace(/\./g, '');

    const fullUnit = sizeMap[sizeUnit] || sizeUnit.toUpperCase();

    // Replace the short form in the text with the full form
    const primarySizeText = rawThirdSize.replace(
      new RegExp(sizeUnit, 'i'),
      fullUnit
    );

    modifiedProductDataPoints['validated_header']['thirdSizeValue'] = sizeValue;
    modifiedProductDataPoints['validated_header']['thirdSizeText'] =
      primarySizeText;
    modifiedProductDataPoints['validated_header']['thirdSizeUOM'] = fullUnit;

    return;
  }

  modifiedProductDataPoints['validated_header']['thirdSizeValue'] = null;
  modifiedProductDataPoints['validated_header']['thirdSizeText'] = rawThirdSize;
  modifiedProductDataPoints['validated_header']['thirdSizeUOM'] = null;
};

const validatePrimarySizeText = (modifiedProductDataPoints: any) => {
  modifiedProductDataPoints['validated_header']['fullSizeStatement'] =
    modifiedProductDataPoints?.['header']?.['product size'][
      'full statement about product size'
    ];
};

const validateOthers = (modifiedProductDataPoints: any) => {
  modifiedProductDataPoints['validated_header']['brandName'] =
    modifiedProductDataPoints?.['header']?.['product info']?.['brand name'];

  modifiedProductDataPoints['validated_header']['productName'] =
    modifiedProductDataPoints?.['header']?.['product info']?.['product name'];

  modifiedProductDataPoints['validated_header']['count'] =
    modifiedProductDataPoints?.['header']?.['product size']?.['count'];

  modifiedProductDataPoints['validated_header']['countUom'] =
    modifiedProductDataPoints?.['header']?.['product size']?.['count uom'];
};
