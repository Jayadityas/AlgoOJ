import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminContext } from '../context/AdminContext';
import { motion } from 'framer-motion';

const UpdateProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {token, backendUrl, setToken} = useContext(AdminContext);
  const [retainTestIds, setRetainTestIds] = useState([]);
  const [existingHiddenTests, setExistingHiddenTests] = useState([]);

  const [samples, setSamples] = useState([
    { input: '', output: '' },
  ]);

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

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    difficulty: 'easy',
    tags: [],
  });

  const [inputFiles, setInputFiles] = useState([]);
  const [outputFiles, setOutputFiles] = useState([]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/problem/${id}`, {
          headers: {
            "Content-Type": "multipart/form-data",
            token,
          }
        });
        const p = res.data.problem;
        const samplesArray = Array.isArray(p.samples)
          ? p.samples
          : Object.values(p.samples);

        setSamples(samplesArray);
        setExistingHiddenTests(p.hiddenTests || []);
        setRetainTestIds(p.hiddenTests?.map(test => test._id) || []);

        setFormData({
          title: p.title,
          description: p.description,
          inputFormat: p.inputFormat,
          outputFormat: p.outputFormat,
          constraints: p.constraints,
          difficulty: p.difficulty,
          tags: p.tags || [],
        });
      } catch (err) {
        toast.error("Failed to load problem");
        navigate('/');
      }
    };

    fetchProblem();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    for (let key in formData) {
      if (key === 'tags') {
        fd.append('tags', JSON.stringify(formData.tags));
      } else {
        fd.append(key, formData[key]);
      }
    }

    fd.append('samples', JSON.stringify(samples));
    fd.append('retainTestIds', JSON.stringify(retainTestIds));

    inputFiles.forEach(file => fd.append('inputFiles', file));
    outputFiles.forEach(file => fd.append('outputFiles', file));

    try {
      const res = await axios.post(`${backendUrl}/api/problem/update/${id}`, fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
          token,
        }
      });

      if (res.data.success) {
        toast.success("Problem updated!");
        navigate('/');
      } else {
        toast.error(res.data.message);
      }

    } catch (error) {
      console.error(error);
      toast.error("Update failed");
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
      className="min-h-screen py-20 bg-[#07034d] px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl font-bold text-blue-300 mb-2">Update Problem</h2>
          <p className="text-lg text-gray-200">Edit the problem details below</p>
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-6 bg-white rounded-xl shadow-xl p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {['title', 'description', 'inputFormat', 'outputFormat', 'constraints'].map((field, i) => (
            <motion.div key={field} variants={itemVariants} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
              <textarea
                name={field}
                rows={field === 'description' ? 6 : 3}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </motion.div>
          ))}

          <motion.div variants={itemVariants} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Difficulty</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option>easy</option>
              <option>medium</option>
              <option>hard</option>
            </select>
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
                  <button
                    type="button"
                    onClick={() => removeSample(index)}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                  >
                    Remove Test Case
                  </button>
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

          <motion.div variants={itemVariants} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags.join(',')}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                tags: e.target.value.split(',').map(tag => tag.trim())
              }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Existing Hidden Test Cases</label>
            <div className="space-y-2">
              {existingHiddenTests.map(test => (
                <motion.div 
                  key={test._id}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  <span className="text-sm font-mono text-gray-700">
                    {test.inputFilePath.split('/').pop()} ➝ {test.outputFilePath.split('/').pop()}
                  </span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={retainTestIds.includes(test._id)}
                      onChange={() => toggleRetainTest(test._id)}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Hidden Input Files</label>
            <div className="flex items-center gap-4">
              <label className="flex-1 cursor-pointer">
                <input 
                  type="file" 
                  multiple 
                  onChange={e => setInputFiles([...e.target.files])} 
                  className="hidden"
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
                  onChange={e => setOutputFiles([...e.target.files])} 
                  className="hidden"
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
              Update Problem
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default UpdateProblem;