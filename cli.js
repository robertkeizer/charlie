var stdin	= process.openStdin( );
stdin.setEncoding( 'utf8' );

function cli( ){

	// Simple function to show the prompt..
	function showPrompt( ){
		process.stdout.write( 'charlie>' );
	}

	// This parses and executes the command.
	function executeCommand( commandToExecute ){
		// For now just debug things.
		process.stdout.write( 'Recieved command "' + commandToExecute + '"\n' );
	}

	// Show the prompt the first time..
	showPrompt();

	// Read in data from stdin. Since this only gets executed on newlines, we can
	// simply trim it and send it off to executeCommand.
	stdin.on( 'data', function( chunk ){
		// Pass off to executeCommand. Trimming in the process.
		executeCommand( chunk.trim() );
		// Show the prompt again.
		showPrompt( );
	});

	// Say goodbye when stdin is closed.
	stdin.on( 'end', function( ){
		process.stdout.write( 'Goodbye.\n' );
	});
};

cli( );
