exports.setenv	= function( pipedArgs, arguments ){
	
	var splitArguments	= arguments.trim().split(" ");
	if( splitArguments.length != 2 ){
		return "Invalid use of setenv.";
	}

	try{
		environment[splitArguments[0]] = splitArguments[1];
		return "okay.";
	}catch( err ){
		return err;
	}
}
