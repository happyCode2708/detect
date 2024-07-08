import * as fs from 'fs';
import * as path from 'path';

function checkFileExists(
  filePath: string
): Promise<{ filePath: string; exists: boolean }> {
  return new Promise((resolve) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      resolve({ filePath, exists: !err });
    });
  });
}

export const checkFilesExist = async (
  filePaths: string[]
): Promise<{ filePath: string; exists: boolean }[]> => {
  const results = await Promise.all(filePaths.map(checkFileExists));
  return results;
};
