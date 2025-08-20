// src/products/products.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductDto } from './product.dto';


@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: ProductDto, imageUrls: string[]) {

    return this.prisma.$transaction(async (tx) => {
      // first create the product
      const product = await tx.product.create({
        data: {
          name: createProductDto.name,
          description: createProductDto.description,
          price: createProductDto.price,
        },
      });

      // 2nd step is to create the images
      // if there are any image URLs provided, create them in the productImage table
      if (imageUrls && imageUrls.length > 0) {
        await tx.productImage.createMany({
          data: imageUrls.map((url) => ({
            url: url,
            productId: product.id,
          })),
        });
      }

      // last step is to return the created product with its images
      // this will include the images in the response
      const createdProduct = await tx.product.findUnique({
        where: { id: product.id },
        include: {
          images: true, 
        },
      });

      return {
        message: 'Product created successfully',
        ...createdProduct
      };
    });
  }
}