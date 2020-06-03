// https://opentutorials.org/course/2717/11797
import aws from 'aws-sdk';
import * as formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  return new Promise((resolve, reject) => {
    const s3 = new aws.S3({
      accessKeyId: 'AKIAIJRK3QM7RS66QL7Q',
      secretAccessKey: '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',
      region: 'ap-northeast-2',
    })

    const form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      console.log('files', files)
      console.log('fields', fields)
      var params = {
        Bucket: 'quvchat',
        Key: 'chatterbox/' + fields.key + '/' + files.file.name,
        ACL: 'public-read',
        Body: require('fs').createReadStream(files.file.path)
      }

      s3.upload(params, function(err, data){
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.statusCode = 200;
        res.json({ result: 'success', file: { name: files.file.name, size: files.file.size, location: data.Location } })
        // res.json({ result: 'success', file: data })
        // console.log('data', data)

        resolve();
      });
    });
  });


  // uploader(req, res, function(err) {
  //   if (err instanceof multer.MulterError) {
  //     return next(err);
  //   } else if (err) {
  //     return next(err);
  //   }
  //   // console.log('원본파일명 : ' + req.file.originalname)
  //   // console.log('저장파일명 : ' + req.file.filename)
  //   // console.log('크기 : ' + req.file.size)
  //   // console.log('경로 : ' + req.file.location) s3 업로드시 업로드 url을 가져옴
  //   res.json({
  //     result:'success',
  //     // obj: Object.keys(req)
  //   })
  // });
}
