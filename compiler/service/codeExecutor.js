import { exec, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const tempDir = path.join('./temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

const TIMEOUT_MS = 20000; // 20 seconds

export const executeCode = (code, language, input = '') => {
  return new Promise((resolve, reject) => {
    const isWindows = process.platform === 'win32';
    const fileExt =
      language === 'cpp' ? 'cpp' :
      language === 'python' ? 'py' :
      language === 'javascript' ? 'js' : '';

    if (!fileExt) return reject(new Error('Unsupported language'));

    const filename = `${uuidv4()}.${fileExt}`;
    const filepath = path.join(tempDir, filename);
    fs.writeFileSync(filepath, code);

    const cleanup = (...files) => {
      for (const file of files) {
        if (fs.existsSync(file)) fs.unlinkSync(file);
      }
    };

    const runWithTimeout = (command, args, onFinish) => {
      const fullCommand = isWindows
        ? [command, ...args]
        : ['/usr/bin/time', ['-v', command, ...args]];

      const runProcess = isWindows
        ? spawn(fullCommand[0], fullCommand.slice(1), { shell: true })
        : spawn(fullCommand[0], fullCommand[1], { shell: true });

      let stdout = '';
      let stderr = '';
      let finished = false;

      const timeout = setTimeout(() => {
        if (!finished) {
          finished = true;
          runProcess.kill('SIGKILL');
          return onFinish({ success: false, error: 'Runtime Error: Time Limit Exceeded' });
        }
      }, TIMEOUT_MS);

      runProcess.stdin.write(input);
      runProcess.stdin.end();

      runProcess.stdout.on('data', (data) => (stdout += data.toString()));
      runProcess.stderr.on('data', (data) => (stderr += data.toString()));

      const handleClose = (code) => {
        if (!finished) {
          finished = true;
          clearTimeout(timeout);

          let memoryUsed = null;
          if (!isWindows) {
            const memoryMatch = stderr.match(/Maximum resident set size.*:\s*(\d+)/);
            memoryUsed = memoryMatch ? (parseInt(memoryMatch[1]) / 1024).toFixed(2) : null; // convert KB to MB
          }

          if (code !== 0) {
            return onFinish({ success: false, error: stderr.trim(), memoryUsed });
          }

          return onFinish({ success: true, output: stdout.trim(), memoryUsed });
        }
      };

      runProcess.on('close', handleClose);
      runProcess.on('exit', handleClose);
    };

    if (language === 'cpp') {
      const exeFile = path.join(tempDir, `${uuidv4()}${isWindows ? '.exe' : '.out'}`);
      const compileProcess = exec(`g++ "${filepath}" -o "${exeFile}"`, { timeout: TIMEOUT_MS }, (err, _, stderr) => {
        if (err) {
          cleanup(filepath);
          return resolve({ success: false, error: stderr || err.message });
        }

        runWithTimeout(exeFile, [], (result) => {
          cleanup(filepath, exeFile);
          resolve(result);
        });
      });

      compileProcess.on('error', (err) => {
        cleanup(filepath);
        return resolve({ success: false, error: err.message });
      });
    }

    else if (language === 'python') {
      runWithTimeout('python', [filepath], (result) => {
        cleanup(filepath);
        resolve(result);
      });
    }

    else if (language === 'javascript') {
      runWithTimeout('node', [filepath], (result) => {
        cleanup(filepath);
        resolve(result);
      });
    }

    else {
      cleanup(filepath);
      return reject(new Error('Unsupported language'));
    }
  });
};
