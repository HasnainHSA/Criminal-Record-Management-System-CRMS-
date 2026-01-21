# CRMS Setup Guide

## Prerequisites Installation

### 1. Install Node.js
Download and install Node.js 18+ from: https://nodejs.org/

Verify installation:
```bash
node --version
npm --version
```

### 2. Install Python
Download and install Python 3.8+ from: https://www.python.org/

Verify installation:
```bash
python --version
pip --version
```

### 3. Install Java Runtime
Download and install Java JRE from: https://www.java.com/

Verify installation:
```bash
java -version
```

### 4. Download MARS Simulator
Download Mars.jar from: http://courses.missouristate.edu/kenvollmar/mars/

Place `Mars.jar` in the project root directory:
```
CRMS_Project/
├── Mars.jar  <-- Place here
├── backend/
├── frontend/
└── asm/
```

## Project Setup

### Step 1: Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

This installs:
- Flask (web framework)
- Flask-CORS (cross-origin requests)

### Step 2: Install Next.js Dependencies

```bash
cd frontend/nextjs-app
npm install
```

This installs:
- Next.js
- React
- React-DOM

## Running the System

### Terminal 1: Start Python Backend

```bash
cd backend
python app.py
```

You should see:
```
==================================================
CRMS Python Middleware Starting...
==================================================
Server running on http://localhost:5000
==================================================
```

### Terminal 2: Start Next.js Frontend

```bash
cd frontend/nextjs-app
npm run dev
```

You should see:
```
- ready started server on 0.0.0.0:3000
- Local: http://localhost:3000
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Testing the System

### Test 1: Register an Officer

1. Go to http://localhost:3000/register-officer
2. Fill in:
   - Officer ID: `OFF001`
   - Name: `John Doe`
   - Password: `password123`
3. Click "Register Officer"
4. You should see: "Officer Registered Successfully"

### Test 2: Login

1. Go to http://localhost:3000/login
2. Fill in:
   - Officer ID: `OFF001`
   - Password: `password123`
3. Click "Login"
4. You should see: "Login Successful"

### Test 3: Add FIR

1. Go to http://localhost:3000/add-fir
2. Fill in:
   - Criminal Name: `Ali Khan`
   - Crime Type: `Theft`
   - Location: `Karachi`
   - Date: `2025-01-10`
3. Click "Add FIR Record"
4. You should see: "FIR Saved Successfully"

### Test 4: Search Criminal

1. Go to http://localhost:3000/search-criminal
2. Enter: `Ali Khan`
3. Click "Search"
4. You should see the criminal's record or "Record Not Found"

### Test 5: View All Records

1. Go to http://localhost:3000/view-firs
2. Click "Load All Records"
3. You should see all FIR records

## Troubleshooting

### Issue: "Mars.jar not found"

**Solution:** Make sure Mars.jar is in the project root directory.

```
CRMS_Project/
├── Mars.jar  <-- Must be here
```

### Issue: "Failed to connect to backend"

**Solution:** Make sure Python backend is running on port 5000.

```bash
cd backend
python app.py
```

### Issue: "Port 3000 already in use"

**Solution:** Kill the process using port 3000 or use a different port.

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Issue: "Module not found"

**Solution:** Reinstall dependencies.

```bash
# Python
cd backend
pip install -r requirements.txt

# Next.js
cd frontend/nextjs-app
rm -rf node_modules
npm install
```

### Issue: MIPS code not executing

**Solution:** Check that:
1. Java is installed: `java -version`
2. Mars.jar exists in project root
3. asm/crms.asm exists
4. Python has permission to execute Java

## File Structure Verification

Your project should look like this:

```
CRMS_Project/
├── Mars.jar                    # MARS simulator
├── input.txt                   # Command input (auto-generated)
├── output.txt                  # Result output (auto-generated)
├── README.md                   # Main documentation
├── ARCHITECTURE.md             # Architecture details
├── SETUP_GUIDE.md             # This file
├── .gitignore
│
├── backend/
│   ├── app.py                 # Flask middleware
│   └── requirements.txt       # Python dependencies
│
├── frontend/
│   └── nextjs-app/
│       ├── app/
│       │   ├── layout.js
│       │   ├── page.js
│       │   ├── login/
│       │   ├── register-officer/
│       │   ├── add-fir/
│       │   ├── search-criminal/
│       │   └── view-firs/
│       ├── package.json
│       └── next.config.js
│
└── asm/
    └── crms.asm               # MIPS backend logic
```

## Development Tips

1. **Keep both terminals open** - You need Python and Next.js running simultaneously
2. **Check console logs** - Both terminals show useful debugging information
3. **Inspect files** - Check `input.txt` and `output.txt` to see communication
4. **CORS errors** - Make sure Flask-CORS is installed
5. **Port conflicts** - Use different ports if 3000 or 5000 are taken

## Next Steps

After successful setup:
1. Read ARCHITECTURE.md to understand the system
2. Explore the MIPS code in asm/crms.asm
3. Try adding new features
4. Experiment with different commands

## Support

If you encounter issues:
1. Check that all prerequisites are installed
2. Verify file structure matches above
3. Read error messages carefully
4. Check both terminal outputs
5. Ensure Mars.jar is accessible
