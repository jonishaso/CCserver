/*
var server = require('dgram').createSocket("udp4");
server.bind(4003,function (){
       server.addMembership('230.111.111.111');
       server.addMembership('230.222.222.222')
    });

    server.on('listen',function(err){
      console.log("server start to litening");
      });

    server.on("message",function(msg,rinfo){
      var tmp = JSON.parse(msg);
      server.send(msg,0,msg.length,4005,'230.222.222.222');
      console.log(tmp);
    });

dns.resolve4('www.google.com', function (err, addresses) {
  if (err) throw err;

  console.log('addresses: ' + JSON.stringify(addresses));

  addresses.forEach(function (a) {
    dns.reverse(a, function (err, hostnames) {
      if (err) {
        throw err;
      }

      console.log('reverse for ' + a + ': ' + JSON.stringify(hostnames));
    });
  });
});
console.log(process.versions);
console.log(process.config);


data = {first:1, second:2};
var fun = function(str,cont){
  console.log(cont[str]);
}

fun('first',data);

var a  = {first:1,second:2};
console.log(a);
console.log(data);
if(JSON.stringify(a) === JSON.stringify(data)){console.log('yes');}
else console.log('no');

count = 3;
selftime = process.argv[2];
testing = function(){
  var server = require("dgram").createSocket("udp4");
  var client_user = require("dgram").createSocket("udp4");
  mmm = process.argv[2];
  server.bind(8002);
  intervalMulitcast = setInterval(multiCast,3*1000);
  function multiCast(){
    server.send(selftime.toString(), 0 , selftime.toString().length, 8000, '230.1.2.1');
    console.log('sending:' + mmm);
  }

  intervalDecrease = setInterval(decrease, 3.5*1000);
  function decrease(){
    if (count > 0) -- count;
    console.log(count);
    if(count <= 0){
      if(intervalMulitcast._repeat == false){ 
        mmm = process.argv[2];
        count = 3;
        intervalMulitcast = setInterval(multiCast,3*1000);
      }else {
        mmm = 'IamServer';
      }
    }
  }
  client_user.bind(8000,function(){    
    client_user.addMembership('230.1.2.1');
  });

  client_user.on("message",function(msg,rinfo){
    if(rinfo.address != '192.168.0.101') {
      if(parseInt(selftime) > parseInt(msg)){
        if(count == 0) count = 3;
        if(intervalMulitcast._repeat != false) clearInterval(intervalMulitcast);
        if(count <= 3) ++count;
      }
      else{
        if(intervalMulitcast._repeat == false) 
          intervalMulitcast = setInterval(multiCast,3*1000);
      }
      console.log("receive: " + rinfo.address + ': ' + rinfo.port);
    }
  });
}
testing();

var remote ;

try{
  remote = JSON.parse("abcd");
}
catch(e){
  console.log("failed");
  process.exit(1);
}
finally{
  console.log(remote);
}
*/

var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');

  var client_user = require("dgram").createSocket("udp4");
  
  client_user.bind(9009);

  intevalBroadcast = setInterval(broadcastNew, 1*1000);
    function broadcastNew(){
        sendMsg = "07";
        client_user.send(sendMsg, 0,sendMsg.length,10000,"230.1.2.2");
        console.log("Sending...");
    } 

  client_user.on("message",function(msg,rinfo){
    kk = JSON.parse(msg);
    console.log(kk);
  });