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
    <div className="min-h-screen bg-[#07034d] flex flex-col md:flex-row relative pt-15 ">
      {/* Sidebar */}
        <div className={`fixed md:static z-20 top-0 left-0 h-screen bg-white shadow-lg transform 
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            md:translate-x-0 transition-transform duration-300 w-64 p-5 overflow-y-auto`}>
            <h2 className="text-xl font-bold mb-6 text-blue-600">Admin Options</h2>
            <ul className="space-y-4">
                <li onClick={()=>navigate('/')} className="text-gray-700 hover:text-blue-600 cursor-pointer font-medium">All Problems</li>
                <li onClick={()=>navigate('/create-problem')} className="text-gray-700 hover:text-blue-600 cursor-pointer font-medium">Create Problem</li>
            </ul>
        </div>

      {/* Main Content */}
      <div className="flex-1 p-6 mr-15 md:ml-15 w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold p-4 mb-4 ml-70 text-amber-300">ALL PROBLEMS</h1>
          <button onClick={toggleSidebar} className="md:hidden text-2xl text-gray-600">
            <FaEllipsisV />
          </button>
        </div>

        {/* All Problems List */}
        <div className="space-y-4 flex flex-col">
          {problems && problems.length > 0 ? (
            problems.map((problem) => (
              <div key={problem._id} className="flex justify-between items-center bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{problem.title}</h3>
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
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button onClick={() => navigate(`/view-problem/${problem._id}`)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                    <FaEye /> View
                  </button>
                  <button onClick={() => navigate(`/update-problem/${problem._id}`)} className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                    <FaPen /> Update
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No problems available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
