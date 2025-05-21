// src/components/CallToAction.jsx
import React from "react";

const CallToAction = () => {
  return (
    <div className="bg-[#07034d] py-30 text-white text-center">
      <h2 className="text-3xl sm:text-4xl font-extrabold">
        Ready to level up your <span className="text-amber-300">coding?</span>
      </h2>
      <br />
      <p className="mb-6 text-lg">Join THE OJ and start solving real challenges today.</p>
      <a
        href="/register"
        className="inline-block bg-white text-purple-600 font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-gray-100 transition"
      >
        Create Account
      </a>
    </div>
  );
};

export default CallToAction;
