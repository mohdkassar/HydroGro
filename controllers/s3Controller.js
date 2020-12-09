const S3 = require("../awsS3Config");
require("dotenv").config();

// Enter the name of the bucket that you have created here
const BUCKET_NAME = process.env.BUCKET_NAME;

const uploadFile = (file, name, callback) => {
  console.log("FILE TO BE UPLOADED ON S3: ");
  console.log(file);
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
