import React, { useState, useContext } from 'react';
import { FaEllipsisV, FaPen, FaEye } from 'react-icons/fa';
import { AdminContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { problems } = useContext(AdminContext);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-[#07034d] py-20 md:py-15 flex flex-col md:flex-row relative">
      
      {/* Sidebar */}
      <div
        className={`fixed md:static z-20 top-0 left-0 h-screen bg-white shadow-lg transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 w-50 p-5 overflow-y-auto`}
      >
        <h2 className="text-xl font-bold mb-6 text-blue-600">Admin Options</h2>
        <ul className="space-y-4">
          <li 
            onClick={() => {
              navigate('/');
              setIsSidebarOpen(false);
            }} 
            className="text-gray-700 hover:text-blue-600 cursor-pointer font-medium"
          >
            All Problems
          </li>
          <li 
            onClick={() => {
              navigate('/create-problem');
              setIsSidebarOpen(false);
            }} 
            className="text-gray-700 hover:text-blue-600 cursor-pointer font-medium"
          >
            Create Problem
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 w-full">
        {/* Header */}
        <div className="relative mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-amber-300 text-center">ALL PROBLEMS</h1>
          <button
            onClick={toggleSidebar}
            className="md:hidden text-2xl text-white absolute right-4 top-0"
          >
            <FaEllipsisV />
          </button>
        </div>

        {/* Problems List */}
        <div className="flex flex-col items-center gap-4">
          {problems && problems.length > 0 ? (
            problems.map((problem) => (
              <div
                key={problem._id}
                className="w-full max-w-2xl bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                      {problem.title}
                    </h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {problem.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-1 rounded text-xs font-semibold text-white ${
                            tag.toLowerCase() === 'easy'
                              ? 'bg-green-500'
                              : tag.toLowerCase() === 'medium'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => navigate(`/view-problem/${problem._id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 w-full sm:w-auto justify-center"
                    >
                      <FaEye className="text-xs sm:text-sm" /> 
                      <span className="hidden xs:inline">View</span>
                    </button>
                    <button
                      onClick={() => navigate(`/update-problem/${problem._id}`)}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 w-full sm:w-auto justify-center"
                    >
                      <FaPen className="text-xs sm:text-sm" /> 
                      <span className="hidden xs:inline">Update</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-300 text-center">No problems available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;