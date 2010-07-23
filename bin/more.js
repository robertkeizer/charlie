function more( incontent, args ){
	sys.puts( "The command 'more' is currently in development.." );
	if( incontent !== "" ){
		// used in a pipe..
		var currentRow		= 0;
		var numRowsInContent	= incontent.split("\n").length;
		sys.puts( "DEBUG: there are " + numRowsInContent + " rows in the content and " + numRows() + " rows in the terminal.." );
		return "";
	}else{
		// parse args for file..
		return "";
	}
}
