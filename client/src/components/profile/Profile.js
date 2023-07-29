import React, { useEffect, useState } from 'react'
import "./Profile.scss"
import Post from '../Posts/Post'
import {useNavigate, useParams} from 'react-router-dom'
import CreatePost from '../createPost/CreatePost'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile } from '../../redux/Slices/postSlice'
import { followAndUnfollowUser } from '../../redux/Slices/feedSlice'
import picture from "../../assets/profile-user.png"
function Profile() {

  const navigate=useNavigate();

  const params =useParams();

  const userProfile=useSelector(state=> state.postSliceReducer.userProfile);
  const myProfile=useSelector(state=> state.appConfigReducer.myProfile);
  const feedData =useSelector(state=> state.feedSlice.feedData);

  const [isMyProfile,setIsMyProfile]=useState(false);
  const [isFollowing,setIsFollowing]=useState(); 

  const dispatch =useDispatch();

  useEffect(()=>{
      dispatch(getUserProfile({
        userId:params.userId
      }));

      setIsMyProfile(myProfile?._id === params.userId );

      if(feedData?.result?.followings.find(item=> item._id === params.userId)){
        setIsFollowing(true);
      }else{
        setIsFollowing(false);
      }

  },[myProfile,params.userId,feedData]);

  function handleUserFollow(){
    dispatch(followAndUnfollowUser({
      userIdToFollow :params.userId
    }));
  }

  return (
    <div>
    <div className="Profile">
        <div className="container">
              <div className="left-part">
              {isMyProfile && <CreatePost/> }
              {userProfile?.result?.posts?.map(post=> <Post key={post._id} photo={userProfile?.result} post={post}/>)}
              </div>
              <div className="right-part">
                    <div className="profile-card">
                      <img src={userProfile?.result?.avatar?.url ? userProfile?.result?.avatar?.url :picture} alt="" className='user-img'/>
                      <h3 className='user-name'>{userProfile?.result?.name}</h3>
                      <p className='bio'>{userProfile?.result?.bio}</p>
                      <div className="follower-info">
                          <h4>{userProfile?.result?.followers.length } Followers </h4>
                          <h4>{userProfile?.result?.followings.length } Following</h4>
                      </div>
                        {!isMyProfile &&  <h5 onClick={handleUserFollow} className={isFollowing ?'hover-link btn-primary  follow-link':"hover-link btn-primary"}>{isFollowing ?'Unfollow' : 'Follow'}</h5>}
                        {isMyProfile && <button className='update-profile btn-secondary' onClick={()=>{navigate('/updateProfile')}}>Update Profile</button>}
                    </div>
              </div>
        </div>
    </div>

    </div>
  )
}

export default Profile