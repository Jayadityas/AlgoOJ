import express from 'express'
import getLeaderboard from '../controller/leaderboardController.js'

const leaderRouter = express.Router();

leaderRouter.get('/', getLeaderboard);

export default leaderRouter;
