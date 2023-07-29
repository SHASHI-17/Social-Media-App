import React, { useEffect } from 'react'
// import { axiosClient } from '../../utils/axiosClient';
import Navbar from '../../components/Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getMyInfo } from '../../redux/Slices/appConfigSlice';

function Home() {

  const dispatch=useDispatch();
  useEffect(()=>{
      dispatch(getMyInfo());
  },[]);
    // useEffect(()=>{
    //   fetchData();
    // },[]);

    // async function fetchData(){
    //   const response= await axiosClient.get("/posts/all"); 
    //   console.log('got the response',response);
    // }

  return (
    <> 
      <Navbar/>
      <div className="outlet" style={{marginTop:'60px'}}>
          <Outlet/>
      </div>
    </>
  )
}

export default Home