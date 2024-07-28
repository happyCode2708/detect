import { cn, removeDuplicates } from '@/lib/utils';
import { findIntersectionArrayString } from '@/lib/utils/array';
import { isEqual } from 'lodash';

export const SectionWrapper = ({
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

export const MetaInfo = ({ productInfo }: { productInfo: any }) => {
  const {
    factPanels,
    header,
    physical,
    attributes,
    ingredients,
    allergens,
    validated_allergens,
    instructions,
    validated_instructions,
    marketing,
    supplyChain,
    validated_supplyChain,
  } = productInfo;

  const {
    validated_notContain,
    validated_contain,
    validated_calorieClaim,
    validated_fatClaims,
    validated_nonCertificateClaims,
    validated_saltClaims,
    validated_sugarClaims,
  } = attributes || {};

  const { allergensAncillary, ...rest_validated_allergens } =
    validated_allergens || {};

  const { processedOnEquipment, freeOf, containList } =
    validated_allergens || {};

  const missMatchEquipmentList = findIntersectionArrayString(
    processedOnEquipment,
    freeOf
  );

  const missMatchContainList = findIntersectionArrayString(containList, freeOf);

  return (
    <div>
      <SectionWrapper name='Header'>
        <CamelFieldStringRender objectValues={header?.[0]} />
      </SectionWrapper>
      <SectionWrapper name='Physical'>
        <CamelFieldStringRender objectValues={physical} />
      </SectionWrapper>
      <SectionWrapper name='Attributes'>
        <CamelFieldStringRender
          objectValues={{
            'possible doesNotContain claim': validated_notContain,
          }}
          styleConfig={{
            'possible doesNotContain claim': {
              keyName: { className: 'bg-red-400' },
            },
          }}
        />
        <CamelFieldStringRender
          objectValues={{ 'possible contain claim': validated_contain }}
          styleConfig={{
            'possible contain claim': {
              keyName: { className: 'bg-red-400' },
            },
          }}
        />
        <CamelFieldStringRender
          objectValues={{ 'possible calorie claim': validated_calorieClaim }}
          styleConfig={{
            'possible calorie claim': {
              keyName: { className: 'bg-red-400' },
            },
          }}
        />
        <CamelFieldStringRender
          objectValues={{ 'possible fat claim': validated_fatClaims }}
          styleConfig={{
            'possible fat claim': {
              keyName: { className: 'bg-red-400' },
            },
          }}
        />
        <CamelFieldStringRender
          objectValues={{ 'possible sugar claim': validated_sugarClaims }}
          styleConfig={{
            'possible sugar claim': {
              keyName: { className: 'bg-red-400' },
            },
          }}
        />
        <CamelFieldStringRender
          objectValues={{
            'possible non certificate claim': validated_nonCertificateClaims,
          }}
          styleConfig={{
            'possible non certificate claim': {
              keyName: { className: 'bg-red-400' },
            },
          }}
        />
        <CamelFieldStringRender
          objectValues={{ 'possible salt claim': validated_saltClaims }}
          styleConfig={{
            'possible salt claim': {
              keyName: { className: 'bg-red-400' },
            },
          }}
        />
      </SectionWrapper>
      <SectionWrapper name='allergens'>
        {allergens?.map((allergenItem: any, idx: number) => {
          return (
            <div className='border rounded-md mb-2 p-1' key={idx}>
              <CamelFieldStringRender objectValues={allergenItem} />
            </div>
          );
        })}
        {validated_allergens && (
          <div className='border rounded-md mb-2 p-1'>
            <div className='font-bold uppercase p-1 rounded-md bg-green-600 text-white inline-block'>
              validated result
            </div>
            <CamelFieldStringRender
              objectValues={{ possibleAllergensAncillary: allergensAncillary }}
              styleConfig={{
                possibleAllergensAncillary: {
                  keyName: { className: 'bg-red-400' },
                },
              }}
            />
            <CamelFieldStringRender
              objectValues={rest_validated_allergens}
              possibleWrongValues={{
                containList: missMatchContainList,
                inFacilityOnEquipmentIncluding: missMatchEquipmentList,
                freeOf: [...missMatchContainList, ...missMatchEquipmentList],
                processedOnEquipment: missMatchEquipmentList,
              }}
            />
          </div>
        )}
      </SectionWrapper>
      <SectionWrapper name='instructions'>
        <CamelFieldStringRender objectValues={instructions?.[0]} />
        {validated_instructions && (
          <div className='border rounded-md mb-2 p-1'>
            <div className='font-bold uppercase p-1 rounded-md bg-green-600 text-white inline-block'>
              validated result
            </div>
            <CamelFieldStringRender objectValues={validated_instructions} />
          </div>
        )}
      </SectionWrapper>
      <SectionWrapper name='marketing'>
        <CamelFieldStringRender objectValues={marketing?.[0]} />
      </SectionWrapper>
      <SectionWrapper name='supplyChain'>
        <CamelFieldStringRender objectValues={supplyChain?.[0]} />
        {validated_supplyChain && (
          <div className='border rounded-md mb-2 p-1'>
            <div className='font-bold uppercase p-1 rounded-md bg-green-600 text-white inline-block'>
              validated result
            </div>
            <CamelFieldStringRender objectValues={validated_supplyChain} />
          </div>
        )}
      </SectionWrapper>
      <SectionWrapper name='ingredients'>
        {ingredients?.map((ingredientsItem: any, idx: number) => {
          const { validated_ingredients, ...rawIngredientInfo } =
            ingredientsItem || {};
          return (
            <div className='rounded-sm p-2 border mb-2' key={idx}>
              <CamelFieldStringRender
                objectValues={rawIngredientInfo}
                key={idx}
              />
              <div className='rounded-sm p-2 border'>
                <div className='font-bold uppercase p-1 rounded-md bg-green-600 text-white inline-block'>
                  validated result
                </div>
                <CamelFieldStringRender objectValues={validated_ingredients} />
              </div>
            </div>
          );
        })}
      </SectionWrapper>
    </div>
  );
};

export const CamelFieldStringRender = ({
  objectValues,
  evaluations,
  styleConfig,
  possibleWrongValues,
}: {
  objectValues: Object;
  evaluations?: any;
  styleConfig?: Record<string, Record<string, { className: string }>>;
  possibleWrongValues?: any;
}) => {
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
          ) {
            return null;
          }

          const evaluationItem = evaluations?.[key];

          return (
            <div key={key} className='flex flex-col mb-4'>
              <div className='font-bold whitespace-nowrap'>
                <span
                  className={styleConfig?.[key]?.['keyName']?.className || ''}
                >
                  {camelCaseToSeparated(key) ?? 'N/A'}{' '}
                </span>
                {evaluationItem && (
                  <div
                    className={cn(
                      'inline-block rounded-md bg-green-600 text-white px-1'
                    )}
                  >
                    {evaluationItem}
                  </div>
                )}
                :
              </div>
              <div>
                {Array.isArray(value)
                  ? value?.map((childValue: any, idx: number) => {
                      const wrongValues = possibleWrongValues?.[key];

                      const showPossibleWrongStyle =
                        !!wrongValues && wrongValues?.includes(childValue);

                      return (
                        <div
                          className={showPossibleWrongStyle ? 'bg-red-300' : ''}
                          key={idx}
                        >
                          +
                          {typeof value === 'boolean' ? `${value}` : childValue}{' '}
                        </div>
                      );
                    })
                  : `${value}`}
              </div>
            </div>
          );
        }
      )}
    </>
  );
};

