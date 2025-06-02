import { toast } from 'react-toastify';
import { useState, useContext } from "react";
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { backendUrl } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();

    const token = new URLSearchParams(location.search).get('token');

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        setIsLoading(true);
        try {
            const res = await axios.post(`${backendUrl}/api/user/reset-password`, { 
                password, 
                token 
            });
            
            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Password reset failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#07034d] via-[#0e0750] to-[#1e0750] p-4">
            <div className="w-100 max-w-md">
                {/* Glass Card */}
                <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/10 transition-all duration-300 hover:shadow-2xl">
                    {/* Accent Gradient Bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-pink-500"></div>
                    
                    {/* Form Content */}
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">
                                Reset Password
                            </h2>
                            <p className="text-white/70">
                                Create a new secure password
                            </p>
                        </div>

                        <form className="space-y-5">
                            {/* Password Field */}
                            <div className="relative">
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-white/50 transition-all pl-12"
                                    placeholder="New Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength="6"
                                />
                                <span className="absolute left-4 top-3 text-white/50">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            </div>

                            {/* Confirm Password Field */}
                            <div className="relative">
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-white/50 transition-all pl-12"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength="6"
                                />
                                <span className="absolute left-4 top-3 text-white/50">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={onSubmitHandler}
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-violet-600 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition duration-300 flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Resetting...
                                    </>
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </form>

                        {/* Footer Links */}
                        <div className="mt-6 text-center text-sm text-white/70">
                            <div className="flex items-center justify-center space-x-2">
                                <span>Remember your password?</span>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-violet-300 hover:text-violet-200 font-medium transition"
                                >
                                    Sign In
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;