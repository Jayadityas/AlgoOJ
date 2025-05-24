import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const [state, setState] = useState('signup');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (state === 'signup') {
      try {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          username,
          email,
          password,
        });
        if (data.success) {
          setToken(data.token);
          toast.success('Account created successfully');
          localStorage.setItem('token', data.token);
          navigate('/');
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    } else {
      try {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });
        if (data.success) {
          setToken(data.token);
          toast.success('Login successfully');
          localStorage.setItem('token', data.token);
          navigate('/');
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-800 via-purple-900 to-indigo-800 relative px-4 py-10">
      {/* Glass Background Overlay */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-md" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          {state === 'login' ? 'Login' : 'Create Account'}
        </h2>

        <form className="space-y-5">
          {state === 'signup' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white/70 backdrop-blur-md"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
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
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white/70 backdrop-blur-md"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {state === 'login' && (
            <>
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white/70 backdrop-blur-md"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <button
            onClick={onSubmitHandler}
            type="submit"
            className="w-full bg-violet-600 text-white py-2 rounded-md font-semibold hover:bg-violet-700 transition duration-300"
          >
            {state === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="text-sm text-center mt-6 text-gray-700">
          {state === 'login' ? (
            <>
              New here?{' '}
              <span
                className="text-violet-600 underline hover:text-violet-800 cursor-pointer transition"
                onClick={() => setState('signup')}
              >
                Create an account
              </span>
            </>
          ) : (
            <>
              Already registered?{' '}
              <span
                className="text-violet-600 underline hover:text-violet-800 cursor-pointer transition"
                onClick={() => setState('login')}
              >
                Login
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
