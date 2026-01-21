# 🚀 How to Run and Test CRMS

## ✅ System Status

**Current Status:** ✅ **FULLY OPERATIONAL**

- ✅ Mars.jar installed
- ✅ Python backend running on http://localhost:5000
- ✅ Next.js frontend running on http://localhost:3000
- ✅ MIPS assembly code ready
- ✅ All dependencies installed

---

## 🎯 How to Run the System

### Option 1: Services Already Running (Current)

The system is **ALREADY RUNNING**! Both services are active:

```
Backend:  http://localhost:5000 ✅
Frontend: http://localhost:3000 ✅
```

**Just open your browser:**
```
http://localhost:3000
```

### Option 2: Start from Scratch

If you need to restart:

**Terminal 1 - Backend:**
```bash
cd backend
py app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend/nextjs-app
npm run dev
```

### Option 3: Use Startup Scripts

**Windows:**
```bash
# Double-click or run:
start-backend.bat
start-frontend.bat
```

**Linux/Mac:**
```bash
chmod +x start-backend.sh start-frontend.sh
./start-backend.sh
./start-frontend.sh
```

---

## 🧪 How to Test the System

### Method 1: Web Browser (Easiest)

1. **Open Browser:** http://localhost:3000

2. **Test Register Officer:**
   - Go to "Register Officer"
   - Fill in:
     - Officer ID: `OFF001`
     - Name: `John Doe`
     - Password: `password123`
   - Click "Register Officer"
   - Should see: "Officer Registered Successfully"

3. **Test Login:**
   - Go to "Login"
   - Enter:
     - Officer ID: `OFF001`
     - Password: `password123`
   - Click "Login"
   - Should see: "Login Successful"

4. **Test Add FIR:**
   - Go to "Add FIR"
   - Fill in:
     - Criminal Name: `Ali Khan`
     - Crime Type: `Theft`
     - Location: `Karachi`
     - Date: `2025-01-18`
   - Click "Add FIR Record"
   - Should see: "FIR Saved Successfully"

5. **Test Search:**
   - Go to "Search Criminal"
   - Enter: `Ali Khan`
   - Click "Search"
   - Should see criminal record or "Record Not Found"

6. **Test View All:**
   - Go to "View All FIRs"
   - Click "Load All Records"
   - Should see all FIR records

### Method 2: PowerShell Script (Automated)

```powershell
# Run the test script
powershell -ExecutionPolicy Bypass -File test_api.ps1
```

This will automatically test:
- ✅ Add FIR
- ✅ Search Criminal
- ✅ View All Records

### Method 3: Manual API Testing

**Test Add FIR:**
```powershell
$body = @{
    criminal_name = "Sara Ahmed"
    crime = "Fraud"
    location = "Lahore"
    date = "2025-01-18"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/add_fir" -Method Post -Body $body -ContentType "application/json"
```

**Test Search:**
```powershell
$body = @{
    criminal_name = "Sara Ahmed"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/search_criminal" -Method Post -Body $body -ContentType "application/json"
```

