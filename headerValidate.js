const HeaderValidate = (response) => {
  let modifiedHeader = response['product']['header'] || {};
  validatePrimarySize(modifiedHeader);

  response['product']['header'] = modifiedHeader;
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
  quart: 'QUART',
  gallon: 'GALLON',
  'fl oz': 'FLUID OUNCE',
  'fl.oz': 'FLUID OUNCE',
  'fl. oz': 'FLUID OUNCE',
};

const validatePrimarySize = (modifiedHeader) => {
  const { primarySize: rawPrimarySize } = modifiedHeader;

  if (!rawPrimarySize) return;

  const regex = /([\d.]+)\s*([a-zA-Z\s.]+)/;
  const match = rawPrimarySize.match(regex);

  if (match) {
    const sizeValue = parseFloat(match[1]);
    const sizeUnit = match[2].trim().toLowerCase().replace(/\./g, '');

    const fullUnit = sizeMap[sizeUnit] || sizeUnit.toUpperCase();

    modifiedHeader['primarySizeValue'] = sizeValue;
    modifiedHeader['primarySizeText'] = rawPrimarySize.toUpperCase();
    modifiedHeader['primarySizeUOM'] = fullUnit;

    return;
  }

  modifiedHeader['primarySizeValue'] = null;
  modifiedHeader['primarySizeText'] = rawPrimarySize.toUpperCase();
  modifiedHeader['primarySizeUOM'] = null;
};

let response = {
  product: {
    header: {
      primarySize: '2.29 OZ',
    },
  },
};

HeaderValidate(response);

console.log(JSON.stringify(response));
