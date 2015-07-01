exports.productServerList_add = function(msg,rinfo,proServerList){
	try{
      var remote = JSON.parse(msg);
      if(!remote.hasOwnProperty("versionNO") &&
         !remote.hasOwnProperty("IPaddress") &&
         !remote.hasOwnProperty("portNO") ) throw new err;
    }
    catch(e){
      console.log("unexpected product server message received " );
      return;
    }
    finally{
      remote.IPaddress = rinfo.address;
    }
    
    count = 0;
    if(proServerList.length == 0){
      proServerList.push(remote);
    }
    else{
      for(var i = 0; i < proServerList.length ; i++){
        if(remote.versionNO == proServerList[i].versionNO &&
          remote.IPaddress == proServerList[i].IPaddress &&
          remote.portNO == proServerList[i].portNO) ++count;
        else continue;
      }
      if(0 == count) proServerList.push(remote);
    }
}

exports.isPeerMessage = function(msg,rinfo){
	try{
        remote = JSON.parse(msg);
        if(	!remote.hasOwnProperty('type') ||
        	!remote.hasOwnProperty('IPaddress') ||
        	!remote.hasOwnProperty('startTime') ||
        	!remote.hasOwnProperty('missMessge')) throw new err;
      }
      catch(err){
        console.log("unexpected message received");
        return undefined;
      }
      finally{
        if(remote.type != 'CCserver') return;
        remote.IPaddress = rinfo.address; 
        return remote; 
      }
}