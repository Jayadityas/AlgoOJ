import express from 'express'
import { createProblem, getAllProblems, getProblemById , updateProblem, deleteProblem } from '../controller/problemController.js'
import authAdmin from '../middleware/authAdmin.js'
import authUser from '../middleware/authUser.js'
import upload from '../config/multer.js'
import { uploadProblemFiles } from '../config/multer.js'

const problemRouter = express.Router()

problemRouter.post('/create',authUser,authAdmin,uploadProblemFiles,createProblem)
problemRouter.get('/all',getAllProblems)
problemRouter.get('/:id',authUser,getProblemById)
problemRouter.post('/update/:id',authUser,authAdmin,uploadProblemFiles,updateProblem)
problemRouter.post('/delete/:id',authUser,authAdmin,deleteProblem)

export default problemRouter