import express from 'express';
import { submitCode, runCode } from '../controller/submissionController.js';
import authUser from '../middleware/authUser.js';

const submissionRouter = express.Router();

submissionRouter.post('/submit', authUser, submitCode);
submissionRouter.post('/run', authUser, runCode);

export default submissionRouter;