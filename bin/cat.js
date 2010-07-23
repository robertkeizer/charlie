function cat( invar, tmpCatArgs ){

	var files = tmpCatArgs.split(" ");
	if( invar == "" ){
		var returnVar = "";
		for( var tmpCatFile=0; tmpCatFile<files.length; tmpCatFile++ ){
			try{
				tmpContents	= fs.readFileSync( files[tmpCatFile], 'utf8' );
				returnVar	+= "\n" + tmpContents;
			}catch( e ){
				sys.puts( "Cat couldn't open the file " + files[tmpCatFile] + ", error: " + e );
			}
		}
		return returnVar;
	}else{
		return invar;
	}
}
