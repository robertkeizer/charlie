#!/usr/bin/env node

// Include required modules..
var fs		= require( 'fs' );
var path	= require( 'path' );
var sys		= require( 'sys' );
var spawn	= require( 'child_process' ).spawn;

// Resume the stdin readable stream..
process.stdin.resume( );

// A function to drop a line..
function dropLine( ){
	process.stdout.write( "\n" );
}

// A function to show the prompt..
function showPrompt( ){
	process.stdout.write( "cli>" );
}

showPrompt( );

// When a line is recieved..
process.stdin.on( 'data', function( chunk ){

	var chunkToUse	= chunk.toString( ).replace( RegExp( "\n$" ), "" );

	if( chunkToUse == "" ){
		showPrompt( );
		return;
	}

	var chunkSplitSemi	= chunkToUse.split( ';' );
	if( chunkSplitSemi.length > 1 ){
		chunkSplitSemi.forEach( function( chunkPart ){
			parseCommand( chunkPart );
		} );
	}else{
		parseCommand( chunkToUse );
	}
} );

process.stdin.on( 'end', function( ){
	dropLine( );
	process.stdout.write( "Bye." );
	dropLine( );
} );

function parseCommand( commandInput ){
	// Trim the incoming input..
	commandInput	= commandInput.trim();

	// Split by bar.
	var commandSplitByBar	= commandInput.split( "|" );

	if( commandSplitByBar.length > 1 ){
		// Piping.. 
		// Create a stream instance here..

		for( var x=0; x<commandSplitByBar.length; x++ ){
			// run through executeCommand with the commands and arguments..
			// change the customFds to be in a stream..
		}

		dropLine( );
		showPrompt( );
		return;
	}else{
		// No pipes detected.. 
		var commandSplit	= commandInput.split( " " );
		var pathToFile		= findInPath( commandSplit[0] );
		if( pathToFile == false ){
			process.stdout.write( "The command '" + commandSplit[0] + "' was not found." );
			dropLine();
			showPrompt();
			return;
		}

		// Grab the command arguments only..
		var commandArguments	= getCommandArguments( commandInput );

		executeCommand( pathToFile[0], commandArguments, {
			customFds: [
				process.stdin,
				process.stdout,
				process.stderr
			]
		} );
	}
}

function getCommandArguments( inputCommand ){
	var commandSplit	= inputCommand.split( " " );
	var commandArguments	= inputCommand.replace( RegExp( commandSplit[0] ), "" ).trim().split( " " );
	if( commandArguments == "" ){
		commandArguments = null;
	}

	return commandArguments;
}

function executeCommand( pathToFile, commandArguments, optionsObj ){
	// Pause stdin traffic - on the parent..
	process.stdin.pause();

	// Spawn off the new command, passing the Fds of the parent..
	var childProc	= spawn( pathToFile, commandArguments, optionsObj );

	// When the child exits, make sure to resume the parent stdin.. 
	childProc.on( 'exit', function( code, signal ){
		process.stdin.resume();
		showPrompt();
	} );
}

// Grab the absolute path to this cli.js, set paths accordingly.. 
var absoluteDirPath	= process.argv[1].replace( RegExp( "\/cli\.js$" ), "" );

// A function to look through process.env[PATH] and find a specific file.
function findInPath( fileToFind ){
	var returnArray	= Array( );
	process.env["PATH"].split( ":" ).forEach( function( pathToSearch ){
	try{
		fs.readdirSync( pathToSearch ).forEach( function( pathContent ){
			if( pathContent == fileToFind ){
				returnArray.push( path.join( pathToSearch, pathContent ) );
			}
			} );
		}catch( err ){
			// Do nothing with the error..
		}
	} );

	if( returnArray.length == 0 ){
		return false;
	}else{
		return returnArray;
	}
}
