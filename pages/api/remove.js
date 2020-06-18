// https://opentutorials.org/course/2717/11797
import aws from 'aws-sdk';
import * as formidable from 'formidable';
import AwsConfig from '../../aws.config';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  return new Promise((resolve, reject) => {
    const s3 = new aws.S3({
      accessKeyId: AwsConfig.accessKeyId,
      secretAccessKey: AwsConfig.secretAccessKey,
      region: 'ap-northeast-2',
    })

    const form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      // console.log('files', files)
      console.log('fields', fields)

      var params = {
        Bucket: 'chatter-box-bucket',
        Key: 'chatterbox/' + fields.key + '/' + fields.filename,
      }

      s3.deleteObject(params, function(err, data) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.statusCode = 200;
        res.json({ result: 'success', data: data })
        console.log('data', data)

        resolve();
      });
    });
  });
}
