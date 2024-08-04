import { execFile } from 'child_process';

export const findImagesContainNutFact = async (filePaths: string[]) => {
  const detects = await Promise.all(
    filePaths.map((path: string) => isImageHaveNutFact(path))
  );

  let validateImages: any = {
    nutIncluded: [],
    nutIncludedIdx: [],
    nutExcluded: [],
    nutExcludedIdx: [],
  };

  detects.forEach((isNutFactFound, idx) => {
    if (isNutFactFound) {
      validateImages.nutIncluded = [
        ...validateImages.nutIncluded,
        filePaths[idx],
      ];
      validateImages.nutIncludedIdx = [...validateImages.nutIncludedIdx, idx];
    } else {
      validateImages.nutExcluded = [
        ...validateImages.nutExcluded,
        filePaths[idx],
      ];
      validateImages.nutExcludedIdx = [...validateImages.nutExcludedIdx, idx];
    }
  });

  return validateImages;
};

export const isImageHaveNutFact = (filePath: string) => {
  const imagePath = filePath;

  return new Promise((resolve, reject) => {
    const pythonPath =
      process.env.NODE_ENV !== 'production' ? 'src/python/' : 'dist/python/';
    execFile(
      process.env.pythonV || 'python',
      [`${pythonPath}detect.py`, imagePath],
      (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.error(`exec error: ${error}`);
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }
        console.log(stdout);
        console.log(typeof stdout);
        console.log('result', stdout.split('```')?.[1]);

        const stringResult = stdout.split('```')?.[1];
        return resolve(stringResult === 'true');
      }
    );
  });
};
