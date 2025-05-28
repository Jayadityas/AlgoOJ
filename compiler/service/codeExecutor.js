import { exec, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const tempDir = path.join('./temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

export const executeCode = (code, language, input = '') => {
  return new Promise((resolve, reject) => {
    const isWindows = process.platform === 'win32';
    const fileExt = language === 'cpp' ? 'cpp' : 'py';
    const filename = `${uuidv4()}.${fileExt}`;
    const filepath = path.join(tempDir, filename);
    fs.writeFileSync(filepath, code);

    if (language === 'cpp') {
      const exeFile = path.join(tempDir, `${uuidv4()}${isWindows ? '.exe' : '.out'}`);

      const compileCmd = `g++ "${filepath}" -o "${exeFile}"`;
      exec(compileCmd, (compileErr, _, compileStderr) => {
        if (compileErr) {
          fs.unlinkSync(filepath);
          return resolve({ success: false, error: compileStderr || compileErr.message });
        }

        // Execute with stdin
        const runProcess = spawn(exeFile, [], { shell: true });

        let stdout = '';
        let stderr = '';

        runProcess.stdin.write(input);
        runProcess.stdin.end();

        runProcess.stdout.on('data', (data) => (stdout += data.toString()));
        runProcess.stderr.on('data', (data) => (stderr += data.toString()));

        runProcess.on('close', (code) => {
          fs.unlinkSync(filepath);
          if (fs.existsSync(exeFile)) fs.unlinkSync(exeFile);
          console.log(code);
          if (code !== 0) {
            return resolve({ success: false, error: stderr || 'Runtime Error' });
          }

          return resolve({ success: true, output: stdout.trim() });
        });
      });
    }

    else if (language === 'python') {
      const runProcess = spawn('python', [filepath], { shell: true });

      let stdout = '';
      let stderr = '';

      runProcess.stdin.write(input);
      runProcess.stdin.end();

      runProcess.stdout.on('data', (data) => (stdout += data.toString()));
      runProcess.stderr.on('data', (data) => (stderr += data.toString()));

      runProcess.on('close', (code) => {
        fs.unlinkSync(filepath);
        if (code !== 0) {
          return resolve({ success: false, error: stderr || 'Runtime Error' });
        }
        return resolve({ success: true, output: stdout.trim() });
      });
    }

    else {
      fs.unlinkSync(filepath);
      return reject(new Error('Unsupported language'));
    }
  });
};
