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
    ingredientsGroup,
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
    ...metaInfo
  } = productInfo;

  const { containOnEquipment, contain, freeOf } = allergen || {};
  const { claims, otherClaims, containInfo } = attributesAndCertifiers || {};
  const { marketingContents, socialMedia, ...marketingRest } =
    marketingAll || {};
  const { primarySize, secondarySize, thirdSize, ...headerRest } = header || {};

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
        <CamelFieldStringRender objectValues={packaging} />
      </SectionWrapper>

      <SectionWrapper name='Ingredients'>
        {ingredientsGroup?.map((ingredientItem: any, idx: number) => {
          return (
            <div>
              <div className='font-bold'>Ingredient No.{idx + 1}: </div>
              <p>{ingredientItem?.ingredients} </p>
            </div>
          );
        })}
      </SectionWrapper>

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
        <CamelFieldStringRender objectValues={containInfo} />
      </SectionWrapper>

      <SectionWrapper name='Marketing'>
        {marketingContents?.length > 0 && (
          <div>
            <div className='font-bold'>Marketing Contents: </div>
            {marketingContents?.map((marketingClaim: string, idx: number) => {
              return <p className='mb-[8px]'>{marketingClaim} </p>;
            })}
          </div>
        )}
        <CamelFieldStringRender objectValues={socialMedia} />
        <CamelFieldStringRender objectValues={marketingRest} />
      </SectionWrapper>

      <SectionWrapper name='Allergen'>
        {containOnEquipment?.statement && (
          <div>
            <div className='font-bold'>Contain on equipments list</div>
            <div>{containOnEquipment?.allergenList?.join(', ')}</div>
            <div className='font-bold'>Contain on equipment statement</div>
            <div>{containOnEquipment?.statement}</div>
          </div>
        )}
        {contain && (
          <div>
            <div className='font-bold'>Contain: </div>
            <p>{contain?.join(', ')} </p>
          </div>
        )}
        {freeOf && (
          <div>
            <div className='font-bold'>Free of: </div>
            <p>{freeOf?.join(', ')} </p>
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
          if (!value) return null;

          return (
            <div key={key}>
              <span className='font-bold'>
                {camelCaseToSeparated(key) ?? 'N/A'}:
              </span>
              <span>
                {Array.isArray(value)
                  ? value.join(', ')
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
  // Split the camelCase string based on capital letters
  const words = name.match(/[A-Z]?[a-z]+|[A-Z]+|[0-9]+/g);

  // Capitalize the first letter of each word and join them with spaces
  const separatedName = words
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return separatedName;
};
