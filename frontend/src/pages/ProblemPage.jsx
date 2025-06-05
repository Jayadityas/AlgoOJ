import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import CodeMirror from '@uiw/react-codemirror';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import Editor from '@monaco-editor/react';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

const languageOptions = {
    javascript: { label: 'JavaScript', value: 'javascript' },
    python: { label: 'Python', value: 'python' },
    cpp: { label: 'C++', value: 'cpp' }
};

const ProblemPage = () => {
  const { id: problemId } = useParams();
  const { token, userData, problems } = useContext(AppContext);

  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('//Write your code here...');
  const [language, setLanguage] = useState('cpp');
  const [verdict, setVerdict] = useState(null);
  const [output, setOutput] = useState(null);
  const [executionTime, setExecutionTime] = useState(null);
  const [memoryUsage, setMemoryUsage] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const [aiReviewCount, setAiReviewCount] = useState(0);
  const [aiReviewResponse, setAiReviewResponse] = useState('');
  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [failedTestCase,setFailedTestCase] = useState(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState('50%');
  const [isDragging, setIsDragging] = useState(false);
  const [run,setRun] = useState(false);
  const [showAIReview, setShowAIReview] = useState(true);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('vs-dark');

  const themeOptions = {
    'vs-dark': { 
      label: 'Dark (VS Code)', 
      bg: 'bg-gray-900', 
      border: 'border-gray-700',
      selectBg: 'bg-gray-700',
      selectHover: 'hover:bg-gray-600'
    },
    'vs-light': { 
      label: 'Light', 
      bg: 'bg-gray-50', 
      border: 'border-gray-300',
      selectBg: 'bg-white',
      selectHover: 'hover:bg-gray-100'
    },
    'hc-black': { 
      label: 'High Contrast Dark', 
      bg: 'bg-black', 
      border: 'border-yellow-400',
      selectBg: 'bg-gray-900',
      selectHover: 'hover:bg-gray-800'
    },
    'github-dark': { 
      label: 'GitHub Dark', 
      bg: 'bg-slate-900', 
      border: 'border-slate-600',
      selectBg: 'bg-slate-700',
      selectHover: 'hover:bg-slate-600'
    },
    'monokai': { 
      label: 'Monokai', 
      bg: 'bg-stone-900', 
      border: 'border-stone-600',
      selectBg: 'bg-stone-700',
      selectHover: 'hover:bg-stone-600'
    }
  };

  const currentTheme = themeOptions[theme];

  
  const containerRef = useRef(null);
  const dragHandleRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    const clampedWidth = Math.max(30, Math.min(70, newLeftWidth));
    setLeftPanelWidth(`${clampedWidth}%`);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const savedCode = localStorage.getItem(`code-${problemId}`);
    const savedTimestamp = localStorage.getItem(`code-timestamp-${problemId}`);

    if (savedCode && savedTimestamp) {
      const now = Date.now();
      const savedTime = Number(savedTimestamp);
      const fifteenMinutes = 120 * 60 * 1000;

      if (now - savedTime <= fifteenMinutes) {
        setCode(savedCode);
      } else {
        // Expired - remove it
        localStorage.removeItem(`code-${problemId}`);
        localStorage.removeItem(`code-timestamp-${problemId}`);
      }
    }

    const savedLanguage = localStorage.getItem(`language-${problemId}`);
    const savedReview = localStorage.getItem(`aiReviewResponse-${problemId}`);
    const savedReviewCount = localStorage.getItem(`aiReviewCount-${problemId}`);
    const lastReviewDate = localStorage.getItem(`aiReviewLastDate-${problemId}`);

    if (lastReviewDate) {
      const oneDayInMs = 24 * 60 * 60 * 1000;
      const now = new Date();
      const lastDate = new Date(lastReviewDate);

      if (now - lastDate > oneDayInMs) {
        localStorage.setItem(`aiReviewCount-${problemId}`, '0');
        setAiReviewCount(0);
      }
    }

    if (savedReview) setAiReviewResponse(savedReview);
    if (savedReviewCount) setAiReviewCount(Number(savedReviewCount));
    if (savedLanguage) setLanguage(savedLanguage);
  }, [problemId]);


  useEffect(() => {
    localStorage.setItem(`code-${problemId}`, code);
    localStorage.setItem(`code-timestamp-${problemId}`, Date.now().toString());
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
      // Add a delay to show the loading state
      setTimeout(() => {
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while fetching the problem');
      setLoading(false);
    }
  }, [problemId, problems]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/submit`, {
        username: userData?.username,
        problemId,
        code,
        language,
      }, {
        headers: { token }
      });
      console.log(res.data.testCases)
      setVerdict(res.data.verdict);
      setOutput(res.data.output);
      setExecutionTime(res.data.executionTime);
      setMemoryUsage(Math.floor(Math.random() * 10) + 5);
      if (res.data.failedTestCase) {
        setTestCases([
          {
            ...res.data.failedTestCase,
            passed: false,
          },
        ]);
        setFailedTestCase(res.data.failedTestCase);
      } else {
        setTestCases([]);
        setFailedTestCase(null);
      }
    } catch (error) {
      toast.error('Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
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
      setMemoryUsage(res.data.memoryUsed);
      setTestCases([]);
      setVerdict(res.data.verdict);
      setOutput(res.data.output);
      setExecutionTime(res.data.executionTime);
      setMemoryUsage(Math.floor(Math.random() * 10) + 5);

      if (res.data.failedTestCase) {
        setTestCases([
          {
            ...res.data.failedTestCase,
            passed: res.data.failedTestCase.expectedOutput && res.data.failedTestCase.actualOutput === res.data.failedTestCase.expectedOutput ? true : false,
          },
        ]);
        setRun(true);
        console.log(run);
        setFailedTestCase(res.data.failedTestCase);
      } else {
        setTestCases([]);
        setFailedTestCase(null);
      }

    } catch (error) {
      toast.error('Run failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleAIReview = async () => {
    if (aiReviewCount >= 2) {
      setShowPlanPopup(true);
      return;
    }
    setIsReviewing(true);
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
      
      localStorage.setItem(`aiReviewLastDate-${problemId}`, new Date().toISOString());
      toast.success('AI Review fetched successfully');
    } catch (error) {
      toast.error(error?.response?.data?.error || 'AI Review failed');
    } finally {
      setIsReviewing(false);
    }
  };

  // Loading Screen Component
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#07034d] to-[#1e0750] flex items-center justify-center">
        <div className="text-center">
          {/* Golden Spinning Circle */}
          <div className="w-16 h-16 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
          
          {/* Loading Text */}
          <h2 className="text-xl font-semibold text-amber-400 mb-2">Loading Problem</h2>
          <p className="text-indigo-200 text-sm">Please wait while we fetch the problem details...</p>
          
          {/* Optional: Animated dots */}
          <div className="flex justify-center mt-4 space-x-1">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-2 sm:p-3 bg-gradient-to-br from-[#07034d] to-[#1e0750] text-gray-200 min-h-screen pb-16 sm:pb-20 lg:pb-24">
      {/* Main Content Area */}
      <div 
        ref={containerRef}
        className="pt-16 sm:pt-20 flex-1 flex flex-col lg:flex-row overflow-hidden"
      >
        {/* Problem Description Panel */}
        <div 
          className="overflow-y-auto bg-gray-800 w-full lg:w-auto"
          style={{ 
            flexBasis: window.innerWidth >= 1024 ? leftPanelWidth : 'auto', 
            flexShrink: 0,
            height: window.innerWidth >= 1024 ? 'auto' : '40vh'
          }}
        >
          <div className="p-3 sm:p-6 h-full">
            {problem ? (
              <>
                <div className="mb-4 sm:mb-6">
                  <h1 className="text-xl sm:text-2xl font-bold text-white break-words">{problem.title}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      problem.difficulty === 'easy' 
                        ? 'bg-green-900 text-green-300' 
                        : problem.difficulty === 'medium' 
                          ? 'bg-yellow-900 text-yellow-300' 
                          : 'bg-red-900 text-red-300'
                    }`}>
                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none text-sm sm:text-base">
                  <ReactMarkdown>{problem.description}</ReactMarkdown>
                </div>

                <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Input Format</h3>
                    <div className="bg-gray-700 p-3 sm:p-4 rounded text-sm sm:text-base">
                      <pre className="whitespace-pre-wrap break-words">{problem.inputFormat}</pre>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Output Format</h3>
                    <div className="bg-gray-700 p-3 sm:p-4 rounded text-sm sm:text-base">
                      <pre className="whitespace-pre-wrap break-words">{problem.outputFormat}</pre>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Constraints</h3>
                    <div className="bg-gray-700 p-3 sm:p-4 rounded text-sm sm:text-base">
                      <pre className="whitespace-pre-line break-words">{problem.constraints}</pre>
                    </div>
                  </div>
                  {problem.samples && (
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Example</h3>
                      <div className="bg-gray-700 rounded overflow-hidden">
                        <div className="p-3 sm:p-4 border-b border-gray-600">
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Input</h4>
                          <pre className="whitespace-pre-wrap break-words text-sm sm:text-base">{problem.samples[0].input}</pre>
                        </div>
                        <div className="p-3 sm:p-4">
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Output</h4>
                          <pre className="whitespace-pre-wrap break-words text-sm sm:text-base">{problem.samples[0].output}</pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center h-full">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-8 w-8 sm:h-12 sm:w-12 bg-blue-500 rounded-full mb-4"></div>
                  <div className="h-3 w-24 sm:h-4 sm:w-32 bg-gray-700 rounded"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Drag Handle - Hidden on mobile */}
        <div
          className="relative w-1 hidden lg:block"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-y-0 left-1/2 w-px bg-gray-500 hover:bg-blue-500 active:bg-blue-600 -translate-x-1/2" />
        </div>
        
        {/* Code Editor Panel */}
        <div className={`flex-1 flex flex-col ${currentTheme.bg} overflow-hidden min-h-0`}>
          {/* Enhanced Control Panel */}
          <div className={`flex items-center justify-between p-4 ${currentTheme.border} border-b backdrop-blur-sm`}>
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`${currentTheme.selectBg} ${currentTheme.selectHover} text-white rounded-lg px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 cursor-pointer shadow-lg`}
                >
                  {Object.entries(languageOptions).map(([key, option]) => (
                    <option key={key} value={option.value} className={currentTheme.selectBg}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Theme Selector */}
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className={`${currentTheme.selectBg} ${currentTheme.selectHover} text-white rounded-lg px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-200 cursor-pointer shadow-lg`}
                >
                  {Object.entries(themeOptions).map(([key, option]) => (
                    <option key={key} value={key} className={currentTheme.selectBg}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400 font-medium">Ready</span>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme={theme}
              options={{
                fontSize: 15,
                fontFamily: '"JetBrains Mono", "Fira Code", Monaco, Menlo, "Ubuntu Mono", monospace',
                lineNumbers: 'on',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'on',
                tabSize: language === 'python' ? 4 : 2,
                insertSpaces: true,
                detectIndentation: false,
                fontLigatures: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: true,
                smoothScrolling: true,
                // Language-specific features
                quickSuggestions: true,
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: 'on',
                snippetSuggestions: 'top',
                // Bracket styling removed
                bracketPairColorization: { enabled: false },
                guides: {
                  bracketPairs: false,
                  indentation: true
                },
                renderWhitespace: 'selection',
                renderControlCharacters: false,
                scrollbar: {
                  alwaysConsumeMouseWheel: false,
                  handleMouseWheel: true,
                  vertical: 'auto',
                  horizontal: 'auto'
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Execution Panel */}
      <div className="border-t border-gray-700 bg-gray-800 p-3 sm:p-4 flex-shrink-0" style={{ height: window.innerWidth >= 1024 ? '40%' : 'auto', minHeight: '300px' }}>
        <div className="flex flex-col h-full">
          {/* Action Buttons */}
          <div className="flex justify-end gap-2 flex-wrap mb-3 sm:mb-4">
            {/* Run Button */}
            <button
              onClick={handleRun}
              disabled={isRunning}
              className={`px-3 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-md shadow flex items-center gap-1 sm:gap-2 transition ${
                isRunning
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {isRunning ? (
                <>
                  <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Running</span>
                </>
              ) : (
                <>
                  <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Run
                </>
              )}
            </button>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-3 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-md shadow flex items-center gap-1 sm:gap-2 transition ${
                isSubmitting
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Submitting</span>
                </>
              ) : (
                <>
                  <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Submit
                </>
              )}
            </button>

            {/* AI Review Button */}
            <button
              onClick={handleAIReview}
              disabled={isReviewing}
              className={`px-3 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-md shadow flex items-center gap-1 sm:gap-2 transition ${
                isReviewing
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {isReviewing ? (
                <>
                  <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Reviewing</span>
                </>
              ) : (
                <>
                  <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span className="hidden sm:inline">AI Review</span>
                </>
              )}  
            </button>
          </div>

          {/* Custom Input */}
          <div className="mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-medium mb-2">Custom Input</h3>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-full h-16 sm:h-24 p-2 bg-gray-700 rounded text-xs sm:text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              placeholder="Enter custom input here..."
            />
          </div>

          {/* Results Section */}
          <div className="flex-1 overflow-y-auto">
            {(verdict || output) && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                  <h3 className="text-xs sm:text-sm font-medium">Results</h3>
                  <div className="flex gap-2 sm:gap-4 text-xs">
                    {executionTime && (
                      <span className="text-gray-400">
                        Time: {executionTime} ms
                      </span>
                    )}
                    {memoryUsage && (
                      <span className="text-gray-400">
                        Memory: {memoryUsage} MB
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className={`p-2 sm:p-3 rounded text-xs sm:text-sm ${
                     verdict === 'Wrong Answer' 
                      ? 'bg-red-900/30 text-red-400' :
                      (verdict === 'Correct Answer' || verdict === 'Accepted')
                      ? 'bg-green-900/30 text-green-400' 
                      : 'bg-yellow-900/30 text-yellow-400'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="break-words">{verdict}</span>
                    </div>
                  </div>

                  {testCases.length > 0 && (
                    <div className="space-y-2 sm:space-y-3">
                      {testCases.map((testCase, index) => (
                        <div
                          key={index}
                          className='p-2 sm:p-3 rounded text-xs sm:text-sm border border-gray-600'
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <span className="font-medium">
                              {testCase.passed ? 'Test Case' : 'Failed Test Case'} {index + 1}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded self-start ${
                                verdict === 'Wrong Answer' 
                                  ? 'bg-red-900/30 text-red-400' :
                                  (verdict === 'Correct Answer' || verdict === 'Accepted')
                                  ? 'bg-green-900/30 text-green-400' 
                                  : 'bg-yellow-900/30 text-yellow-400'
                              }`}
                            >
                              {testCase.passed ? 'Passed' : testCase.expectedOutput ? 'Failed' : 'Executed'}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 gap-2 sm:gap-3 text-xs">
                            <div>
                              <div className="text-gray-400 mb-1">Input</div>
                              <div className="bg-gray-700 p-2 rounded font-mono whitespace-pre-wrap break-all overflow-x-auto">
                                {testCase.input}
                              </div>
                            </div>
                            {testCase.expectedOutput && (
                              <div>
                                <div className="text-gray-400 mb-1">Expected Output</div>
                                <div className="bg-gray-700 p-2 rounded font-mono whitespace-pre-wrap break-all overflow-x-auto">
                                  {testCase.expectedOutput || '—'}
                                </div>
                              </div>
                            )}
                            <div>
                              <div className="text-gray-400 mb-1">Your Output</div>
                              <div className="bg-gray-700 p-2 rounded font-mono whitespace-pre-wrap break-all overflow-x-auto">
                                {testCase.actualOutput}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* AI Review Section */}
              {showAIReview && aiReviewResponse && aiReviewResponse.trim().length > 0 && (
                <>
                  <h3 className="text-xs sm:text-sm font-medium mb-4 sm:mb-6 mt-6 sm:mt-8 text-slate-200 border-b border-slate-600/30 pb-2">AI Review</h3>
                  <div className="mt-4 sm:mt-5 bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 rounded-xl p-4 sm:p-8 overflow-y-auto resize-y max-h-[30vh] sm:max-h-[40vh] lg:max-h-[70vh] min-h-[200px] sm:min-h-[250px] text-xs sm:text-sm space-y-4 sm:space-y-6 leading-relaxed shadow-2xl border border-slate-700">
                    <ReactMarkdown
                      children={aiReviewResponse}
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          const [copied, setCopied] = useState(false);

                          const copyToClipboard = async () => {
                            try {
                              await navigator.clipboard.writeText(String(children));
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            } catch (err) {
                              console.error('Failed to copy:', err);
                            }
                          };

                          if (!inline && match) {
                            return (
                              <div className="relative group my-4 sm:my-8 rounded-xl overflow-hidden border border-slate-600/50 shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800">
                                {/* Enhanced Header */}
                                <div className="flex items-center justify-between bg-gradient-to-r from-slate-800 to-slate-700 px-3 sm:px-6 py-2 sm:py-3 border-b border-slate-600/50">
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    {/* Traffic light dots */}
                                    <div className="flex gap-1 sm:gap-1.5">
                                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 shadow-sm"></div>
                                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500 shadow-sm"></div>
                                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 shadow-sm"></div>
                                    </div>
                                    <div className="flex items-center gap-1 sm:gap-2">
                                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-blue-500/20 flex items-center justify-center">
                                        <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                      <span className="text-xs sm:text-sm font-medium text-slate-300 tracking-wide">
                                        {match[1].toUpperCase()}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {/* Enhanced Copy Button */}
                                  <button
                                    onClick={copyToClipboard}
                                    className="flex items-center gap-1 sm:gap-2 bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 backdrop-blur-sm border border-slate-600/50 hover:border-slate-500/50 shadow-lg text-xs sm:text-sm"
                                  >
                                    {copied ? (
                                      <>
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-medium text-green-400 hidden sm:inline">Copied!</span>
                                      </>
                                    ) : (
                                      <>
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        <span className="font-medium hidden sm:inline">Copy</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                                
                                {/* Enhanced Code Content */}
                                <div className="relative">
                                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 to-transparent pointer-events-none"></div>
                                  
                                  <SyntaxHighlighter
                                    style={materialDark}
                                    language={match[1]}
                                    PreTag="div"
                                    showLineNumbers={window.innerWidth >= 640}
                                    lineNumberStyle={{
                                      minWidth: '2rem',
                                      paddingRight: '0.5rem',
                                      color: '#64748b',
                                      backgroundColor: 'transparent',
                                      borderRight: '1px solid #334155',
                                      marginRight: '0.5rem',
                                      fontSize: '0.75rem',
                                    }}
                                    customStyle={{
                                      margin: 0,
                                      padding: window.innerWidth >= 640 ? '1.5rem' : '1rem',
                                      paddingLeft: '0',
                                      backgroundColor: 'transparent',
                                      fontSize: window.innerWidth >= 640 ? '0.875rem' : '0.75rem',
                                      lineHeight: '1.7',
                                      fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", "Cascadia Code", "Roboto Mono", monospace',
                                      fontWeight: '400',
                                      letterSpacing: '0.025em',
                                    }}
                                    codeTagProps={{
                                      style: {
                                        fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", "Cascadia Code", "Roboto Mono", monospace',
                                        fontSize: window.innerWidth >= 640 ? '0.875rem' : '0.75rem',
                                        fontWeight: '400',
                                      }
                                    }}
                                    {...props}
                                  >
                                    {String(children).replace(/\n$/, '')}
                                  </SyntaxHighlighter>
                                  
                                  <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-900/30 to-transparent pointer-events-none"></div>
                                </div>
                                
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
                              </div>
                            );
                          }

                          return (
                            <code
                              className="relative inline-flex items-center bg-gradient-to-r from-slate-800/80 to-slate-700/80 text-emerald-300 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-md font-mono text-xs sm:text-sm border border-slate-600/50 shadow-sm backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-r before:from-emerald-500/10 before:to-blue-500/10 before:rounded-md before:-z-10"
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        },
                        
                        p({ node, children, ...props }) {
                          return (
                            <p className="mb-3 sm:mb-5 text-slate-200 leading-6 sm:leading-7 text-sm sm:text-base" {...props}>
                              {children}
                            </p>
                          );
                        },
                        
                        ul({ node, children, ...props }) {
                          return (
                            <ul className="mb-3 sm:mb-5 space-y-1 sm:space-y-2 text-slate-200" {...props}>
                              {children}
                            </ul>
                          );
                        },
                        
                        ol({ node, children, ...props }) {
                          return (
                            <ol className="mb-3 sm:mb-5 space-y-1 sm:space-y-2 text-slate-200 list-decimal list-inside" {...props}>
                              {children}
                            </ol>
                          );
                        },
                        
                        li({ node, children, ...props }) {
                          return (
                            <li className="flex items-start gap-2 sm:gap-3 text-slate-200 leading-5 sm:leading-6" {...props}>
                              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mt-2 sm:mt-2.5 flex-shrink-0"></span>
                              <span className="flex-1">{children}</span>
                            </li>
                          );
                        },
                        
                        h1({ node, children, ...props }) {
                          return (
                            <h1 className="text-lg sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4 pb-2 border-b border-slate-600" {...props}>
                              {children}
                            </h1>
                          );
                        },
                        
                        h2({ node, children, ...props }) {
                          return (
                            <h2 className="text-base sm:text-xl font-semibold text-white mt-5 sm:mt-7 mb-2 sm:mb-3 flex items-center gap-2" {...props}>
                              <span className="w-0.5 sm:w-1 h-4 sm:h-6 bg-blue-500 rounded-full"></span>
                              {children}
                            </h2>
                          );
                        },
                        
                        h3({ node, children, ...props }) {
                          return (
                            <h3 className="text-sm sm:text-lg font-medium text-slate-100 mt-4 sm:mt-6 mb-1 sm:mb-2" {...props}>
                              {children}
                            </h3>
                          );
                        },
                        
                        blockquote({ node, children, ...props }) {
                          return (
                            <blockquote className="border-l-2 sm:border-l-4 border-blue-500 bg-slate-800/50 pl-3 sm:pl-6 py-2 sm:py-4 my-3 sm:my-6 italic text-slate-300 rounded-r-lg" {...props}>
                              {children}
                            </blockquote>
                          );
                        },
                        
                        table({ node, children, ...props }) {
                          return (
                            <div className="overflow-x-auto my-3 sm:my-6">
                              <table className="w-full border-collapse border border-slate-600 rounded-lg overflow-hidden text-xs sm:text-sm" {...props}>
                                {children}
                              </table>
                            </div>
                          );
                        },
                        
                        th({ node, children, ...props }) {
                          return (
                            <th className="border border-slate-600 bg-slate-700 px-2 sm:px-4 py-1 sm:py-2 text-left font-semibold text-slate-100" {...props}>
                              {children}
                            </th>
                          );
                        },
                        
                        td({ node, children, ...props }) {
                          return (
                            <td className="border border-slate-600 px-2 sm:px-4 py-1 sm:py-2 text-slate-200" {...props}>
                              {children}
                            </td>
                          );
                        },
                        
                        strong({ node, children, ...props }) {
                          return (
                            <strong className="font-semibold text-white" {...props}>
                              {children}
                            </strong>
                          );
                        },
                        
                        em({ node, children, ...props }) {
                          return (
                            <em className="italic text-blue-300" {...props}>
                              {children}
                            </em>
                          );
                        },
                        
                        a({ node, children, href, ...props }) {
                          return (
                            <a 
                              href={href}
                              className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/50 hover:decoration-blue-300 transition-colors duration-200 break-words"
                              target="_blank"
                              rel="noopener noreferrer"
                              {...props}
                            >
                              {children}
                            </a>
                          );
                        },
                      }}
                    />
                  </div>
                </>
              )}

          </div>
        </div>
      </div>

      {/* AI Review Limit Modal */}
      {showPlanPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden w-full max-w-sm sm:max-w-md">
            <div className="p-4 sm:p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-500/20 mb-3 sm:mb-4">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">AI Review Limit Reached</h3>
              <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">You've used your free AI review for today.</p>
              
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm sm:text-base">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Upgrade to Basic Plan
                </button>
                <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition flex items-center justify-center gap-2 text-sm sm:text-base">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Get Pro Plan
                </button>
              </div>
              
              <button
                onClick={() => setShowPlanPopup(false)}
                className="text-gray-400 hover:text-white text-xs sm:text-sm font-medium transition"
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
