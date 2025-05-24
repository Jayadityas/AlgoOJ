import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const languageOptions = {
  javascript: { label: 'JavaScript', extension: javascript() },
  python: { label: 'Python', extension: python() },
  cpp: { label: 'C++', extension: cpp() },
};


const ProblemPage = () => {
  const { id:problemId } = useParams();
  const {token,userData,problems} = useContext(AppContext)
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('// Write your code here...');
  const [language, setLanguage] = useState('javascript');
  const [verdict, setVerdict] = useState(null);
  const [output, setOutput] = useState(null);
  const [executionTime , setExecutionTime] = useState(null);

  useEffect(() => {
    console.log(problems)
    console.log(problemId)
  const selectedProblem = problems.find((p) => p._id === problemId);
  if (selectedProblem) {
    setProblem(selectedProblem);
  } else {
    toast.error('Problem not found');
  }
}, [problemId, problems]);

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/submit`, {
        username:userData?.username,
        problemId,
        code,
        language,
      },{
        headers: {
            token
        }});
      setVerdict(res.data.verdict);
      setOutput(res.data.output);
      setExecutionTime(res.data.executionTime);
      toast.success(res.data.message || 'Submitted successfully!');
    } catch (error) {
      toast.error('Submission failed');
    }
  };

  const handleRun = async () => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/run`, {
      code,
      language,
      problemId,
    },{headers:{token}});

        setOutput(res.data.output);
        setVerdict(res.data.verdict);
        setExecutionTime(res.data.executionTime);
        toast.success('Code executed successfully');
    } catch (error) {
        toast.error('Run failed');
    }
  };


  return (
    <div className='bg-[#07034d]'>
    <div className="max-w-6xl mx-auto px-4 py-30">
      {problem ? (
        <div className="space-y-10">
          <h1 className="text-4xl font-bold text-blue-300">{problem.title}</h1>

          <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Description</h2>
              <p className="text-gray-600">{problem.description}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Input Format</h2>
              <p className="text-gray-600">{problem.inputFormat}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Output Format</h2>
              <p className="text-gray-600">{problem.outputFormat}</p>
            </div>
            <div>
            <h2 className="text-xl font-semibold text-gray-700">Constraints</h2>
            <p className="text-gray-600 whitespace-pre-line">{problem.constraints}</p>
            </div>

            {problem.samples && (
            <div>
                <h2 className="text-xl font-semibold text-gray-700">Sample Input</h2>
                <pre className="bg-gray-100 p-3 rounded text-sm text-gray-800 whitespace-pre-wrap">
                {problem.samples[0].input}
                </pre>
            </div>
            )}

            {problem.samples && (
            <div>
                <h2 className="text-xl font-semibold text-gray-700">Sample Output</h2>
                <pre className="bg-gray-100 p-3 rounded text-sm text-gray-800 whitespace-pre-wrap">
                {problem.samples[0].output}
                </pre>
            </div>
            )}

          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <label className="text-lg font-medium text-white">Choose Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border text-amber-400 border-gray-300 rounded-md px-4 py-2 shadow-md"
            >
              {Object.keys(languageOptions).map((key) => (
                <option key={key} value={key}>
                  {languageOptions[key].label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg overflow-hidden shadow-md border">
            <CodeMirror
              value={code}
              height="500px"
              extensions={[languageOptions[language].extension]}
              onChange={(value) => setCode(value)}
              className="text-sm"
            />
          </div>

          <button
            onClick={handleRun}
            className="bg-green-600 text-white px-6 mx-6 py-3 rounded-lg hover:bg-green-700 transition w-full md:w-auto"
          >
            Run Code
          </button>


          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 mx-6 py-3 rounded-lg hover:bg-green-700 transition w-full md:w-auto"
          >
            Submit Code
          </button>

          {verdict && (
            <div className="bg-gray-100 p-4 rounded-md shadow-md">
              <p className="text-lg font-semibold text-gray-700">Verdict: <span className={`font-semibold ${verdict==='Wrong Answer' ? 'text-red-600' : 'text-green-600'}`}>{verdict}</span></p>
              {output && (
                <>
                <p className="mt-2 text-gray-700 ">Output: <span className='text-blue-600'>{output}</span></p>
                <p className="mt-2 text-gray-700">RunTime: <span className='text-blue-600'>{executionTime}ms</span></p>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-600">Loading problem...</p>
      )}
    </div>
    </div>
  );
};

export default ProblemPage;