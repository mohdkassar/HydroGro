const S3 = require("../awsS3Config");

// Enter the name of the bucket that you have created here
const BUCKET_NAME = "shabeb";

const uploadFile = (file, name, callback) => {
  if (file != null) {
    var params = {
      Bucket: BUCKET_NAME,
      Key: name,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    S3.upload(params, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        return callback({
          Location: data.Location,
        });
      }
    });
  } else {
    return callback({
      Location: "",
    });
  }
};
module.exports = {
  uploadFile,
};
