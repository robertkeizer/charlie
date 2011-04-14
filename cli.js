#!/usr/bin/env node

// Include required modules..
var sys		= require( 'sys' );
var fs		= require( 'fs' );
var path	= require( 'path' );
var vm		= require( 'vm' );
var util	= require( 'util' );

exports.cli	= function( pipedInput, arguments ){
	
	// Resume the stdin readable stream..
	process.stdin.resume( );
	
	// A function to show the prompt..
	function showPrompt( first ){
		if( first ){
			process.stdout.write( "cli>" );
		}else{
			process.stdout.write( "\ncli>" );
		}
	}

	// Show the prompt for the first time.. 
	showPrompt( true );

	// When a line is recieved..
	process.stdin.on( 'data', function( chunk ){
		// Remove the trailing \n.. 
		var escapedChunk = chunk.toString().replace( RegExp( "\n$" ), "" );

		// For loop if semicolon's detected.
		var splitEscapedChunk = escapedChunk.split( ';' );
		if( splitEscapedChunk.length > 1 ){
			for( var x=0; x<splitEscapedChunk.length; x++ ){
				doCommand( splitEscapedChunk[x] );
			}
		}else{
			doCommand( escapedChunk );
		}

		// Show the prompt again.
		showPrompt( );
	} );

	process.stdin.on( 'end', function( ){ process.stdout.write("\n"); } );

	// Actually do the command.. ( parse and Execute the command - showing its output to process.stdout.. ).
	function doCommand( commandInput ){

		// Remove spaces at the beginning and end of the command..
		commandInput	= commandInput.trim();

		// Split by semicolons and recurse..
		var semiSplit	= commandInput.split( ";" );
		if( semiSplit.length > 1 ){
			for( var x=0; x<semiSplit.length; x++ ){
				if( semiSplit[x].trim() != "" ){
					doCommand( semiSplit[x] );
				}
			}
		}

		// Piping.. 
		var fullCmd	= "";
		var pipeSplit	= commandInput.split( "|" );
		for( var x=0; x<pipeSplit.length; x++ ){
			var tmpPipeSplitBySpace		= pipeSplit[x].trim().split( " " );
			var tmpPipeFirstCommand		= tmpPipeSplitBySpace[0].trim();
			var tmpPipeArguments		= pipeSplit[x].trim().replace( RegExp( "^" + tmpPipeFirstCommand ), '' ).trim();

			var tmpPathToFirstCommand	= findInPath( tmpPipeFirstCommand );
			if( !tmpPathToFirstCommand ){
				process.stdout.write( "Command '" + tmpPipeFirstCommand + "' was not found." );
				return;
			}

			// First time around, make sure to include black quotes for input args..
			if( fullCmd == "" ){
				fullCmd = "require( '" + tmpPathToFirstCommand + "' )." + tmpPipeFirstCommand + "( '', '" + tmpPipeArguments + "' )";
			}else{
				fullCmd	= "require( '" + tmpPathToFirstCommand + "' )." + tmpPipeFirstCommand + "( " + fullCmd;
				fullCmd = fullCmd + ", '" + tmpPipeArguments + "' )";
			}
		}

		// Ugly as heck.. 

		process.stdout.write( "" + 
			eval( fullCmd )
		);
		return;
	}

	// Find a file in the environment['PATH'] object's directories.. 
	// If fileToFind doesn't have a '.js' suffix, add one.. 
	function findInPath( fileToFind ){
		if( !fileToFind.match( "\.js$" ) ){ fileToFind += ".js" };

		var paths	= environment["PATH"].split( ":" );
		for( var x=0; x<paths.length; x++ ){
			try{
				var pathContent	= fs.readdirSync( paths[x] );
				for( var y=0; y<pathContent.length; y++ ){
					if( fileToFind == pathContent[y] ){
						var fullpath	= path.join( paths[x], pathContent[y] );
						if( !fullpath.match( RegExp( "^\." ) ) || !fullpath.match( RegExp( '^' + '/' ) ) ){
							fullpath = "./" + fullpath;
						}
						return fullpath;
					}
				}
			}catch( err ){
				return false;
			}
		}

		return false;
	}
}

// Grab the absolute path to this cli.js, set paths accordingly.. 
var absoluteDirPath	= process.argv[1].replace( RegExp( "\/cli\.js$" ), "" );

environment		= Array( );
environment["PATH"]	= absoluteDirPath + ":" + absoluteDirPath + "/bin/";
environment["PWD"]	= process.cwd();
exports.cli( "", "" );
