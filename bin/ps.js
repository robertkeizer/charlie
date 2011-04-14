var linux	= require( 'linux-util' );
exports.ps	= function( pipedInput, inArgs ){
	var returnString	= "PID\tUID\tGID\tState\t\tCommand\n";
	linux.ps().forEach( function( psObj ){
		returnString += psObj['pid'] + "\t" + psObj['uid'] + "\t" + psObj['gid'] + "\t" + psObj['state'] + "\t";
		if( psObj['cmdline'] ){
			returnString += psObj['cmdline'].substr(0,80) + "\n";
		}else{
			returnString += psObj['name'] + "\n";
		}
	} );
	return returnString.trim();
}
