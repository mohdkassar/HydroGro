const SystemData = require("../models/systemData.models");
require("dotenv").config();

// MQTT broker
var mqtt = require("mqtt");
var client = mqtt.connect(process.env.MQTT, {
  //open connection with your broker in AWS via websocket
  username: process.env.MQTTUSERNAME, //authenticate your broker with username and password
  password: process.env.MQTTPASSWORD,
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
  console.log("MESSAGE FROM THE ESP");
  if (message.length > 0) {
    console.log(message.toString());
    try {
      var mqttMessage = JSON.parse(message.toString());
      console.log(mqttMessage.message.localeCompare("SR"));
      if (mqttMessage.message.localeCompare("SR") == 0) {
        console.log("SENSOR READING");
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
        console.log("SYSTEM INFORMATION");

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
    } catch (e) {
      console.log(e);
    }
  }
});
module.exports = client;
