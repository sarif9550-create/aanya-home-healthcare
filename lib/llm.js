import { spawn } from 'child_process';
import path from 'path';

export function callLLM({ session_id = 'default', system_message = 'You are a helpful AI assistant.', message, provider = 'openai', model = 'gpt-4o-mini' } = {}) {
  return new Promise((resolve, reject) => {
    const py = spawn('/root/.venv/bin/python3', [path.join(process.cwd(), 'lib', 'llm_worker.py')], {
      env: { ...process.env },
    });
    let out = '';
    let err = '';
    py.stdout.on('data', (d) => (out += d.toString()));
    py.stderr.on('data', (d) => (err += d.toString()));
    py.on('error', (e) => reject(e));
    py.on('close', () => {
      try {
        const trimmed = out.trim();
        const parsed = JSON.parse(trimmed);
        if (parsed.error) return reject(new Error(parsed.error + (parsed.trace ? '\n' + parsed.trace : '')));
        resolve(parsed.response);
      } catch (e) {
        reject(new Error(`LLM parse failed: ${e.message}\nSTDOUT=${out}\nSTDERR=${err}`));
      }
    });
    py.stdin.write(JSON.stringify({ session_id, system_message, message, provider, model }));
    py.stdin.end();
  });
}
