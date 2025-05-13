import Problem from "../model/problemModel.js"


const createProblem = async (req, res) => {

    try {
        const { title, description, inputFormat, outputFormat, constraints, samples, difficulty, tags } = req.body;

        // Validating the input
        if (!title || !description || !inputFormat || !outputFormat || !constraints || !samples || !difficulty || !hiddenTests) {
            return res.status(400).json({ success: false, message: 'Please fill all the fields!' });
        }

        // Check if the problem already exists
        const existingProblem = await Problem.findOne({ title });
        if (existingProblem) {
            return res.status(400).json({ success: false, message: 'Problem already exists!' });
        }

        // Create a new problem
        const newProblem = new Problem({
            title,
            description,
            inputFormat,
            outputFormat,
            constraints,
            samples,
            difficulty,
            tags,
            hiddenTests,
        });
        const savedProblem = await newProblem.save();
        res.status(201).json({ success: true, message: 'Problem created successfully!'});
    }
    catch (error) {
        console.error('Error creating problem:', error);
        res.status(500).json({ success: false, message: 'Problem creation failed!' });
    }
}

const getAllProblems = async (req, res) => {

    try {
        const problems = await Problem.find().select('title difficulty tags');       //sending only the just required data to the client not sending the complete data due to security reasons since the problem has hiddenTests and other sensitive data
        if(problems.length === 0) {
            return res.status(404).json({ success: false, message: 'No problems found!' });
        }
        else res.status(200).json({ success: true, problems });

    } 
    catch (error) {
        console.error('Error fetching problems:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch problems!' });
    }
}

const getProblemById = async (req, res) => {

    try {

        const {id} = req.params;
        const problem = await Problem.findById(id).select('-hiddenTests');           // Exclude hiddenTests from the response
        if (!problem) {
            return res.status(404).json({ success: false, message: 'Problem not found!' });
        }
        else res.status(200).json({ success: true, problem });

    } 
    catch (error) {
        console.error('Error fetching problem:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch problem!' });
        
    }
}




export {createProblem,getAllProblems,getProblemById}