// {Array.isArray(value)
//     ? removeDuplicates(value)?.join(', ')
//     : typeof value === 'boolean'
//     ? `${value}`
//     : value}

const camelCaseToSeparated = (name: string) => {
  const words = name.match(/[A-Z]?[a-z]+|[A-Z]+|[0-9]+/g);

  const separatedName = words
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return separatedName;
};

//! back up camel case render
// export const CamelFieldStringRender = ({
//   objectValues,
//   evaluations,
// }: {
//   objectValues: Object;
//   evaluations?: any;
// }) => {
//   if (!objectValues) return null;

//   return (
//     <>
//       {Object.entries(objectValues)?.map(
//         ([key, value]: [key: string, value: any]) => {
//           if (
//             value === null ||
//             value === undefined ||
//             isEqual(value, []) ||
//             value === ''
//           ) {
//             return null;
//           }

//           const evaluationItem = evaluations?.[key];

//           return (
//             <div key={key} className='grid grid-cols-6 mb-4'>
//               <div className='font-bold whitespace-nowrap col-span-3'>
//                 {camelCaseToSeparated(key) ?? 'N/A'}{' '}
//                 {evaluationItem && (
//                   <div className='inline-block rounded-md bg-green-600 text-white px-1'>
//                     {evaluationItem}
//                   </div>
//                 )}
//                 :
//               </div>
//               <div className='col-span-3'>
//                 {Array.isArray(value)
//                   ? value?.map((childValue: any) => {
//                       return (
//                         <div>
//                           +{' '}
//                           {typeof value === 'boolean' ? `${value}` : childValue}{' '}
//                         </div>
//                       );
//                     })
//                   : value}
//               </div>
//             </div>
//           );
//         }
//       )}
//     </>
//   );
// };
