import User from '../model/userModel.js'

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({}).select('username solvedCount') // include only needed fields
      .sort({ solvedCount: -1 })                                       // sort descending by solvedCount
      .limit(50)

    // Assign ranks manually
    const rankedUsers = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      solvedCount: user.solvedCount
    }));

    res.status(200).json({ success: true, data: rankedUsers });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch leaderboard' });
  }
};

export default getLeaderboard
