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

  const handleInputFiles = (e) => {
    const files = [...e.target.files];
    // console.log('Selected input files:', files.map(f => f.name));
    setInputFiles(files);
  };

  const handleOutputFiles = (e) => {
    const files = [...e.target.files];
    // console.log('Selected output files:', files.map(f => f.name));
    setOutputFiles(files);
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

    inputFiles.forEach(file => {
      formData.append('inputFiles', file);
    });

    outputFiles.forEach(file => {
      formData.append('outputFiles', file);
    });

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
      } else {
        toast.error(error.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pt-30 pb-30">
      <h1 className="text-3xl font-bold text-center mb-6">Create Problem</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border rounded" />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required className="w-full p-2 border rounded" />
        <div>
          <label className="block font-semibold mb-1">Input Format</label>
          <textarea
            rows={4}
            value={inputFormat}
            onChange={(e) => setInputFormat(e.target.value)}
            required
            placeholder="Enter the input format"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Output Format</label>
          <textarea
            rows={4}
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            required
            placeholder="Enter the output format"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Constraints</label>
          <textarea
            rows={4}
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            required
            placeholder="Enter problem constraints"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Difficulty</label>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)} required className="w-full p-2 border rounded">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <input type="text" placeholder="Comma-separated tags" value={tags.join(',')} onChange={e => setTags(e.target.value.split(','))} className="w-full p-2 border rounded" />

        <div className="grid gap-4">
          <h2 className="text-lg font-semibold">Sample Test Cases</h2>
          {samples.map((sample, index) => (
            <div key={index} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Sample Input {index + 1}</label>
                <textarea
                  className="w-full border p-2 rounded"
                  rows={3}
                  value={sample.input}
                  onChange={(e) => {
                    const newSamples = [...samples];
                    newSamples[index].input = e.target.value;
                    setSamples(newSamples);
                  }}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Sample Output {index + 1}</label>
                <textarea
                  className="w-full border p-2 rounded"
                  rows={3}
                  value={sample.output}
                  onChange={(e) => {
                    const newSamples = [...samples];
                    newSamples[index].output = e.target.value;
                    setSamples(newSamples);
                  }}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setSamples([...samples, { input: '', output: '' }])}
            className="mt-2 px-4 py-2 w-40 bg-blue-600 text-white rounded"
          >
            + Add Sample
          </button>
        </div>


        <div>
          <label className="block font-semibold mb-1">Hidden Input Files</label>
          <input type="file" multiple onChange={handleInputFiles}/>

        </div>

        <div>
          <label className="block font-semibold mb-1">Hidden Output Files</label>
          <input type="file" multiple onChange={handleOutputFiles}/>
        </div>

        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Create Problem</button>
      </form>
    </div>
  );
};

export default CreateProblem;





