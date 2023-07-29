import React from 'react'
import "./Navbar.scss" ;
import Avatar from '../Avatar/Avatar';
import {useNavigate} from "react-router-dom"
import {CgLogOut} from "react-icons/cg"
import {useDispatch, useSelector } from 'react-redux';

import { axiosClient } from '../../utils/axiosClient';
import { KEY_ACCESS_TOKEN, removeItem } from '../../utils/localStorageManager';
// import { setLoading } from '../../redux/Slices/appConfigSlice';

function Navbar() {

    const navigate=useNavigate();
  const dispatch=useDispatch();
  const  myProfile= useSelector(state=> state.appConfigReducer.myProfile);

    // const isLoading=useSelector(state => state.appConfigReducer.isLoading);

    // function toggleLoadingBar(){
    //       if(isLoading){
    //         dispatch(setLoading(false));
    //       }else{
    //          dispatch(setLoading(true));
    //       }
    // }

 async function handleLogoutClicked(){
        try{
          await axiosClient.post('/auth/logout');
          removeItem(KEY_ACCESS_TOKEN);
          navigate('/login');
        }catch(e){
            console.log(e.message);
        }
  }

  return (
    <div className='Navbar'>
            <div className="container">
                <h2 className="banner hover-link" onClick={()=>{navigate('/')}}>Social Media</h2>
                <div className="right-side">
                    <div className="profile hover-link" onClick={()=>{navigate(`/profile/${myProfile._id}`)}}>
                        <Avatar src={myProfile}/>
                    </div>
                    <div className="logout hover-link" onClick={handleLogoutClicked}>
                  <CgLogOut/>
                </div>
                </div>

            </div>
    </div>
  )
}

export default Navbar