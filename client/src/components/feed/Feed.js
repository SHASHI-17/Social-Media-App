import React, { useEffect } from 'react'
import "./Feed.scss"
import Post from '../Posts/Post'
import Follower from '../follower/Follower'
import { useDispatch, useSelector } from 'react-redux'
import { getFeedData } from '../../redux/Slices/feedSlice'

function Feed() {

  const dispatch =useDispatch();
  const feedData =useSelector(state=> state.feedSlice.feedData);
  useEffect(()=>{
      dispatch(getFeedData());
  },[dispatch]);

  return (
    <div className='Feed'>
      <div className="container">
            <div className="left-part">
                  {feedData?.result?.posts?.map(post => <Post key={post._id} photo={feedData?.result} post={post}/>)}
            </div>
            <div className="right-part">
              <div className="following">
                <h3 className='title'>You are Following</h3>

                    {feedData?.result?.followings?.map(user => <Follower key={user._id} user={user}/>)}
              </div>

              <div className="suggestions">
                <h3 className='title'>Suggestions for  You</h3>
                {feedData?.result?.suggestions?.map(user => <Follower key={user._id} user={user}/>)}
              </div>

            </div>
      </div>
    </div>
  )
}

export default Feed