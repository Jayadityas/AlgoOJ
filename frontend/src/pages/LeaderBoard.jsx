import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaTrophy, FaMedal, FaStar, FaUser, FaCrown, FaFire, FaGithub, FaLinkedin, FaTwitter
} from 'react-icons/fa';
import { HiSparkles, HiLightningBolt } from 'react-icons/hi';

const LeaderBoard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/leaderboard`);
        if (res.data && Array.isArray(res.data.data)) {
          const sortedUsers = res.data.data.sort((a, b) => b.submissionsCount - a.submissionsCount);
          setUsers(sortedUsers);
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (index) => {
    if (index === 0) return <FaTrophy className="text-yellow-400" />;
    if (index === 1) return <FaMedal className="text-gray-300" />;
    if (index === 2) return <FaStar className="text-orange-300" />;
    return <span className="text-white">#{index + 1}</span>;
  };

  const getProfileImageUrl = (user, size = 64) => {
    if (user.profileImage && user.profileImage.startsWith('http') && user.profileImage.includes('cloudinary.com')) {
      const parts = user.profileImage.split('/upload/');
    }
    return user.profileImage || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e61c9c] to-[#bdec30] flex items-center justify-center">
        <div className="text-center">
          {/* Golden Spinning Circle */}
          <div className="w-16 h-16 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
          
          {/* Loading Text */}
          <h2 className="text-xl font-semibold text-[#88274f] mb-2">Loading Leaderboard</h2>
          <p className="text-[#88274f] text-sm">Please wait while we fetch the leaderboard...</p>
          
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
    <div className="min-h-screen bg-gradient-to-br from-[#3017e6] via-[#c8e879] to-[#f01ba9] text-white py-25 px-4">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-4">
          <FaCrown className="text-yellow-400 text-3xl animate-bounce" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#44ee06] via-[#f40e8e] to-[#f4260e] bg-clip-text text-transparent drop-shadow">Leaderboard</h1>
          <HiSparkles className="text-yellow-400 text-3xl animate-pulse" />
        </div>
        <p className="text-white mt-2">Celebrating our coding champions</p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.slice(0, 3).map((user, index) => (
          <div key={user._id} className={`rounded-xl border border-gray-600 p-6 shadow-xl bg-gradient-to-br ${
            index === 0 ? 'from-yellow-100/10 to-yellow-400/10' :
            index === 1 ? 'from-gray-100/10 to-gray-400/10' :
            'from-amber-100/10 to-amber-400/10'} flex flex-col items-center hover:scale-105 transition`}>
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full overflow-visible transform hover:scale-110 transition duration-300">
                {getProfileImageUrl(user) ? (
                  <img
                    src={getProfileImageUrl(user, 100)}
                    alt={user.username}
                    className="w-28 h-28 object-cover rounded-full translate-y-4 shadow-2xl"
                    style={{ transform: 'translateY(-20%)' }}
                  />
                ) : (
                  <div className="w-28 h-28 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full translate-y-4 shadow-2xl" style={{ transform: 'translateY(-20%)' }}>
                    <FaUser className="text-white text-2xl" />
                  </div>
                )}
              </div>
              <div className="absolute -top-2 -right-2">
                {getRankIcon(index)}
              </div>
            </div>
            <h3 className="text-lg font-semibold mt-2">{user.username}</h3>
            <p className="text-sm text-gray-400">Submissions: {user.submissionsCount}</p>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-2xl font-bold text-center mb-6">Other Top Performers</h2>
        <ul className="space-y-4">
          {users.slice(3).map((user, index) => (
            <li key={user._id} className="flex items-center justify-between bg-white/5 px-4 py-3 rounded-lg hover:bg-white/10 transition">
              <div className="flex items-center gap-4">
                <span className="font-bold text-yellow-300">#{index + 4}</span>
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  {getProfileImageUrl(user, 40) ? (
                    <img src={getProfileImageUrl(user, 40)} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                      <FaUser className="text-white text-sm" />
                    </div>
                  )}
                </div>
                <span className="text-white">{user.username}</span>
              </div>
              <span className="text-gray-300 text-sm">{user.submissionsCount} submissions</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LeaderBoard;
