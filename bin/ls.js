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
			output += files[k] + "\n";
                }
		output	= output.trim();
                return output;
        } catch( e ){
		throw e;
        }
}
