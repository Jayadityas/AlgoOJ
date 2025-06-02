import express from 'express'
import { createProblem, getAllProblems, getProblemById , updateProblem, deleteProblem } from '../controller/problemController.js'
import authAdmin from '../middleware/authAdmin.js'
import authUser from '../middleware/authUser.js'
import upload from '../config/multer.js'

const problemRouter = express.Router()

problemRouter.post('/create',authUser,authAdmin,upload.fields([
    { name: 'inputFiles', maxCount: 10 },
    { name: 'outputFiles', maxCount: 10 },
    { name: 'zipFile', maxCount: 1 }, 
  ]),createProblem)
problemRouter.get('/all',getAllProblems)
problemRouter.get('/:id',authUser,getProblemById)
problemRouter.post('/update/:id',authUser,authAdmin,upload.fields([
    { name: 'inputFiles', maxCount: 10 },
    { name: 'outputFiles', maxCount: 10 },
    { name: 'zipFile', maxCount: 1 },
  ]),updateProblem)
problemRouter.post('/delete/:id',authUser,authAdmin,deleteProblem)

export default problemRouter