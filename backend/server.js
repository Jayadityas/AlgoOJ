import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/mongodb.js'
import cors from 'cors'
import userRouter from './route/userRoute.js'
import problemRouter from './route/problemRoute.js'
import leaderRouter from './route/leaderboardRoute.js'
import contactRouter from './route/contact.js'

dotenv.config()
connectDB()

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())


//api endpoints
app.use('/api/user', userRouter)
app.use('/api/problem', problemRouter)
app.use('/api/leaderboard',leaderRouter)
app.use('/api/contact',contactRouter)

app.get('/', (req,res) => {
    res.send(`This is OJ Project`);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
