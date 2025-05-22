import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminContext } from '../context/AdminContext';

const UpdateProblem = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const {token,backendUrl,setToken} = useContext(AdminContext);
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Update Problem</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {['title', 'description', 'inputFormat', 'outputFormat', 'constraints'].map(field => (
          <div key={field}>
            <label className="block font-medium mb-1 capitalize">{field}</label>
            <textarea
              name={field}
              rows={field === 'description' ? 6 : 3}
              value={formData[field]}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        ))}

        <div>
          <label className="block font-medium mb-1">Difficulty</label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option>easy</option>
            <option>medium</option>
            <option>hard</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Sample Test Cases</label>
          {samples.map((sample, index) => (
            <div key={index} className="mb-4 border border-gray-300 p-3 rounded-md">
              <label className="block font-medium mb-1">Input {index + 1}</label>
              <textarea
                className="w-full p-2 border rounded mb-2"
                value={sample.input}
                onChange={(e) => handleSampleChange(index, 'input', e.target.value)}
                rows={3}
                required
              />
              <label className="block font-medium mb-1">Output {index + 1}</label>
              <textarea
                className="w-full p-2 border rounded"
                value={sample.output}
                onChange={(e) => handleSampleChange(index, 'output', e.target.value)}
                rows={3}
                required
              />
              <button
                type="button"
                onClick={() => removeSample(index)}
                className="text-sm mt-2 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSample}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
          >
            + Add Sample
          </button>
        </div>

        <div>
          <label className="block font-medium mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            value={formData.tags.join(',')}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              tags: e.target.value.split(',').map(tag => tag.trim())
            }))}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Existing Hidden Test Cases</label>
          {existingHiddenTests.map(test => (
            <div key={test._id} className="flex items-center justify-between border p-2 rounded mb-2">
              <span>{test.inputFilePath.split('/').pop()} ➝ {test.outputFilePath.split('/').pop()}</span>
              <input
                type="checkbox"
                checked={retainTestIds.includes(test._id)}
                onChange={() => toggleRetainTest(test._id)}
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block font-medium mb-1">Hidden Input Files</label>
          <input type="file" multiple onChange={e => setInputFiles([...e.target.files])} />
        </div>

        <div>
          <label className="block font-medium mb-1">Hidden Output Files</label>
          <input type="file" multiple onChange={e => setOutputFiles([...e.target.files])} />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Update Problem
        </button>
      </form>
    </div>
  );
};

export default UpdateProblem;
