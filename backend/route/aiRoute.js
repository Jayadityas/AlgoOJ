import express from 'express';
import reviewCode  from '../controller/aiController.js';

const ReviewRouter = express.Router();

ReviewRouter.post('/review', reviewCode);

export default ReviewRouter;
