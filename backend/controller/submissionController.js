import Submission from '../model/submissionModel.js';
import Problem from '../model/problemModel.js';
import User from '../model/userModel.js';
import { executeCode } from '../service/codeExecutor.js';
import fs from 'fs/promises';

const submitCode = async (req, res) => {
  const { problemId, code, language } = req.body;
  const userId = req.user._id;

  const problem = await Problem.findById(problemId);
  if (!problem) return res.status(404).json({ message: 'Problem not found' });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  try {
    let verdict = 'Accepted';
    let output = '';
    let allPassed = true;
    let totalExecutionTime = 0; // <- Track total execution time

    for (const testCase of problem.hiddenTests) {
      try {
        const inputData = await fs.readFile(testCase.inputFilePath, 'utf-8');
        const expectedOutput = await fs.readFile(testCase.outputFilePath, 'utf-8');

        const start = Date.now(); // Start time
        const result = await executeCode(code, language, inputData);
        const end = Date.now(); // End time

        const execTime = end - start; // Time in ms
        totalExecutionTime += execTime;

        if (!result.success) {
          verdict = 'Compilation Error';
          output = result.error;
          allPassed = false;
          break;
        }

        if ((result.output || '').trim() !== (expectedOutput || '').trim()) {
          verdict = 'Wrong Answer';
          output = result.output;
          allPassed = false;
          break;
        }
      } catch (err) {
        console.error('Error reading test case files:', err);
        verdict = 'Error';
        output = 'Failed to read test files';
        allPassed = false;
        break;
      }
    }

    // Update user stats
    if (allPassed) {
      verdict = 'Accepted';
      output = 'All test cases passed!';
      if (!user.solvedProblems.includes(problemId)) {
        user.solvedProblems.push(problemId);
        user.submissionsCount += 1;
      }
    }

    await user.save();

    const submission = await Submission.create({
      user: userId,
      problem: problemId,
      code,
      language,
      verdict,
      output,
      executionTime: totalExecutionTime,
    });

    res.json({
      message: 'Code submitted successfully',
      verdict,
      output,
      executionTime: totalExecutionTime,
      submissionId: submission._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing submission' });
  }
};


const runCode = async (req, res) => {
  const { code, language, problemId } = req.body;

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    const sampleInput = problem.samples[0]?.input || '';
    const expectedOutput = problem.samples[0]?.output || '';

    const start = Date.now();
    const result = await executeCode(code, language, sampleInput);
    const end = Date.now();

    const executionTime = end - start; // in milliseconds

    let verdict = 'Correct Answer';
    if (!result.success) verdict = 'Compilation Error';
    else if (expectedOutput && result.output.trim() !== expectedOutput.trim()) verdict = 'Wrong Answer';

    return res.json({
      message: 'Code executed',
      verdict,
      output: result.output || result.error,
      expected: expectedOutput,
      executionTime, // include runtime in ms
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Code execution failed' });
  }
};


export { submitCode, runCode };
