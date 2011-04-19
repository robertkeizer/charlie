#!/usr/bin/env node
var sys		= require('sys');
var fs		= require('fs');

var pathToUse		= Array( );
var returnString	= "";

// process.argv[2] contains the first real argument passed..
if( process.argv[2] == "" ){
	pathToUse[0]	= ".";
}else{
	for( var x=2; x<process.argv.length; x++ ){
		pathToUse[x-2]	= process.argv[x];
	}
}

// Path to use contains a valid array of arguments..
pathToUse.forEach( function( path ){
	try{
		var tmpContents	= fs.readdirSync( path );
		tmpContents.forEach( function( content ){
			returnString += content + "\n";
		} );
	} catch( err ){
		console.log( err );
		process.exit(1);
	}
} );


process.stdout.write( returnString );
