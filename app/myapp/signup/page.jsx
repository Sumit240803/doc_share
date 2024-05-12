// components/SignUpForm.js
"use client"
import {doc , setDoc} from 'firebase/firestore';
import { useState } from 'react';
import {auth} from '../../firebase-config'
import {createUserWithEmailAndPassword} from 'firebase/auth'
import { db } from '../../firebase-config';
import {onAuthStateChanged} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
const SignUp = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (e) => {
        try {
            e.preventDefault();
            // Handle form submission here (e.g., send data to server)
            createUserWithEmailAndPassword(auth , email,password).then((users)=>{
                console.log(users);
                setEmail('');
                setPassword('');
                onAuthStateChanged(auth , (user)=>{
                    const id = user.uid;
                    const myDoc = setDoc(doc(db , 'users', id ),{
                        name : 'User',
                        email: email,
                        govt_doc : [],
                        age : '',
                    contact:''});
    
                }
            )
            router.push("/")
               /* */
                
            })
        } catch{
            console.log(error)
        }
        
    };
    return (
        <div className='bg-gradient-to-r from-violet-700 via-purple-600 to-rose-900 min-h-screen'>

        
        <div className='flex justify-center items-center pt-44 '>
        <div className='flex h-72 w-80 border-2 border-black border-opacity-30 rounded-lg pt-4 '>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto" >
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
            </div>
            <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
            </div>
            <div className="flex items-center justify-between">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Sign Up
                </button>
                <Link href={'/'}>Return</Link>
            </div>
        </form>
        </div>
        </div>
        </div>
    );
};

export default SignUp;
