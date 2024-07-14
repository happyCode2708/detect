import { isEqual } from 'lodash';
import { getMatchPercent } from './utils';

export const compareWithTDC = ({
  tdcFormattedExtractData,
  tdcData,
}: {
  tdcFormattedExtractData: any;
  tdcData: any;
}) => {
  const comparisonResult = compareObjects(tdcFormattedExtractData, tdcData);
  // const compareResultFactPanel = compareFactPanelByOrder(
  //   tdcFormattedExtractData,
  //   tdcData
  // );

  const compareResultFactPanel = compareFactPanelByMostMatch(
    tdcFormattedExtractData,
    tdcData
  );

  return {
    ...comparisonResult,
    ...compareResultFactPanel,
    generalFactPanels:
      comparisonResult?.NutritionPanel || comparisonResult?.SupplementPanel,
  };
};

const compareFactPanelByOrder = (obj1: any, obj2: any) => {
  const {
    NutritionPanel: NutritionPanel_1,
    SupplementPanel: SupplementPanel_1,
  } = obj1;
  const {
    NutritionPanel: NutritionPanel_2,
    SupplementPanel: SupplementPanel_2,
  } = obj2;

  let factPanels = NutritionPanel_1 || SupplementPanel_1;
  let tdc_factPanels = NutritionPanel_2 || SupplementPanel_2;

  let panelType: any;

  if (SupplementPanel_2?.length > 0) {
    panelType = 'SupplementPanel';
  } else {
    panelType = 'NutritionPanel';
  }

  if (!factPanels) return {};

  let matchResult = {
    [panelType]: [],
  } as any;

  tdc_factPanels?.forEach((panelItem: any, idx: number) => {
    const panelPropertyList = panelItem?.Property || [];

    matchResult[panelType].push({ Property: [] });

    panelPropertyList.forEach((propertyItem: any) => {
      const propertyName = propertyItem?.PropertyName;
      let comparisonResult = { name: propertyName } as any;

      const samePropertyOnExtractData = factPanels?.[idx]?.Property?.find(
        (propertyItem: any) => propertyItem?.PropertyName === propertyName
      );

      for (const key of Object.keys(propertyItem)) {
        if (samePropertyOnExtractData?.hasOwnProperty(key)) {
          const value = propertyItem[key];
          const extractValue = samePropertyOnExtractData[key];
          const valueString =
            typeof value !== 'string' ? JSON.stringify(value) : value;
          const extractValueString =
            typeof extractValue === 'undefined'
              ? ''
              : typeof extractValue !== 'string'
              ? JSON.stringify(extractValue)
              : extractValue;

          console.log(
            `key -- ${key} -- ${valueString} -- ${extractValueString} `
          );

          if (
            (valueString === '' && extractValueString === '') ||
            (valueString === '0' && extractValueString === '0')
          ) {
            comparisonResult[key] = '100';
          } else {
            comparisonResult[key] = `${getMatchPercent({
              v1: valueString,
              v2: extractValueString,
            })}`;
          }
        }
      }

      matchResult[panelType][idx]['Property'].push(comparisonResult);
    });
  });

  return matchResult;
};

const compareObjects = (obj1: any, obj2: any) => {
  try {
    const comparisonResult = {} as any;

    for (const key of Object.keys(obj2)) {
      if (obj1.hasOwnProperty(key)) {
        const extractedDataObj = obj1;
        const tdcDataObj = obj2;

        const extractValue = extractedDataObj[key];
        const value = tdcDataObj[key];
        const valueString =
          typeof value !== 'string' ? JSON.stringify(value) : value;
        const extractValueString =
          typeof extractValue === 'undefined'
            ? ''
            : typeof extractValue !== 'string'
            ? JSON.stringify(extractValue)
            : extractValue;

        if (
          (valueString === '' && extractValueString === '') ||
          (valueString === '0' && extractValueString === '0')
        ) {
          comparisonResult[key] = '100';
        } else {
          comparisonResult[key] = `${getMatchPercent({
            v1: valueString,
            v2: extractValueString,
          })}`;
        }
      } else {
        // comparisonResult[key] = '';
      }
    }

    for (const key of Object.keys(obj1)) {
      if (!obj2.hasOwnProperty(key)) {
        if (obj1[key] === '' || obj1[key] === null) {
          break;
        }
        comparisonResult[key] = '0';
      }
    }

    return comparisonResult;
  } catch (e) {
    console.log('compare object error ---', e);
    // console.log(`error --- key---${key} -- ${obj1[key]} --- ${obj2[key]}`);

    return {};
  }
};

const compareFactPanelByMostMatch = (obj1: any, obj2: any) => {
  const {
    NutritionPanel: NutritionPanel_1,
    SupplementPanel: SupplementPanel_1,
  } = obj1;
  const {
    NutritionPanel: NutritionPanel_2,
    SupplementPanel: SupplementPanel_2,
  } = obj2;

  let factPanels = NutritionPanel_1 || SupplementPanel_1;
  let tdc_factPanels = NutritionPanel_2 || SupplementPanel_2;

  let panelType: any;

  if (SupplementPanel_2?.length > 0) {
    panelType = 'SupplementPanel';
  } else {
    panelType = 'NutritionPanel';
  }

  if (!factPanels) return {};

  let matchResult = {
    [panelType]: [],
  } as any;

  tdc_factPanels?.forEach((panelItem: any, idx: number) => {
    const panelPropertyList = panelItem?.Property || [];

    matchResult[panelType].push({ Property: [] });

    panelPropertyList.forEach((propertyItem: any) => {
      const propertyName = propertyItem?.PropertyName;
      let comparisonResult = { name: propertyName } as any;

      const samePropertyOnExtractData = factPanels?.[idx]?.Property?.find(
        (propertyItem: any) => {
          const matchPercent = getMatchPercent({
            v1: `${propertyItem?.PropertyName}`,
            v2: `${propertyName}`,
          });

          if (typeof matchPercent === 'string') {
            return false;
          }

          if (matchPercent > 85) {
            return true;
          }

          return false;
        }
      );

      for (const key of Object.keys(propertyItem)) {
        if (samePropertyOnExtractData?.hasOwnProperty(key)) {
          const value = propertyItem[key];
          const extractValue = samePropertyOnExtractData[key];
          const valueString =
            typeof value !== 'string' ? JSON.stringify(value) : value;
          const extractValueString =
            typeof extractValue === 'undefined'
              ? ''
              : typeof extractValue !== 'string'
              ? JSON.stringify(extractValue)
              : extractValue;

          console.log(
            `key -- ${key} -- ${valueString} -- ${extractValueString} `
          );

          if (
            (valueString === '' && extractValueString === '') ||
            (valueString === '0' && extractValueString === '0')
          ) {
            comparisonResult[key] = '100';
          } else {
            comparisonResult[key] = `${getMatchPercent({
              v1: valueString,
              v2: extractValueString,
            })}`;
          }
        }
      }

      matchResult[panelType][idx]['Property'].push(comparisonResult);
    });
  });

  return matchResult;
};
