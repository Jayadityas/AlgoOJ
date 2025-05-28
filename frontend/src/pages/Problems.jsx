import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Problems = () => {
  const { problems, token } = useContext(AppContext);
  const navigate = useNavigate();

  const getTagColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'hard':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const onSolveHandler = (id) => {
    if (token) {
      navigate(`/problems/${id}`);
    } else {
      toast.error('Please login to solve problems');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07034d] to-[#1e0750] py-25 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto"> {/* Reduced container width */}
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-amber-400 sm:text-4xl mb-3">
            Coding Challenges
          </h1>
          <p className="text-lg text-indigo-200">
            Sharpen your skills with our curated problems
          </p>
        </div>

        {/* Problems List */}
        <div className="space-y-4"> {/* Reduced spacing between cards */}
          {problems && problems.length > 0 ? (
            problems.map((problem, index) => (
              <div
                key={problem._id}
                className={`transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                  index % 2 === 0 
                    ? 'bg-white' 
                    : 'bg-gray-50'
                } rounded-lg shadow-sm overflow-hidden border border-gray-200`}
              >
                <div className="p-4 sm:p-5"> {/* Reduced padding */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Problem Info */}
                    <div className="flex-1 min-w-0"> {/* Added min-w-0 to prevent overflow */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getTagColor(problem.difficulty)}`}>
                          {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                        </span>
                        <h2 className="text-lg font-bold text-gray-800 truncate">
                          {problem.title}
                        </h2>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {problem.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs font-medium px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Solve Button */}
                    <button
                      onClick={() => onSolveHandler(problem._id)}
                      className="group relative inline-flex items-center justify-center px-4 py-2 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow hover:ring-1 hover:ring-indigo-500 text-sm"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600"></span>
                      <span className="absolute bottom-0 right-0 block w-48 h-48 mb-24 mr-3 transition duration-500 origin-bottom-left transform rotate-45 translate-x-18 bg-indigo-600 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                      <span className="relative text-white flex items-center">
                        Solve
                        <svg
                          className="w-3 h-3 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          ></path>
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-3">
                <svg
                  className="w-8 h-8 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-1">
                No problems found
              </h3>
              <p className="text-indigo-200 text-sm">
                Check back later for new challenges
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Problems;