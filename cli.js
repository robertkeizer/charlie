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

		// Split by semicolons and call thyself!
		var commandToExecuteSplitBySemicolons	= commandToExecute.split(";");
		// This if makes sure infinite loops don't happen.
		if( commandToExecuteSplitBySemicolons.length != 1 ){
			// Process everything before returning anything..
			var totalReturn	= "";
			for( var tmpSemicolonCount=0; tmpSemicolonCount<commandToExecuteSplitBySemicolons.length; tmpSemicolonCount++ ){
				if( commandToExecuteSplitBySemicolons[tmpSemicolonCount] != "" ){
					totalReturn += executeCommand( commandToExecuteSplitBySemicolons[tmpSemicolonCount] );
				}
			}
			return totalReturn;
		}

		// Split by pipes if need be..
		var commandToExecuteSplitByBar = commandToExecute.split( "|" );

		// Set the variable realCommandToExecute so that the next if statement doesn't has to in each.
		var realCommandToExecute = "";

		// We are piping..
		if( commandToExecuteSplitByBar.length != 1 ){
			// Go through each piped cmd.. 
			// Use some sneaky code: alpha; bravo; charlie; becomes charlie( bravo( alpha( "", "" ), "" ), "" )
			// So grab the output of each and feed it into the next..
			for( var tmpPipeCount=0; tmpPipeCount<commandToExecuteSplitByBar.length; tmpPipeCount++ ){
				// commandToExecuteSplitByBar[tmpPipeCount] contains the individual command and arguments.
			}
		}else{
			// Don't re-write any commands.
			realCommandToExecute = commandToExecute;
		}

		var tmpPath	= checkPathFor( realCommandToExecute.split( " " )[0] + '.js' );
		if( !tmpPath ){
			return "Command not found.\n";
		}else{
			return "Found the file.." + tmpPath + "\n";
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
