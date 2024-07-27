'use client';
import NutritionTable from '@/components/table/NutritionTable';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { MetaInfo, SectionWrapper } from './common';
import { ComparisonTabContent } from '../comparison-result/ComparisonTabContent';
import { mapToTDCformat } from '@/lib/mapper/mapToTDCFormat';
import { compareWithTDC } from '@/lib/comparator/compareWithTDC';

export const Result = ({
  productInfo,
  productTdcData,
  compareResultData,
}: {
  productInfo: any;
  productTdcData: any;
  compareResultData: any;
}) => {
  const [tabActive, setTabActive] = useState<string>('table');

  const onValueChange = (tabActive: string) => {
    setTabActive(tabActive);
  };

  // useEffect(() => {
  //   try {
  //     if (productInfo && productTdcData) {
  //       const mappedData = mapToTDCformat(productInfo);
  //       console.log('obj__1', mappedData);
  //       console.log('obj__2', productTdcData);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }, [productInfo, productTdcData]);

  if (!productInfo) return null;

  return (
    <div>
      <Tabs
        defaultValue='table'
        className='w-full overflow-hidden'
        onValueChange={onValueChange}
      >
        <TabsList
          className={
            process.env.NODE_ENV !== 'production'
              ? 'grid w-full grid-cols-6'
              : 'grid w-full grid-cols-4'
          }
        >
          <TabsTrigger value='table'>Table</TabsTrigger>
          <TabsTrigger value='json'>Json</TabsTrigger>
          <TabsTrigger value='jsonTDC'>TDC data</TabsTrigger>

          <TabsTrigger value='compare'>
            {process.env.NODE_ENV !== 'production'
              ? 'Compare'
              : 'Result In TDC format'}
          </TabsTrigger>
          {process.env.NODE_ENV !== 'production' && (
            <>
              <TabsTrigger value='nut-md'>nut md</TabsTrigger>
              <TabsTrigger value='all-md'>all md</TabsTrigger>
            </>
          )}
        </TabsList>
        <TabsContent value='json' forceMount hidden={tabActive !== 'json'}>
          <JsonRender productInfo={productInfo} />
        </TabsContent>
        <TabsContent value='table' forceMount hidden={tabActive !== 'table'}>
          <TableResult productInfo={productInfo?.product} />
        </TabsContent>
        <TabsContent
          value='json tdc'
          forceMount
          hidden={tabActive !== 'jsonTDC'}
        >
          <JsonRender productInfo={productTdcData} />
        </TabsContent>
        <TabsContent
          value={'compare'}
          forceMount
          hidden={tabActive !== 'compare'}
        >
          <ComparisonTabContent
            productInfo={productInfo?.product}
            productTdcData={productTdcData}
            compareResultData={compareResultData}
          />
        </TabsContent>
        {process.env.NODE_ENV !== 'production' && (
          <>
            <TabsContent
              value='nut-md'
              forceMount
              hidden={tabActive !== 'nut-md'}
            >
              <div className='whitespace-pre-line max-h-[500px] overflow-auto'>
                {productInfo?.product?.nutMark}
              </div>
            </TabsContent>
            <TabsContent
              value='all-md'
              forceMount
              hidden={tabActive !== 'all-md'}
            >
              <div className='whitespace-pre-line max-h-[500px] overflow-auto'>
                {productInfo?.product?.allMark}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

const TableResult = ({ productInfo }: { productInfo: any }) => {
  return (
    <>
      {productInfo ? (
        <div className='p-4 border rounded-md flex-1 overflow-auto max-h-screen'>
          <MetaInfo productInfo={productInfo} />
          <SectionWrapper name='Nutrition Fact/Supplement Fact'>
            {productInfo?.factPanels?.map((labelData: any, idx: number) => {
              return <NutritionTable data={labelData} key={idx} />;
            })}
          </SectionWrapper>
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
