var fs		= require( 'fs' );

exports.ls = function( pipedInput, inputArgs, detail ){
	// This is for the path..
	if( !inputArgs || inputArgs == "" ){
		inputArgs = environment["PWD"];
	}

	var returnString		= "";
	var inputArgsSplitBySpace	= inputArgs.split( " " );

	if( inputArgsSplitBySpace.length > 1 ){

		for( var x=0; x<inputArgsSplitBySpace.length; x++ ){
			returnString += exports.ls( pipedInput, inputArgsSplitBySpace[x] );
		}
	}else{
		try{
			var dircontents	= fs.readdirSync( inputArgs );
			for( var y=0; y<dircontents.length; y++ ){

				// dircontents[y] contains one entry of the directory such as 
				// a file or another directory... 
				
				returnString += dircontents[y];
				if( y != dircontents.length -1 ){
					returnString += "\n";
				}
			}
		}catch(err){
			return err;
		}
	}

	return returnString;
}
