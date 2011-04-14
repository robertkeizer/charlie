var fs		= require( 'fs' );
var path	= require( 'path' );
var sys		= require( 'sys' );

exports.ls = function( pipedInput, inputArgs, detail){
	var returnString		= "";
	var inputArgsSplitBySpace	= inputArgs.split( " " );

	// Check for details first..
	if( inputArgsSplitBySpace[0].trim().match( "^-[^ ]*l" ) ){
		detail		= true;
		detailhead	= true;
		delete inputArgsSplitBySpace[0];
	}

	// If there isn't a path set, set it to the current directory.
	if( inputArgsSplitBySpace[inputArgsSplitBySpace.length-1] == '' || typeof inputArgsSplitBySpace[inputArgsSplitBySpace.length-1] == 'undefined' ){
		inputArgsSplitBySpace[0] = environment["PWD"];
	}

	// Recurse if more than one path was found.
	if( inputArgsSplitBySpace.length > 1 ){
		inputArgsSplitBySpace.forEach( function( inputArg ){
			returnString += exports.ls( pipedInput, inputArg, detail ) + "\n";
		} );
	}else{
		try{
			var dircontents	= fs.readdirSync( inputArgsSplitBySpace[0] );

			// This shows the header or title for the columns..
			if( detail ){
				returnString	+= "mode\tuid\tgid\tsize\tname\n";
			}

			// Run through the contents..
			dircontents.forEach( function( dirContent ){
				if( detail ){
					var tmpStatObj	= fs.statSync( path.join( inputArgsSplitBySpace[0], dirContent ) );
					returnString += tmpStatObj.mode + "\t" + tmpStatObj.uid + "\t" + tmpStatObj.gid + "\t" + tmpStatObj.size + "\t" + dirContent + "\n";
				}else{
					returnString += dirContent + "\n";
				}
			} );
			returnString += "\n";

		}catch(err){
			return err;
		}
	}

	return returnString.trim();
}
