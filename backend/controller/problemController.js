import Problem from "../model/problemModel.js"
import fs from 'fs'
import AdmZip from 'adm-zip'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const createProblem = async (req, res) => {
  try {
    // console.log(req.files);
    const { role } = req.user;
    if (role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You are not authorized to create a problem!' });
    }

    const { title, description, inputFormat, outputFormat, constraints, samples, difficulty, tags } = req.body;

    if (!title || !description || !inputFormat || !outputFormat || !constraints || !samples || !difficulty) {
      return res.status(400).json({ success: false, message: 'Please fill all the fields!' });
    }

    const existingProblem = await Problem.findOne({ title });
    if (existingProblem) {
      return res.status(400).json({ success: false, message: 'Problem already exists!' });
    }

    let hiddenTests = [];

    // ✅ Handle zipFile with nested folder
    if (req.files?.zipFile) {
      const zipFile = req.files.zipFile[0];
      const zip = new AdmZip(zipFile.path);

      const extractFolder = `uploads/${Date.now()}_${title.replace(/\s+/g, '_')}`;
      const extractPath = path.join(process.cwd(), extractFolder);
      fs.mkdirSync(extractPath, { recursive: true });

      zip.extractAllTo(extractPath, true);

      // 🔍 Recursively get input*.txt and output*.txt from all subfolders
      const walkSync = (dir, fileList = []) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const filepath = path.join(dir, file);
          const stat = fs.statSync(filepath);
          if (stat.isDirectory()) {
            walkSync(filepath, fileList);
          } else {
            fileList.push(filepath);
          }
        }
        return fileList;
      };

      const allExtractedFiles = walkSync(extractPath);
      const inputFiles = allExtractedFiles.filter(f => path.basename(f).startsWith('input') && f.endsWith('.txt')).sort();
      const outputFiles = allExtractedFiles.filter(f => path.basename(f).startsWith('output') && f.endsWith('.txt')).sort();

      if (inputFiles.length !== outputFiles.length) {
        return res.status(400).json({ success: false, message: 'Number of input and output files in ZIP must match.' });
      }

      hiddenTests = inputFiles.map((inputPath, idx) => ({
        inputFilePath: path.relative(process.cwd(), inputPath).replace(/\\/g, '/'), // ✅ save relative paths
        outputFilePath: path.relative(process.cwd(), outputFiles[idx]).replace(/\\/g, '/'),
      }));
    }

    // Fallback to input/output files (if no zip)
    else if (req.files?.inputFiles && req.files?.outputFiles) {
      const { inputFiles, outputFiles } = req.files;

      if (inputFiles.length !== outputFiles.length) {
        return res.status(400).json({ success: false, message: "Input and output files must be provided in matching pairs." });
      }

      hiddenTests = inputFiles.map((inputFile, index) => ({
        inputFilePath: inputFile.path.replace(/\\/g, '/'),
        outputFilePath: outputFiles[index]?.path.replace(/\\/g, '/'),
      }));
    }

    if (!hiddenTests.length) {
      return res.status(400).json({ success: false, message: 'No test cases found in upload.' });
    }

    const newProblem = new Problem({
      title,
      description,
      inputFormat,
      outputFormat,
      constraints,
      samples: JSON.parse(samples),
      difficulty,
      tags: tags ? JSON.parse(tags) : [],
      hiddenTests,
    });

    await newProblem.save();
    return res.status(201).json({ success: true, message: 'Problem created successfully!' });

  } catch (error) {
    console.error('Error creating problem:', error);
    res.status(500).json({ success: false, message: 'Problem creation failed!' });
  }
};


const getAllProblems = async (req, res) => {

    try {
        const problems = await Problem.find().select('-hiddenTests');       //sending only the just required data to the client not sending the complete data due to security reasons since the problem has hiddenTests and other sensitive data
     if (problems.length === 0) {
  return res.status(200).json({ success: true, problems: [] });
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

    // Parse JSON fields
    try {
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

    // Handle file uploads (both individual files and ZIP)
    const inputFiles = req.files?.inputFiles || [];
    const outputFiles = req.files?.outputFiles || [];
    const zipFile = req.files?.zipFile?.[0];

    const newHiddenTests = [];

    if (zipFile) {
      const zip = new AdmZip(zipFile.path);
      const zipEntries = zip.getEntries();
      const testPairs = {};
      const uploadDir = path.resolve('uploads/');

      // Make sure upload dir exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      zipEntries.forEach(entry => {
        if (entry.isDirectory) return;
        const name = entry.entryName.toLowerCase().split('/').pop();
        const match = name.match(/(input|output)(\d+)\.txt$/i);

        if (match) {
          const [_, type, num] = match;
          if (!testPairs[num]) testPairs[num] = {};

          // Generate unique filename to avoid conflicts
          const uniqueFilename = `${Date.now()}-${name}`;
          const filePath = path.join(uploadDir, uniqueFilename);
          fs.writeFileSync(filePath, entry.getData());
          testPairs[num][type + 'FilePath'] = filePath.replace(/\\/g, '/'); // normalize for MongoDB
        }
      });

      // Now create hiddenTests array with paths, only if both input/output exist
      Object.values(testPairs).forEach(pair => {
        if (pair.inputFilePath && pair.outputFilePath) {
          newHiddenTests.push({
            inputFilePath: pair.inputFilePath,
            outputFilePath: pair.outputFilePath,
          });
        }
      });

      // Remove the uploaded ZIP file after extraction
      fs.unlinkSync(zipFile.path);
    } else {
      if (inputFiles.length !== outputFiles.length) {
        return res.status(400).json({ success: false, message: 'Input/Output file count mismatch' });
      }

      for (let i = 0; i < inputFiles.length; i++) {
        newHiddenTests.push({
          inputFilePath: inputFiles[i].path.replace(/\\/g, '/'),
          outputFilePath: outputFiles[i].path.replace(/\\/g, '/')
        });
      }
    }

    updateData.hiddenTests = [...retainedTestCases, ...newHiddenTests];

    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

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