import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import CodeMirror from '@uiw/react-codemirror';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // choose a dark theme
import remarkGfm from 'remark-gfm';

const languageOptions = {
  javascript: { label: 'JavaScript', extension: javascript() },
  python: { label: 'Python', extension: python() },
  cpp: { label: 'C++', extension: cpp() },
};

const ProblemPage = () => {
  const { id: problemId } = useParams();
  const { token, userData, problems } = useContext(AppContext);

  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('// Write your code here...');
  const [language, setLanguage] = useState('cpp');
  const [verdict, setVerdict] = useState(null);
  const [output, setOutput] = useState(null);
  const [executionTime, setExecutionTime] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const [aiReviewCount, setAiReviewCount] = useState(0);
  const [aiReviewResponse, setAiReviewResponse] = useState('');
  const [showPlanPopup, setShowPlanPopup] = useState(false);

  useEffect(() => {
    const savedCode = localStorage.getItem(`code-${problemId}`);
    const savedLanguage = localStorage.getItem(`language-${problemId}`);
    const savedReview = localStorage.getItem(`aiReviewResponse-${problemId}`);
    const savedReviewCount = localStorage.getItem(`aiReviewCount-${problemId}`);
    if (savedReview) setAiReviewResponse(savedReview);
    if (savedReviewCount) setAiReviewCount(Number(savedReviewCount));
    if (savedCode) setCode(savedCode);
    if (savedLanguage) setLanguage(savedLanguage);
  },[problemId])

  useEffect(() => {
    localStorage.setItem(`code-${problemId}`, code);
  }, [code, problemId]);

  useEffect(() => {
    localStorage.setItem(`language-${problemId}`, language);
  }, [language, problemId]);

  useEffect(() => {
    if (aiReviewResponse) localStorage.setItem(`aiReviewResponse-${problemId}`, aiReviewResponse);
  }, [aiReviewResponse, problemId]);

  useEffect(() => {
    localStorage.setItem(`aiReviewCount-${problemId}`, aiReviewCount.toString());
  }, [aiReviewCount, problemId]);

  useEffect(() => {
    try {
      const selectedProblem = problems.find((p) => p._id === problemId);
      if (selectedProblem) {
        setProblem(selectedProblem);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while fetching the problem');
    }
  }, [problemId, problems]);

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/submit`, {
        username: userData?.username,
        problemId,
        code,
        language,
      }, {
        headers: { token }
      });
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
        input: customInput ? customInput : null,
      }, {
        headers: { token }
      });

      setOutput(res.data.output);
      setVerdict(res.data.verdict);
      setExecutionTime(res.data.executionTime);
      toast.success('Code executed successfully');
    } catch (error) {
      toast.error('Run failed');
    }
  };

  const handleAIReview = async () => {
    if (aiReviewCount >= 1) {
      setShowPlanPopup(true);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/ai/review`,
        {
          code,
          language,
          problemId,
          username: userData?.username,
        },
        {
          headers: { token },
        }
      );
      setAiReviewCount(prev => prev + 1);
      setAiReviewResponse(res.data.review || 'No response received.');
      toast.success('AI Review fetched successfully');
    } catch (error) {
      toast.error(error?.response?.data?.error || 'AI Review failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-25 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {problem ? (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-3">
                {problem.title}
              </h1>
              <div className="flex justify-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  problem.difficulty === 'easy' 
                    ? 'bg-green-100 text-green-800' 
                    : problem.difficulty === 'medium' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-red-100 text-red-800'
                }`}>
                  {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                </span>
              </div>
            </div>

            {/* Problem Details Card */}
            <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700 transform transition-all duration-300 hover:shadow-2xl">
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-2">Problem Description</h2>
                <div className="prose prose-invert max-w-none text-white">
                  <ReactMarkdown>{problem.description}</ReactMarkdown>
                </div>
              </div>

              {/* Stacked sections */}
              <div className="space-y-6">

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-blue-400">Input Format</h3>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <pre className="text-gray-200 whitespace-pre-wrap">{problem.inputFormat}</pre>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-blue-400">Output Format</h3>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <pre className="text-gray-200 whitespace-pre-wrap">{problem.outputFormat}</pre>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-blue-400">Constraints</h3>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <pre className="text-gray-200 whitespace-pre-line">{problem.constraints}</pre>
                  </div>
                </div>

                {problem.samples && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-blue-400">Sample Input</h3>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <pre className="text-gray-200 whitespace-pre-wrap">{problem.samples[0].input}</pre>
                    </div>

                    <h3 className="text-xl font-semibold text-blue-400">Sample Output</h3>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <pre className="text-gray-200 whitespace-pre-wrap">{problem.samples[0].output}</pre>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>


            {/* Code Editor Section */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-2xl font-bold text-white">Code Editor</h2>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-blue-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  {Object.keys(languageOptions).map((key) => (
                    <option key={key} value={key} className="bg-gray-800">
                      {languageOptions[key].label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-xl overflow-hidden shadow-lg border border-gray-700 transform transition-all duration-300 hover:shadow-xl">
                <CodeMirror
                  value={code}
                  height="500px"
                  extensions={[languageOptions[language].extension]}
                  onChange={(value) => setCode(value)}
                  theme="dark"
                  className="text-lg"
                />
              </div>
            </div>

            {/* Custom Input Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Custom Input</h3>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="w-full h-40 p-4 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter your custom input here..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleRun}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Run Code
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Submit Code
              </button>
              <button
                onClick={handleAIReview}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                AI Review
              </button>
            </div>

            {/* Verdict Section */}
            {verdict && (
              <div className={`p-6 rounded-xl shadow-lg border ${
                verdict === 'Accepted' || verdict === 'Correct Answer' 
                  ? 'bg-green-900/30 border-green-500' 
                  : verdict === 'Wrong Answer' 
                    ? 'bg-red-900/30 border-red-500' 
                    : 'bg-blue-900/30 border-blue-500'
              } transform transition-all duration-300`}>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-semibold text-white">Result</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    verdict === 'Accepted' || verdict === 'Correct Answer' 
                      ? 'bg-green-100 text-green-800' 
                      : verdict === 'Wrong Answer' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                  }`}>
                    {verdict}
                  </span>
                </div>
                {output && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300">Output:</span>
                      <pre className="text-gray-100 bg-gray-800/50 p-2 rounded-lg overflow-x-auto">{output}</pre>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <span>Execution Time:</span>
                      <span className="font-mono text-white">{executionTime}ms</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AI Review Section */}
            {aiReviewResponse && (
              <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700 transform transition-all duration-300 hover:shadow-2xl">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                      AI Review
                    </h2>
                    <span className="px-2 py-1 text-xs font-bold bg-purple-900/50 text-purple-200 rounded-full">
                      {aiReviewCount}/1 used
                    </span>
                  </div>
                  <div className="prose prose-invert max-w-none text-white bg-gray-700 p-4 rounded-lg border border-gray-600 overflow-y-auto max-h-96">
                    <ReactMarkdown
                      children={aiReviewResponse}
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={materialDark}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className="bg-gray-800 text-green-300 px-1 py-0.5 rounded" {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-blue-500 rounded-full mb-4"></div>
              <div className="h-4 w-32 bg-gray-700 rounded"></div>
            </div>
          </div>
        )}
      </div>

      {/* AI Review Limit Modal */}
      {showPlanPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden w-full max-w-md transform transition-all duration-300 animate-fade-in-up">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20 mb-4">
                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Review Limit Reached</h3>
              <p className="text-gray-400 mb-6">You've used your free AI review for today.</p>
              
              <div className="space-y-3 mb-6">
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg flex items-center justify-center gap-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Upgrade to Basic Plan
                </button>
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-700 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-800 transition-all duration-300 shadow-lg flex items-center justify-center gap-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Get Pro Plan
                </button>
              </div>
              
              <button
                onClick={() => setShowPlanPopup(false)}
                className="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemPage;