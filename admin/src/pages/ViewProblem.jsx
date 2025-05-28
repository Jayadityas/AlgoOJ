import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';

const ViewProblem = () => {
  const { id: problemId } = useParams();
  const { problems } = useContext(AdminContext);

  const problem = problems.find(p => p._id === problemId);

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
        <p className="text-xl text-red-600 dark:text-red-400">Problem not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07034d] px-4 py-25">
      <div className="max-w-4xl w-full mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-6">{problem.title}</h1>

        <div className="space-y-4 text-gray-800 dark:text-gray-200">

          <div>
            <h2 className="text-xl font-semibold">Difficulty:</h2>
            <p className="pl-2">{problem.difficulty}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Statement:</h2>
            <p className="pl-2 whitespace-pre-wrap">{problem.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Input Format:</h2>
            <p className="pl-2 whitespace-pre-wrap">{problem.inputFormat}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Output Format:</h2>
            <p className="pl-2 whitespace-pre-wrap">{problem.outputFormat}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Constraints:</h2>
            <p className="pl-2 whitespace-pre-wrap">{problem.constraints}</p>
          </div>

          {problem.sampleTests?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold">Sample Test Cases:</h2>
              <div className="space-y-3 mt-2">
                {problem.sampleTests.map((test, idx) => (
                  <div key={idx} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 overflow-x-auto">
                    <p><strong>Input:</strong> <span className="whitespace-pre-wrap">{test.input}</span></p>
                    <p><strong>Output:</strong> <span className="whitespace-pre-wrap">{test.output}</span></p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {problem.tags?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold">Tags:</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {problem.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-indigo-100 dark:bg-indigo-600 text-indigo-800 dark:text-white px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProblem;
