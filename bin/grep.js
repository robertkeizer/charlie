exports.grep	= function( inargs, arguments ){
	var returnString	= "";
	if( inargs == "" ){
		return "Grep does not support files yet. Pipe to grep.";
	}

	var inArgsSplit	= inargs.split( "\n" );
	for( var lineNum=0; lineNum<inArgsSplit.length; lineNum++ ){
		if( inArgsSplit[lineNum].match( RegExp( arguments ) ) ){
			returnString += inArgsSplit[lineNum] + "\n";
		}
	}

	return returnString.replace( RegExp( "\n$" ), "" );
}
