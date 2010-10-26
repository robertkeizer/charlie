exports.run	= function( incontent, args ){
	if( args.match( RegExp( "^-n " ) ) ){
		return args.replace( RegExp( "^-n " ), "" );
	}else{
		return args + '\n';
	}
}
