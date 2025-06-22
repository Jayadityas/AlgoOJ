import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import userRouter from './route/userRoute.js'
import problemRouter from './route/problemRoute.js'
import leaderRouter from './route/leaderboardRoute.js'
import contactRouter from './route/contactRoute.js'
import submissionRouter from './route/submissionRoute.js'
import ReviewRouter from './route/aiRoute.js';

dotenv.config()
import connectDB from './config/mongodb.js';
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())


//api endpoints
app.use('/api/user', userRouter)
app.use('/api/problem', problemRouter)
app.use('/api/leaderboard',leaderRouter)
app.use('/api',contactRouter)
app.use('/api',submissionRouter)
app.use('/api/ai', ReviewRouter);


app.get('/', (req,res) => {
    res.send(`This is OJ Project`);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
