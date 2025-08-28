import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductsService } from './product.service';
import { CloudinaryService } from 'src/cloudinary/cloudianary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [AuthModule],
  controllers: [ProductController],
  providers: [ProductsService, CloudinaryService, PrismaService],
})
export class ProductModule {}
