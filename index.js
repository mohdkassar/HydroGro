const bodyparser = require("body-parser");
var express = require("express");
var cors = require("cors");
var app = express();
var mongoose = require("mongoose");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());

app.listen(8080, () => {
  console.log("listening");
});

//Connecting database
//=============================================================================
var configDB = require("./config/db.config");
var clinet = require("./mqtt/client");

mongoose
  .connect(configDB.url, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

require("./routes/users.routes.js")(app);
require("./routes/plants.routes.js")(app);
require("./routes/systemData.routes.js")(app);