**Test View All:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/view_all" -Method Get
```

### Method 4: Check Files Directly

**Check input.txt:**
```bash
type input.txt
```

**Check output.txt:**
```bash
type output.txt
```

**Test MARS directly:**
```bash
java -jar Mars.jar nc sm asm/crms.asm
```

---

## 📊 Complete System Architecture

### 🏗️ Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                         │
│                 http://localhost:3000                   │
│                                                         │
│  Pages: Home, Login, Register, Add FIR, Search, View   │
└─────────────────────────────────────────────────────────┘
                         │
                         │ HTTP Request (JSON)
                         ▼
┌─────────────────────────────────────────────────────────┐
│              LAYER 1: Next.js Frontend                  │
│              Location: frontend/nextjs-app/             │
│                                                         │
│  Responsibility: USER INTERFACE ONLY                    │
│  ├─ Display forms and tables                           │
│  ├─ Capture user input                                 │
│  ├─ Send HTTP requests to Python                       │
│  └─ Display responses                                  │
│                                                         │
│  What it DOES NOT do:                                  │
│  ✗ Store data                                          │
│  ✗ Process business logic                             │
│  ✗ Validate FIR records                               │
│                                                         │
│  Files:                                                │
│  ├─ app/page.js (Home)                                │
│  ├─ app/login/page.js                                 │
│  ├─ app/register-officer/page.js                      │
│  ├─ app/add-fir/page.js                               │
│  ├─ app/search-criminal/page.js                       │
│  └─ app/view-firs/page.js                             │
└─────────────────────────────────────────────────────────┘
                         │
                         │ HTTP POST/GET
                         ▼
┌─────────────────────────────────────────────────────────┐
│            LAYER 2: Python Flask Middleware             │
│            Location: backend/app.py                     │
│            Running: http://localhost:5000               │
│                                                         │
│  Responsibility: BRIDGE ONLY                           │
│  ├─ Receive HTTP requests from Next.js                │
│  ├─ Parse JSON data                                   │
│  ├─ Write to input.txt                                │
│  ├─ Execute: java -jar Mars.jar nc sm asm/crms.asm   │
│  ├─ Read output.txt                                   │
│  └─ Return JSON response to Next.js                   │
│                                                         │
│  What it DOES NOT do:                                  │
│  ✗ Store data                                          │
│  ✗ Implement business logic                           │
│  ✗ Process FIR operations                             │
│                                                         │
│  API Endpoints:                                        │
│  ├─ POST /api/register_officer                        │
│  ├─ POST /api/login                                   │
│  ├─ POST /api/add_fir                                 │
│  ├─ POST /api/search_criminal                         │
│  └─ GET  /api/view_all                                │
└─────────────────────────────────────────────────────────┘
                         │
                         │ File Write
                         ▼
                   ┌──────────┐
                   │input.txt │
                   └──────────┘
                         │
                         │ Execute MARS
                         ▼
┌─────────────────────────────────────────────────────────┐
│           LAYER 3: MIPS Assembly Backend                │
│           Location: asm/crms.asm                        │
│           Runtime: MARS Simulator (Mars.jar)            │
│                                                         │
│  Responsibility: ALL BUSINESS LOGIC                     │
│  ├─ Read input.txt                                     │
│  ├─ Parse command (REGISTER, LOGIN, ADD_FIR, etc.)    │
│  ├─ Execute business logic                            │
│  ├─ Store data in memory arrays                       │
│  └─ Write results to output.txt                       │
│                                                         │
│  Data Storage (In-Memory Arrays):                      │
│  ┌─────────────────────────────────────────┐          │
│  │ Officers (max 100):                     │          │
│  │ ├─ officer_ids[2000]    (20 bytes each)│          │
│  │ ├─ officer_names[5000]  (50 bytes each)│          │
│  │ ├─ officer_pwds[2000]   (20 bytes each)│          │
│  │ └─ officer_count                        │          │
│  │                                         │          │
│  │ FIRs (max 100):                         │          │
│  │ ├─ fir_ids[400]         (4 bytes each) │          │
│  │ ├─ criminal_names[5000] (50 bytes each)│          │
│  │ ├─ crime_types[3000]    (30 bytes each)│          │
│  │ ├─ locations[3000]      (30 bytes each)│          │
│  │ ├─ dates[2000]          (20 bytes each)│          │
│  │ └─ fir_count                            │          │
│  └─────────────────────────────────────────┘          │
│                                                         │
│  Commands Supported:                                   │
│  ├─ REGISTER_OFFICER                                  │
│  ├─ LOGIN                                             │
│  ├─ ADD_FIR                                           │
│  ├─ SEARCH_CRIMINAL                                   │
│  └─ VIEW_ALL                                          │
└─────────────────────────────────────────────────────────┘
                         │
                         │ File Write
                         ▼
                   ┌───────────┐
                   │output.txt │
                   └───────────┘
                         │
                         │ File Read
                         ▼
              Python reads and returns JSON
                         │
                         ▼
              Next.js displays result to user
```

---

## 🔄 Data Flow Example: Adding a FIR

```
Step 1: User Action
├─ User opens http://localhost:3000/add-fir
├─ Fills form:
│  ├─ Criminal Name: "Ali Khan"
│  ├─ Crime Type: "Theft"
│  ├─ Location: "Karachi"
│  └─ Date: "2025-01-18"
└─ Clicks "Add FIR Record"

Step 2: Next.js Frontend
├─ Validates form
├─ Creates JSON:
│  {
│    "criminal_name": "Ali Khan",
│    "crime": "Theft",
│    "location": "Karachi",
│    "date": "2025-01-18"
│  }
└─ Sends POST to http://localhost:5000/api/add_fir

Step 3: Python Middleware
├─ Receives JSON request
├─ Writes to input.txt:
│  ADD_FIR
│  Ali Khan
│  Theft
│  Karachi
│  2025-01-18
├─ Executes: java -jar Mars.jar nc sm asm/crms.asm
└─ Waits for MARS to complete

Step 4: MARS Simulator
├─ Loads asm/crms.asm
├─ Starts execution at main
└─ Runs MIPS assembly code

Step 5: MIPS Assembly
├─ Reads input.txt
├─ Parses command: "ADD_FIR"
├─ Reads data lines
├─ Loads fir_count from memory
├─ Increments counter
├─ Stores in arrays:
│  ├─ criminal_names[count] = "Ali Khan"
│  ├─ crime_types[count] = "Theft"
│  ├─ locations[count] = "Karachi"
│  └─ dates[count] = "2025-01-18"
├─ Saves new fir_count
└─ Writes to output.txt: "FIR Saved Successfully"

Step 6: Python Middleware
├─ Reads output.txt
├─ Creates JSON response:
│  {
│    "success": true,
│    "message": "FIR Saved Successfully"
│  }
└─ Returns to Next.js

Step 7: Next.js Frontend
├─ Receives JSON response
├─ Displays success message
└─ Clears form

Total Time: ~1-2 seconds
```

