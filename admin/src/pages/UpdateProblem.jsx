import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminContext } from '../context/AdminContext';
import { motion, AnimatePresence } from 'framer-motion';

// Clean TextArea with refined glass effect
const TextArea = ({ name, value, onChange, rows = 3, placeholder, className = '', ...props }) => (
  <div className={`relative group ${className}`}>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      className="w-full px-4 py-3 bg-slate-800/80 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 resize-none shadow-lg group-hover:border-white/30"
      placeholder={placeholder}
      {...props}
    />
    <div className="absolute bottom-2 right-3 text-xs text-slate-400">
      {value.length}/5000
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
  </div>
);

const UpdateProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, backendUrl } = useContext(AdminContext);
  const [retainTestIds, setRetainTestIds] = useState([]);
  const [existingHiddenTests, setExistingHiddenTests] = useState([]);
  const [testCaseZip, setTestCaseZip] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tagInput, setTagInput] = useState('');
  const [samples, setSamples] = useState([{ input: '', output: '' }]);
  const [inputFiles, setInputFiles] = useState([]);
  const [outputFiles, setOutputFiles] = useState([]);
  const [activeSection, setActiveSection] = useState(0);

  const inputRef = useRef(null);
  const outputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    difficulty: 'easy',
    tags: [],
  });

  // Sync tagInput when formData.tags changes externally
  useEffect(() => {
    setTagInput(formData.tags.join(', '));
  }, [formData.tags]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/problem/${id}`, {
          headers: { token }
        });
        const p = res.data.problem;
        
        const samplesArray = Array.isArray(p.samples) 
          ? p.samples 
          : Object.values(p.samples || {});

        const formattedHiddenTests = (p.hiddenTests || []).map(test => ({
          ...test,
          inputDisplayPath: test.inputFilePath || test.input,
          outputDisplayPath: test.outputFilePath || test.output
        }));

        setSamples(samplesArray);
        setExistingHiddenTests(formattedHiddenTests);
        setRetainTestIds(formattedHiddenTests.map(test => test._id) || []);

        setFormData({
          title: p.title,
          description: p.description,
          inputFormat: p.inputFormat,
          outputFormat: p.outputFormat,
          constraints: p.constraints,
          difficulty: p.difficulty,
          tags: Array.isArray(p.tags) ? p.tags : (p.tags ? [p.tags] : []),
        });

      } catch (err) {
        toast.error("Failed to load problem");
        navigate('/');
      } finally {
        // Add a delay to show the loading state
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    };

    fetchProblem();
  }, [id, navigate, backendUrl, token]);

  const handleTagChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleSampleChange = (index, field, value) => {
    const updatedSamples = [...samples];
    updatedSamples[index][field] = value;
    setSamples(updatedSamples);
  };

  const addSample = () => {
    setSamples([...samples, { input: '', output: '' }]);
  };

  const removeSample = (index) => {
    const updatedSamples = samples.filter((_, i) => i !== index);
    setSamples(updatedSamples);
  };

  const toggleRetainTest = (id) => {
    setRetainTestIds(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleInputFiles = (e) => {
    const files = [...e.target.files];
    setInputFiles(files);
  };


  // for debugging of asynchronous file 
  //useEffect(() => {
  //console.log("Input Files:", inputFiles);
  // }, [inputFiles]);

  // useEffect(() => {
  //   console.log("Output Files:", outputFiles);
  // }, [outputFiles]);

  const handleOutputFiles = (e) => {
    const files = [...e.target.files];
    setOutputFiles(files);
  };

  const handleZipFile = (e) => {
    if (e.target.files.length > 0) {
      setTestCaseZip(e.target.files[0]);
      setInputFiles([]);
      setOutputFiles([]);
    }
  };

  const getDisplayName = (path) => {
    if (!path) return 'Unknown';
    if (path.includes('/') || path.includes('\\')) {
      return path.split(/[/\\]/).pop();
    }
    return path;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (testCaseZip && (inputFiles.length > 0 || outputFiles.length > 0)) {
      toast.error('Please use either zip file or individual files, not both.');
      return;
    }

    const fd = new FormData();
    
    // Process tags from tagInput and combine with existing formData.tags
    const tagsFromInput = tagInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    const allTags = [...new Set([...formData.tags, ...tagsFromInput])];
    
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'tags') {
        fd.append(key, JSON.stringify(allTags));
      } else {
        fd.append(key, value);
      }
    });

    fd.append('samples', JSON.stringify(samples));
    fd.append('retainTestIds', JSON.stringify(retainTestIds));

    if (testCaseZip) {
      fd.append('zipFile', testCaseZip);
    } else {
      inputFiles.forEach(file => fd.append('inputFiles', file));
      outputFiles.forEach(file => fd.append('outputFiles', file));
    }

    try {
      setIsUploading(true);
      const res = await axios.post(
        `${backendUrl}/api/problem/update/${id}`,
        fd,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            token,
          }
        }
      );

      if (res.data.success) {
        toast.success("Problem updated successfully!");
        navigate('/problems');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setIsUploading(false);
    }
  };

  const sections = [
    { title: 'Basic Info', icon: '📝' },
    { title: 'Test Cases', icon: '🧪' },
    { title: 'Files', icon: '📁' }
  ];

  if (isLoading) {
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
    <div className="min-h-screen bg-[#07034d] py-25 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Update Problem</h2>
          <p className="text-slate-400 text-sm sm:text-base">Edit your coding challenge</p>
        </motion.div>

        {/* Clean Glass Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Dark Inner Background */}
          <div className="absolute inset-0 bg-slate-900/60 rounded-3xl"></div>
          
          {/* Main Form Content */}
          <div className="relative">
            {/* Progress Steps */}
            <div className="flex items-center justify-center p-4 sm:p-6 border-b border-white/10 bg-slate-800/40">
              {sections.map((section, index) => (
                <div key={index} className="flex items-center">
                  <motion.div
                    className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 ${
                      activeSection === index 
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setActiveSection(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="text-base sm:text-lg">{section.icon}</span>
                    <span className="text-xs sm:text-sm font-medium hidden sm:block">{section.title}</span>
                  </motion.div>
                  {index < sections.length - 1 && (
                    <div className="w-4 sm:w-8 h-px bg-slate-600 mx-1 sm:mx-2"></div>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
              <AnimatePresence mode="wait">
                {/* Section 1: Basic Information */}
                {activeSection === 0 && (
                  <motion.div
                    key="basic"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4 sm:space-y-6"
                  >
                    {/* Title & Difficulty Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="lg:col-span-2 space-y-2">
                        <label className="block text-sm font-medium text-slate-200">Problem Title</label>
                        <div className="relative group">
                          <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-slate-800/80 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 shadow-lg group-hover:border-white/30"
                            placeholder="Enter problem title"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-200">Difficulty</label>
                        <div className="relative group">
                          <select
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-slate-800/80 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 shadow-lg group-hover:border-white/30"
                          >
                            <option value="easy" className="bg-slate-800">Easy</option>
                            <option value="medium" className="bg-slate-800">Medium</option>
                            <option value="hard" className="bg-slate-800">Hard</option>
                          </select>
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-200">Description</label>
                      <TextArea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        required
                        placeholder="Describe the problem in detail..."
                      />
                    </div>

                    {/* Input/Output Format Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-200">Input Format</label>
                        <TextArea
                          name="inputFormat"
                          value={formData.inputFormat}
                          onChange={handleChange}
                          rows={3}
                          required
                          placeholder="Expected input format"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-200">Output Format</label>
                        <TextArea
                          name="outputFormat"
                          value={formData.outputFormat}
                          onChange={handleChange}
                          rows={3}
                          required
                          placeholder="Expected output format"
                        />
                      </div>
                    </div>

                    {/* Constraints & Tags Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-200">Constraints</label>
                        <TextArea
                          name="constraints"
                          value={formData.constraints}
                          onChange={handleChange}
                          rows={3}
                          required
                          placeholder="Problem constraints"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-200">Tags</label>
                        <div className="relative group">
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onBlur={() => {
                              const newTags = tagInput
                                .split(',')
                                .map(tag => tag.trim())
                                .filter(tag => tag && !formData.tags.includes(tag));
                              
                              if (newTags.length > 0) {
                                setFormData(prev => ({ 
                                  ...prev, 
                                  tags: [...prev.tags, ...newTags] 
                                }));
                                setTagInput('');
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const newTags = tagInput
                                  .split(',')
                                  .map(tag => tag.trim())
                                  .filter(tag => tag && !formData.tags.includes(tag));
                                
                                if (newTags.length > 0) {
                                  setFormData(prev => ({ 
                                    ...prev, 
                                    tags: [...prev.tags, ...newTags] 
                                  }));
                                  setTagInput('');
                                }
                              }
                            }}
                            className="w-full px-4 py-3 bg-slate-800/80 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 shadow-lg group-hover:border-white/30"
                            placeholder="array, sorting, dp"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                        {formData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formData.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      tags: prev.tags.filter((_, i) => i !== index)
                                    }));
                                  }}
                                  className="ml-2 text-blue-300 hover:text-blue-100"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="text-xs text-slate-400">
                          Current tags: {formData.tags.length > 0 ? formData.tags.join(', ') : 'None'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Section 2: Test Cases */}
                {activeSection === 1 && (
                  <motion.div
                    key="testcases"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4 sm:space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <h3 className="text-lg font-semibold text-white">Sample Test Cases</h3>
                      <motion.button
                        type="button"
                        onClick={addSample}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg text-sm self-start"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Test Case
                      </motion.button>
                    </div>

                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {samples.map((sample, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="relative bg-slate-800/60 border border-white/10 rounded-2xl p-4 shadow-lg"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-slate-200">Test Case {index + 1}</span>
                            {samples.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSample(index)}
                                className="text-slate-400 hover:text-white transition-colors duration-200 bg-slate-700/50 rounded-lg p-1"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="block text-xs font-medium text-slate-300">Input</label>
                              <TextArea
                                value={sample.input}
                                onChange={(e) => handleSampleChange(index, 'input', e.target.value)}
                                rows={3}
                                required
                                placeholder="Sample input"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs font-medium text-slate-300">Output</label>
                              <TextArea
                                value={sample.output}
                                onChange={(e) => handleSampleChange(index, 'output', e.target.value)}
                                rows={3}
                                required
                                placeholder="Expected output"
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Section 3: File Upload */}
                {activeSection === 2 && (
                  <motion.div
                    key="files"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4 sm:space-y-6"
                  >
                    <h3 className="text-lg font-semibold text-white">Test Case Files</h3>
                    
                    {/* Zip Upload */}
                    <div className="relative group">
                      <motion.div 
                        className="border-2 border-dashed border-white/30 rounded-2xl p-6 sm:p-8 text-center hover:border-blue-400/50 transition-all duration-300 bg-slate-800/40"
                        whileHover={{ scale: 1.02 }}
                      >
                        <input 
                          type="file" 
                          accept=".zip,.rar,.7zip"
                          onChange={handleZipFile}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <p className="text-white font-medium mb-2 text-sm sm:text-base">
                            {testCaseZip ? testCaseZip.name : 'Upload Test Cases Zip'}
                          </p>
                          <p className="text-slate-400 text-xs sm:text-sm">
                            Drag & drop or click to browse
                          </p>
                          {testCaseZip && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTestCaseZip(null);
                              }}
                              className="mt-3 text-red-400 hover:text-red-300 text-sm bg-slate-700/50 px-3 py-1 rounded-lg"
                            >
                              Remove File
                            </button>
                          )}
                        </div>
                      </motion.div>
                    </div>

                    {/* OR Separator */}
                    <div className="flex items-center">
                      <div className="flex-1 border-t border-slate-600"></div>
                      <span className="px-4 text-slate-400 text-sm">OR</span>
                      <div className="flex-1 border-t border-slate-600"></div>
                    </div>

                    {/* Existing Test Cases */}
                    {existingHiddenTests.length > 0 && (
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-slate-200">Existing Hidden Test Cases</label>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {existingHiddenTests.map(test => (
                            <motion.div 
                              key={test._id}
                              // Removed whileHover to prevent scaling/translation on hover
                              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-white/10 rounded-lg bg-slate-800/40 hover:bg-slate-800/60 transition-colors duration-200 gap-2"
                            >
                              <span className="text-xs sm:text-sm font-mono text-slate-300 break-all">
                                {getDisplayName(test.inputDisplayPath)} ➝ {getDisplayName(test.outputDisplayPath)}
                              </span>
                              <label className="inline-flex items-center cursor-pointer self-start sm:self-center">
                                <input
                                  type="checkbox"
                                  checked={retainTestIds.includes(test._id)}
                                  onChange={() => toggleRetainTest(test._id)}
                                  className="sr-only peer"
                                />
                                <div className="relative w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Individual Files */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <motion.div
                        className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-6 text-center transition-all duration-300 flex-1 cursor-pointer ${
                          testCaseZip
                            ? 'border-slate-600/30 bg-slate-800/20 opacity-50 pointer-events-none'
                            : 'border-white/30 bg-slate-800/40 hover:border-green-400/50'
                        }`}
                        whileHover={!testCaseZip ? { scale: 1.02 } : {}}
                        onClick={() => !testCaseZip && inputRef.current && inputRef.current.click()}
                      >
                        <input
                          ref={inputRef}
                          type="file"
                          multiple
                          onChange={handleInputFiles}
                          className="hidden"
                          disabled={!!testCaseZip}
                        />
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-3">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <p className="text-white text-sm font-medium mb-1">Input Files</p>
                          <p className="text-slate-400 text-xs">
                            {inputFiles.length > 0 ? `${inputFiles.length} files selected` : 'Select input files'}
                          </p>
                        </div>
                      </motion.div>

                      {/* Output Files */}
                      <motion.div
                        className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-6 text-center transition-all duration-300 flex-1 cursor-pointer ${
                          testCaseZip
                            ? 'border-slate-600/30 bg-slate-800/20 opacity-50 pointer-events-none'
                            : 'border-white/30 bg-slate-800/40 hover:border-orange-400/50'
                        }`}
                        whileHover={!testCaseZip ? { scale: 1.02 } : {}}
                        onClick={() => !testCaseZip && outputRef.current && outputRef.current.click()}
                      >
                        <input
                          ref={outputRef}
                          type="file"
                          multiple
                          onChange={handleOutputFiles}
                          className="hidden"
                          disabled={!!testCaseZip}
                        />
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-3">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <p className="text-white text-sm font-medium mb-1">Output Files</p>
                          <p className="text-slate-400 text-xs">
                            {outputFiles.length > 0 ? `${outputFiles.length} files selected` : 'Select output files'}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation & Submit */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-white/10 gap-4">
                  <div className="flex gap-3">
                    {activeSection > 0 && (
                      <motion.button
                        type="button"
                        onClick={() => setActiveSection(activeSection - 1)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 sm:px-6 py-3 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-600/50 transition-all duration-300 font-medium text-sm sm:text-base"
                      >
                        Previous
                      </motion.button>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {activeSection < 2 ? (
                      <motion.button
                        type="button"  // Make sure this is type="button" to prevent form submission
                        onClick={(e) => {
                          e.preventDefault(); // Prevent any form submission
                          setActiveSection(activeSection + 1);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg text-sm sm:text-base"
                      >
                        Next
                      </motion.button>
                    ) : (
                      <motion.button
                        type="submit"  // Only this button should submit the form
                        onClick={(e) => {
                          // Don't prevent default here as we want form submission
                          if (isUploading) {
                            e.preventDefault();
                            return;
                          }
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isUploading}
                        className={`px-6 sm:px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg text-sm sm:text-base ${
                          isUploading ? 'opacity-70 cursor-not-allowed' : 'hover:from-green-600 hover:to-emerald-700'
                        }`}
                      >
                        {isUploading ? (
                          <div className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="hidden sm:inline">Updating...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Update Problem
                          </div>
                        )}
                      </motion.button>
                    )}
                  </div>
                </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UpdateProblem;