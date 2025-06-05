import express from 'express'
import { getUserProfile, loginUser, registerUser, updateUserProfile, forgotPassword, resetPassword, addBookmark } from '../controller/userController.js'
import authUser from '../middleware/authUser.js'
import uploadProfile from '../middleware/uploadProfile.js'


const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/my-profile',authUser,getUserProfile)
userRouter.put('/update-profile',authUser,uploadProfile.single('image'),updateUserProfile)
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);
userRouter.post('/bookmark',authUser,addBookmark);

export default userRouter