exports.kill	= function( pipedArgs, inputArgs ){
	var returnString = "";
	var splitInputArgs	= inputArgs.split( " " );
	if( splitInputArgs.length > 1 ){
		splitInputArgs.forEach( function( arg ){
			returnString += exports.kill( '', arg );
		} );
		return returnString;
	}

	try{
		process.kill( inputArgs, 'SIGKILL' );
		returnString += "Killed '" + inputArgs + "'. ";
	}catch( err ){
		returnString += err;
	}
	
	return returnString;
}
