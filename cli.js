#!/usr/bin/env node

// Include required modules..
var sys		= require( 'sys' );

exports.cli	= function( pipedInput, environment, arguments ){
	
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

		
		process.stdout.write( "Got chunk of '" + escapedChunk + "'" );

		// Show the prompt again.
		showPrompt( );
	} );

	process.stdin.on( 'end', function( ){
		process.stdout.write( "\nGoodbye.\n" );
	} );
}

var environmentObj	= Array( );
environmentObj["PATH"]	= ".:bin/";


exports.cli( "", environmentObj, "" );
