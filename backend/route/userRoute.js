import express from 'express'
import { getUserProfile, loginUser, registerUser } from '../controller/userController.js'
import authUser from '../middleware/authUser.js'


const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/my-profile',authUser,getUserProfile)


export default userRouter