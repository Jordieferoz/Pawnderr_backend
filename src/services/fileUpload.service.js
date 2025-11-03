import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

/**
 * Upload file to AWS S3
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} originalFileName - Original file name
 * @param {string} folder - Folder path in bucket (optional)
 * @param {string} contentType - File content type
 */
export const uploadToS3 = async (fileBuffer, originalFileName, folder = '', contentType) => {
  try {
    const fileExtension = originalFileName.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const key = folder ? `${folder}/${fileName}` : fileName;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: 'public-read', // Make file publicly accessible
    };

    const uploadResult = await s3.upload(params).promise();

    return {
      success: true,
      url: uploadResult.Location,
      key: uploadResult.Key,
      bucket: uploadResult.Bucket,
    };
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload file');
  }
};

/**
 * Delete file from AWS S3
 * @param {string} key - S3 object key
 */
export const deleteFromS3 = async (key) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };

    await s3.deleteObject(params).promise();

    return {
      success: true,
      message: 'File deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw new Error('Failed to delete file');
  }
};

/**
 * Get presigned URL for file upload (for client-side direct uploads)
 * @param {string} fileName - File name
 * @param {string} folder - Folder path in bucket (optional)
 * @param {number} expiresIn - URL expiration time in seconds (default: 1 hour)
 */
export const getPresignedUploadUrl = (fileName, folder = '', expiresIn = 3600) => {
  try {
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const key = folder ? `${folder}/${uniqueFileName}` : uniqueFileName;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Expires: expiresIn,
    };

    const url = s3.getSignedUrl('putObject', params);

    return {
      success: true,
      url,
      key,
    };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error('Failed to generate upload URL');
  }
};

/**
 * Get presigned URL for file download
 * @param {string} key - S3 object key
 * @param {number} expiresIn - URL expiration time in seconds (default: 1 hour)
 */
export const getPresignedDownloadUrl = (key, expiresIn = 3600) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Expires: expiresIn,
    };

    const url = s3.getSignedUrl('getObject', params);

    return {
      success: true,
      url,
    };
  } catch (error) {
    console.error('Error generating download URL:', error);
    throw new Error('Failed to generate download URL');
  }
};

