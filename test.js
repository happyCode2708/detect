const cleanJSON = (jsonString) => {
  // Remove trailing commas before closing braces/brackets
  return jsonString
    .replace(/,\s*([}\]])/g, '$1') // Handle trailing commas in objects and arrays
    .replace(/,\s*$/, ''); // Handle trailing comma at the end of the string
};

const parseJson = (jsonString) => {
  jsonString = cleanJSON(jsonString);

  try {
    const jsonObject = JSON.parse(jsonString);
    return jsonObject;
  } catch (error) {
    console.error('Invalid JSON string:', error);
    return {};
  }
};
