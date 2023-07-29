import {configureStore} from "@reduxjs/toolkit"
import appConfigReducer from "./Slices/appConfigSlice";
import postSliceReducer from "./Slices/postSlice";
import feedSlice from "./Slices/feedSlice"

    export default configureStore({
            reducer :{
                appConfigReducer,postSliceReducer,feedSlice
            }
    });