import { metadata } from '@/app/layout';
import NutritionTable from '../table/NutritionTable';
import { CamelFieldStringRender, MetaInfo, SectionWrapper } from './common';

export const TableResultTDC = ({ productTdcData }: { productTdcData: any }) => {
  const { SupplementPanel, NutritionPanel, ...metaData } =
    (productTdcData as any) || {};

  const { HasSupplementPanel, HasNutritionPanel } = metaData;

  return (
    <>
      {productTdcData ? (
        <div className='p-4 border rounded-md flex-1 overflow-auto max-h-screen'>
          {/* <MetaInfo productInfo={productInfo} />
           */}
          <CamelFieldStringRender
            objectValues={metaData}
            evaluations={{
              BrandName: {
                score: '100%',
                note: 'test note',
              },
              Contains: {
                score: '50%',
                note: 'test note',
              },
            }}
          />

          {HasSupplementPanel && (
            <div>
              {SupplementPanel?.map((panelData) => {
                return (
                  <TdcNutPanelRender
                    propertyList={panelData?.Property}
                    title='Supplement Fact'
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
}: {
  propertyList: any[];
  title: string;
}) => {
  console.log('list', propertyList);
  return (
    <div className='border p-2'>
      <div className='font-bold uppercase mb-2'>{title}</div>
      {propertyList?.map((propertyItem) => {
        const { PropertyName, ...restProperty } = propertyItem;
        return (
          <div>
            <div className=''>+{PropertyName}</div>
            <div className='pl-4'>
              <CamelFieldStringRender objectValues={restProperty} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
