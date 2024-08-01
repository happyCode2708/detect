const fs = require('fs');
const path = require('path');

// Define the source folder and destination base folder
const sourceFolder = '/Users/duynguyen/Downloads/yolo/dataset';
const destinationBaseFolder =
  '/Users/duynguyen/Downloads/yolo/batching_dataset'; // Base folder for batches
const batchSize = 2; // Number of images per batch

// Function to create folders and copy files
async function splitImages() {
  try {
    // Ensure the destination base folder exists
    if (!fs.existsSync(destinationBaseFolder)) {
      fs.mkdirSync(destinationBaseFolder, { recursive: true });
      console.log(`Created base folder: ${destinationBaseFolder}`);
    }

    // Read the files from the source folder
    const files = fs.readdirSync(sourceFolder);

    let batchNumber = 1;
    let count = 0;

    // Loop through each file and copy it to the batch folder
    files.forEach((file) => {
      if (count % batchSize === 0) {
        // Create a new batch folder with just the batch number
        const batchFolder = path.join(destinationBaseFolder, `${batchNumber}`);
        if (!fs.existsSync(batchFolder)) {
          fs.mkdirSync(batchFolder);
          console.log(`Created batch folder: ${batchFolder}`);
        }
        batchNumber++;
      }

      // Copy the file to the current batch folder
      const oldPath = path.join(sourceFolder, file);
      const newPath = path.join(
        destinationBaseFolder,
        `${batchNumber - 1}`,
        file
      );
      fs.copyFileSync(oldPath, newPath);

      count++;
    });

    console.log('Images have been split into batches successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function
splitImages();
