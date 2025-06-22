import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AdminContext } from '../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Myprofile = () => {
  const { adminData, setAdminData, backendUrl, token } = useContext(AdminContext);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    username: adminData?.username || '',
    email: adminData?.email || '',
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(adminData?.profileImage);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setForm({
      username: adminData?.username || '',
      email: adminData?.email || ''
    });
    if (adminData?.profileImage) {
      setPreview(adminData.profileImage);
    }
  }, [adminData]);

  const isUnchanged = form.username === adminData.username &&
                      form.email === adminData.email &&
                      !image;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUnchanged) return;
    setIsUploading(true);

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

      setAdminData((prev) => ({
        ...prev,
        username: res.data.updatedUser.username || prev.username,
        email: res.data.updatedUser.email || prev.email,
        profileImage: res.data.updatedUser.profileImage || prev.profileImage,
      }));

      setPreview(res.data.updatedUser.profileImage);
      setEditing(false);
      toast.success('Profile updated successfully!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!adminData) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#07034d] to-[#1e0750]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="h-12 w-12 border-4 border-t-transparent border-purple-500 rounded-full"
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-[#07034d] to-[#1e0750] px-4 py-10"
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-28 h-28 rounded-full bg-indigo-500/10 blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-center py-8 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500"
        >
          My Profile
        </motion.h1>

        {/* Profile Section */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl p-6 mb-10 overflow-hidden"
        >
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            {/* Profile Image Section */}
            <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col items-center gap-4">
              <div className="relative group">
                {preview && (
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    src={preview}
                    alt="Profile"
                    className="w-28 h-28 rounded-full border-4 border-indigo-500/80 object-cover shadow-lg group-hover:border-indigo-400 transition-all duration-300"
                  />
                )}
                <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>

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
                className="cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg inline-block text-center shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                Choose Image
              </label>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={isUnchanged || isUploading}
                className={`px-6 py-2 rounded-lg shadow-lg transition-all duration-300 ${
                  isUnchanged || isUploading
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white'
                }`}
              >
                {isUploading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  image ? 'Upload Image' : 'Save Changes'
                )}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Myprofile;
