// Open up stdin and set it to utf8 encoding.
var stdin	= process.openStdin( );
stdin.setEncoding( 'utf8' );

// Path is used for commandLinePaths..
var path	= require( 'path' );

function cli( cliPath ){

	// Simple function to show the prompt..
	function showPrompt( ){
		process.stdout.write( 'charlie>' );
	}

	// This parses and executes the command.
	function executeCommand( commandToExecute ){

		// Allow for the enter key to be pressed without an argument..
		if( commandToExecute == "" ){
			return "";
		}

		// Split by semicolons and call thyself!
		var commandToExecuteSplitBySemicolons	= commandToExecute.split(";");
		// This if makes sure infinite loops don't happen.
		if( commandToExecuteSplitBySemicolons.length != 1 ){
			// Process everything before returning anything..
			var totalReturn	= "";
			for( var tmpSemicolonCount=0; tmpSemicolonCount<commandToExecuteSplitBySemicolons.length; tmpSemicolonCount++ ){
				if( commandToExecuteSplitBySemicolons[tmpSemicolonCount] != "" ){
					totalReturn += executeCommand( commandToExecuteSplitBySemicolons[tmpSemicolonCount].trim() );
				}
			}
			return totalReturn;
		}


		// Define a function that will only be used internally..
		// This function actually loads the command as a module and runs it.
		function blindExecCmd( inargs, command, args ){
			var tmpPath	= checkPathFor( command + '.js' );
			if( !tmpPath ){
				return "Invalid command( " + command + " )\n";
			}else{
				var tmpCommandObj	= require( "./" + tmpPath );
				return tmpCommandObj.run( inargs, args );
			}
		}

		// Split by pipes if need be..
		var commandToExecuteSplitByBar = commandToExecute.split( "|" );

		// We are piping..
		if( commandToExecuteSplitByBar.length != 1 ){
			// Go through each piped cmd.. 
			// Use some sneaky code: alpha; bravo; charlie; becomes charlie( bravo( alpha( "", "" ), "" ), "" )
			// So grab the output of each and feed it into the next..

			var tmpRunningOutput	= "";
			for( var tmpPipeCount=0; tmpPipeCount<commandToExecuteSplitByBar.length; tmpPipeCount++ ){
				// commandToExecuteSplitByBar[tmpPipeCount] contains the individual command and arguments.
				var tmpPipedCommand	= commandToExecuteSplitByBar[tmpPipeCount].split(" ")[0];
				
				// Calcuate what the arguments for the particular command are..
				var tmpPipedCommandArg	= commandToExecuteSplitByBar[tmpPipedCount].replace( RegExp( "^" + tmpPipedCommand ), "" ).trim();

				// Run the command through blindExecCmd..
				tmpRunningOutput = blindExecCmd( tmpRunningOutput, tmpPipedCommand, tmpPipedCommandArg );
			}

			return tmpRunningOutput;
		}else{
			// No pipes.. simple command.
			var tmpCommandName	= commandToExecute.split( " " )[0];
			var tmpCommandArg	= commandToExecute.replace( RegExp( "^" + tmpCommandName ), "" ).trim();
			return blindExecCmd( "", tmpCommandName, tmpCommandArg );
		}

	}

	// Run through all the paths in cliPath. Return the path to the file in question
	// if found. Return false if not found in any of the paths.
	function checkPathFor( filename ){
		var returnPath	= false;
		// Go through each path and check to see if the file exists.
		cliPath.split(":").forEach( function( singleCliPath ){
			if( path.existsSync( path.join( singleCliPath, filename ) ) ){
				returnPath = path.join( singleCliPath, filename );
			}
		} );

		return returnPath;
	}

	// Show the prompt the first time..
	showPrompt();

	// Read in data from stdin. Since this only gets executed on newlines, we can
	// simply trim it and send it off to executeCommand.
	stdin.on( 'data', function( chunk ){
		// Pass off to executeCommand. Trimming in the process.
		var tmpReturn = executeCommand( chunk.trim() );
		// Display the result..
		process.stdout.write( tmpReturn );
		// Show the prompt again.
		showPrompt( );
	});

	// Say goodbye when stdin is closed.
	stdin.on( 'end', function( ){
		process.stdout.write( '\nGoodbye.\n' );
	});
};

cli( "bin/:sbin/" );
