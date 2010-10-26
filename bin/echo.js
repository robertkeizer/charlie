exports.run	= function( incontent, args ){
	if( args.match( RegExp( "^-n" ) ){
		return args;
	}else{
		return args + '\n';
	}
}
