const AWS = require("aws-sdk");
require("dotenv").config();

// Enter copied or downloaded access id and secret here
const ID = process.env.ID;
const SECRET = process.env.SECRET;

// Initializing S3 Interface
const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});

module.exports = s3;
