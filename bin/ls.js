function ls( incontent, path ){

	path	= path.trim();
	if( path.split(" ").length > 1 ){
		sys.puts( "Invalid path specified." );
		return;
	}

        try{
		// allow ls of current directory
		if( path == "" ){
			path = ".";
		}

                files   = fs.readdirSync( path );
                var output = "";
                for( var k=0; k<files.length; k++ ){
			var lastOutputLineLength = output.split("\n")[output.split("\n").length-1].length;
			if( (lastOutputLineLength + files[k].length + 1) > numColumns() ){
				output += "\n" + files[k];
			}else{
				output += " " + files[k];
			}
                }
		output	= output.trim();
                return output;
        } catch( e ){
                sys.puts( e );
        }
}
