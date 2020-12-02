const SystemData = require("../models/systemData.models");

// MQTT broker
var mqtt = require("mqtt");
var client = mqtt.connect("http://34.201.69.234:1883", {
  //open connection with your broker in AWS via websocket
  username: "shabeb1", //authenticate your broker with username and password
  password: "1234_Kassar",
});

client.on("connect", function () {
  client.subscribe("message", function (err) {
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
    console.log(message.toString);
    var mqttMessage = JSON.parse(message.toString());
    console.log(mqttMessage.message.localeCompare("SR"));
    if (mqttMessage.message.localeCompare("SR") == 0) {
      console.log("------");
      const systemData = new SystemData({
        user_id: 1664,
        dataType: "Sensor Reading",
        data: [
          {
            pH: mqttMessage.TR1[5],
            EC: mqttMessage.TR1[3],
            "Water Level": mqttMessage.TR1[1],
            Temperature: mqttMessage.GR[1],
          },
          {
            pH: mqttMessage.TR2[5],
            EC: mqttMessage.TR2[3],
            "Water Level": mqttMessage.TR2[1],
            Temperature: mqttMessage.GR[1],
          },
        ],
      });
      systemData
        .save()
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else if (mqttMessage.message.localeCompare("SI") == 0) {
      console.log("------");
      const systemData = new SystemData({
        user_id: 1664,
        dataType: "System Information",
        data: {
          status: mqttMessage.SS,
          solution1: mqttMessage.BS[0],
          solution2: mqttMessage.BS[1],
          solution3: mqttMessage.BS[2],
        },
      });
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
