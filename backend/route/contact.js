import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import contact from '../controller/contactController.js';

dotenv.config();
const contactRouter = express.Router();

contactRouter.post('/', contact);

export default contactRouter;
