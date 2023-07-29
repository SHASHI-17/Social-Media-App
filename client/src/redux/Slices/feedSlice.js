
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from '../../utils/axiosClient';
import { likeAndUnlikePost } from "./postSlice";

export const getFeedData = createAsyncThunk('user/getFeedData',async  (_, ) => {
    try {
        const response=await axiosClient.get('/user/getFeedData' ); 
        console.log('api called of feed ',response);
        return response.data;
    } catch (e) {
            return Promise.reject(e);
    } 
});


    export const followAndUnfollowUser=createAsyncThunk('user/followAndUnfollow',async (body)=>{
        try {
           const response= await axiosClient.post('/user/follow' ,body); 
            console.log('api called of follow/unfollow ',response);
            return response.data.result.user; 
        } catch (e) {
                return Promise.reject(e);
        }
    });

const feedSlice = createSlice({
    name: "feedSlice",
    initialState: {
        feedData:{}
    },
    // after the fullfilment of the getUserProfile we will store user into myprofile 
    extraReducers : (builder) =>{
            builder.addCase(getFeedData.fulfilled,(state,action)=>{
                state.feedData=action.payload;
            })
            .addCase(likeAndUnlikePost.fulfilled,(state,action)=>{
                // refreshing in the ui
                    const post=action.payload;
                    console.log("like  post ",post);
                    const index=state.feedData.result.posts.findIndex(item => item._id === post._id);
                    console.log(index);
                    if(index !== undefined && index !== -1){
                        state.feedData.result.posts[index]=post;  
                    }
            })
            .addCase(followAndUnfollowUser.fulfilled,(state,action)=>{
                        const user=action.payload;
                        const index=state?.feedData?.result.followings.findIndex(item => item._id === user._id);
                        if(index !==-1){
                            //id thi to ussko nikalni hai
                            state?.feedData.result.followings.splice(index,1);
                        }else{
                            // nhi thi toh daal rhe hai
                            state?.feedData.result.followings.push(user);
                        }
            })
    }
});




export default feedSlice.reducer;
