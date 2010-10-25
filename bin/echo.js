exports.run	= function( incontent, args ){
	returnVar = "";
	if( incontent != "" ){
		returnVar += incontent;
	}
	if( args != "" ){
		returnVar += args;
	}

	return returnVar;
}
