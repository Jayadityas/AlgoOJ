import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

const Problems = () => {
  const { problems } = useContext(AppContext);

  const getTagColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">All Problems</h1>

      <div className="space-y-4">
        {problems && problems.length > 0 ? (
          problems.map((problem) => (
            <div
              key={problem._id}
              className="flex flex-col md:flex-row justify-between items-center bg-white shadow-md p-4 rounded-lg hover:shadow-lg transition"
            >
              <div className="w-full md:w-3/4">
                <h2 className="text-lg font-semibold text-gray-800 mb-1 space-x-1">{problem.title}<span className={`px-2 mx-3 rounded-full font-medium ${getTagColor(problem.difficulty)}`}>{problem.difficulty}</span></h2>
                <div className="flex flex-wrap gap-2 text-sm">
                  {problem.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded-full font-medium ${getTagColor(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 md:mt-0">
                <Link
                  to={`/problems/${problem._id}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Solve
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No problems found.</p>
        )}
      </div>
    </div>
  );
}

export default Problems
