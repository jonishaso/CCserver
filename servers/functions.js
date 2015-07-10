
exports.isPeerMessage = function(msg,rinfo){
	try{
        remote = JSON.parse(msg);
        if(	!remote.hasOwnProperty('type') &&
        	!remote.hasOwnProperty('IPaddress') &&
        	!remote.hasOwnProperty('startTime') &&
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
