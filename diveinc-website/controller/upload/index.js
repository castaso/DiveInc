`use strict`

const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

const baseUrl = `https://diveinc.sgp1.digitaloceanspaces.com/`
const spacesEndpoint = new aws.Endpoint('sgp1.digitaloceanspaces.com')
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: '5XD2N3PUCL2TYX7JCYOD',
  secretAccessKey: '7IgnA39EzRfp+Klmh59JMaijbr+OsZhqJlbOVm/PX7Q'
})

const uploadImage = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'diveinc',
      acl: 'public-read',
      key: function (request, file, cb) {
        //console.log(file);
        let dateTime = new Date().getTime()
        let checkName = file.originalname.replace(/ +(?= )/g,'')
        let name = checkName.replace(" ", "-")
        cb(null, 'image/'+dateTime +"-"+ name)
      }
    })
  }).array('upload', 1)

  const uploadVideo = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'diveinc',
      acl: 'public-read',
      key: function (request, file, cb) {
        console.log(file);
        let dateTime = new Date().getTime()
        let checkName = file.originalname.replace(/ +(?= )/g,'')
        let name = checkName.replace(" ", "-")
        cb(null, 'video/'+dateTime +"-"+ name)
      }
    })
  }).array('upload', 1)

  const uploadFile = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'diveinc',
      acl: 'public-read',
      key: function (request, file, cb) {
        console.log(file);
        let dateTime = new Date().getTime()
        let checkName = file.originalname.replace(/ +(?= )/g,'')
        let name = checkName.replace(" ", "-")
        cb(null, 'file/'+dateTime +"-"+ name)
      }
    })
  }).array('upload', 1)

module.exports = {
    image : async (request, response) => {

        uploadImage(request, response, function (error) {
            if (error) {
              console.log(error)
              return response.status(500).send({success : false, message : "Internal server error"})
            }
            console.log(request.files)
            request.files[0].baseUrl = baseUrl
            return response.status(200).send({success : true, message : "Upload image successfully", data : request.files[0]})
          })
    },
    video : async (request,response) => {

        uploadVideo(request, response, function (error) {
            if (error) {
              console.log(error)
              return response.status(500).send({success : false, message : "Internal server error"})
            }
            console.log(request.files)
            request.files[0].baseUrl = baseUrl
            return response.status(200).send({success : true, message : "Upload image successfully", data : request.files[0]})
          })
    },
    file : async (request,response) => {

        uploadFile(request, response, function (error) {
            if (error) {
              console.log(error)
              return response.status(500).send({success : false, message : "Internal server error"})
            }
            console.log(request.files)
            request.files[0].baseUrl = baseUrl
            return response.status(200).send({success : true, message : "Upload image successfully", data : request.files[0]})
          })
    }
}