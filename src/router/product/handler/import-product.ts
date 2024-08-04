import { prisma, productImportDir, uploadsDir } from '@/server';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

export const importProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const folderNames = fs
      .readdirSync(productImportDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const folderName of folderNames) {
      let product = await prisma.product.findUnique({
        where: { ixoneID: folderName },
      });

      if (!product) {
        // Create a new product if it doesn't exist
        let createdProduct = await prisma.product.create({
          data: {
            ixoneID: folderName,
          },
        });

        const imageFiles = fs.readdirSync(
          path.join(productImportDir, folderName)
        );

        const imagePromises = imageFiles.map((file) => {
          const filePath = path.join(productImportDir, folderName, file);
          const uniqueSuffix = Date.now();
          const newFileName = `product__${folderName}__${uniqueSuffix}${path.extname(
            file
          )}`;

          const newFilePath = path.join(uploadsDir, newFileName);
          fs.copyFileSync(filePath, newFilePath);

          const imageUrl = `/assets/${newFileName}`;

          console.log('New path', path);

          return prisma.image.create({
            data: {
              url: imageUrl,
              path: newFilePath,
              productId: createdProduct.id,
            },
          });
        });

        await Promise.all(imagePromises);
      } else {
        console.log(
          `Product with ixoneID ${folderName} already exists, skipping...`
        );
      }
    }

    res
      .status(200)
      .json({ isSuccess: true, message: 'All images uploaded successfully' });
  } catch (error) {
    next(error);
  }
};
