var fs	= require('fs');

exports.help = function( pipedArguments, inargs ){
	returnVar	= "Available commands are: \n";
	var envPaths	= environment["PATH"].split(":");
	for( var x=0; x<envPaths.length; x++ ){
		var dirContent	= fs.readdirSync( envPaths[x], 'utf8' );
		for( var y=0; y<dirContent.length; y++ ){
			if( dirContent[y].match( "\.js$" ) ){
				returnVar += dirContent[y].replace( RegExp( "\.js$" ), "" ) + "\n";
			}
		}
	}
	return returnVar.replace( RegExp( "\n$" ), "" );
}
