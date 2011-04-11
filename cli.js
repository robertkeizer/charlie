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
	function showPrompt( ){
		process.stdout.write( "\ncli>" );
	}

	// Show the prompt for the first time.. 
	showPrompt( );

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
		var commandInputSplitBySpace	= commandInput.split( " " );
		var firstCommand		= commandInputSplitBySpace[0];
		var commandArguments		= commandInput.replace( RegExp( "^" + firstCommand ), '' ).trim( );

		var pathToFirstCommand		= findInPath( firstCommand );
		if( !pathToFirstCommand ){
			process.stdout.write( "Command '" + firstCommand + "' was not found.." );
			return;
		}

		process.stdout.write( "" + 
			eval( "require( '" + pathToFirstCommand + "' )." + firstCommand + "( '', '" + commandArguments + "' )" )
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

environment		= Array( );
environment["PATH"]	= "./:bin/";
environment["PWD"]	= process.cwd();
exports.cli( "", "" );
