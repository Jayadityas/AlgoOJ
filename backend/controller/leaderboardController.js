import User from '../model/userModel.js'

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({})
    .select('username submissionsCount')
    .lean();

    console.log(users)

    const sortedUsers = users.sort((a, b) => {
      if (b.submissionsCount !== a.submissionsCount) {
        return b.submissionsCount - a.submissionsCount;
      }
      const nameA = a.username || '';
      const nameB = b.username || '';
      return nameA.localeCompare(nameB);
    });

    res.status(200).json({ success: true, data: sortedUsers });
  } 
  catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch leaderboard' });
  }
};

export default getLeaderboard
