// not use

// https://basketdeveloper.tistory.com/55
// https://morningbird.tistory.com/62
import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import AwsConfig from '../aws.config';

const s3 = new aws.S3({
  accessKeyId: AwsConfig.accessKeyId,
  secretAccessKey: AwsConfig.secretAccessKey,
  region: 'ap-northeast-2',
})

const storage = multerS3({
  s3: s3,
  bucket: 'quvchat', // s3 생성시 버킷명
  // contentType: multerS3.AUTO_CONTENT_TYPE,
  // storageClass: 'STANDARD',
  acl: 'public-read',   // 업로드 된 데이터를 URL로 읽을 때 설정하는 값입니다. 업로드만 한다면 필요없습니다.
  metadata: function (req, file, cb) {
    console.log('s3? meta', file.fieldname);
    cb(null, {fieldName: file.fieldname}); // 파일 메타정보를 저장합니다.
  },
  key: function (req, file, cb) {
    console.log('s3? key', file.originalname);
    cb(null, file.originalname) // key... 저장될 파일명과 같이 해봅니다.
  }
})

const upload = multer({ storage: storage }).single("file");

export default upload;
