const AWS = require('aws-sdk');

// Initialize the AWS SDK with your region
AWS.config.update({ region: 'us-east-1' });

// Create an AWS S3 client
const s3 = new AWS.S3();

async function uploadFile() {
  try {
    // Specify your bucket name
    const bucketName = '<FMI_1>';

    // Specify the local file path
    const filename = '/home/ec2-user/environment/pythonnodejs-lab6.1/resources/website/config.js';

    // Specify the S3 key (object key) for the file
    const s3Key = 'config.js';

    // Upload the file to S3 with the specified content type and cache control
    await s3.upload({
      Bucket: bucketName,
      Key: s3Key,
      Body: require('fs').createReadStream(filename),
      ContentType: 'application/js',
      CacheControl: 'max-age=0',
    }).promise();

    console.log('DONE');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Call the uploadFile function to upload the file to S3
uploadFile();
