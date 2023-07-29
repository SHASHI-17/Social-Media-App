
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from '../../utils/axiosClient';

export const getUserProfile = createAsyncThunk('user/getUserProfile',async  (body) => {
    try {
        const response=await axiosClient.post('/user/getUserProfile',body); 
        console.log('api called of post ',response);
        return response.data;
    } catch (e) {
            return Promise.reject(e);
    } 
});


export const likeAndUnlikePost = createAsyncThunk('post/likeAndUnlike',async (body,)=>{
    try {
        const response=await axiosClient.post('/posts/like',body); 
        console.log('api called of post/like ',response.data.result.post);
        return response.data.result.post;
    } catch (e) {
            return Promise.reject(e);
    }
})


const postSlice = createSlice({
    name: "postSlice",
    initialState: {
        userProfile:{}
    },
    // after the fullfilment of the getUserProfile we will store user into myprofile 
    extraReducers : (builder) =>{
            builder.addCase(getUserProfile.fulfilled,(state,action)=>{
                state.userProfile=action.payload;
            })
            .addCase(likeAndUnlikePost.fulfilled,(state,action)=>{
                    const post=action.payload;
                    console.log("like  post ",post);
                    const index=state?.userProfile?.result?.posts?.findIndex(item => item._id === post._id);
                    console.log('value of index ',index);
                    if(index!==undefined && index !== -1 ){
                        state.userProfile.result.posts[index]=post; 
                    }
            })
    }
});




export default postSlice.reducer;
