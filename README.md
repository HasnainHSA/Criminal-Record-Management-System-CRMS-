# CRMS - Crime Record Management System

Three-layer architecture: **Next.js** (UI) → **Python** (Bridge) → **MIPS Assembly** (Backend Logic)

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- Java 8+
- Mars.jar (MIPS Simulator)

### Installation

```bash
# Install Python dependencies
cd backend
pip install flask flask-cors

# Install Next.js dependencies
cd frontend/nextjs-app
npm install
```

### Run

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend/nextjs-app
npm run dev
```

**Access:** http://localhost:3000

## Architecture

### Layer 1: Next.js Frontend
- **Job:** UI only (forms, buttons, display)
- **Does NOT:** Store data or process logic

### Layer 2: Python Middleware  
- **Job:** Bridge between Next.js and MIPS
- **Does NOT:** Store data or process logic

### Layer 3: MIPS Assembly Backend
- **Job:** ALL business logic and data storage
- **Storage:** In-memory arrays (max 100 officers, 100 FIRs)

## Data Flow

```
User → Next.js → Python → input.txt → MIPS → output.txt → Python → Next.js → User
```

## Features

- 👮 Officer registration and login
- 📝 Add FIR records
- 🔍 Search criminals by name
- 📊 View all FIR records

## Project Structure

```
coa crms/
├── Mars.jar                    # MIPS Simulator
├── backend/
│   └── app.py                  # Python Flask middleware
├── frontend/nextjs-app/        # Next.js UI
└── asm/
    └── crms.asm                # MIPS backend (ALL LOGIC)
```

## Testing

1. Register Officer: http://localhost:3000/register-officer
2. Login: http://localhost:3000/login
3. Add FIR: http://localhost:3000/add-fir
4. Search: http://localhost:3000/search-criminal
5. View All: http://localhost:3000/view-firs

## Key Points

- **MIPS is the real backend** - All logic in assembly
- **No database** - Data in MIPS memory arrays
- **File-based IPC** - input.txt/output.txt communication
- **Educational** - Learn system architecture + MIPS

## Documentation

- **README.md** - This file (overview)
- **ARCHITECTURE.md** - Detailed architecture
- **SETUP_GUIDE.md** - Installation guide
- **HOW_TO_RUN_AND_TEST.md** - Complete testing guide
- **QUICK_REFERENCE.md** - Quick commands reference
