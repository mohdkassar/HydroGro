const SystemData = require("../models/systemData.models");

// MQTT broker
var mqtt = require("mqtt");
var client = mqtt.connect("http://34.201.69.234:1883", {
  //open connection with your broker in AWS via websocket
  username: "shabeb1", //authenticate your broker with username and password
  password: "1234_Kassar",
});

client.on("connect", function () {
  client.subscribe("test", function (err) {
    if (!err) {
      console.log("Subscribed to test");
    } else {
      console.log(err);
    }
  });
});

client.on("message", function (topic, message) {
  // message is Buffer
  console.log(topic);
  if (message.length > 0) {
    var mqttMessage = JSON.parse(message.toString());
    console.log(mqttMessage.message.localeCompare("SR"));
    if (mqttMessage.message.localeCompare("SR") == 0) {
      console.log("------");
      const systemData = new SystemData({
        user_id: 1664,
        dataType: "Sensor Reading",
        data: {
          TR1: mqttMessage.TR1,
          TR2: mqttMessage.TR2,
          GR: mqttMessage.TR2,
        },
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
