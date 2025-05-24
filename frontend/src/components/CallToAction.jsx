import React from "react";
import {NavLink, useNavigate} from 'react-router-dom'

const CallToAction = () => {

  const navigate = useNavigate()

  return (
    <div className="bg-[#07034d] py-30 text-white text-center">
      <h2 className="text-3xl sm:text-4xl font-extrabold">
        Ready to level up your <span className="text-amber-300">coding?</span>
      </h2>
      <br />
      <p className="mb-6 text-lg">Join <span className="text-purple-400">THE OJ</span> community and start solving real challenges today.</p>
      <button
        onClick={()=>navigate('/login')}
        className="inline-block bg-white text-purple-600 font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-gray-100 cursor-pointer transition"
      >
        Create Account
      </button>
    </div>
  );
};

export default CallToAction;
