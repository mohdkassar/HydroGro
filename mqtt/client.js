// MQTT broker
var mqtt = require("mqtt");
var client = mqtt.connect("http://18.234.249.165", {
  //open connection with your broker in AWS via websocket
  username: "shabeb", //authenticate your broker with username and password
  password: "1234_Kassar",
});
module.exports = client;