---

## 📁 Project File Structure

```
D:\coding related projects\coa crms\
│
├── Mars.jar                    ✅ MARS Simulator (4.2 MB)
├── input.txt                   📝 Command input (auto-generated)
├── output.txt                  📝 Result output (auto-generated)
│
├── Documentation (11 files)
│   ├── README.md               📚 Main overview
│   ├── WELCOME.md              👋 Friendly intro
│   ├── INDEX.md                🗂️ Documentation index
│   ├── QUICK_REFERENCE.md      ⚡ Quick reference
│   ├── SETUP_GUIDE.md          🔧 Installation guide
│   ├── ARCHITECTURE.md         🏗️ Architecture details
│   ├── SYSTEM_FLOW.md          📊 Visual diagrams
│   ├── TESTING_GUIDE.md        🧪 Testing procedures
│   ├── MARS_DOWNLOAD.md        📥 MARS setup
│   ├── PROJECT_SUMMARY.md      📋 Complete summary
│   └── HOW_TO_RUN_AND_TEST.md  🚀 This file
│
├── backend/                    🐍 Python Middleware
│   ├── app.py                  Flask API (bridge)
│   └── requirements.txt        Dependencies
│
├── frontend/nextjs-app/        ⚛️ Next.js Frontend
│   ├── app/
│   │   ├── layout.js           Root layout
│   │   ├── page.js             Home page
│   │   ├── login/page.js       Login
│   │   ├── register-officer/page.js  Register
│   │   ├── add-fir/page.js     Add FIR
│   │   ├── search-criminal/page.js   Search
│   │   └── view-firs/page.js   View all
│   ├── package.json
│   └── next.config.js
│
├── asm/                        🔧 MIPS Backend
│   └── crms.asm                Assembly code (ALL logic)
│
└── Scripts
    ├── start-backend.bat       Windows backend
    ├── start-frontend.bat      Windows frontend
    ├── start-backend.sh        Linux/Mac backend
    ├── start-frontend.sh       Linux/Mac frontend
    └── test_api.ps1            API testing script
```

---

## 🎯 Key Architecture Principles

### 1. Strict Separation of Concerns

| Layer | Responsibility | What it CANNOT do |
|-------|---------------|-------------------|
| Next.js | UI only | No logic, no storage |
| Python | Bridge only | No logic, no storage |
| MIPS | ALL logic | Nothing else |

### 2. File-Based Communication

```
Python → input.txt → MIPS → output.txt → Python
```

### 3. No Database

All data stored in MIPS memory arrays (lost when MARS exits)

### 4. Educational Focus

Learn:
- Three-layer architecture
- MIPS assembly programming
- Inter-process communication
- Full-stack development

---

## ✅ Testing Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Can register officer
- [ ] Can login
- [ ] Can add FIR
- [ ] Can search criminal
- [ ] Can view all records
- [ ] input.txt updates correctly
- [ ] output.txt shows results
- [ ] MARS executes without errors

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to backend"
**Solution:** Make sure backend is running on port 5000
```bash
cd backend
py app.py
```

### Issue: "Port already in use"
**Solution:** Kill the process or use different port

### Issue: "Mars.jar not found"
**Solution:** Verify Mars.jar is in project root
```bash
dir Mars.jar
```

### Issue: "No output generated"
**Solution:** Check MARS execution
```bash
java -jar Mars.jar nc sm asm/crms.asm
type output.txt
```

---

## 📞 Quick Commands Reference

```bash
# Check if services are running
curl http://localhost:5000/health
curl http://localhost:3000

# View input/output files
type input.txt
type output.txt

# Test MARS directly
java -jar Mars.jar nc sm asm/crms.asm

# Run API tests
powershell -ExecutionPolicy Bypass -File test_api.ps1

# Restart backend (if needed)
# Press Ctrl+C in backend terminal, then:
cd backend
py app.py

# Restart frontend (if needed)
# Press Ctrl+C in frontend terminal, then:
cd frontend/nextjs-app
npm run dev
```

---

## 🎉 You're All Set!

**The system is READY and RUNNING!**

👉 **Open your browser:** http://localhost:3000

👉 **Start testing:** Register → Login → Add FIR → Search → View

👉 **Have fun learning!** 🚀
