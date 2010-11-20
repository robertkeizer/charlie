var fs = require('fs');
var path = require('path');
exports.run	=	function( inargs, args ){
				var removeDirectories	= false;
				// Split by spaces.
				var filesToRemove	= args.split( " " );
				// Go through and look for flags. Replace the filesToRemove array with one that doesn't contain the flags.
				var newFilesToRemove	= Array();
				for( var c=0;c<filesToRemove.length;c++ ){
					if( filesToRemove[c] == '-r' ){
						removeDirectories	= true;
					}else{
						newFilesToRemove.push(filesToRemove[c]);
					}
				}
				filesToRemove	= newFilesToRemove;

				var returnString	= "";
				// Go through each argument.
				for( var c=0;c<filesToRemove.length;c++ ){
					// If the file is not absolute or relative with a ./, prefix with a ./
					if( !filesToRemove[c].match( "^(\.|\/)" ) ){
						filesToRemove[c]	= "./" + filesToRemove[c];
					}
					// Check to see if the path exists..
					var pathExists = false;
					path.exists( filesToRemove[c], function( pathExists ){
						// Path doesn't exist.. 
						if( !pathExists ){
							returnString	+= "'" + filesToRemove[c] + "' doesn't exist.\n";
						}else{
							var tmpStat	= fs.statSync( filesToRemove[c] );
							// A directory was passed.
							if( tmpStat.isDirectory() ){
								// Check if -r flag was set.
								if( removeDirectories ){
									try{
										fs.rmdirSync( filesToRemove[c] );
									}catch( e ){
										returnString += "'" + filesToRemove[c] + "' " + e + "\n";
									}
								}else{
									returnString += "'" + filesToRemove[c] + "' is a directory. Specify -r to remove it.\n";
								}
								// A file was passed.
							}else if( tmpStats.isFile() ){
								try{
									fs.unlinkSync( filesToRemove[c] );
								}catch( e ){
									returnString += "'" + filesToremove[c] + "' " + e + "\n";
								}
							// Something else was passed.. don't do anything for now.
							}else{
								returnString += "'" + filesToRemove[c] + "' is not a directory or a file. Won't unlink.\n";
							}
						}
					} );
				// End of for loop.
				}

				return returnString;
			}
