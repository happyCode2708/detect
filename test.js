const getDescriptor = (nutrientName) => {
  const pattern = /(\s*\([^()]*\))+$/;
  const match = nutrientName.match(pattern);
  return match ? match[0] : null;
};

const validateNutrientNameByDescriptor = (modifiedNutrient) => {
  const logicExtractedDescriptor = getDescriptor(
    modifiedNutrient?.['nutrientName']
  );

  console.log('extracted descriptor', logicExtractedDescriptor);
  // if (logicExtractedDescriptor && !modifiedNutrient?.['descriptor']) {
  if (logicExtractedDescriptor) {
    modifiedNutrient['validated_descriptor_from_name'] =
      logicExtractedDescriptor;
    modifiedNutrient['validated_nutrientName_from_descriptor'] =
      modifiedNutrient['nutrientName']?.split(logicExtractedDescriptor)?.[0];
  } else {
    modifiedNutrient['validated_nutrientName_from_descriptor'] =
      modifiedNutrient['nutrientName'];
  }

  console.log(modifiedNutrient);
};

let modifiedNutrient = {
  nutrientName: 'Monounsaturated Fat',
};

validateNutrientNameByDescriptor(modifiedNutrient);
