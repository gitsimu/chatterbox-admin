// https://opentutorials.org/course/2717/11797
import aws from 'aws-sdk'
import * as formidable from 'formidable'
import AwsConfig from '../../aws.config'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async (req, res) => {
  return new Promise((resolve, reject) => {
    const s3 = new aws.S3({
      accessKeyId: AwsConfig.accessKeyId,
      secretAccessKey: AwsConfig.secretAccessKey,
      region: 'ap-northeast-2',
    })

    const form = new formidable.IncomingForm()
    form.parse(req, function(err, fields, files) {
      console.log('files', files)

      const filename = newFileName(files.file.name)
      const tagValue = fields.tag || '1month'

      var params = {
        Bucket: 'smartlog',
        Key: 'chat/' + fields.key + '/' + filename,
        ACL: 'public-read',
        Body: require('fs').createReadStream(files.file.path)
      }
      var tag = {
        tags: [
          {
            Key: 'type',
            Value: tagValue
          }
        ]
      }

      s3.upload(params, tag, function(err, data) {
      // s3.putObject(params, function(err, data) {
        if (err) {
          console.log('err', err)
        }
        res.setHeader("Access-Control-Allow-Origin", "*")
        res.setHeader("Access-Control-Allow-Headers", "Content-Type")
        res.statusCode = 200
        res.json({ result: 'success', file: { name: files.file.name, size: files.file.size, location: data.Location } })
        console.log('data', data)

        resolve()
      })
    })
  })


  // uploader(req, res, function(err) {
  //   if (err instanceof multer.MulterError) {
  //     return next(err)
  //   } else if (err) {
  //     return next(err)
  //   }
  //   // console.log('원본파일명 : ' + req.file.originalname)
  //   // console.log('저장파일명 : ' + req.file.filename)
  //   // console.log('크기 : ' + req.file.size)
  //   // console.log('경로 : ' + req.file.location) s3 업로드시 업로드 url을 가져옴
  //   res.json({
  //     result:'success',
  //     // obj: Object.keys(req)
  //   })
  // })
}

const newFileName = (filename) => {
  const extension = filename.split('.').pop()
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let result = ''

  for ( var i = 0; i < 12; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return `${result}.${extension}`
}
