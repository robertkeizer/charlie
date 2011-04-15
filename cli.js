#!/usr/bin/env node

// Include required modules..
var fs		= require( 'fs' );
var path	= require( 'path' );
var vm		= require( 'vm' );

exports.cli	= function( pipedInput, arguments ){
	
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

		showPrompt( );
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
			dropLine( );
			return;
		}

		if( pathToFile.length > 1 ){
			// Prompt the user for which one?
			// Right now just use the first on in the array.. This if statement
			// should send whichever one the user chooses to pathToFile[0].. 
		}
	
		// This works for now. Will use child processes in the future.
		var vmSandbox	= { 'environment': environment, 'require': require, 'process': process };

		vm.runInNewContext( fs.readFileSync( pathToFile[0], 'utf8' ), vmSandbox, pathToFile[0] )
	}
}

// Grab the absolute path to this cli.js, set paths accordingly.. 
var absoluteDirPath	= process.argv[1].replace( RegExp( "\/cli\.js$" ), "" );

// Create an environment variable.
environment			= Array( );
environment["NODE_PATH"]	= process.execPath;
environment["PATH"]		= absoluteDirPath + ":" + absoluteDirPath + "/bin/";
environment["PWD"]		= process.cwd();

// A function to look through environment[PATH] and find a specific file.
function findInPath( fileToFind ){
	var returnArray	= Array( );
	environment["PATH"].split( ":" ).forEach( function( pathToSearch ){
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

// Start the cli.
exports.cli( "", "" );
