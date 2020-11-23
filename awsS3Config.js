const AWS = require("aws-sdk");

// Enter copied or downloaded access id and secret here
const ID = "AKIA2XGNFJWUSRRAQNP4";
const SECRET = "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";

// Initializing S3 Interface
const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});

module.exports = s3;
