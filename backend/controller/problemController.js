import Problem from "../model/problemModel.js"
import fs from 'fs'
import path from "path"

const createProblem = async (req, res) => {

    try {

        const {role} = req.user
        // console.log(role)
        if(role === 'admin') {
            // console.log('Admin creating problem')
            const { title, description, inputFormat, outputFormat, constraints, samples, difficulty, tags } = req.body;
            
            // Validating the input
            if (!title || !description || !inputFormat || !outputFormat || !constraints || !samples || !difficulty) {
                return res.status(400).json({ success: false, message: 'Please fill all the fields!' });
            }

            // Check if the problem already exists
            const existingProblem = await Problem.findOne({ title });
            if (existingProblem) {
                return res.status(400).json({ success: false, message: 'Problem already exists!' });
            }

            const { inputFiles, outputFiles } = req.files;

            console.log('Input Files:', inputFiles);
            console.log('Output Files:', outputFiles);

            if (!inputFiles || !outputFiles || inputFiles.length !== outputFiles.length) {
            return res.status(400).json({ error: "Input and output files must be provided in matching pairs." });
            }

            const hiddenTests = inputFiles.map((inputFile, index) => ({
                inputFilePath: inputFile.path,
                outputFilePath: outputFiles[index]?.path,
            }));

            // Create a new problem
            const newProblem = new Problem({
                title,
                description,
                inputFormat,
                outputFormat,
                constraints,
                samples:JSON.parse(samples),
                difficulty,
                tags:tags ? JSON.parse(tags) : [],
                hiddenTests,
            });

            const savedProblem = await newProblem.save();
            res.status(201).json({ success: true, message: 'Problem created successfully!'})

        }
        else {
            return res.status(403).json({ success: false, message: 'You are not authorized to create a problem!' })
        }
    }
    catch (error) {
        console.error('Error creating problem:', error)
        res.status(500).json({ success: false, message: 'Problem creation failed!' })
    }
}

const getAllProblems = async (req, res) => {

    try {
        const problems = await Problem.find().select('-hiddenTests');       //sending only the just required data to the client not sending the complete data due to security reasons since the problem has hiddenTests and other sensitive data
        if(problems.length === 0) {
            return res.status(404).json({ success: false, message: 'No problems found!' })
        }
        else res.status(200).json({ success: true, problems })

    } 
    catch (error) {
        console.error('Error fetching problems:', error)
        res.status(500).json({ success: false, message: 'Failed to fetch problems!' })
    }
}

const getProblemById = async (req, res) => {

    try {

        //sending the problem data according to the user role
        const {id} = req.params
        const {role} = req.user 
        const problem = (role==='admin') 
        ? await Problem.findById(id) 
        : await Problem.findById(id).select('-hiddenTests')

        if(problem){
            res.status(200).json({success:true,message:'problem sent successfully',problem})
        }
        else res.status(400).json({success:false,message:'No problem exists!'})
        
    } 
    catch (error) {
        console.error('Error fetching problem:', error)
        res.status(500).json({ success: false, message: 'Failed to fetch problem!' })
        
    }

}

const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;

    if (role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const updateData = {};

    try {
      console.log(req.body.samples)
      updateData.samples = JSON.parse(req.body.samples || '[]');
      updateData.tags = JSON.parse(req.body.tags || '[]');
    } catch (err) {
      return res.status(400).json({ success: false, message: 'Invalid JSON in samples or tags' });
    }

    // Plain text fields
    ['title', 'description', 'inputFormat', 'outputFormat', 'constraints', 'difficulty'].forEach(key => {
      if (req.body[key]) updateData[key] = req.body[key];
    });

    // Parse retained hidden test cases
    let retainedTests = [];
    try {
      retainedTests = JSON.parse(req.body.retainTestIds || '[]');
    } catch (err) {
      retainedTests = [];
    }

    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    const existingTests = problem.hiddenTests || [];
    const retainedTestCases = existingTests.filter(test => retainedTests.includes(String(test._id)));

    const inputFiles = req.files?.inputFiles || [];
    const outputFiles = req.files?.outputFiles || [];

    if (inputFiles.length !== outputFiles.length) {
      return res.status(400).json({ success: false, message: 'Input/Output file count mismatch' });
    }

    const newHiddenTests = [];
    for (let i = 0; i < inputFiles.length; i++) {
      newHiddenTests.push({
        inputFilePath: inputFiles[i].path,
        outputFilePath: outputFiles[i].path
      });
    }

    updateData.hiddenTests = [...retainedTestCases, ...newHiddenTests];

    const updatedProblem = await Problem.findByIdAndUpdate(id,{ $set: updateData },{ new: true });


    return res.status(200).json({
      success: true,
      message: 'Problem updated successfully!',
      updatedProblem
    });

  } catch (error) {
    console.error('Error updating problem:', error);
    res.status(500).json({ success: false, message: 'Problem update failed!' });
  }
};


const deleteProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.user;

        if (role !== 'admin') {
            return res.status(403).json({ success: false, message: 'You are not authorized to delete a problem!' });
        }

        const problem = await Problem.findById(id);

        if (!problem) {
            return res.status(400).json({ success: false, message: 'No problem exists!' });
        }

        // Delete associated hidden test files
        if (problem.hiddenTests && problem.hiddenTests.length > 0) {
            for (const test of problem.hiddenTests) {
                try {
                    if (fs.existsSync(test.inputFilePath)) {
                        fs.unlinkSync(test.inputFilePath);
                    }
                    if (fs.existsSync(test.outputFilePath)) {
                        fs.unlinkSync(test.outputFilePath);
                    }
                } catch (fileError) {
                    console.error(`Error deleting files:`, fileError.message);
                    // Don't abort deletion, just log it
                }
            }
        }

        // Delete the problem from DB
        await Problem.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: 'Problem deleted successfully!' });

    } catch (error) {
        console.error('Error deleting problem:', error);
        res.status(500).json({ success: false, message: 'Problem deletion failed!' });
    }
};






export {createProblem,getAllProblems,getProblemById,updateProblem,deleteProblem}