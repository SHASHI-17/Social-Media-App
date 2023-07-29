import React from 'react'
import Avatar from "../Avatar/Avatar"
import "./Post.scss"
import {AiOutlineHeart ,AiFillHeart} from "react-icons/ai"
import { useDispatch } from 'react-redux'
import {likeAndUnlikePost } from '../../redux/Slices/postSlice'
import { useNavigate } from 'react-router-dom'
import { showToast } from '../../redux/Slices/appConfigSlice'
import { TOAST_SUCCESS } from '../../App'
import picture from "../../assets/profile-user.png"

function Post({post ,photo}) {
  const dispatch=useDispatch();
  const navigate =useNavigate();
  async function handlePostLike(){

        dispatch(showToast({
          type:TOAST_SUCCESS,
          message:'liked or unliked'
        }))
        dispatch(likeAndUnlikePost({
          postId:post._id
        }));
  }

  return (
    <div className="Post">
        <div className="heading" onClick={()=>navigate(`/profile/${post.owner._id}`)}>
            <Avatar src={photo ? photo : picture}/>
            <h4>{post?.owner?.name}</h4> 
        </div>
        <div className="content">
                <img src={post?.image?.url} alt="" />
        </div>
        <div className="footer">
            <div className="likes" onClick={handlePostLike}>
              {post?.isLiked ? <AiFillHeart className='icon'/> : <AiOutlineHeart className='icon'/>}
              
                <h4>{post?.likesCount} likes</h4>
            </div>
            <p className='caption'>{post?.caption}</p>
            <h6 className='time-ago'>{post?.timeAgo}</h6>
        </div>
    </div>
  )
}

export default Post