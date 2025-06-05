import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';

const ViewProblem = () => {
  const { id: problemId } = useParams();
  const { problems } = useContext(AdminContext);

  const problem = problems.find(p => p._id === problemId);

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07034d] px-4">
        <p className="text-xl text-red-500">Problem not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07034d] px-4 py-25 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-10 text-gray-900 dark:text-gray-100 space-y-6">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 dark:text-indigo-400 mb-6">
          {problem.title}
        </h1>

        <div className="grid gap-6 text-sm sm:text-base">
          <DetailSection title="Difficulty" content={problem.difficulty} />
          <DetailSection title="Statement" content={problem.description} />
          <DetailSection title="Input Format" content={problem.inputFormat} />
          <DetailSection title="Output Format" content={problem.outputFormat} />
          <DetailSection title="Constraints" content={problem.constraints} />

          {problem.sampleTests?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2 text-indigo-600 dark:text-indigo-300">
                Sample Test Cases
              </h2>
              <div className="space-y-4">
                {problem.sampleTests.map((test, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 shadow-inner"
                  >
                    <div className="overflow-x-auto text-sm sm:text-base">
                      <p className="mb-1">
                        <strong className="text-indigo-500">Input:</strong>
                        <pre className="whitespace-pre-wrap break-words bg-gray-200 dark:bg-gray-600 mt-1 p-2 rounded-md text-gray-900 dark:text-white">
                          {test.input}
                        </pre>
                      </p>
                      <p className="mt-3">
                        <strong className="text-indigo-500">Output:</strong>
                        <pre className="whitespace-pre-wrap break-words bg-gray-200 dark:bg-gray-600 mt-1 p-2 rounded-md text-gray-900 dark:text-white">
                          {test.output}
                        </pre>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {problem.tags?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2 text-indigo-600 dark:text-indigo-300">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
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

const DetailSection = ({ title, content }) => (
  <div>
    <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-300 mb-1">
      {title}
    </h2>
    <p className="pl-2 whitespace-pre-wrap break-words">{content}</p>
  </div>
);

export default ViewProblem;
