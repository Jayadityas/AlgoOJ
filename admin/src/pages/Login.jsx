import React, {useState,useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const Login = () => {
    
    const {backendUrl,token,setToken} = useContext(AdminContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        
        try {
            const {data} = await axios.post(`${backendUrl}/api/user/login`,{email,password});
            if(data.success){
                setToken(data.token)
                toast.success('Login successfully')
                localStorage.setItem('token',data.token)
                navigate('/')
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            
        }
    }

    return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 flex items-start justify-center pt-24 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">Login
        </h2>

        <form className="space-y-5">
          {(
            <>
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter username"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />
          </div>
          </>
            )}


          <button
            onClick={onSubmitHandler}
            type="submit"
            className="w-full bg-violet-600 text-white py-2 rounded-md font-semibold hover:bg-violet-700 transition duration-300"
          >Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login
