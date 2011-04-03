#!/usr/bin/env node

// Include required modules..
var	tty		= require( 'tty' );
var	fs		= require( 'fs' );
var	path		= require( 'path' );
var	util		= require( 'util' );
var	arguments	= require( 'arguments' );

// Set some default variables..
var	cliEnvironment	= Array( );
cliEnvironment["PATH"]	= ".";
var	cliPrefix	= "charlie-new>";

// Parse command line arguments..
arguments.parse( [
			{'name': /^(-h|--help)$/, 'expected': null, 'callback': printHelp},
			{'path': /^(-p|--path)$/, 'expected': null, 'callback': setPath}
		], main, invalidArgument );

function printHelp( ){
	console.log( "No options right now.." );
	process.exit( 1 );
}

function setPath( end, pathToSet ){
	cliEnvironment["PATH"]	= pathToSet;
}

function invalidArgument( argument, valueMissing ){
	if( valueMissing ){
		console.log( "Required argument '" + argument + "'." );
	}else{
		console.log( "Invalid argument '" + argument + "'." );
	}

	process.exit( 1 );
}
// End of parsing command line arguments..

// Find a file in the cliEnvironment["PATH"] array. Return a path or false.
function findFile( fileToFind ){
	
	// Append a .js extenion if it was not provided.
	if( fileToFind.match( RegExp( /[^\.js]$/ ) ) ){
		fileToFind+=".js";
	}

	// Go through all the paths..
	for( var pathCounter=0; pathCounter<cliEnvironment["PATH"].length; pathCounter++ ){

		// Go through all the files in the directory.
		var filesInDir	= fs.readdirSync( cliEnvironment["PATH"][pathCounter] );
		for( var fileCounter=0; fileCounter<filesInDir.length; fileCounter++ ){
			if( filesInDir[fileCounter] == fileToFind ){
				return path.join( cliEnvironment["PATH"][pathCounter], filesInDir[fileCounter] );
			}
		}
	}
	return false;
}

function showPrefix( ){
	process.stdout.write( cliPrefix );
}

// Program body..
function main( ){

	// Define variables..
	var runningCommand	= "";
	
	// Set the tty to raw mode, resume stdin.
	tty.setRawMode( true );
	process.stdin.resume( );

	// Show the cliPrefix for the first time..
	showPrefix( );

	// On key press..
	process.stdin.on( 'keypress', function( char, key ){
		
		// Run special command or..
		if( !specialCommand( char, key ) ){

			// Don't count CTRL+* if it's not a special command..
			if( !key.ctrl ){
				// Append to the runningCommand variable.
				runningCommand += char;

				// Show on stdout..
				process.stdout.write( char );
			}
		}
	} );

	// If specialCommand execute and return true.. else return false.
	function specialCommand( char, key ){

		// CTRL+D to exit..
		if( key.ctrl && key.name == 'd' ){
			process.stdout.write( "Exiting..\n" );
			process.exit( 0 );
		}

		// CTRL+C to resetLine().. 
		if( key.ctrl && key.name == 'c' ){
			process.stdout.write("\n");
			resetLine( );

			return true;
		}

		// Enter key pressed..
		if( key.name == 'enter' ){
			
			// Execute the command..
			executeCommand( runningCommand );

			// Reset the line..
			resetLine( );

			return true;
		}

		return false;
	}

	function executeCommand( cmdToExecute ){
		var fileLocation	= findFile( cmdToExecute.split( " " )[0] );

		if( !fileLocation ){
			process.stdout.write( "\nCouldn't find command '" + cmdToExecute.split( " " )[0] + "'..\n" );
		}else{
			process.stdout.write( "\nFound file location of '" + fileLocation + "'..\n" );
		}
	}

	function resetLine( ){
		showPrefix( );
		runningCommand	= "";
	}
}
