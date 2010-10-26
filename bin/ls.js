var fs	= require('fs');
exports.run	= function( incontent, args ){
	// Args shouldn't have trailing spaces..
	args	= args.trim();
	// Should only take 1 argument.. or none..
	if( args.split( " " ).length > 1 ){
		return "Invalid use of ls.\nUsage: ls /path\n";
	}

	// Replace nothing with a dot so that 'ls' returns the current directory..
	if( args == "" ){
		args = "./";
	}

	try{
		var fileArray	= fs.readdirSync( args );

		// Run through each file in the array.. get the output.
		var returnVar	= "";
		for( var tmpFileCount=0; tmpFileCount<fileArray.length; tmpFileCount++ ){
			returnVar += fileArray[tmpFileCount] + "\n";
		}

		return returnVar;
	}catch( e ){
		return "" + e + "\n";
	}
}
