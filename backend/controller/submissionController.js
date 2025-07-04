import Submission from '../model/submissionModel.js';
import Problem from '../model/problemModel.js';
import User from '../model/userModel.js';
import fs from 'fs/promises';
import axios from 'axios';  

const COMPILER_SERVICE_URL = process.env.COMPILER_SERVICE_URL;

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
    let totalExecutionTime = 0;

    let failedTestCaseDetails = null; // Store info for frontend

    for (const testCase of problem.hiddenTests) {
      try {
        const inputData = await fs.readFile(testCase.inputFilePath, 'utf-8');
        const expectedOutput = await fs.readFile(testCase.outputFilePath, 'utf-8');

        const response = await axios.post(COMPILER_SERVICE_URL, {
          code,
          language,
          input: inputData
        });


        const result = response.data;
        
        totalExecutionTime += result.executionTime || 0;

        if (!result.success) {
          verdict = 'Compilation Error';
          output = result.error || 'Error during execution';
          allPassed = false;
          break;
        }

        if ((result.output || '').trim() !== (expectedOutput || '').trim()) {
          verdict = 'Wrong Answer';
          output = result.output;

          failedTestCaseDetails = {
            input: inputData.trim(),
            expectedOutput: expectedOutput.trim(),
            actualOutput: result.output.trim(),
          };

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
      ...(failedTestCaseDetails && { failedTestCase: failedTestCaseDetails })
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing submission' });
  }
};


const runCode = async (req, res) => {
  const { code, language, problemId, input } = req.body;

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Default to first sample
    const sampleInput = problem.samples[0]?.input || '';
    const expectedOutput = problem.samples[0]?.output || '';

    const isCustomInput = input !== undefined && input !== null;
    const actualInput = isCustomInput ? input : sampleInput;
    const actualExpectedOutput = isCustomInput ? undefined : expectedOutput;

    const response = await axios.post(COMPILER_SERVICE_URL, {
      code,
      language,
      input: actualInput,
    });

    const result = response.data;

    const actualOutput = result.output?.trim() || result.error?.trim();
    const expected = actualExpectedOutput?.trim();
    const inputUsed = actualInput.trim();

    let verdict = '';
    let passed = false;
console.log("Compiler raw response:", result);
    if (!result.success) {
      verdict = 'Compilation Error';
    } else if (!isCustomInput && expected && actualOutput !== expected) {
      verdict = 'Wrong Answer';
    } else if (!isCustomInput && expected && actualOutput === expected) {
      verdict = 'Correct Answer';
      passed = true;
    } else {
      verdict = 'Executed'; // For custom input
    }

    return res.status(200).json({
      verdict,
      output: result.output || result.error,
      executionTime: result.executionTime,
      memoryUsage: result.memoryUsage,
      failedTestCase: {
        input: inputUsed,
        expectedOutput: expected || '',
        actualOutput,
        passed
      },
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      verdict: 'Server Error',
      message: 'Code execution failed',
      failedTestCase: {
        input: input || '',
        expectedOutput: '',
        actualOutput: err.message,
        passed: false
      }
    });
  }
};




export { submitCode, runCode };