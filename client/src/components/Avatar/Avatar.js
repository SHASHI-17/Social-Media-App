import React from 'react'
import userImg from "../../assets/profile-user.png";
import "./Avatar.scss"
function Avatar({src}) {
  return (
    <div className='Avatar'>
        <img src={src?.avatar?.url ?src?.avatar?.url : userImg} alt="" />
    </div>
  )
}

export default Avatar