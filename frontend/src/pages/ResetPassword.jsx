import {toast} from 'react-toastify'
import { useState , useContext } from "react";
import { AppContext } from '../context/AppContext';
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const ResetPassword = () => {

    const [password , setPassword] = useState();
    const {backendUrl} = useContext(AppContext);
    const navigate = useNavigate();

    const token = new URLSearchParams(location.search).get('token');

    const onSubmitHandler = async (e) =>{
        e.preventDefault();
        try {
            const res = await axios.post(`${backendUrl}/api/user/reset-password`,{password,token})
            console.log(res)
            if(res.data.success){
                toast.success(res.data.message);
                navigate('/login')
            }
        } catch (error) {
            console.log(error)
            toast.error('User Not Found!')
        }
    }


    return(
    <div className="min-h-screen flex items-center justify-center bg-[#07034d] relative px-4 py-10">
      {/* Glass Background Overlay */}
      <div className="absolute inset-0 backdrop-blur-md" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                Reset Password
            </h2>

            <form className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                    New Password
                    </label>
                    <input
                    type="password"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white/70 backdrop-blur-md"
                    placeholder="Enter New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </div>

            <button
                onClick={onSubmitHandler}
                type="submit"
                className="w-full bg-violet-600 text-white py-2 rounded-md font-semibold hover:bg-violet-700 transition duration-300"
            >
                Reset Password
            </button>
            </form>
        </div>
    </div>
    )
}

export default ResetPassword 
