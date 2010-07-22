function ls( incontent, path ){
        try{
                // allow ls of current directory
                if( path == "" ){
                        path = ".";
                }

                files   = fs.readdirSync( path );
                var output = "";
                for( var k=0; k<files.length; k++ ){
                        if( k == files.length-1 ){
                                output += files[k];
                        }else{
                                output += files[k] + "\n";
                        }
                }

                return output;
        } catch( e ){
                sys.puts( e );
        }
}
