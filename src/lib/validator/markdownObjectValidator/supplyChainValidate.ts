import { isValueEmpty } from '../../../lib/mapper/checkValueEmpty';
import { trimPeriodsAndCommas } from '../../../lib/utils/string';
import { toLower, toUpper } from 'lodash';

export const supplyChainValidate = async (modifiedProductDataPoints: any) => {
  if (!modifiedProductDataPoints?.['supplyChain']) return;

  modifiedProductDataPoints['validated_supplyChain'] = {};

  // await validateManufacturerState(modifiedProductDataPoints);
  await validateAddress(modifiedProductDataPoints);
  await validateCountryOfOrigin(modifiedProductDataPoints);
  await validateOtherFields(modifiedProductDataPoints);
};

const validateAddress = async (modifiedProductDataPoints: any) => {
  const addresses =
    modifiedProductDataPoints?.['supplyChain']?.[
      'address and phone number info'
    ];

  addresses?.forEach((addressItem: any) => {
    const fullAddressStatement = addressItem?.['full address statement'];
    const companyName = addressItem?.['company name'];
    const streetNumber = addressItem?.['street number'];
    const streetName = addressItem?.['street name'];
    const city = addressItem?.['city'];
    const state = addressItem?.['state'];
    const zipCode = addressItem?.['zipCode'];
    const phoneNumber = addressItem?.['phone number'];
    const addressType = addressItem?.['address type'];
    const prefixAddress = addressItem?.['prefix address'];

    const isDistributor = DISTRIBUTED_BY_PHRASE?.find((phrase: any) =>
      toLower(fullAddressStatement)?.includes(phrase)
    );

    const isManufacturer = MANUFACTURED_BY_PHRASE?.find((phrase: any) =>
      toLower(fullAddressStatement)?.includes(phrase)
    );

    if (
      (addressType === 'manufacturer' ||
        addressType === 'other' ||
        isManufacturer) &&
      !isDistributor
    ) {
      if (state) {
        validateManufacturerState(modifiedProductDataPoints, state);
      }

      modifiedProductDataPoints['validated_supplyChain'] = {
        ...modifiedProductDataPoints['validated_supplyChain'],
        manufacturerName: companyName,
        manufacturerPhoneNumber: phoneNumber,
        manufacturerStreetNumber: streetNumber,
        manufacturerStreetAddress: streetName,
        manufacturerCity: city,
        manufactureZipCode: zipCode,
      };
    }

    if ((addressType === 'distributor' || isDistributor) && !isManufacturer) {
      const isFullAddressStatementContainPrefix = toLower(
        fullAddressStatement
      )?.includes(toLower(prefixAddress));

      modifiedProductDataPoints['validated_supplyChain']['distributedByText'] =
        isFullAddressStatementContainPrefix
          ? fullAddressStatement
          : `${prefixAddress} ${fullAddressStatement}`;
    }
  });
};

const validateManufacturerState = async (
  modifiedProductDataPoints: any,
  stateValue: string
) => {
  const manufacturerState = stateValue;
  // modifiedProductDataPoints?.['supplyChain']?.['manufacturer address info']?.[
  //   'manufacture state'
  // ];

  if (isValueEmpty(manufacturerState)) return;

  const upperAbbreviation = toUpper(manufacturerState?.trim());

  if (states[upperAbbreviation]) {
    modifiedProductDataPoints['validated_supplyChain']['manufacturerState'] =
      states[upperAbbreviation];
  } else {
    modifiedProductDataPoints['validated_supplyChain']['manufacturerState'] =
      toUpper(manufacturerState);
  }
};

// const validateManufacturerState = async (modifiedProductDataPoints: any) => {
//   const manufacturerState =
//     modifiedProductDataPoints?.['supplyChain']?.['manufacturer address info']?.[
//       'manufacture state'
//     ];

//   if (isValueEmpty(manufacturerState)) return;

//   const upperAbbreviation = toUpper(manufacturerState?.trim());

//   if (states[upperAbbreviation]) {
//     modifiedProductDataPoints['validated_supplyChain']['manufacturerState'] =
//       states[upperAbbreviation];
//   } else {
//     modifiedProductDataPoints['validated_supplyChain']['manufacturerState'] =
//       toUpper(manufacturerState);
//   }
// };suppl

