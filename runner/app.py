import json
import os
import subprocess
import tempfile
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/run', methods=['POST'])
def run_code():
    data = request.get_json()
    code = data.get('code', '')
    input_data = data.get('input', {})
    harness_template = data.get('harnessTemplate', '')

    script = harness_template.replace('{USER_CODE}', code)

    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False, dir='/tmp') as f:
            f.write(script)
            tmp_path = f.name

        result = subprocess.run(['python3', tmp_path],
                                 input=json.dumps(input_data), 
                                 capture_output=True, text=True, 
                                 timeout=5, cwd='/tmp',)

        if result.returncode != 0:
            return jsonify({'ok': False, 'error': result.stderr.strip()})
        
        return jsonify(json.loads(result.stdout))
    
    except subprocess.TimeoutExpired:
        return jsonify({'ok': False, 'error': 'Timeout (5s)'})
    except json.JSONDecodeError:
        return jsonify({'ok': False, 'error': 'Runner output was not valid JSON'})
    except Exception as e:
        return jsonify({'ok': False, 'error': str(e)})
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)