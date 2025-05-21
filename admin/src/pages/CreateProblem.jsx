import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

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

  const addSample = () => {
    setSamples([...samples, { input: '', output: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !description ||
      !inputFormat ||
      !outputFormat ||
      !constraints ||
      !difficulty ||
      samples.length === 0 ||
      inputFiles.length === 0 ||
      outputFiles.length === 0 ||
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

    for (let file of inputFiles) {
      formData.append('inputFiles', file);
    }
    for (let file of outputFiles) {
      formData.append('outputFiles', file);
    }

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Problem creation failed.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pt-30 pb-30">
      <h1 className="text-3xl font-bold text-center mb-6">Create Problem</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border rounded" />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required className="w-full p-2 border rounded" />
        <input type="text" placeholder="Input Format" value={inputFormat} onChange={e => setInputFormat(e.target.value)} required className="w-full p-2 border rounded" />
        <input type="text" placeholder="Output Format" value={outputFormat} onChange={e => setOutputFormat(e.target.value)} required className="w-full p-2 border rounded" />
        <input type="text" placeholder="Constraints" value={constraints} onChange={e => setConstraints(e.target.value)} required className="w-full p-2 border rounded" />

        <div>
          <label className="block font-semibold mb-1">Difficulty</label>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)} required className="w-full p-2 border rounded">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <input type="text" placeholder="Comma-separated tags" value={tags.join(',')} onChange={e => setTags(e.target.value.split(','))} className="w-full p-2 border rounded" />

        <div>
          <label className="block font-semibold mb-1">Sample Inputs/Outputs</label>
          {samples.map((sample, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input type="text" placeholder="Sample Input" value={sample.input} onChange={e => handleSampleChange(index, 'input', e.target.value)} required className="w-1/2 p-2 border rounded" />
              <input type="text" placeholder="Sample Output" value={sample.output} onChange={e => handleSampleChange(index, 'output', e.target.value)} required className="w-1/2 p-2 border rounded" />
            </div>
          ))}
          <button type="button" onClick={addSample} className="text-blue-600 hover:underline">+ Add Sample</button>
        </div>

        <div>
          <label className="block font-semibold mb-1">Hidden Input Files</label>
          <input type="file" multiple onChange={e => setInputFiles([...e.target.files])} required className="w-full" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Hidden Output Files</label>
          <input type="file" multiple onChange={e => setOutputFiles([...e.target.files])} required className="w-full" />
        </div>

        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Create Problem</button>
      </form>
    </div>
  );
};

export default CreateProblem;





