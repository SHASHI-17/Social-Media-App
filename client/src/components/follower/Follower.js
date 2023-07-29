import React, { useEffect, useState } from 'react'
import "./Follower.scss"
import Avatar from '../Avatar/Avatar'
import { useDispatch, useSelector } from 'react-redux'
import { followAndUnfollowUser } from '../../redux/Slices/feedSlice';
import { useNavigate } from 'react-router-dom';

function Follower({user}) {

  const dispatch=useDispatch();
  const feedData =useSelector(state=> state.feedSlice.feedData);
  const navigate=useNavigate();

  const [isFollowing,setIsFollowing]=useState();

  useEffect(()=>{
      if(feedData?.result?.followings.find(item=> item._id === user._id)){
        setIsFollowing(true);
      }else{
        setIsFollowing(false);
      }
  },[feedData])

      function handleUserFollow(){
        dispatch(followAndUnfollowUser({
          userIdToFollow :user._id
        }));
      }

  return (
    <div className='follower'>
            <div className="user-info" onClick={()=>navigate(`/profile/${user._id}`)}>
            <Avatar src={user}/>
            <h4 className='name'>{user?.name}</h4>    
            </div>
            <h5 onClick={handleUserFollow} className={isFollowing ?'hover-link follow-link':"hover-link btn-primary"}>{isFollowing ?'Unfollow' : 'Follow'}</h5>
            
    </div>  
  )
}

export default Follower