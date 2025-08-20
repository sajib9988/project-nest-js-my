// src/cloudinary/cloudinary.module.ts
import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from './Cloundinary.Provider';
import { CloudinaryService } from './cloudianary.service';

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {} 