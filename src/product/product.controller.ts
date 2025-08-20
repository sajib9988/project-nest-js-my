import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './product.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductDto } from './product.dto';
import { CloudinaryService } from 'src/cloudinary/cloudianary.service';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('create')
  @UseInterceptors(FilesInterceptor('files', 5))
  async createProduct(
    @Body('data') data: string,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    let createProductDto: ProductDto;

    // ✅ JSON parse check
    try {
      createProductDto = JSON.parse(data);
    } catch (error) {
      throw new BadRequestException('Invalid product data provided.');
    }

    try {
      let imageUrls: string[] = [];
      if (files && files.length > 0) {
        const uploadImages = await this.cloudinaryService.uploadFiles(files);
        imageUrls = uploadImages.map((image) => image.secure_url);
      }

      return this.productService.create(createProductDto, imageUrls);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }
}
