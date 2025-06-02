import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { executeCode } from './service/codeExecutor.js';  // your existing code executor logic

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

app.post('/', async (req, res) => {
  const { code, language, input } = req.body;

  if (!code || !language) {
    return res.status(400).json({ success: false, error: 'Code and language are required' });
  }

  try {
    const start = Date.now();
    const result = await executeCode(code, language, input || '');
    const end = Date.now();

    const executionTime = end - start;

    // The executeCode function should ideally return an object like:
    // { success: true/false, output: '...', error: '...' }

    if (result.success) {
      return res.json({
        success: true,
        output: result.output,
        executionTime,
      });
    } else {
        console.error('Execution error:', result.error);
      return res.json({
        success: false,
        error: result.error || 'Execution failed',
        executionTime,
      });
    }
  } catch (err) {
    console.error('Execution server error:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during code execution',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Compiler service running on port ${PORT}`);
});