const validateCountryOfOrigin = async (modifiedProductDataPoints: any) => {
  const countryOfOriginList =
    modifiedProductDataPoints?.['supplyChain']?.['country info']?.[
      'country of origin from made in statement'
    ];

  const validated_countryOfOriginList = [] as string[];

  countryOfOriginList?.forEach((countryOfOriginRaw: string) => {
    const countryOfOrigin = trimPeriodsAndCommas(countryOfOriginRaw);

    if (isValueEmpty(countryOfOrigin)) return;

    const upperName = countryOfOrigin?.toUpperCase() as string;

    if (COUNTRY_SHORT_NAMES?.[upperName]) {
      validated_countryOfOriginList.push(
        toUpper(COUNTRY_SHORT_NAMES[upperName])
      );
    } else {
      validated_countryOfOriginList.push(upperName);
    }
  });

  if (validated_countryOfOriginList?.length > 0) {
    modifiedProductDataPoints['validated_supplyChain']['countryOfOrigin'] =
      validated_countryOfOriginList;
  }
};

const validateOtherFields = async (modifiedProductDataPoints: any) => {
  const supplyChainData = modifiedProductDataPoints?.['supplyChain'];

  const otherFields = {
    countryOfOriginText:
      supplyChainData?.['country info']?.[
        'statement indicate from which nation product was made in'
      ],
  };

  Object.entries(otherFields)?.forEach(([fieldName, value]) => {
    if (isValueEmpty(value)) {
      return;
    }
    modifiedProductDataPoints['validated_supplyChain'][fieldName] = value;
  });
};

const DISTRIBUTED_BY_PHRASE = [
  'distributed by',
  'distributor',
  'manufacture for',
  'dist. by',
  'dist . by',
];
const MANUFACTURED_BY_PHRASE = [
  'manufactured by',
  'manufacturer',
  'manufacturing by',
];

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
  QC: 'Quebec',
} as any;

