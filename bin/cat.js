var path	= require('path');
var fs		= require('fs');

exports.run	= function( incontent, args ){
	// Set the returnVar to nothing..Fill it in after.
	var returnVar	= "";

	// If incontent is specified, simply return it..
	if( incontent != "" ){
		return incontent;
	}

	// If args are nothing.. return invalid use.
	if( args == "" ){
		return "Invalid use of cat.\nUsage: cat /path/to/file\n";
	}
	
	var argsSplitBySpace	= args.split( " " );
	// Run through each file specified..
	for( var argCount=0;argCount<argsSplitBySpace.length;argCount++ ){
		if( path.existsSync( argsSplitBySpace[argCount] ) ){
			returnVar	+= fs.readFileSync( argsSplitBySpace[argCount] );
		}else{
			return "File not found (" + argsSplitBySpace[argCount] + ")\n";
		}
	}

	return returnVar;
}
