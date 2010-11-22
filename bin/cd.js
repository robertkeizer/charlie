exports.run	=	function( inargs, args ){
				try{
					process.chdir( args );
					return "";
				}catch( e ){
					return "cd: " + e + "\n";
				}
			}
