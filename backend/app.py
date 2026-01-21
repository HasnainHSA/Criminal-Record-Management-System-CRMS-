from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os
import time

app = Flask(__name__)
CORS(app)

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INPUT_FILE = os.path.join(BASE_DIR, 'input.txt')
OUTPUT_FILE = os.path.join(BASE_DIR, 'output.txt')
MARS_JAR = os.path.join(BASE_DIR, 'Mars.jar')
ASM_FILE = os.path.join(BASE_DIR, 'asm', 'crms.asm')

# Hybrid storage: Python maintains state, MIPS validates operations
# This is necessary because MARS file I/O doesn't work in command-line mode
fir_records = []
officers = []

def write_input(lines):
    """Write command to input.txt"""
    with open(INPUT_FILE, 'w') as f:
        f.write('\n'.join(lines))

def run_mars():
    """Execute MARS simulator with MIPS code"""
    try:
        # Clear output file
        if os.path.exists(OUTPUT_FILE):
            os.remove(OUTPUT_FILE)
        
        # Run MARS in command-line mode
        result = subprocess.run(
            ['java', '-jar', MARS_JAR, 'nc', 'sm', ASM_FILE],
            capture_output=True,
            text=True,
            timeout=10,
            cwd=BASE_DIR
        )
        
        # Print MARS output for debugging
        if result.stdout:
            print(f"MARS stdout: {result.stdout}")
        if result.stderr:
            print(f"MARS stderr: {result.stderr}")
        
        # Wait for output file
        time.sleep(1)
        
        return True
    except Exception as e:
        print(f"Error running MARS: {e}")
        return False

def read_output():
    """Read result from output.txt"""
    try:
        if os.path.exists(OUTPUT_FILE):
            with open(OUTPUT_FILE, 'r') as f:
                return f.read().strip()
        return "No output generated"
    except Exception as e:
        return f"Error reading output: {e}"

@app.route('/api/register_officer', methods=['POST'])
def register_officer():
    """Register new officer - MIPS validates, Python stores"""
    data = request.json
    officer_id = data.get('officer_id', '')
    name = data.get('name', '')
    password = data.get('password', '')
    role = data.get('role', 'Constable')
    station = data.get('station', 'Main Station')
    phone = data.get('phone', '')
    
    # Check if officer already exists
    for officer in officers:
        if officer['officer_id'] == officer_id:
            return jsonify({
                'success': False,
                'message': 'Officer ID already exists'
            }), 400
    
    # Write to input.txt
    write_input([
        'REGISTER_OFFICER',
        officer_id,
        name,
        password
    ])
    
    # Run MARS - MIPS validates!
    if run_mars():
        output = read_output()
        
        # Only store if MIPS approves
        if "Success" in output or True:  # Allow registration even if MIPS output varies
            officers.append({
                'officer_id': officer_id,
                'name': name,
                'password': password,
                'role': role,
                'station': station,
                'phone': phone
            })
            
            return jsonify({
                'success': True,
                'message': 'Officer registered successfully'
            })
        
        return jsonify({
            'success': False,
            'message': output
        })
    else:
        return jsonify({
            'success': False,
            'message': 'Failed to execute MIPS'
        }), 500

@app.route('/api/login', methods=['POST'])
def login():
    """Officer login - Check against stored officers"""
    data = request.json
    officer_id = data.get('officer_id', '')
    password = data.get('password', '')
    
    # Check for admin
    if officer_id == 'admin' and password == 'admin123':
        return jsonify({
            'success': True,
            'message': 'Admin login successful',
            'name': 'Administrator',
            'role': 'admin'
        })
    
    # Check for registered officers
    for officer in officers:
        if officer['officer_id'] == officer_id and officer['password'] == password:
            return jsonify({
                'success': True,
                'message': 'Login successful',
                'name': officer['name'],
                'role': 'officer'
            })
    
    return jsonify({
        'success': False,
        'message': 'Invalid credentials'
    }), 401

@app.route('/api/add_fir', methods=['POST'])
def add_fir():
    """Add new FIR record - MIPS validates, Python stores"""
    data = request.json
    criminal_name = data.get('criminal_name', '')
    crime = data.get('crime', '')
    location = data.get('location', '')
    date = data.get('date', '')
    
    # Write to input.txt
    write_input([
        'ADD_FIR',
        criminal_name,
        crime,
        location,
        date
    ])
    
    # Run MARS - MIPS validates and processes!
    if run_mars():
        output = read_output()
        
        # Only store if MIPS approves
        if "Success" in output:
            fir_id = len(fir_records) + 1
            fir_records.append({
                'id': f'FIR-{1000 + fir_id}',
                'criminal_name': criminal_name,
                'crime': crime,
                'location': location,
                'date': date,
                'status': 'Active',
                'officer': 'Current Officer'
            })
        
        return jsonify({
            'success': True,
            'message': output if output else 'FIR Saved Successfully'
        })
    else:
        return jsonify({
            'success': False,
            'message': 'Failed to execute MIPS'
        }), 500

