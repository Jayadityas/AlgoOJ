import React from 'react'

const About = () => {
  return (
    <div className="min-h-screen bg-[#07034d] py-30 px-4">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-800">About THE OJ</h1>

        <p className="text-gray-600 text-center max-w-3xl mx-auto">
          Welcome to <span className="font-semibold text-blue-600">THE OJ</span> – your go-to online judge platform built by developers, for developers. Our mission is to empower aspiring coders, students, and professionals with a reliable, scalable, and beginner-friendly problem-solving hub.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 text-gray-700">
          {/* Our Mission */}
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-800">🎯 Our Mission</h2>
            <p>
              We aim to make coding accessible and enjoyable by providing a streamlined interface for submitting, testing, and evaluating solutions to algorithmic problems in real time.
            </p>
            <p>
              Whether you're preparing for interviews, contests, or just want to grow your problem-solving skills — THE OJ is here to help.
            </p>
          </div>

          {/* What Makes Us Different */}
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-800">🚀 What Makes Us Different</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Clean, minimal, and intuitive interface</li>
              <li>Real-time result feedback and runtime analysis</li>
              <li>Admin panel to manage problems efficiently</li>
              <li>Support for hidden and sample test cases</li>
              <li>Focus on speed, simplicity, and accuracy</li>
            </ul>
          </div>

          {/* Our Vision */}
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-800">🌍 Our Vision</h2>
            <p>
              To build a collaborative and open-source platform that not only supports problem solving but encourages community contribution and learning.
            </p>
            <p>
              We believe in building a space where every learner can grow — with confidence, creativity, and curiosity.
            </p>
          </div>

          {/* Our Team */}
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-800">👨‍💻 Our Team</h2>
            <p>
              THE OJ is developed and maintained by a passionate group of developers and educators who understand the challenges of coding education and want to make it better for everyone.
            </p>
            <p>
              We constantly evolve based on user feedback — because your journey is our priority.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to start solving?</h3>
          <p className="text-gray-600 mb-4">Create an account and join the coding revolution today.</p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default About
