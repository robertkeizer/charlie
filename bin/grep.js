exports.run = function( incontent, args ){
	if( incontent == "" ){
		return "Grep doesn't support reading files. Try piping text to it.\n";
	}

	var numArgs	= args.split( " " ).length;
	if( numArgs != 1 ){
		return "No spaces permited in grep regex's yet..\n";
	}

	var regexToCheck	= RegExp( args.trim() );

	var tmpReturn	= "";
	incontent.split("\n").forEach( function( lineToCheck ){
		if( lineToCheck.match( regexToCheck ) ){
			tmpReturn	+= lineToCheck + '\n';
		}
	} );

	return tmpReturn;
}
