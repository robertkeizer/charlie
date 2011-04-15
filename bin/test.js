var sys	= require( 'sys' );

var returnString = sys.inspect( environment ) + "\n";

process.stdout.write( returnString );