const COUNTRY_SHORT_NAMES = {
  AF: 'Afghanistan',
  AL: 'Albania',
  DZ: 'Algeria',
  AD: 'Andorra',
  AO: 'Angola',
  AG: 'Antigua and Barbuda',
  AR: 'Argentina',
  AM: 'Armenia',
  AU: 'Australia',
  AT: 'Austria',
  AZ: 'Azerbaijan',
  BS: 'Bahamas',
  BH: 'Bahrain',
  BD: 'Bangladesh',
  BB: 'Barbados',
  BY: 'Belarus',
  BE: 'Belgium',
  BZ: 'Belize',
  BJ: 'Benin',
  BT: 'Bhutan',
  BO: 'Bolivia',
  BA: 'Bosnia and Herzegovina',
  BW: 'Botswana',
  BR: 'Brazil',
  BN: 'Brunei',
  BG: 'Bulgaria',
  BF: 'Burkina Faso',
  BI: 'Burundi',
  CV: 'Cabo Verde',
  KH: 'Cambodia',
  CM: 'Cameroon',
  CA: 'Canada',
  CF: 'Central African Republic',
  TD: 'Chad',
  CL: 'Chile',
  CN: 'China',
  CO: 'Colombia',
  KM: 'Comoros',
  CG: 'Congo',
  CR: 'Costa Rica',
  HR: 'Croatia',
  CU: 'Cuba',
  CY: 'Cyprus',
  CZ: 'Czechia',
  CD: 'Democratic Republic of the Congo',
  DK: 'Denmark',
  DJ: 'Djibouti',
  DM: 'Dominica',
  DO: 'Dominican Republic',
  EC: 'Ecuador',
  EG: 'Egypt',
  SV: 'El Salvador',
  GQ: 'Equatorial Guinea',
  ER: 'Eritrea',
  EE: 'Estonia',
  SZ: 'Eswatini',
  ET: 'Ethiopia',
  FJ: 'Fiji',
  FI: 'Finland',
  FR: 'France',
  GA: 'Gabon',
  GM: 'Gambia',
  GE: 'Georgia',
  DE: 'Germany',
  GH: 'Ghana',
  GR: 'Greece',
  GD: 'Grenada',
  GT: 'Guatemala',
  GN: 'Guinea',
  GW: 'Guinea-Bissau',
  GY: 'Guyana',
  HT: 'Haiti',
  HN: 'Honduras',
  HU: 'Hungary',
  IS: 'Iceland',
  IN: 'India',
  ID: 'Indonesia',
  IR: 'Iran',
  IQ: 'Iraq',
  IE: 'Ireland',
  IL: 'Israel',
  IT: 'Italy',
  JM: 'Jamaica',
  JP: 'Japan',
  JO: 'Jordan',
  KZ: 'Kazakhstan',
  KE: 'Kenya',
  KI: 'Kiribati',
  KP: 'North Korea',
  KR: 'South Korea',
  KW: 'Kuwait',
  KG: 'Kyrgyzstan',
  LA: 'Laos',
  LV: 'Latvia',
  LB: 'Lebanon',
  LS: 'Lesotho',
  LR: 'Liberia',
  LY: 'Libya',
  LI: 'Liechtenstein',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  MG: 'Madagascar',
  MW: 'Malawi',
  MY: 'Malaysia',
  MV: 'Maldives',
  ML: 'Mali',
  MT: 'Malta',
  MH: 'Marshall Islands',
  MR: 'Mauritania',
  MU: 'Mauritius',
  MX: 'Mexico',
  FM: 'Micronesia',
  MD: 'Moldova',
  MC: 'Monaco',
  MN: 'Mongolia',
  ME: 'Montenegro',
  MA: 'Morocco',
  MZ: 'Mozambique',
  MM: 'Myanmar',
  NA: 'Namibia',
  NR: 'Nauru',
  NP: 'Nepal',
  NL: 'Netherlands',
  NZ: 'New Zealand',
  NI: 'Nicaragua',
  NE: 'Niger',
  NG: 'Nigeria',
  MK: 'North Macedonia',
  NO: 'Norway',
  OM: 'Oman',
  PK: 'Pakistan',
  PW: 'Palau',
  PS: 'Palestine',
  PA: 'Panama',
  PG: 'Papua New Guinea',
  PY: 'Paraguay',
  PE: 'Peru',
  PH: 'Philippines',
  PL: 'Poland',
  PT: 'Portugal',
  QA: 'Qatar',
  RO: 'Romania',
  RU: 'Russia',
  RW: 'Rwanda',
  KN: 'Saint Kitts and Nevis',
  LC: 'Saint Lucia',
  VC: 'Saint Vincent and the Grenadines',
  WS: 'Samoa',
  SM: 'San Marino',
  ST: 'Sao Tome and Principe',
  SA: 'Saudi Arabia',
  SN: 'Senegal',
  RS: 'Serbia',
  SC: 'Seychelles',
  SL: 'Sierra Leone',
  SG: 'Singapore',
  SK: 'Slovakia',
  SI: 'Slovenia',
  SB: 'Solomon Islands',
  SO: 'Somalia',
  ZA: 'South Africa',
  SS: 'South Sudan',
  ES: 'Spain',
  LK: 'Sri Lanka',
  SD: 'Sudan',
  SR: 'Suriname',
  SE: 'Sweden',
  CH: 'Switzerland',
  SY: 'Syria',
  TW: 'Taiwan',
  TJ: 'Tajikistan',
  TZ: 'Tanzania',
  TH: 'Thailand',
  TL: 'Timor-Leste',
  TG: 'Togo',
  TO: 'Tonga',
  TT: 'Trinidad and Tobago',
  TN: 'Tunisia',
  TR: 'Turkey',
  TM: 'Turkmenistan',
  TV: 'Tuvalu',
  UG: 'Uganda',
  UA: 'Ukraine',
  AE: 'United Arab Emirates',
  GB: 'United Kingdom',
  US: 'United States',
  USA: 'United States',
  'U.S.A': 'United States',
  UY: 'Uruguay',
  UZ: 'Uzbekistan',
  VU: 'Vanuatu',
  VE: 'Venezuela',
  VN: 'Vietnam',
  YE: 'Yemen',
  ZM: 'Zambia',
  ZW: 'Zimbabwe',
} as any;
