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
			executeCommand( chunkPart );
		} );
	}else{
		executeCommand( chunkToUse );
	}
} );

process.stdin.on( 'end', function( ){
	dropLine( );
	process.stdout.write( "Bye." );
	dropLine( );
} );

function executeCommand( commandInput ){
	commandInput	= commandInput.trim();

	if( commandInput.split( "|" ).length > 1 ){
		process.stdout.write( "Piping is not yet implemented." );
		dropLine( );
		return;
	}	

	var commandSplit	= commandInput.split( " " );
	var pathToFile		= findInPath( commandSplit[0] );
	if( pathToFile == false ){
		process.stdout.write( "The command '" + commandSplit[0] + "' was not found." );
		dropLine();
		showPrompt();
		return;
	}

	if( pathToFile.length > 1 ){
		// Prompt the user for which one?
		// Right now just use the first on in the array.. This if statement
		// should send whichever one the user chooses to pathToFile[0].. 
	}

	// Grab the command arguments only..
	var commandArguments	= commandInput.replace( RegExp( commandSplit[0] ), "" ).trim().split( " " );

	// Pause stdin traffic - on the parent..
	process.stdin.pause();

	// Spawn off the new command, passing the Fds of the parent..
	var childProc	= spawn( pathToFile[0], commandArguments, {
		customFds: [
			process.stdin,
			process.stdout,
			process.stderr
		]
	} );

	// When the child exits, make sure to resume the parent stdin.. 
	childProc.on( 'exit', function( code, signal ){
		process.stdin.resume();
		showPrompt();
	} );
}

// Grab the absolute path to this cli.js, set paths accordingly.. 
var absoluteDirPath	= process.argv[1].replace( RegExp( "\/cli\.js$" ), "" );

// Ammend the environment variable to include paths relative to this script..
process.env["PATH"]	+= ":.:" + absoluteDirPath + "/bin/";

// A function to look through environment[PATH] and find a specific file.
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
