import NutritionTable from '@/components/table/NutritionTable';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Result = ({ productInfo }: { productInfo: any }) => {
  if (!productInfo) return null;

  return (
    <Tabs defaultValue='table' className='w-full overflow-hidden'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='table'>Table</TabsTrigger>
        <TabsTrigger value='json'>Json</TabsTrigger>
      </TabsList>
      <TabsContent value='table'>
        <TableResult productInfo={productInfo?.product} />
      </TabsContent>
      <TabsContent value='json'>
        <JsonRender productInfo={productInfo} />
      </TabsContent>
    </Tabs>
  );
};

const TableResult = ({ productInfo }: { productInfo: any }) => {
  return (
    <>
      {productInfo ? (
        <div className='p-4 border rounded-md flex-1 overflow-auto max-h-[500px]'>
          {/* {repla} */}
          <MetaInfo productInfo={productInfo} />
          {productInfo?.factPanels?.map((labelData: any, idx: number) => {
            return <NutritionTable data={labelData} key={idx} />;
          })}
        </div>
      ) : null}
    </>
  );
};

const JsonRender = ({ productInfo }: { productInfo: any }) => {
  return (
    <pre className='bg-zinc-100 p-4 rounded-sm max-h-[500px] overflow-auto'>
      {JSON.stringify(productInfo, null, 2)}
    </pre>
  );
};

const MetaInfo = ({ productInfo }: { productInfo: any }) => {
  const {
    factPanels,
    ocrText,
    isFactPanelLooked,
    ingredientsGroup,
    contain,
    factPanelDebug,
    isFactPanelGoodToRead,
    ...metaInfo
  } = productInfo;
  return (
    <>
      {Object.entries(metaInfo)?.map(
        ([key, value]: [key: string, value: any]) => {
          if (!value) return null;
          Result;

          return (
            <div key={key}>
              <span className='font-bold'>{key}: </span>
              <span>{value}</span>
            </div>
          );
        }
      )}
      {ingredientsGroup?.map((ingredientItem: any, idx: number) => {
        return (
          <div>
            <div className='font-bold'>Ingredient No.{idx + 1}: </div>
            <p>{ingredientItem?.ingredients} </p>
          </div>
        );
      })}
      {contain && (
        <div>
          <div className='font-bold'>Contain: </div>
          <p>{contain} </p>
        </div>
      )}
    </>
  );
};
