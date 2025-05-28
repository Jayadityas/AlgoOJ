import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const CreateProblem = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [inputFormat, setInputFormat] = useState('');
  const [outputFormat, setOutputFormat] = useState('');
  const [constraints, setConstraints] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [tags, setTags] = useState([]);
  const [samples, setSamples] = useState([{ input: '', output: '' }]);
  const [inputFiles, setInputFiles] = useState([]);
  const [outputFiles, setOutputFiles] = useState([]);

  const handleSampleChange = (index, field, value) => {
    const updatedSamples = [...samples];
    updatedSamples[index][field] = value;
    setSamples(updatedSamples);
  };

  const handleInputFiles = (e) => {
    const files = [...e.target.files];
    setInputFiles(files);
  };

  const handleOutputFiles = (e) => {
    const files = [...e.target.files];
    setOutputFiles(files);
  };

  const addSample = () => {
    setSamples([...samples, { input: '', output: '' }]);
  };

  const removeSample = (index) => {
    const updatedSamples = samples.filter((_, i) => i !== index);
    setSamples(updatedSamples);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title || !description || !inputFormat || !outputFormat || !constraints || !difficulty ||
      samples.length === 0 || inputFiles.length === 0 || outputFiles.length === 0 ||
      inputFiles.length !== outputFiles.length
    ) {
      toast.error('Please fill all fields correctly and match test files.');
      return;
    }

    const validSamples = samples.every(s => s.input.trim() !== '' && s.output.trim() !== '');
    if (!validSamples) {
      toast.error('Please fill all sample input/output fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('inputFormat', inputFormat);
    formData.append('outputFormat', outputFormat);
    formData.append('constraints', constraints);
    formData.append('difficulty', difficulty);
    formData.append('samples', JSON.stringify(samples));
    formData.append('tags', JSON.stringify(tags));

    inputFiles.forEach(file => formData.append('inputFiles', file));
    outputFiles.forEach(file => formData.append('outputFiles', file));

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/problem/create`, formData, {
        headers: {
          token,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.success) {
        toast.success(data.message);
        // Reset form after successful submission
        setTitle('');
        setDescription('');
        setInputFormat('');
        setOutputFormat('');
        setConstraints('');
        setDifficulty('easy');
        setTags([]);
        setSamples([{ input: '', output: '' }]);
        setInputFiles([]);
        setOutputFiles([]);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create problem');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const sampleVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    },
    exit: { x: 20, opacity: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#07034d] py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl font-extrabold text-blue-300 mb-2">Create New Problem</h2>
          <p className="text-lg text-gray-200">Fill in the details below to create a new coding problem</p>
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-6 bg-white rounded-xl shadow-xl p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Problem title"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={6}
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Detailed problem description"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Input Format</label>
            <textarea
              rows={3}
              value={inputFormat}
              onChange={e => setInputFormat(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Expected input format"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Output Format</label>
            <textarea
              rows={3}
              value={outputFormat}
              onChange={e => setOutputFormat(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Expected output format"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Constraints</label>
            <textarea
              rows={3}
              value={constraints}
              onChange={e => setConstraints(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Problem constraints"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Difficulty</label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags.join(',')}
              onChange={e => setTags(e.target.value.split(',').map(tag => tag.trim()))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="e.g., array, sorting, dynamic-programming"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <label className="block text-lg font-semibold text-gray-800">Sample Test Cases</label>
            <div className="space-y-4">
              {samples.map((sample, index) => (
                <motion.div
                  key={index}
                  variants={sampleVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Input {index + 1}</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        value={sample.input}
                        onChange={(e) => handleSampleChange(index, 'input', e.target.value)}
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Output {index + 1}</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        value={sample.output}
                        onChange={(e) => handleSampleChange(index, 'output', e.target.value)}
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                  {samples.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSample(index)}
                      className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                    >
                      Remove Test Case
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
            <motion.button
              type="button"
              onClick={addSample}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Sample Test Case
            </motion.button>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Hidden Input Files</label>
            <div className="flex items-center gap-4">
              <label className="flex-1 cursor-pointer">
                <input 
                  type="file" 
                  multiple 
                  onChange={handleInputFiles} 
                  className="hidden"
                  required
                />
                <div className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-center">
                  <p className="text-sm text-gray-600">Click to select input files</p>
                  {inputFiles.length > 0 && (
                    <p className="text-xs mt-1 text-blue-600">{inputFiles.length} file(s) selected</p>
                  )}
                </div>
              </label>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Hidden Output Files</label>
            <div className="flex items-center gap-4">
              <label className="flex-1 cursor-pointer">
                <input 
                  type="file" 
                  multiple 
                  onChange={handleOutputFiles} 
                  className="hidden"
                  required
                />
                <div className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-center">
                  <p className="text-sm text-gray-600">Click to select output files</p>
                  {outputFiles.length > 0 && (
                    <p className="text-xs mt-1 text-blue-600">{outputFiles.length} file(s) selected</p>
                  )}
                </div>
              </label>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-4">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
            >
              Create Problem
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default CreateProblem;