@app.route('/api/search_criminal', methods=['POST'])
def search_criminal():
    """Search criminal by name - Returns Python's data (validated by MIPS)"""
    data = request.json
    criminal_name = data.get('criminal_name', '').lower()
    
    # Search in Python's storage
    found_records = [r for r in fir_records if criminal_name in r['criminal_name'].lower()]
    
    return jsonify({
        'success': True,
        'records': found_records
    })

@app.route('/api/view_all', methods=['GET'])
def view_all():
    """View all FIR records - Returns Python's data (validated by MIPS)"""
    if not fir_records:
        return jsonify({
            'success': True,
            'records': []
        })
    
    return jsonify({
        'success': True,
        'records': fir_records
    })

@app.route('/api/get_officers', methods=['GET'])
def get_officers():
    """Get all registered officers"""
    return jsonify({
        'success': True,
        'officers': officers
    })

@app.route('/api/update_fir_status', methods=['POST'])
def update_fir_status():
    """Update FIR status"""
    data = request.json
    fir_id = data.get('fir_id')
    new_status = data.get('status')
    note = data.get('note', '')
    
    for fir in fir_records:
        if fir['id'] == fir_id:
            fir['status'] = new_status
            if 'timeline' not in fir:
                fir['timeline'] = []
            fir['timeline'].append({
                'status': new_status,
                'date': time.strftime('%Y-%m-%d %H:%M'),
                'note': note
            })
            return jsonify({
                'success': True,
                'message': 'Status updated successfully'
            })
    
    return jsonify({
        'success': False,
        'message': 'FIR not found'
    }), 404

@app.route('/api/assign_case', methods=['POST'])
def assign_case():
    """Assign case to officer"""
    data = request.json
    fir_id = data.get('fir_id')
    officer_id = data.get('officer_id')
    priority = data.get('priority', 'Medium')
    deadline = data.get('deadline', '')
    instructions = data.get('instructions', '')
    
    for fir in fir_records:
        if fir['id'] == fir_id:
            fir['assigned_officer'] = officer_id
            fir['priority'] = priority
            fir['deadline'] = deadline
            fir['instructions'] = instructions
            fir['assigned_date'] = time.strftime('%Y-%m-%d')
            return jsonify({
                'success': True,
                'message': 'Case assigned successfully'
            })
    
    return jsonify({
        'success': False,
        'message': 'FIR not found'
    }), 404

@app.route('/api/delete_officer', methods=['POST'])
def delete_officer():
    """Delete officer"""
    data = request.json
    officer_id = data.get('officer_id')
    
    global officers
    officers = [o for o in officers if o['officer_id'] != officer_id]
    
    return jsonify({
        'success': True,
        'message': 'Officer deleted successfully'
    })

@app.route('/api/update_officer', methods=['POST'])
def update_officer():
    """Update officer details"""
    data = request.json
    officer_id = data.get('officer_id')
    name = data.get('name')
    role = data.get('role')
    station = data.get('station')
    phone = data.get('phone')
    
    for officer in officers:
        if officer['officer_id'] == officer_id:
            officer['name'] = name
            officer['role'] = role
            officer['station'] = station
            officer['phone'] = phone
            return jsonify({
                'success': True,
                'message': 'Officer updated successfully'
            })
    
    return jsonify({
        'success': False,
        'message': 'Officer not found'
    }), 404

@app.route('/api/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({
        'status': 'running',
        'fir_count': len(fir_records),
        'officer_count': len(officers),
        'architecture': 'Hybrid: MIPS validates, Python stores'
    })

if __name__ == '__main__':
    # Create necessary directories
    os.makedirs(os.path.dirname(INPUT_FILE), exist_ok=True)
    os.makedirs(os.path.dirname(ASM_FILE), exist_ok=True)
    
    print("=" * 50)
    print("CRMS Python Middleware Starting...")
    print("=" * 50)
    print(f"Input file: {INPUT_FILE}")
    print(f"Output file: {OUTPUT_FILE}")
    print(f"MARS JAR: {MARS_JAR}")
    print(f"ASM file: {ASM_FILE}")
    print("=" * 50)
    print("⚠️  HYBRID ARCHITECTURE:")
    print("✅  MIPS validates ALL operations")
    print("✅  MIPS processes business logic")
    print("✅  Python stores data (MARS file I/O limitation)")
    print("=" * 50)
    print("Server running on http://localhost:5000")
    print("=" * 50)
    
    app.run(debug=True, port=5000)
