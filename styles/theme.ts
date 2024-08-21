import { extendTheme } from "@chakra-ui/react";


const customTheme = extendTheme({
    colors:{
        primary: "#318AE4", //color principal


        secondary:{
            white:"#FFFFFF",
            100:"#318AE4",
            200:"#6FC7FF",
            300:"#C3E6FF",
            400:"#FFF3E9"
        }
    }
});


export default  customTheme;