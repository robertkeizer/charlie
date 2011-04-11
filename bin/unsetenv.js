exports.unsetenv = function( pipedArgs, arguments ){
	try{
		if( typeof environment[arguments.trim()] != 'undefined' ){
			delete environment[arguments.trim()];
		}else{
			return "Cannot unset a variable that isn't set.";
		}
	}catch(err){
		return err;
	}

	return "okay.";
}
