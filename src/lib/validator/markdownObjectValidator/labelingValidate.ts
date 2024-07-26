import { toLower } from 'lodash';

export const labelingInfoValidate = async (modifiedProductDataPoints: any) => {
  modifiedProductDataPoints['validated_labeling'] = {
    free: [],
    contain: [],
  };
  await validateFree(modifiedProductDataPoints);
  // await validateContain(modifiedProductDataPoints);
};

const validateFree = async (modifiedProductDataPoints: any) => {
  modifiedProductDataPoints?.['labelingAnalysis']?.forEach((labelItem: any) => {
    const { free, isFreeOf, label } = labelItem;
    if (free && isFreeOf === 'yes') {
      free?.split('/')?.forEach((freeItem: string) => {
        if (toLower(label)?.includes(toLower(freeItem?.trim()))) {
          const currentValue =
            modifiedProductDataPoints['validated_labeling']['free'];

          modifiedProductDataPoints['validated_labeling']['free'] = Array.from(
            new Set([...currentValue, toLower(freeItem)])
          );
        }
      });
    }
  });
};

// const validateContain = async (modifiedProductDataPoints: any) => {
//   modifiedProductDataPoints?.['labeling']?.forEach((labelItem: any) => {
//     const { contain } = labelItem;
//     if (contain) {
//       const currentValue =
//         modifiedProductDataPoints['validated_labeling']['contain'];

//       modifiedProductDataPoints['validated_labeling']['contain'] = Array.from(
//         new Set([...currentValue, toLower(contain)])
//       );
//     }
//   });
// };

// const aller

// const EXTRA_ITEM =  {

// }

// export const labelingInfoValidate = async (modifiedProductDataPoints: any) => {
//   await validateFree(modifiedProductDataPoints);
//   await validateContain(modifiedProductDataPoints);
// };

// const validateFree = async (modifiedProductDataPoints: any) => {
//   let labeling = modifiedProductDataPoints?.['labeling']?.[0];
//   const { free } = labeling;

//   let validatedFreeLabeling = free
//     ?.split('/')
//     ?.map((item: string) => item?.trim());

//   if (!validatedFreeLabeling) return;

//   modifiedProductDataPoints['labeling'][0]['validated_free'] =
//     validatedFreeLabeling;
// };

// const validateContain = async (modifiedProductDataPoints: any) => {
//   let labeling = modifiedProductDataPoints?.['labeling']?.[0];
//   const { contain } = labeling;

//   let validatedContainLabeling = contain
//     ?.split('/')
//     ?.map((item: string) => item?.trim());

//   if (!validatedContainLabeling) return;

//   modifiedProductDataPoints['labeling'][0]['validated_contain'] =
//     validatedContainLabeling;
// };
