var fs		= require( 'fs' );
var path	= require( 'path' );

exports.cat	= function( pipedArgs, inArgs ){
	var returnString	= "";
	if( pipedArgs == "" && inArgs == "" ){
		return "Invalid use of cat.";
	}
	
	if( pipedArgs != "" ){
		return pipedArgs;
	}

	try{
		var argSplit	= inArgs.split( " " );
		if( argSplit > 1 ){
			argSplit.forEach( function( arg ){
				returnString += exports.cat( '', arg );
			} );
			return returnString;
		}

		if( !( inArgs.match( "^/" ) || inArgs.match( "^\." ) ) ){
			inArgs	= path.join( environment["PWD"], inArgs );
		}

		var tmpStat	= fs.statSync( inArgs );
		if( !tmpStat.isFile() ){
			return "Cat error: '" + inArgs + "' is not a file.";
		}

		returnString	= fs.readFileSync( inArgs, 'utf8' );
	}catch( err ){
		return err;
	}

	return returnString;
}
