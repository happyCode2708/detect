import { removeFieldByPath } from '@/lib/utils/object';

export const removeRawFieldData = (rawResponse: object) => {
  const fields = [
    'product.attributes.containAndNotContain',
    'product.attributes.fatClaims',
    'product.attributes.nonCertificateClaims',
    'product.attributes.calorieClaims',
    'product.attributes.saltClaims',
    'product.attributes.sugarClaims',
    'product.attributes.baseCertifierClaims',
    'product.marketing.instagram',
    'product.marketing.pinterest',
    'product.marketing.youtube',
    'product.marketing.facebook',
    'product.marketing.twitter',
    'product.nutMark',
    'product.allMark',
    'product.extraInfo',
    'product.extraInfo',
    'product.instructions',
    'product.labeling',
  ];

  fields.forEach((removeField) => {
    removeFieldByPath(rawResponse, removeField);
  });
};
