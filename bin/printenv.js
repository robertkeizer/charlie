var sys		= require( 'sys' );

exports.printenv = function( inargs, args ){

	var returnString = "";
	for( var environmentVar in environment ){
		returnString += environmentVar + ": " + environment[environmentVar] + "\n";
	}

	return returnString.trim();
}
