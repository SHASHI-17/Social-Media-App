import React, { useEffect, useState } from 'react'
import "./UpdateProfile.scss"
import { useDispatch, useSelector } from 'react-redux';
import { updateMyProfile } from '../../redux/Slices/appConfigSlice';
import picture from "../../assets/profile-user.png"
import { axiosClient } from '../../utils/axiosClient';
import { KEY_ACCESS_TOKEN, removeItem } from '../../utils/localStorageManager';
import { useNavigate } from 'react-router-dom';

function UpdateProfile() {
  const  myProfile= useSelector(state=> state.appConfigReducer.myProfile);
  const [name,setName]=useState("");
  const [bio,setBio]=useState("");
  const [userImg,setUserImg]=useState("");
  const dispatch=useDispatch();
  const navigate=useNavigate();


  useEffect(()=>{
    setName(myProfile?.name || " "); 
    setBio(myProfile?.bio || " "); 
    // setUserImg(myProfile?.avatar.url);
    if(myProfile?.avatar?.url ){
        setUserImg(myProfile?.avatar?.url )
    }else{
      setUserImg(picture);
    }
  },[myProfile]); // myprofile mtlb data aaya nhi toh nhi toh nhi aaya

  function handleImgChange(e){
      const file=e.target.files[0];
      const fileReader=new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload=()=>{
        if(fileReader.readyState=== fileReader.DONE){
          setUserImg(fileReader.result);
          console.log(fileReader.result);
        }
      }
  }

    function handleSubmit(e){
        e.preventDefault();
        dispatch(updateMyProfile({
          name,
          bio,
          userImg
        }));
    } 

   async function handleDelete(){

    }

  return (
    <div className='UpdateProfile'>
            <div className="container">
                    <div className="left-part">
                        <div className="input-user-img">
                          <label htmlFor="inputImg" className='labelImg'><img src={userImg} alt={`${name} upload kr bsdk`} /></label>
                          <input className='inputImg' id='inputImg' type="file" accept='image/*' onChange={handleImgChange} />
                        </div>
                    </div>
                    <div className="right-part">
                        <form onSubmit={handleSubmit}>
                            <input value={name} placeholder='Your Name' type="text" onChange={(e)=>{setName(e.target.value)}} />
                            <input value={bio} type="text" placeholder='Your Bio' onChange={(e)=>{setBio(e.target.value)}} />
                            <input type="submit" className='btn-primary' onClick={handleSubmit}/>
                        </form>

                        <button className='delete-account btn-primary' onClick={handleDelete}>Delete Account</button>

                    </div>
            </div>
    </div>
  )
}

export default UpdateProfile