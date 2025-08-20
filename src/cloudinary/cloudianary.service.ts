// src/cloudinary/cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { Express } from 'express';

const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {

  uploadFile(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise<UploadApiResponse | UploadApiErrorResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('No result returned from Cloudinary'));
        resolve(result);
      });

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadFiles(files: Array<Express.Multer.File>): Promise<UploadApiResponse[]> {
    const uploadPromises = files.map(file => this.uploadFile(file) as Promise<UploadApiResponse>);
    return Promise.all(uploadPromises);
  }
}