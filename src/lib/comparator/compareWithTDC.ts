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
  const compareResultFactPanel = compareFactPanel(
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

const compareFactPanel = (obj1: any, obj2: any) => {
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
          const value = `${propertyItem[key]}`;
          const sameValue = `${samePropertyOnExtractData[key]}`;

          if (
            (value === '' && sameValue === '') ||
            (value === '0' && sameValue === '0')
          ) {
            comparisonResult[key] = '100';
          } else {
            comparisonResult[key] = `${getMatchPercent({
              v1:
                typeof propertyItem[key] !== 'string'
                  ? JSON.stringify(propertyItem[key])
                  : propertyItem[key],
              v2:
                typeof samePropertyOnExtractData[key] !== 'string'
                  ? JSON.stringify(samePropertyOnExtractData[key])
                  : samePropertyOnExtractData[key],
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
  const comparisonResult = {} as any;

  for (const key of Object.keys(obj2)) {
    if (obj1.hasOwnProperty(key)) {
      if (`${obj1[key]}` === `${obj2[key]}`) {
        comparisonResult[key] = '100';
      } else if (obj1[key] === undefined && obj2[key] !== undefined) {
        comparisonResult[key] = '0';
      } else {
        comparisonResult[key] = `${getMatchPercent({
          v1:
            typeof obj1[key] !== 'string'
              ? JSON.stringify(obj1[key])
              : obj1[key],
          v2:
            typeof obj2[key] !== 'string'
              ? JSON.stringify(obj2[key])
              : obj2[key],
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
};
