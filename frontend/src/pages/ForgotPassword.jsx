import { toast } from 'react-toastify';
import { useState, useContext } from "react";
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { backendUrl } = useContext(AppContext);
    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });
            if (res.data) {
                toast.success(res.data.message);
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'User Not Found!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#07034d] to-[#1e0750] p-4">
            <div className="w-100 max-w-md">
                {/* Animated Card */}
                <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/10 transition-all duration-300 hover:shadow-2xl">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-pink-500"></div>
                    
                    {/* Form content */}
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">
                                Forgot Password
                            </h2>
                            <p className="text-white/70">
                                Enter your email to receive a reset link
                            </p>
                        </div>

                        <form className="space-y-5">
                            <div className="relative">
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-white/50 transition-all pl-12"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <span className="absolute left-4 top-3 text-white/50">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </span>
                            </div>

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
                                        Sending...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-white/70">
                            <div className="flex items-center justify-center space-x-2">
                                <span>Remember your password?</span>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-violet-300 hover:text-violet-200 font-medium transition"
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;