import { metadata } from '@/app/layout';
import NutritionTable from '../table/NutritionTable';
import { CamelFieldStringRender, MetaInfo, SectionWrapper } from './common';

export const TableResultTDC = ({
  productTdcData,
  evaluation = {},
}: {
  productTdcData: any;
  evaluation?: any;
}) => {
  const { SupplementPanel, NutritionPanel, ...metaData } =
    (productTdcData as any) || {};

  const { HasSupplementPanel, HasNutritionPanel } = metaData;

  return (
    <>
      {productTdcData ? (
        <div className='p-4 border rounded-md flex-1 overflow-auto max-h-screen'>
          <CamelFieldStringRender
            objectValues={{ ...metaData, generalFactPanels: 'N/A' }}
            evaluations={process.env.NODE_ENV !== 'production' && evaluation}
          />

          {SupplementPanel?.length > 0 && (
            <div>
              {SupplementPanel?.map((panelData: any, idx: number) => {
                return (
                  <TdcNutPanelRender
                    propertyList={panelData?.Property}
                    title='Supplement Fact'
                    evaluation={evaluation?.SupplementPanel?.[idx]?.Property}
                  />
                );
              })}
            </div>
          )}
          {NutritionPanel?.length > 0 && (
            <div>
              {NutritionPanel?.map((panelData: any, idx: number) => {
                return (
                  <TdcNutPanelRender
                    propertyList={panelData?.Property}
                    title='Nutrition Fact'
                    evaluation={evaluation?.NutritionPanel?.[idx]?.Property}
                  />
                );
              })}
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};

const TdcNutPanelRender = ({
  propertyList,
  title,
  evaluation,
}: {
  propertyList: any[];
  title: string;
  evaluation?: any;
}) => {
  return (
    <div className='border-2 p-2 rounded-md'>
      <div className='font-bold uppercase mb-2'>{title}</div>
      {propertyList?.map((propertyItem, idx: number) => {
        const { PropertyName, ...restProperty } = propertyItem;
        return (
          <div>
            <div className=''>+{PropertyName}</div>
            <div className='pl-4'>
              <CamelFieldStringRender
                objectValues={restProperty}
                evaluations={evaluation?.[idx]}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
