# CRMS Project Structure

```
CRMS/
├── asm/
│   └── crms.asm                    # MIPS assembly validation logic
│
├── backend/
│   ├── app.py                      # Flask backend server
│   └── requirements.txt            # Python dependencies
│
├── frontend/
│   └── nextjs-app/
│       ├── app/                    # Next.js pages
│       │   ├── page.js            # Landing page
│       │   ├── login/             # Login page
│       │   └── dashboard/         # Dashboard pages
│       ├── public/
│       │   └── images/            # Logo and slider images
│       ├── package.json           # Node dependencies
│       └── next.config.js         # Next.js config
│
├── Mars.jar                        # MIPS simulator
├── input.txt                       # MIPS input file
├── output.txt                      # MIPS output file
├── fir_data.txt                    # FIR data storage
│
├── start-backend.bat/.sh          # Backend startup scripts
├── start-frontend.bat/.sh         # Frontend startup scripts
│
├── README.md                       # Main documentation
├── SETUP_GUIDE.md                 # Setup instructions
└── HOW_TO_RUN_AND_TEST.md        # Running guide
```

## Quick Start

1. **Setup**: See `SETUP_GUIDE.md`
2. **Run**: See `HOW_TO_RUN_AND_TEST.md`
3. **Access**: http://localhost:3000

## Tech Stack

- **Frontend**: Next.js 15.5.9, React 19
- **Backend**: Python Flask
- **Validation**: MIPS Assembly
- **Theme**: Blue (#1e3a8a) & Red (#dc2626)

## Credits

Developed by **Hasnain Saleem** & **Shahood Khan**
