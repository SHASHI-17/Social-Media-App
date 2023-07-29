
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from '../../utils/axiosClient';

export const getMyInfo = createAsyncThunk('user/getMyInfo',async  (_) => {
    try {
        const response=await axiosClient.get('/user/getMyInfo');
        console.log('api called ',response);
        return response.data;
    } catch (e) {
            return Promise.reject(e);
    } 
});

    export const updateMyProfile=createAsyncThunk('user/updateMyProfile',async(body)=>{
                    try {
        const response=await axiosClient.put('/user/',body);
        console.log('api called ',response);
        return response.data;
    } catch (e) {
            return Promise.reject(e);
    } 
    })

const appConfigSlice = createSlice({
    name: "appConfigSlice",
    initialState: {
        isLoading: false,
        myProfile:{},
        toastData:{}
    },
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        showToast:(state,action)=>{
            state.toastData=action.payload;
        }
    },
    // after the fullfilment of the getmyInfo we will store user into myprofile 
    extraReducers : (builder) =>{
            builder.addCase(getMyInfo.fulfilled,(state,action)=>{
                state.myProfile=action.payload.result.user;
            })
            .addCase(updateMyProfile.fulfilled,(state,action)=>{
                state.myProfile=action.payload.result.user;
            });
    }
});




export default appConfigSlice.reducer;

export const { setLoading ,showToast} = appConfigSlice.actions;
