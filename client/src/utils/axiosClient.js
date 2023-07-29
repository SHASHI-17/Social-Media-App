import axios from "axios"
import { getItem , KEY_ACCESS_TOKEN, removeItem,setItem} from "./localStorageManager"

import store from "../redux/store"
import { setLoading, showToast } from "../redux/Slices/appConfigSlice";
import { TOAST_FAILURE } from "../App";

export const  axiosClient=axios.create({
    baseURL:process.env.REACT_APP_SERVER_BASE_URL,
    withCredentials:true   // for transmiting cookie to the backend
})



// axiosClient.interceptors.request.use(
//     (request)=>{
//         const accessToken = getItem(KEY_ACCESS_TOKEN);
//         request.headers['Authorization']=`Bearer ${accessToken}`;   
//         return request;
//     }
// )





axiosClient.interceptors.request.use(
    (request) => {
    const accessToken = getItem(KEY_ACCESS_TOKEN);
    request.headers["Authorization"] = `Bearer ${accessToken}`;
    store.dispatch(setLoading(true));
    return request;
});

axiosClient.interceptors.response.use(
 async   (response)=>{
    store.dispatch(setLoading(false));
            const data=response.data;

            if(data.status === 'ok'){
                return response;
            } 

            const originalRequest=response.config;
            const statusCode=response.data.statusCode;
            const error=response.data.message;

            // when refresh token expires after 1y in this case , send user to login page
            // auth/refresh ek baar kr diya uss k baad ye wala config mein aa jatha 
            // matlab ek baar krne k baad agar nhi aaya toh token fail hua
            // if(statusCode === 401 && originalRequest.url === `${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`){
            //     removeItem(KEY_ACCESS_TOKEN);
            //         window.location.replace('/login','_self'); // redirecting to the login page in the current page
            //         return Promise.reject(error);
            // }


                store.dispatch(showToast({
                    type :TOAST_FAILURE,
                    message:error
                }))

            // this case for 15 min regeneration of access token in this case
            if(statusCode === 401 && !originalRequest._retry){
                    originalRequest._retry=true;
                const response = await axios.create({
                    withCredentials:true
                }).get(`${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`);

                // req kr denge access token k liye milne k baad nichee update kr denge

                console.log("response from backend ",response);

                if(response.data.status === 'ok'){
                    setItem(KEY_ACCESS_TOKEN,response.data.result.accessToken);
                    originalRequest.headers['Authorization']=`Bearer ${response.data.result.accessToken}`

                    return axios(originalRequest); // jo b request aayi jo fail hua tha abh vapas call ho jayega
                    //in case all/post call kiya tabh fail hua toh ussko vapas call krne k liye
                }else{
                    removeItem(KEY_ACCESS_TOKEN);
                    window.location.replace('/login','_self'); // redirecting to the login page in the current page
                    return Promise.reject(error);
                }
            }

            return Promise.reject(error);
    } ,async (e)=>{
        store.dispatch(setLoading(false));
        store.dispatch(showToast({
            type :TOAST_FAILURE,
            message:e.message
        }))
        return Promise.reject(e);
    }  
)