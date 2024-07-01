'use client';
import NutritionTable from '@/components/table/NutritionTable';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { removeDuplicates } from '@/lib/utils';
import { isEqual } from 'lodash';
import { useState } from 'react';

export const Result = ({ productInfo }: { productInfo: any }) => {
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
            ? 'grid w-full grid-cols-4'
            : 'grid w-full grid-cols-2'
        }
      >
        <TabsTrigger value='table'>Table</TabsTrigger>
        <TabsTrigger value='json'>Json</TabsTrigger>
        {process.env.NODE_ENV !== 'production' && (
          <>
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
      {process.env.NODE_ENV !== 'production' && (
        <>
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

const MetaInfo = ({ productInfo }: { productInfo: any }) => {
  const {
    factPanels,
    header,
    physical,
    attributes,
    ingredients,
    allergens,
    instructions,
    marketing,
    supplyChain,
  } = productInfo;

  const {
    validated_notContain,
    validated_contain,
    validated_calorieClaim,
    validated_fatClaims,
    validated_nonCertificateClaims,
    validated_saltClaims,
    validated_sugarClaims,
  } = attributes;

  return (
    <div>
      <SectionWrapper name='Header'>
        <CamelFieldStringRender objectValues={header?.[0]} />
      </SectionWrapper>
      <SectionWrapper name='Physical'>
        <CamelFieldStringRender objectValues={physical?.[0]} />
      </SectionWrapper>
      <SectionWrapper name='Attributes'>
        <CamelFieldStringRender
          objectValues={{ doesNotContain: validated_notContain }}
        />
        <CamelFieldStringRender objectValues={{ contain: validated_contain }} />
        <CamelFieldStringRender
          objectValues={{ calorie: validated_calorieClaim }}
        />
        <CamelFieldStringRender objectValues={{ fat: validated_fatClaims }} />
        <CamelFieldStringRender
          objectValues={{ sugar: validated_sugarClaims }}
        />
        <CamelFieldStringRender
          objectValues={{
            ['non certificate claim']: validated_nonCertificateClaims,
          }}
        />
        <CamelFieldStringRender objectValues={{ salt: validated_saltClaims }} />
      </SectionWrapper>
      <SectionWrapper name='allergens'>
        <CamelFieldStringRender objectValues={allergens?.[0]} />
      </SectionWrapper>
      <SectionWrapper name='instructions'>
        <CamelFieldStringRender objectValues={instructions?.[0]} />
      </SectionWrapper>
      <SectionWrapper name='marketing'>
        <CamelFieldStringRender objectValues={marketing?.[0]} />
      </SectionWrapper>
      <SectionWrapper name='supplyChain'>
        <CamelFieldStringRender objectValues={supplyChain?.[0]} />
      </SectionWrapper>
      <SectionWrapper name='ingredients'>
        <CamelFieldStringRender objectValues={ingredients?.[0]} />
      </SectionWrapper>
    </div>
  );
};

const SectionWrapper = ({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) => {
  return (
    <div>
      <div className='font-bold bg-blue-500 p-2 rounded-md text-white mb-2'>
        {name}
      </div>
      <div className='pl-8'>{children && children}</div>
    </div>
  );
};

const CamelFieldStringRender = ({ objectValues }: { objectValues: Object }) => {
  if (!objectValues) return null;

  return (
    <>
      {Object.entries(objectValues)?.map(
        ([key, value]: [key: string, value: any]) => {
          if (
            value === null ||
            value === undefined ||
            isEqual(value, []) ||
            value === ''
          )
            return null;

          return (
            <div key={key}>
              <span className='font-bold'>
                {camelCaseToSeparated(key) ?? 'N/A'}:
              </span>
              <span>
                {Array.isArray(value)
                  ? removeDuplicates(value)?.join(', ')
                  : typeof value === 'boolean'
                  ? `${value}`
                  : value}
              </span>
            </div>
          );
        }
      )}
    </>
  );
};

const camelCaseToSeparated = (name: string) => {
  const words = name.match(/[A-Z]?[a-z]+|[A-Z]+|[0-9]+/g);

  const separatedName = words
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return separatedName;
};
