function grep( content, expression ){
        var myRegex = new RegExp( expression );

        contentLines    = content.split( "\n" );
        var returnVar   = "";
        for( var z=0;z<contentLines.length;z++ ){
                if( contentLines[z].match( myRegex ) ){
			returnVar += contentLines[z] + "\n";
                }
        }

	return returnVar.trim();
}
