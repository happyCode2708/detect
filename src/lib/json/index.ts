import path, { resolve } from 'path';
import fs from 'fs';

export const writeJsonToFile = (
  directory: string,
  fileName: string,
  content: any
) => {
  // Check if the directory exists
  if (!fs.existsSync(directory)) {
    // If it does not exist, create it
    console.log('does not exist');
    fs.mkdirSync(directory, { recursive: true });
  }

  // Define the complete file path
  const filePath = path.join(directory, fileName);

  // Write the JSON string to a file
  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.log('Error writing file:', err);
    } else {
      console.log(
        `JSON data is written to the file successfully at ${filePath}.`
      );
    }
  });
};

const cleanJSON = (jsonString: string) => {
  // Remove trailing commas before closing braces/brackets
  return jsonString
    .replace(/,\s*([}\]])/g, '$1') // Handle trailing commas in objects and arrays
    .replace(/,\s*$/, ''); // Handle trailing comma at the end of the string
};

export const parseJson = (jsonString: string) => {
  jsonString = cleanJSON(jsonString);

  try {
    const jsonObject = JSON.parse(jsonString);
    return jsonObject;
  } catch (error) {
    console.error('Invalid JSON string:', error);
    return {};
  }
};
