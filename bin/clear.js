exports.run	=	function( inargs, args ){
				var returnString = "";
				var numRows	= process.binding('stdio').getRows();
				var numCols	= process.binding('stdio').getColumns();

				for( var r=0; r<numRows; r++ ){
					for( var c=0; c<numCols; c++ ){
						returnString += " ";
					}
					returnString += "\n";
				}

				return returnString;
			}
