import Cookies from "js-cookie";
import axiosInstance from "../axiosConfig";

const url_auth = "auth";

export const AuthService = {

async getUserInfo ():Promise<any> {
    try {
        const token = Cookies.get('authTokens')
        if (!token) {
            // throw new error('NO token found')
        }
        const response = await axiosInstance.get(`${url_auth}/get-me`)
        return response.data;
    } catch( error ){
        console.error('Error al obtener informacion del usuario:', error)
        return null
    }
}, 

}

