import { removeDuplicates } from '@/lib/utils';
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
  } = attributes || {};

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

export const CamelFieldStringRender = ({
  objectValues,
  evaluations,
}: {
  objectValues: Object;
  evaluations?: any;
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
                {camelCaseToSeparated(key) ?? 'N/A'}{' '}
                {evaluationItem && (
                  <div className='inline-block rounded-md bg-green-600 text-white px-1'>
                    {evaluationItem}
                  </div>
                )}
                :
              </div>
              <div>
                {Array.isArray(value)
                  ? value?.map((childValue: any) => {
                      return (
                        <div>
                          +{' '}
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