#!/usr/bin/env node
console.log( "This is the child.." );

process.stdin.resume();
process.stdin.setEncoding( 'utf8' );

process.stdin.on( "data", function( chunk ){
	console.log( "CHILD: got chunk of '" + chunk + "'" );
	if( chunk == 'exit\n' ){
		process.exit(0);
	}
} );
