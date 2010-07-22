function cat( invar, outvar ){

        if( invar == "" ){
                // cat a file
                try{
                        contents = fs.readFileSync( outvar.trim(), 'utf8' );
                        return contents;
                }catch( e ){
                        return e;
                }
        }else{
                if( outvar !== "" ){
                        return "Invalid use of cat.";
                }
                return invar;
        };
}
