import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const Myprofile = () => {

  const { userData , setUserData, backendUrl, token } = useContext(AppContext);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    username: userData?.username || '',
    email: userData?.email || '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${backendUrl}/api/user/update-profile`, form , {headers:{token}});
      setUserData(res.data.updatedUser);
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!userData) return <div className="text-center mt-10 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-30">
      <h1 className="text-2xl font-bold mb-6 text-center">My Profile</h1>

      {!editing ? (
        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-lg font-semibold">Name: {userData.username}</p>
              <p className="text-md text-gray-600">Email: {userData.email}</p>
              <p className="text-sm text-gray-700 mt-2">Submissions: {userData.submissionsCount}</p>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer px-4 py-1 rounded-lg"
            >
              Edit
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md">
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-green-500 text-white px-4 py-1 rounded">
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="bg-gray-400 text-white px-4 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* My Submissions Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">My Submissions</h2>
        <div className="bg-white rounded-xl shadow-md p-4 space-y-3">
          {userData.solvedProblems && userData.solvedProblems.length > 0 ? (
            userData.solvedProblems.map((prob, idx) => (
              <div key={idx} className="border-b pb-2 text-sm text-gray-700">
                ✅ Solved: Problem #{prob.title}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No submissions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Myprofile
