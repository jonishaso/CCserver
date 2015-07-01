var functions = require("./functions.js");
var proServerList = [];

exports.toProduct = function(){
  var client_product = require("dgram").createSocket("udp4");

  client_product.bind({port:9000},function(){    
    client_product.addMembership('230.1.2.3');
  });

  client_product.on("listening",function(){
    console.log("client_product listening .....");
  });

  client_product.on("message",function(msg,rinfo){
    functions.productServerList_add(msg,rinfo,proServerList);
    console.log(proServerList);
  });

  refreshProServerList = setInterval(cleanList, 10*1000);        
  function cleanList() {
    delete client_product._events.message;
    proServerList.forEach(function(detail){proServerList.pop(detail);});    
    if(0 == proServerList.length){
        client_product.on("message",function(msg,rinfo){
        functions.productServerList_add(msg,rinfo,proServerList);
        console.log(proServerList);
      });     
    }
  }
}
exports.proServerList = proServerList;