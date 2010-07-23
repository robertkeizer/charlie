sys = require( "sys" ), fs = require( "fs" ), stdin = process.openStdin();
stdin.setEncoding('utf8');

function commandLine( path ){
	paths	= path.split(":");

	function autoload( functionName ){

		var contents	= false;
		for( var k = 0; (k<paths.length && contents==false); k++ ){
			var tmpContent	= "";
			try{
				tmpContent = fs.readFileSync( paths[k]+functionName+".js", "utf8" );
			}catch( e ){
				// do nothing..
			}
			if( tmpContent !== "" ){
				contents = tmpContent;
			}
		}

		// passed to be evaled..
		if( contents == false ){
			return "// do nothing";
		}else{
			return contents;
		}
	}

	function numRows( ){
		return process.binding('stdio').getRows();
	}

	function numColumns( ){
		return process.binding('stdio').getColumns();
	}

	function parseCmdLine( cmdLine ){
		pipedCmds		= cmdLine.trim().split( "|" );
		startingCmd		= pipedCmds[0].trim();
		startingCmdParts	= startingCmd.split( " " );
		startingCmdName		= startingCmdParts[0].trim();
		startingCmdArguments	= [];
		for( startingCmdNum=1;startingCmdNum<startingCmdParts.length;startingCmdNum++ ){
			startingCmdArguments[startingCmdNum] = startingCmdParts[startingCmdNum];
		}

		// Autoload the first function called..
		eval( autoload( startingCmdName ) );

		var startingCmdArgs = "";
		for( var startingCmdNum=1; startingCmdNum<startingCmdParts.length; startingCmdNum++ ){
			startingCmdArgs	+= startingCmdParts[startingCmdNum] + " ";
		}

		startingCmdArgs	= startingCmdArgs.trim();

		codeToEval	=	startingCmdName + '( "", "' + startingCmdArgs + '" )';
		//******* Now on to piped commands if there are any.

		for( pipedCmdNum=1; pipedCmdNum<pipedCmds.length; pipedCmdNum++ ){
			pipedCmdParts	= pipedCmds[pipedCmdNum].trim().split( " " );
			pipedCmdName	= pipedCmdParts[0].trim();

			pipedCmdArgs	= [];
			for( k=1;k<pipedCmdParts.length;k++ ){
				pipedCmdArgs[k] = pipedCmdParts[k];
			}

			// if this is the last piped command ( or the last command at all ) - check for redirection.
			if( pipedCmdNum == pipedCmds.length-1 ){
				
			}

			// Autoload functions..
			eval( autoload( pipedCmdName ) );

			var pipedCmdArgs = "";
			for( var tmpPipedArgNum=1; tmpPipedArgNum<pipedCmdParts.length; tmpPipedArgNum++ ){
				pipedCmdArgs += pipedCmdParts[tmpPipedArgNum];
			}

			newCodeToEval	= pipedCmdName + "( " + codeToEval + ', "' + pipedCmdArgs + '" )';
			codeToEval	= newCodeToEval;
		}
		try{
			return eval( codeToEval );
		} catch( e ){
			var problemCommand	= codeToEval.split("(")[0];
			return "Error: " + problemCommand + ": " + e;
		}
	}

	function parseCmd( cmd ){
		multipleCmds	= cmd.trim().split( ";" );
		var output	= "";
		for(var k=0;k<multipleCmds.length;k++){
			output += parseCmdLine( multipleCmds[k] ) + "\n";
		}
		return output;
	}

	function showConsole( ){
		sys.print( "charlie>" );
	}

	stdin.addListener( "data", function( data ){
		sys.print( parseCmd( data ) );
		showConsole();
	});

	process.addListener( "SIGINT", function( ){
		sys.puts( "" );
		showConsole();
	});

	process.addListener( "SIGHUP", function( ){
		sys.puts( "SIGHUP received." );
		/*
		This doesn't kill off current instance.. 
		eval( autoload( "commandLine" ) );
		commandLine( path );
		*/
	});

	process.addListener( "SIGTERM", function( ){
		sys.puts( "Killed" );
		process.exit(0);
	});

	showConsole();
};

commandLine( "/root/charlie/bin/:/path/to/charlie/bin/:/another/path/to/stuff/:/tmp/foobar/" );
