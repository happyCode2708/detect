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
      <TabsList className='grid w-full grid-cols-4'>
        <TabsTrigger value='table'>Table</TabsTrigger>
        <TabsTrigger value='json'>Json</TabsTrigger>
        <TabsTrigger value='nut-md'>nut md</TabsTrigger>
        <TabsTrigger value='all-md'>all md</TabsTrigger>
      </TabsList>
      <TabsContent value='table' forceMount hidden={tabActive !== 'table'}>
        <TableResult productInfo={productInfo?.product} />
      </TabsContent>
      <TabsContent value='json' forceMount hidden={tabActive !== 'json'}>
        <JsonRender productInfo={productInfo} />
      </TabsContent>
      <TabsContent value='nut-md' forceMount hidden={tabActive !== 'nut-md'}>
        <div className='whitespace-pre-line'>
          {productInfo?.product?.nutMark}
        </div>
      </TabsContent>
      <TabsContent value='all-md' forceMount hidden={tabActive !== 'all-md'}>
        <div className='whitespace-pre-line'>
          {productInfo?.product?.allMark}
        </div>
      </TabsContent>
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
    ocrText,
    isFactPanelLooked,
    ingredients_group,
    other_ingredients_group,
    validated_ingredients_group,
    validated_other_ingredients_group,
    factPanelDebug,
    isFactPanelGoodToRead,
    attributesAndCertifiers,
    allergen,
    supplyChain,
    header,
    marketingAll,
    physical,
    instructions,
    packaging,
    contain_and_notContain,
    process,
    ...metaInfo
  } = productInfo;

  const {
    validated_allergen_containOnEquipment,
    allergen_containOnEquipment_statement,
    validated_allergen_contain,
    validated_allergen_freeOf,
  } = allergen || {};
  const { claims, otherClaims, containInfo } = attributesAndCertifiers || {};
  const {
    marketing_contents,
    socialMedia,
    social_media_check,
    ...marketingRest
  } = marketingAll || {};
  const { primarySize, secondarySize, thirdSize, ...headerRest } = header || {};
  const { recyclingInfo, recyclable, ...restPackaging } = packaging || {};
  const {
    product_contain,
    product_does_not_contain,
    ...validatedContainClaims
  } = contain_and_notContain || {};

  return (
    <>
      {/* {Object.entries(metaInfo)?.map(
        ([key, value]: [key: string, value: any]) => {
          if (!value) return null;

          return (
            <div key={key}>
              <span className='font-bold'>
                {camelCaseToSeparated(key) ?? 'N/A'}:
              </span>
              <span>{Array.isArray(value) ? value.join(', ') : value}</span>
            </div>
          );
        }
      )} */}

      <SectionWrapper name='Header'>
        <CamelFieldStringRender objectValues={primarySize} />
        <CamelFieldStringRender objectValues={secondarySize} />
        <CamelFieldStringRender objectValues={thirdSize} />
        <CamelFieldStringRender objectValues={headerRest} />
      </SectionWrapper>

      <SectionWrapper name='Physical'>
        <CamelFieldStringRender objectValues={physical} />
      </SectionWrapper>

      <SectionWrapper name='Packaging'>
        <CamelFieldStringRender objectValues={restPackaging} />
        {typeof recyclingInfo === 'object' && recyclingInfo ? (
          <div>
            <div className='font-bold'>Recycling info: </div>
            <div className='pl-6'>
              <CamelFieldStringRender objectValues={recyclingInfo} />
            </div>
          </div>
        ) : null}
        {recyclable && recyclable?.length > 0 ? (
          <div>
            <div className='font-bold'>Recyclable: </div>
            <div className='pl-6'>
              {recyclable?.map((recyclableItem: any, idx: number) => {
                return (
                  <div className='mb-2'>
                    <CamelFieldStringRender objectValues={recyclableItem} />
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </SectionWrapper>
      {validated_ingredients_group?.length > 0 && (
        <SectionWrapper name='Ingredients'>
          {validated_ingredients_group?.map(
            (ingredientListObject: any, idx: number) => {
              return (
                <div>
                  <div className='font-bold'>
                    Validated Ingredient No.{idx + 1}:{' '}
                  </div>
                  <div className='pl-6'>
                    <CamelFieldStringRender
                      objectValues={{
                        ...ingredientListObject,
                        // ingredients: JSON.stringify(
                        //   ingredientListObject?.ingredients
                        // ),
                      }}
                    />
                  </div>
                </div>
              );
            }
          )}
        </SectionWrapper>
      )}
      {validated_other_ingredients_group?.length > 0 && (
        <SectionWrapper name='Other Ingredients'>
          {validated_other_ingredients_group?.map(
            (ingredientListObject: any, idx: number) => {
              return (
                <div>
                  <div className='font-bold'>
                    Validated Ingredient No.{idx + 1}:{' '}
                  </div>
                  <div className='pl-6'>
                    <CamelFieldStringRender
                      objectValues={{
                        ...ingredientListObject,
                        // ingredients: JSON.stringify(
                        //   ingredientListObject?.ingredients
                        // ),
                      }}
                    />
                  </div>
                </div>
              );
            }
          )}
        </SectionWrapper>
      )}

      <SectionWrapper name='Attributes'>
        {/* {claimsOrCertifications?.length > 0 && (
          <div>
            <div className='font-bold'>Attributes Claims: </div>
            {claimsOrCertifications?.map((claimItem: any, idx: number) => {
              return (
                <div className='mb-[3px]'>
                  {claimItem?.value} (certified: {claimItem?.isClaimGetFromLogo}
                  ){' '}
                </div>
              );
            })}
          </div>
        )} */}
        {claims &&
          Object.entries(claims)?.map(
            ([key, attributeGroup]: [key: string, value: any]) => {
              const isClaimHaveValue = Object.entries(attributeGroup).find(
                (keyAndAvalue) => {
                  const [fieldKey, fieldValue] = keyAndAvalue;
                  if (fieldValue) {
                    return true;
                  }

                  return false;
                }
              );

              if (!isClaimHaveValue) return null;

              return (
                <div key={key}>
                  <div className='font-bold'>
                    {camelCaseToSeparated(key) ?? 'N/A'}:
                  </div>
                  <div className='pl-6'>
                    <CamelFieldStringRender objectValues={attributeGroup} />
                  </div>
                </div>
              );
            }
          )}
        <CamelFieldStringRender objectValues={otherClaims} />
        <CamelFieldStringRender objectValues={validatedContainClaims} />

        {/* <CamelFieldStringRender objectValues={{ high: high_in }} /> */}
      </SectionWrapper>

      <SectionWrapper name='Marketing'>
        {/* {marketing_contents?.length > 0 && (
          <div>
            <div className='font-bold'>Marketing Contents: </div>
            {marketing_contents?.map((marketingClaim: string, idx: number) => {
              return <p className='mb-[8px]'>{marketingClaim} </p>;
            })}
          </div>
        )} */}
        <CamelFieldStringRender objectValues={socialMedia} />
        <CamelFieldStringRender objectValues={marketingRest} />
      </SectionWrapper>

      <SectionWrapper name='Allergen'>
        {allergen_containOnEquipment_statement && (
          <div>
            <div className='flex flex-row'>
              <div className='font-bold'>Contain on equipments list: </div>
              <div>{validated_allergen_containOnEquipment?.join(', ')}</div>
            </div>
            <div>
              <div className='font-bold'>Contain on equipment statement: </div>
              <p className='ml-6'>{allergen_containOnEquipment_statement}</p>
            </div>
          </div>
        )}
        {validated_allergen_contain?.length > 0 && (
          <div className='flex flex-row'>
            <div className='font-bold'>Contain: </div>
            <div>{validated_allergen_contain?.join(', ')} </div>
          </div>
        )}
        {validated_allergen_freeOf?.length > 0 && (
          <div className='flex flex-row'>
            <div className='font-bold'>Free of: </div>
            <p>{validated_allergen_freeOf?.join(', ')} </p>
          </div>
        )}
      </SectionWrapper>

      <SectionWrapper name='Supply Chain'>
        <CamelFieldStringRender objectValues={supplyChain} />
      </SectionWrapper>
      <SectionWrapper name='Instructions'>
        <CamelFieldStringRender objectValues={instructions} />
      </SectionWrapper>
    </>
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
          if (value === null || value === undefined || isEqual(value, []))
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

// {Array.isArray(value)
//   ? removeDuplicates(value)?.join(', ')
//   : typeof value === 'boolean' ||
//     value === 'false' ||
//     value === 'true'
//   ? `${value}`
//   : value}
// </span>

const camelCaseToSeparated = (name: string) => {
  // Split the camelCase string based on capital letters
  const words = name.match(/[A-Z]?[a-z]+|[A-Z]+|[0-9]+/g);

  // Capitalize the first letter of each word and join them with spaces
  const separatedName = words
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return separatedName;
};
