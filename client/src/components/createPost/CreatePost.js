import React, { useState } from 'react'
import "./CreatePost.scss"
import Avatar from "../Avatar/Avatar"
import {BsCardImage} from "react-icons/bs"
import { axiosClient } from '../../utils/axiosClient'
import {useDispatch, useSelector} from "react-redux"

import { getUserProfile } from '../../redux/Slices/postSlice'
import { useParams } from 'react-router-dom'

function CreatePost() {

    const [postImg, setPostImg] = useState('');
    const [caption, setCaption] = useState('');
    const dispatch=useDispatch();

    const myProfile=useSelector(state=>state.appConfigReducer.myProfile);

    const handleImgChange = (e) => {
        const file=e.target.files[0];
        const fileReader=new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload=()=>{
          if(fileReader.readyState=== fileReader.DONE){
            setPostImg(fileReader.result);
            console.log(fileReader.result);
          }
        }
    }

    const params=useParams();

    const handlePostSubmit = async()=>{
            try {
                const  result=await  axiosClient.post('/posts',{
                    caption,
                    postImg 
                });
                console.log('post done ',result );
            } catch (e) {
                    console.log(e.message);
            }finally{
                setCaption("");
                setPostImg("");
                dispatch(getUserProfile({
                    userId:params?.userId
                }));
            }
    }

    return (
        <div className='CreatePost'>


            <div className="left-part">
                <Avatar src={myProfile}/>
            </div>
        
            <div className="right-part">
                <input value={caption} type="text" className='caption' placeholder="what's on your mind" onChange={(e)=>{setCaption(e.target.value)}} />
              {/* image ko khali dikhane k liye */}
                    {postImg && <div className="img-container">
                    <img className='post-img' src={postImg} alt="post-img" />
                </div>}

                <div className="bottom-part">
                    <div className="input-post-img">
                        <label htmlFor="inputImg" className='labelImg'><BsCardImage/></label>
                        <input className='inputImg' id='inputImg' type="file" accept='image/*' onChange={handleImgChange} />
                    </div>
                    <button className='post-btn btn-primary' onClick={handlePostSubmit}>Post</button>
                </div>
            </div>

        </div>
  )
}

export default CreatePost