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
      console.log('fields', fields)

      var params = {
        Bucket: 'chatter-box-bucket',
        Key: 'chatterbox/' + fields.key + '/' + files.file.name,
        ACL: 'public-read',
        Body: require('fs').createReadStream(files.file.path)
      }

      s3.upload(params, function(err, data) {
        res.setHeader("Access-Control-Allow-Origin", "*")
        res.setHeader("Access-Control-Allow-Headers", "Content-Type")
        res.statusCode = 200
        res.json({ result: 'success', file: { name: files.file.name, size: files.file.size, location: data.Location } })
        console.log('data', data)

        resolve()
      })
    })
  })
}
