import {toast} from 'react-toastify'
import { useState , useContext } from "react";
import { AppContext } from '../context/AppContext';
import axios from 'axios'

const ForgotPassword = () => {

    const [email , setEmail] = useState();
    const {backendUrl} = useContext(AppContext);

    const onSubmitHandler = async (e) =>{
        e.preventDefault();
        try {
            const res = await axios.post(`${backendUrl}/api/user/forgot-password`,{email})
            console.log(res)
            if(res.data){
                toast.success(res.data.message);
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
                Forgot Password
            </h2>

            <form className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email
                    </label>
                    <input
                    type="email"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white/70 backdrop-blur-md"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                </div>

            <button
                onClick={onSubmitHandler}
                type="submit"
                className="w-full bg-violet-600 text-white py-2 rounded-md font-semibold hover:bg-violet-700 transition duration-300"
            >
                Send Reset Password Link
            </button>
            </form>
        </div>
    </div>
    )
}

export default ForgotPassword