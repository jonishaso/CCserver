
/*
      Only smaller start-up time is useful for current server. As this remote server may be 
      a candidate of master server, then we keep the remote status into the record and set an 
      additional figure in remote object for marking its amount of unreceived multi-cast 
      messages, if the amount is exceed three, there is action about setting five seconds of 
      timer. In this five seconds, it is still possible to cancel this timer in condition of 
      receiving message again. If after five seconds, the stand-by CCserver is going to send 
      a message of given content, Then all CCservers will transfer its status to seeking-master, 
      every sever need to multi-cast its type, start-up time and IP address. If it received a 
      message of smaller start-up time, it will shut down interval multi-cast automatically and 
      remain information of message no mater how start-up time this is.the receiver of this message 
      have to shut down its to_client socket for banning service for client side. In this way, 
      the system would finished seeking status ASAP as a whole and less the server which do 
      multi-cast. Afterwards, the slave server will modify its master server.
*/

var functions = require('./functions.js');
var toClientFunction = require("./to_client.js"); 
var selfBeMaster = 3;
var selfStatus = {type:'CCserver'
                ,IPaddress:''
                ,startTime:0
                ,missMessge:3
                };
var masterServer;
// only store one premium server

exports.peering = function(){
    var server = require('dgram').createSocket("udp4");
    var client_peer = require("dgram").createSocket("udp4");
    var client_user = toClientFunction.toClient();

    selfStatus.startTime = Date.now();
    mmm = selfStatus.startTime;
    
    server.bind(function(){
      server.setBroadcast(true);
      server.setMulticastTTL(24);
      server.setMulticastLoopback(true); 
      console.log( "server information is :" + JSON.stringify(server.address()));
    });

    intervalBroadcast = setInterval(broadcastNew, 2*1000);
    function broadcastNew() {
        var mm = JSON.stringify(selfStatus);
        server.send(mm, 0, mm.length, 8000,"230.1.2.1");
        // console.log("Sending  " + mmm);
      }

    intervalCheck = setInterval(addMissMessage, 2.2*1000);
    function addMissMessage(){
      if(masterServer == undefined ){
        if(selfBeMaster >= 0) --selfBeMaster;
        if(selfBeMaster < 0) {
          masterServer = selfStatus;
          mmm = selfStatus.startTime;
          selfBeMaster = 3;
          if(intervalBroadcast._repeat == false) 
            intervalBroadcast = setInterval(broadcastNew,2*1000);
          if( !client_user._events.hasOwnProperty('message'))
            toClientFunction.onMessage_user(client_user);
        }
        console.log('selfBeMaster timer ' + selfBeMaster);
      }
      else{
        if(masterServer.missMessge > 0) --masterServer.missMessge;
        if(masterServer.missMessge <= 0) masterServer = undefined;
        // if(masterServer != undefined) console.log("masterServer missMessge " + masterServer.missMessge);
      }    
    }

    client_peer.bind(8000,function(){
      client_peer.addMembership('230.1.2.1');
      console.log("client information is :" + JSON.stringify(client_peer.address()));     
    });

    client_peer.on("message",function(msg,rinfo){
      var remote = functions.isPeerMessage(msg,rinfo);
      if (remote == undefined) return;
      
      if(masterServer == undefined){
        if(remote.startTime >= selfStatus.startTime){
          delete remote;
        }
        else{
          masterServer = remote;
          if(intervalBroadcast._repeat == true)
            clearInterval(intervalBroadcast);
          if(client_user._events.hasOwnProperty('message'))
            toClientFunction.offMessage_user(client_user);
        }
      }
      
      else{
        if(remote.startTime < masterServer.startTime){
          masterServer = remote;
          if(intervalBroadcast._repeat == true) 
            clearInterval(intervalBroadcast);
          if(client_user._events.hasOwnProperty('message'))
            toClientFunction.offMessage_user(client_user);
        }
        else if(remote.startTime == masterServer.startTime){
          if(masterServer.missMessge < 3)
            ++masterServer.missMessge;
          if(intervalBroadcast._repeat == false && masterServer.startTime == selfStatus.startTime) 
            intervalBroadcast = setInterval(broadcastNew, 2*1000);
          if(intervalBroadcast._repeat == true && masterServer.startTime != selfStatus.startTime)
            clearInterval(intervalBroadcast);
        }
        else{
          delete remote;
        }
      }                
    });
}