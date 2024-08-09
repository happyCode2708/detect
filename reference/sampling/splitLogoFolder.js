const fs = require('fs');
const path = require('path');

const batch_index = 36;

const batch_indexes = [31];

const processOneBatch = (batch_index) => {
  // Paths
  const directoryPath = `D:/yolo/cert/batching_images/${batch_index}`; // Path to your original image folder

  const splitPath = `D:/yolo/cert/batching_images/split_${batch_index}`;
  const withLogoPath = `${splitPath}/images`; // Path to the folder for images with logo
  const withoutLogoPath = `${splitPath}/no_logo`; // Path to the folder for images without logo

  // Create directories if they don't exist
  if (!fs.existsSync(splitPath)) {
    fs.mkdirSync(splitPath);
  }

  if (!fs.existsSync(withLogoPath)) {
    fs.mkdirSync(withLogoPath);
  }
  if (!fs.existsSync(withoutLogoPath)) {
    fs.mkdirSync(withoutLogoPath);
  }

  // Read the JSON files
  const imagesWithLogo = JSON.parse(
    fs.readFileSync(path.join(directoryPath, 'imagesWithLogo.json'))
  );
  const imagesWithoutLogo = JSON.parse(
    fs.readFileSync(path.join(directoryPath, 'imagesWithoutLogo.json'))
  );

  // Function to copy images
  const copyImages = (imageList, destination) => {
    imageList.forEach((file) => {
      const sourcePath = path.join(directoryPath, file);
      const destPath = path.join(destination, file);

      // Ensure the destination folder exists
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied ${file} to ${destination}`);
    });
  };

  // Copy images to respective folders
  copyImages(imagesWithLogo, withLogoPath);
  copyImages(imagesWithoutLogo, withoutLogoPath);

  console.log('Finished copying images.');
};

const run = () => {
  batch_indexes.forEach((batchIndex) => {
    processOneBatch(batchIndex);
  });
};

run();
