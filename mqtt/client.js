const SystemData = require("../models/systemData.models");

// MQTT broker
var mqtt = require("mqtt");
var client = mqtt.connect("http://18.234.249.165:1883", {
  //open connection with your broker in AWS via websocket
  username: "shabeb1", //authenticate your broker with username and password
  password: "1234_Kassar",
});

client.on("connect", function () {
  client.subscribe("test", function (err) {
    if (!err) {
      console.log("Subscribed to test");
    }
  });
});

client.on("message", function (topic, message) {
  // message is Buffer
  console.log(topic);
  if (message.toString().localeCompare("test")) {
    var mqttMessage = JSON.parse(message.toString());
    if (mqttMessage.message == "data") {
      var req = {
        body: {
          user_id: mqttMessage.SystemID,
        },
      };
      const systemData = new SystemData({
        user_id: mqttMessage.SystemID,
        data: mqttMessage.Data,
      });

      // Save Note in the database
      systemData
        .save()
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }
});
module.exports = client;
