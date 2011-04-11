exports.exit	= function( pipedargs, arguments ){
	// Exit with code of 0 unless specified..
	if( !parseInt( arguments ) ){
		process.exit( 0 );
	}else{
		process.exit( parseInt( arguments ) );
	}
}
