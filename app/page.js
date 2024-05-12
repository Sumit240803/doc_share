"use client"
import { useState } from 'react';
import {auth} from './firebase-config'
import {signInWithEmailAndPassword} from 'firebase/auth'
import Link from "next/link";
import { useRouter } from 'next/navigation'; 
import {onAuthStateChanged} from 'firebase/auth'
import useCurrentUserId from './utils/getUserId';
export default function Home() {
  const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const id = useCurrentUserId();
            
    const handleSubmit = (e) => {
      e.preventDefault();
        // Handle form submission here (e.g., send data to server)
        signInWithEmailAndPassword(auth, email, password)
        .then((user)=>{

            /*onAuthStateChanged(auth , (users)=>{
              const id = users.uid;
             */
            router.push(`myapp/protected/profile/${id}`);
         // })
        }).catch((error)=>{
            console.log(error);
        })
    };
  return (
    <div className='bg-gradient-to-r from-violet-700 via-purple-600 to-rose-900 min-h-screen'>

  {/* Header */}
  <div className="flex h-16 items-center justify-center">
    <div className="font-bold text-white text-2xl pl-4">
      Share Your Documents with family
    </div>
  </div>

  {/* Main Content */}
  <div className="flex justify-center mt-8">
    <div className="flex flex-col sm:flex-row h-auto sm:h-96 w-full sm:w-80 border-4 border-black  rounded-lg">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto pt-4">
        <div className="mb-4">
          <label htmlFor="email" className="block text-white text-xl font-bold mb-2 tracking-wide">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none rounded w-full py-2 px-3 bg-opacity-40 bg-slate-50 text-gray-950 leading-tight focus:bg-white focus:bg-opacity-35 focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block tracking-wide text-white text-xl font-bold mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none bg-white bg-opacity-35 rounded w-full py-2 px-3 text-gray-950 leading-tight focus:bg-white focus:bg-opacity-35 focus:outline-none focus:shadow-outline"
            required
            />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-white bg-opacity-35 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
            >
            Login
          </button>
        </div>
        <div className='flex flex-col mt-4 font-bold border-2 border-double border-opacity-30 border-black justify-center rounded-full bg-white bg-opacity-35'>
          <span className='text-center text-black tracking-wider font-bold'>Not Registered?</span>
            <Link href={'/myapp/signup'} className='flex text-white text-lg justify-center'>Sign Up</Link>
          
        </div>
      </form>
    </div>
  </div>

</div>

    );
}
/**
<div className="flex ">
 <div className="flex  gap-4">
 
 <div className="flex bg-white h-7 rounded-lg">
   <Link href={"/myapp/signup"}>SignUp</Link>
 </div>
 <div className="flex bg-white h-7 mr-5 rounded-lg">
   <Link href={"/myapp/login"}>Login</Link>
 </div>
 </div>
</div> */
