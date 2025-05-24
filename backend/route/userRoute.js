import express from 'express'
import { getUserProfile, loginUser, registerUser, updateUserProfile } from '../controller/userController.js'
import authUser from '../middleware/authUser.js'
import uploadProfile from '../middleware/uploadProfile.js'


const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/my-profile',authUser,getUserProfile)
userRouter.put('/update-profile',authUser,uploadProfile.single('image'),updateUserProfile)


export default userRouter