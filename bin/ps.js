var linux	= require( 'linux-util' );
exports.ps	= function( pipedInput, inArgs ){
	var detail = false;
	if( inArgs.match( "x" ) ){
		detail = true;
	}
	var returnString	= "PID\t";
	if( detail ){
		returnString += "UID\tGID\tState";
	}
	returnString += "\tCommand\n";

	linux.ps().forEach( function( psObj ){
		returnString += psObj['pid'] + "\t";
		if( detail ){
			returnString += psObj['uid'] + "\t" + psObj['gid'] + "\t" + psObj['state'] + "\t";
		}
		if( psObj['cmdline'] ){
			returnString += psObj['cmdline'].substr(0,80) + "\n";
		}else{
			returnString += psObj['name'] + "\n";
		}
	} );
	return returnString.trim();
}
