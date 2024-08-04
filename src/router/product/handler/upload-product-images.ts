import { Request, Response } from 'express';
import { prisma } from '@/server';

export const uploadProductImages = async (req: Request, res: Response) => {
  const { productId } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete old images
    await prisma.image.deleteMany({
      where: {
        productId: product.id,
      },
    });

    // Optionally, delete files from the filesystem (uncomment if needed)
    // product.images.forEach(image => {
    //   const filePath = path.join(__dirname, image.url);
    //   fs.unlinkSync(filePath);
    // });

    const files = req.files as Express.Multer.File[];

    const imagePromises = files.map((file) => {
      const imageUrl = `/assets/${file.filename}`;
      const path = `/upload/${file.filename}`;

      console.log('path', path);

      return prisma.image.create({
        data: {
          url: imageUrl,
          path,
          productId: product.id,
        },
      });
    });

    await Promise.all(imagePromises);

    res
      .status(200)
      .json({ isSuccess: true, message: 'Images uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload images' });
  }
};
