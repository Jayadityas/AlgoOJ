import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Myprofile = () => {
  const { userData, setUserData, backendUrl, token } = useContext(AppContext);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    username: userData?.username || '',
    email: userData?.email || '',
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(userData?.profileImage);

  useEffect(() => {
    if (userData?.profileImage) {
      setPreview(userData.profileImage);
    }
  }, [userData])



  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('username', form.username);
  formData.append('email', form.email);
  if (image) {
    formData.append('image', image);
  }

  try {
    const res = await axios.put(`${backendUrl}/api/user/update-profile`, formData, {
      headers: {
        token,
        'Content-Type': 'multipart/form-data',
      },
    });

    setUserData((prev) => ({
      ...prev,
      username: res.data.updatedUser.username || prev.username,
      email: res.data.updatedUser.email || prev.email,
      profileImage: res.data.updatedUser.profileImage || prev.profileImage,
    }));

    setPreview(res.data.updatedUser.profileImage);
    setEditing(false);
    toast.success('Profile updated');
  } catch (err) {
    console.error(err);
    toast.error('Failed to update profile');
  }
};


  if (!userData) return <div className="text-center mt-10 text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#07034d] px-4 py-10">
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-extrabold text-center py-5 text-amber-400">My Profile</h1>

      {/* Profile Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 transition hover:shadow-2xl duration-300">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex flex-col items-center gap-3">
            {preview && (
              <img
                src={preview}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-indigo-500 object-cover shadow-md"
              />
            )}

            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setImage(file);
                if (file) {
                  setPreview(URL.createObjectURL(file));
                }
              }}
              className="hidden"
            />

            <label
              htmlFor="profile-upload"
              className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg inline-block text-center shadow"
            >
              Choose Image
            </label>

            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg shadow"
            >
              Upload Image
            </button>
          </div>



          {!editing ? (
            <div>
              <p className="text-xl font-semibold text-gray-800">
                👤 Name: <span className="font-normal">{userData.username}</span>
              </p>
              <p className="text-lg text-gray-600 mt-1">📧 Email: {userData.email}</p>
              <p className="text-md text-gray-500 mt-2">📈 Submissions: {userData.submissionsCount}</p>
              <button
                onClick={() => setEditing(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm transition duration-200 shadow-md"
              >
                ✏️ Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 w-full md:w-2/3">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow transition duration-200"
                >
                  💾 Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg shadow transition duration-200"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* My Submissions Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">📝 My Submissions</h2>
        <div className="bg-green-200 rounded-lg shadow-md p-2 space-y-4 transition hover:shadow-xl duration-300">
          {userData.solvedProblems && userData.solvedProblems.length > 0 ? (
            userData.solvedProblems.map((prob, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between border-b pb-2 text-sm text-gray-700 last:border-none"
              >
                <span className="text-black-600 text-lg font-medium">✅ {prob.title}</span>
                <span className="text-xs text-gray-400"># {idx + 1}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic text-sm">No submissions yet. Start solving problems to see them here!</p>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Myprofile;
