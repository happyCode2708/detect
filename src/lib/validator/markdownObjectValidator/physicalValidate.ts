export const physicalValidate = async (modifiedProductDataPoints: any) => {
  let modifiedPhysical = modifiedProductDataPoints?.['physical']?.[0];

  if (!modifiedPhysical) return;

  validateUpc(modifiedPhysical);

  modifiedProductDataPoints['physical'][0] = modifiedPhysical;
};

const validateUpc = (modifiedPhysical: any) => {
  const { possibleUpc12, lotNumber, numberAfterLotNumber } = modifiedPhysical;

  if (possibleUpc12 && possibleUpc12?.length === 12) {
    if (!lotNumber) {
      modifiedPhysical['validated_upc12'] = possibleUpc12;
      console.log('case 1');
      return;
    }

    // console.log('possibleUpc12', possibleUpc12);
    // console.log('type', typeof possibleUpc12);
    if (lotNumber && possibleUpc12?.startsWith(lotNumber)) {
      modifiedPhysical['validated_upc12'] = possibleUpc12;
      console.log('case 2');
      return;
    }
  }

  if (possibleUpc12 && lotNumber && numberAfterLotNumber) {
    if (possibleUpc12 === `${lotNumber}${numberAfterLotNumber}`) {
      console.log('case 3');
      modifiedPhysical['validated_upc12'] = possibleUpc12;
      return;
    }

    if (possibleUpc12 !== `${lotNumber}${numberAfterLotNumber}`) {
      if (`${lotNumber}${numberAfterLotNumber}`?.length === 12) {
        modifiedPhysical[
          'validated_upc12'
        ] = `${lotNumber}${numberAfterLotNumber}`;
        return;
      }

      if (possibleUpc12?.length == 12) {
        modifiedPhysical['validated_upc12'] = possibleUpc12;
        return;
      }
    }
  }
};
