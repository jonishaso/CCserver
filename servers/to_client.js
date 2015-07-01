
var productList = require('./to_product.js').proServerList;

exports.toClient = function(){
  var client_user = require("dgram").createSocket("udp4");
  client_user.bind({port:10000},function(){
    client_user.addMembership('230.1.2.2');
  });    
  client_user.on("listening",function(){
    console.log("cklient_user listening .....");
  });
  return client_user;
}  

exports.onMessage_user = function(client_user){
  client_user.on("message",function(msg,rinfo){
      if(0 != productList.length) mm = productList[0].IPaddress + ":" + productList[0].portNO;
      else mm = "192.168.24.126:5002";
      client_user.send(mm , 0 , mm.length ,9009,rinfo.address);
      console.log("receiving....");
  });
  console.log("---------client_user is on message----------");
}

exports.offMessage_user = function(client_user){
  if(client_user._events.hasOwnProperty('message')){
    delete client_user._events.message;
  }
  console.log("--------client_user is off message-----------");
  return client_user._events.hasOwnProperty("message");
}