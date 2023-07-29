import React, { useState } from 'react'
import "./Signup.scss"
import { Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient';
function Signup() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name,setName]=useState('');


   async function handleSubmit(e){
      e.preventDefault();
        try {
          const response=await axiosClient.post('/auth/signup',{
            name,
            email,
            password
          })
          
          console.log(response); 

        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className='Signup'> 

        <div className='signup-box'>
            <h2 className='heading'>Signup</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name</label>
                <input type="text"  id="name" className='name' onChange={(e)=>{setName(e.target.value) }} />
                <label htmlFor="email">Email</label>
                <input type="email" className='email' id='email' onChange={(e)=>{setEmail(e.target.value) }}/>
                <label htmlFor="password">Password</label>
                <input type="password" className='password' id='password' onChange={(e)=>{setPassword(e.target.value) }}/>

                <input type="submit" className='submit' />
            </form>
            <p className='subHeading'>Already have an account? <Link to="/login">Login</Link></p>
         </div>
    </div>
  )
}

export default Signup