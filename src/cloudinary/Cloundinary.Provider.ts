import { CLOUDINARY } from "./constants";
import { ConfigService, ConfigModule } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
    provide: CLOUDINARY,
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        return cloudinary;
    },
    inject: [ConfigService],
};