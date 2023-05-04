import AWS from 'aws-sdk';
import { v4 } from 'uuid';
import s3Config from '../s3Config';

const S3_BUCKET = 'plog-media';
const REGION = 'us-east-1';

AWS.config.update({
  accessKeyId: s3Config.accessKeyId,
  secretAccessKey: s3Config.secretAccessKey,
});

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

export async function uploadFileToS3(file, fileType) {
  if (!file) {
    return {};
  }
  const id = v4();
  let key = `${fileType}/${id}`;
  if (fileType === 'videos') {
    key += '.mp4';
  }
  const params = {
    Bucket: S3_BUCKET,
    Body: file,
    Key: key,
  };

  // myBucket.putObject(params).promise()
  try {
    await myBucket.upload(params).promise();
  } catch (err) {
    throw new Error(err);
  }
  return ({ id, src: `https://${S3_BUCKET}.s3.amazonaws.com/${key}` });
}

export function deleteS3File(fileName, fileType) {
  const params = {
    Bucket: S3_BUCKET,
    Key: `${fileType}/${fileName}`,
  };
  myBucket.deleteObject(params, (err, data) => {
    if (err) {
      throw (err);
    } // an error occurred
    // successful response
    console.log(`deleted ${fileType} from s3`, data);
  });
}
