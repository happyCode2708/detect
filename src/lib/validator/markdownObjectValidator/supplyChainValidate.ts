import { toLower, toUpper } from 'lodash';

export const supplyChainValidate = async (modifiedProductDataPoints: any) => {
  await validateManufacturerState(modifiedProductDataPoints);
};

const validateManufacturerState = async (modifiedProductDataPoints: any) => {
  const manufacturerState =
    modifiedProductDataPoints?.supplyChain?.[0]?.manufacturerState;

  if (!manufacturerState) return;

  const upperAbbreviation = manufacturerState?.trim().toUpperCase();
  if (states[upperAbbreviation]) {
    modifiedProductDataPoints['supplyChain'][0]['validated_manufacturerState'] =
      states[upperAbbreviation];
  } else {
    modifiedProductDataPoints['supplyChain'][0]['validated_manufacturerState'] =
      toUpper(manufacturerState);
  }
};

const states = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
} as any;
