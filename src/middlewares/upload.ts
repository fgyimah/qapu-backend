import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { RequestHandler } from 'express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FILE_SIZE = process.env.UPLOAD_FILE_SIZE || 10485760; // 10MB

/**
 * Returns an upload middleware which automatically handles file upload
 * and attaches the new URL to the body
 * Function reads the node environment and uses the appropriate file upload
 *
 * Other options included are:
 * - No file larger than the `FILE_SIZE`
 */
export function uploadFile({
  single,
  field,
  fields,
}: {
  single: boolean;
  field: string;
  fields?: string[];
}): RequestHandler {
  const options: multer.Options = {
    limits: {
      fileSize: Number.parseInt(FILE_SIZE as string, 10),
    },
  };

  switch (process.env.NODE_ENV) {
    case 'development':
      options.storage = new CloudinaryStorage({
        cloudinary,
        params: { folder: 'dev' },
      });
      break;

    case 'production':
      options.storage = new CloudinaryStorage({
        cloudinary,
        params: { folder: 'uploads' },
      });
      break;

    default:
      options.storage = multer.memoryStorage();
  }

  const upload = multer(options);

  if (single) {
    return upload.single(field);
  } else if (fields) {
    return upload.fields(fields.map((field) => ({ name: field, maxCount: 1 })));
  } else {
    return upload.array(field);
  }
}
