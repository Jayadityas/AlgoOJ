import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrophy, FaMedal, FaStar } from 'react-icons/fa';

const LeaderBoard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/leaderboard`);
        if (res.data && Array.isArray(res.data.data)) {
          const sortedUsers = res.data.data.sort((a, b) => {
            if (b.submissionsCount !== a.submissionsCount) {
              return b.submissionsCount - a.submissionsCount;
            }
            return (a.username || '').localeCompare(b.username || '');
          });
          setUsers(sortedUsers);
        } else {
          console.error("Invalid data format for users:", res.data);
          setUsers([]);
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setUsers([]);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (index) => {
    if (index === 0) return <FaTrophy className="text-yellow-500 text-2xl" />;
    if (index === 1) return <FaMedal className="text-gray-400 text-2xl" />;
    if (index === 2) return <FaStar className="text-orange-500 text-2xl" />;
    return <span className="font-bold text-lg text-gray-600">#{index + 1}</span>;
  };

  return (
    <div className="min-h-screen p-30 bg-[#07034d]">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-amber-400 mb-10 drop-shadow-lg">
          🏆 Leaderboard
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user, index) => (
            <div
              key={user._id}
              className="bg-white shadow-xl rounded-xl p-6 flex items-center justify-between hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-center gap-4">
                {getRankIcon(index)}
                <div>
                  <p className="text-lg font-semibold text-gray-800">{user.username}</p>
                  <p className="text-sm text-gray-500">Submissions: {user.submissionsCount}</p>
                </div>
              </div>
              <span className="text-sm font-medium text-blue-600">Rank #{index + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
