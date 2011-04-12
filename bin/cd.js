var fs		= require( 'fs' );
var path	= require( 'path' );
exports.cd	= function( pipedArgs, inArgs ){
	var currentDir	= environment["PWD"];
	try{
		var pathToCdInto	= path.join( currentDir, inArgs );
		var tmpStatObj	= fs.statSync( pathToCdInto );
		if( tmpStatObj.isDirectory() ){
			process.chdir( pathToCdInto );
			environment["PWD"]	= process.cwd();
			return "Changed directory to '" + pathToCdInto + "'";
		}else{
			return pathToCdInto + " is not a directory.";
		}
	}catch(err){
		return err;
	}
}
