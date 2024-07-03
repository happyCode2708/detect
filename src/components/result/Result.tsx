'use client';
import NutritionTable from '@/components/table/NutritionTable';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { MetaInfo, SectionWrapper } from './common';
import { ComparisonTabContent } from '../comparison-result/ComparisonTabContent';

export const Result = ({
  productInfo,
  productTdcData,
}: {
  productInfo: any;
  productTdcData: any;
}) => {
  if (!productInfo) return null;

  const [tabActive, setTabActive] = useState<string>('table');

  const onValueChange = (tabActive: string) => {
    setTabActive(tabActive);
  };

  return (
    <Tabs
      defaultValue='table'
      className='w-full overflow-hidden'
      onValueChange={onValueChange}
    >
      <TabsList
        className={
          process.env.NODE_ENV !== 'production'
            ? 'grid w-full grid-cols-6'
            : 'grid w-full grid-cols-2'
        }
      >
        <TabsTrigger value='table'>Table</TabsTrigger>
        <TabsTrigger value='json'>Json</TabsTrigger>
        {process.env.NODE_ENV !== 'production' && (
          <>
            <TabsTrigger value='jsonTDC'>Json TDC</TabsTrigger>
            <TabsTrigger value='compare'>Compare</TabsTrigger>
            <TabsTrigger value='nut-md'>nut md</TabsTrigger>
            <TabsTrigger value='all-md'>all md</TabsTrigger>
          </>
        )}
      </TabsList>
      <TabsContent value='table' forceMount hidden={tabActive !== 'table'}>
        <TableResult productInfo={productInfo?.product} />
      </TabsContent>
      <TabsContent value='json' forceMount hidden={tabActive !== 'json'}>
        <JsonRender productInfo={productInfo} />
      </TabsContent>
      <TabsContent value='json tdc' forceMount hidden={tabActive !== 'jsonTDC'}>
        <JsonRender productInfo={productTdcData} />
      </TabsContent>
      {process.env.NODE_ENV !== 'production' && (
        <>
          <TabsContent
            value='table'
            forceMount
            hidden={tabActive !== 'compare'}
          >
            <ComparisonTabContent
              productInfo1={productInfo?.product}
              productInfo2={productInfo?.product}
              productTdcData={productTdcData}
            />
          </TabsContent>
          <TabsContent
            value='nut-md'
            forceMount
            hidden={tabActive !== 'nut-md'}
          >
            <div className='whitespace-pre-line'>
              {productInfo?.product?.nutMark}
            </div>
          </TabsContent>
          <TabsContent
            value='all-md'
            forceMount
            hidden={tabActive !== 'all-md'}
          >
            <div className='whitespace-pre-line'>
              {productInfo?.product?.allMark}
            </div>
          </TabsContent>
        </>
      )}
    </Tabs>
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
