// Open up stdin and set it to utf8 encoding.
var stdin	= process.openStdin( );
stdin.setEncoding( 'utf8' );

// Path is used for commandLinePaths..
var path	= require( 'path' );

// fs is needed for redirections using > and >> to write and append to files.
var fs		= require( 'fs' );

// Declare the array used for variables in the command line.
commandLineVars	= Array( );
// Hack to go along with the commandLineVars.. keep a string of the variable names seperated by commas.
commandLineVarsIndex	= "";

// Declare a simple function to map in_array from php.
function in_array( needle, haystack ){
	for( var c=0;c<haystack.length;c++ ){
		if( needle == haystack[c] ){
			return true;
		}
	}
	return false;
}

// Simple function to show the prompt.
function showPrompt( ){
	process.stdout.write( 'charlie>' );
}

function cli( inargs, args ){
	
	// First off, the args should only contain the path.
	setenv( "", "PATH " + args );

	// Define an array of in-cli function command keywords.
	// These commands will not look outside this script.
	inCliFunctions	= [ "printenv", "setenv" ];

	// Show any variables that are defined
	function printenv( incontent, args ){
		var returnString = "";
		commandLineVarsIndex.split(",").forEach( function( variableName ) {
			returnString += variableName + " = " + commandLineVars[variableName] + "\n";
		} );
		return returnString;
	}

	// Allow setting of certian in-cli variables.. such as path.
	function setenv( incontent, args ){
		var argsSplitBySpaces	= args.split( " " );
		if( argsSplitBySpaces.length != 2 ){
			return "Invalid use of setenv.\nUsage: setenv variable value\n";
		}
		
		commandLineVars[argsSplitBySpaces[0]]	= argsSplitBySpaces[1];

		// Hack to keep a seperate index of variables that are declared.
		if( commandLineVarsIndex == "" ){
			commandLineVarsIndex += argsSplitBySpaces[0];
		}else{
			commandLineVarsIndex += ","+argsSplitBySpaces[0];
		}

		return "";
	}

	// A function to facilitate replacement of $var with the value of commandLineVars[var];
	function replace_dollarsign_vars( command ){
		returnString	= command;
		// Loop through each of the variables that are set.
		commandLineVarsIndex.split(",").forEach( function( variableName ){
			returnString = returnString.replace( '$' + variableName, commandLineVars[variableName] );
		});
		return returnString;
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


		// This function actually loads the command as a module and runs it.
		function blindExecCmd( inargs, command, args ){

			// Replace variables using replace_dollarsign_vars.
			args	= replace_dollarsign_vars( args );

			// A small hack to allow in-cli function calls..
			// These should be moved outside the cli.js file.
			if( in_array( command, inCliFunctions ) ){
				// need to use RegExp and replace to remove single 's from inside inargs or args.
				return eval( command + "('" + inargs + "','" + args + "')" );
			}

			var tmpPath	= checkPathFor( command + '.js' );

			if( !tmpPath ){
				return "Invalid command ( " + command + " )\n";
			}else{
				var tmpCommandObj	= require( "./" + tmpPath );

				// Check for redirection here. > and >>.
				if( args.match( "^.*>>.*" ) ){
					// Get the file to redirect to..
					var fileToAppendTo	= args.replace( RegExp( ".*>>" ), "" ).trim();
					// Check to see if the file is relative or absolute. If it is relative, add a ./before it.
					if( !fileToAppendTo.match( "^(\.\/|\/)" ) ){
						fileToAppendTo	= "./" + fileToAppendTo;
					}
					// Strip the appending '>> anything' from the args. The trailing trim() might cause problems later on.. 
					var args		= args.replace( RegExp( ">>.*" ), "" ).trim();
					// Now run the command but append the output to a file.
					var tmpResult	= tmpCommandObj.run( inargs, args );
					// Grab the content of the file already.
					try{
						var tmpContent	= fs.readFileSync( fileToAppendTo, 'utf8' );
					}catch( e ){
						// This accounts for no such file or directory errors that arise out of using redirections.
					}

					// Make the variable an empty string if nothing..
					if( tmpContent == null ){
						var tmpContent	= "";
					}

					fs.writeFileSync( fileToAppendTo, tmpContent+tmpResult, 'utf8' );
					return "";
				// Matching simple >
				}else if( args.match( "^.*>.*" ) ){
					// Get the file to write to.
					var fileToWriteTo	= args.replace( RegExp( ".*>" ), "" ).trim();
					// Prefix with a ./ if not absolute or already has ./
					if( !fileToWriteTo.match( "^(\.\/|\/)" ) ){
						fileToWriteTo = "./" + fileToWriteTo;
					}
					// Calculate the new arguments without the > anything
					var args	= args.replace( RegExp( ">.*" ), "" ).trim();
					// Run the command
					var tmpResult	= tmpCommandObj.run( inargs, args );
					// Save the output to a file.
					fs.writeFileSync( fileToWriteTo, tmpResult, 'utf8' );
					return "";
				}else{
					return tmpCommandObj.run( inargs, args );
				}
			}
		}

		// Split by pipes if need be..
		var commandToExecuteSplitByBar = commandToExecute.split( "|" );

		// We are piping..
		if( commandToExecuteSplitByBar.length != 1 ){
			// Create a runningOutput variable so that it an be returned at the end.
			var tmpRunningOutput	= "";
			// Run through each of the pipedCommands..
			for( var tmpPipeCount=0; tmpPipeCount<commandToExecuteSplitByBar.length; tmpPipeCount++ ){
				// This includes the whole string.. command and args..
				var wholePipedCommand	= commandToExecuteSplitByBar[tmpPipeCount].trim();
				// Seperate out the command name by itself..
				var tmpCommandName	= wholePipedCommand.split( " " )[0].trim();
				// Seperate out the arguments from the whole command using the name..
				var tmpCommandArgs	= wholePipedCommand.replace( RegExp( "^" + tmpCommandName ), "" ).trim();
				// Run the command through blindExecCmd..
				tmpRunningOutput = blindExecCmd( tmpRunningOutput, tmpCommandName, tmpCommandArgs );
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
		commandLineVars['PATH'].split(":").forEach( function( singleCliPath ){
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

cli( "", ".:bin/:sbin/" );
