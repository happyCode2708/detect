export const HeaderValidate = (response: any) => {
  let modifiedHeader = response?.['product']?.['header']?.[0];

  if (!modifiedHeader) return;

  validatePrimarySize(modifiedHeader);
  validateSecondarySize(modifiedHeader);
  validateThirdSize(modifiedHeader);

  response['product']['header'][0] = modifiedHeader;
};

const sizeMap = {
  g: 'GRAM',
  mg: 'MILLIGRAM',
  kg: 'KILOGRAM',
  mcg: 'MICROGRAM',
  oz: 'OUNCE',
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

const validatePrimarySize = (modifiedHeader: any) => {
  const { primarySize: rawPrimarySize } = modifiedHeader;

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

    modifiedHeader['primarySizeValue'] = sizeValue;
    modifiedHeader['primarySizeText'] = primarySizeText;
    modifiedHeader['primarySizeUOM'] = fullUnit;

    return;
  }

  modifiedHeader['primarySizeValue'] = null;
  modifiedHeader['primarySizeText'] = rawPrimarySize;
  modifiedHeader['primarySizeUOM'] = null;
};

const validateSecondarySize = (modifiedHeader: any) => {
  const { secondarySize: rawSecondarySize } = modifiedHeader;

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

    modifiedHeader['secondarySizeValue'] = sizeValue;
    modifiedHeader['secondarySizeText'] = primarySizeText;
    modifiedHeader['secondarySizeUOM'] = fullUnit;

    return;
  }

  modifiedHeader['secondarySizeValue'] = null;
  modifiedHeader['secondarySizeText'] = rawSecondarySize;
  modifiedHeader['secondarySizeUOM'] = null;
};

const validateThirdSize = (modifiedHeader: any) => {
  const { thirdSize: rawThirdSize } = modifiedHeader;

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

    modifiedHeader['thirdSizeValue'] = sizeValue;
    modifiedHeader['thirdSizeText'] = primarySizeText;
    modifiedHeader['thirdSizeUOM'] = fullUnit;

    return;
  }

  modifiedHeader['thirdSizeValue'] = null;
  modifiedHeader['thirdSizeText'] = rawThirdSize;
  modifiedHeader['thirdSizeUOM'] = null;
};
