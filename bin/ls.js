var fs		= require( 'fs' );

exports.ls = function( pipedInput, inputArgs, detail ){
	// This is for the path..
	if( !inputArgs || inputArgs == "" ){
		inputArgs = environment["PWD"];
	}

	var returnString		= "";
	var inputArgsSplitBySpace	= inputArgs.split( " " );

	if( inputArgsSplitBySpace.length > 1 ){
		inputArgsSplitBySpace.forEach( function( inputArg ){
			returnString += exports.ls( pipedInput, inputArg, detail );
		} );
	}else{
		try{
			var dircontents	= fs.readdirSync( inputArgs );
			dircontents.forEach( function( dirContent ){
				returnString += dirContent + "\n";
			} );
			returnString	= returnString.trim();

		}catch(err){
			return err;
		}
	}

	return returnString;
}
