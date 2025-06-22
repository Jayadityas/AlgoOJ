import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import contactController from '../controller/contactController.js';

const contactRouter = express.Router();

contactRouter.post('/contact', contactController);

dotenv.config();
export default contactRouter;
