# 🚀 Studymate Project - Setup & Run Guide

## ✅ What Was Fixed

Your project had several issues that have been resolved:

### Backend Issues Fixed
1. **Project Structure**: Reorganized from duplicate nesting to clean structure
2. **Missing utils.py**: Created email utility module
3. **Database**: Switched to SQLite for development (was requiring PostgreSQL)
4. **Migrations**: Applied all database migrations
5. **Duplicate App**: Removed conflicting `tasks` app (consolidated with `work`)
6. **Configuration**: Updated Django settings for development environment

### Frontend Issues Fixed
1. **Proxy URL**: Corrected to point to backend `http://localhost:8000`

---

## 🎯 How to Run the Project

### **Terminal 1: Backend (Django)**

```bash
# Navigate to backend directory
cd backend

# Start Django development server
python manage.py runserver 0.0.0.0:8000
```

✅ Backend will run at: `http://localhost:8000`
✅ Admin panel at: `http://localhost:8000/admin`
✅ API at: `http://localhost:8000/api/v1`

### **Terminal 2: Frontend (React)**

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Start React development server
npm start
```

If you want to open the app from a phone on the same Wi-Fi network, bind the frontend to all interfaces before starting it:

```bash
# Windows PowerShell
$env:HOST="0.0.0.0"
npm start
```

✅ Frontend will run at: `http://localhost:3000`

---

## 📋 Project Structure (Final)

```
student-planner/
├── backend/                    # Django backend
│   ├── manage.py              # Django entry point
│   ├── db.sqlite3             # SQLite database (auto-created)
│   ├── planner/               # Project settings (renamed from backend)
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   ├── asgi.py
│   │   └── utils.py           # Email utilities (NEW)
│   ├── users/                 # Users app
│   ├── work/                  # Work/Tasks app (now main)
│   └── requirements.txt
│
├── frontend/                  # React frontend (renamed)
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── api.js
│       ├── App.js
│       └── Components/
│
├── docker-compose.yaml        # Docker configuration
├── requirements.txt           # Python dependencies
├── package.json               # Root package config
└── .env                        # Environment variables
```

---

## 🔐 Default Accounts & Configuration

### Admin Account (Create First)
```bash
cd backend
python manage.py createsuperuser
# Follow the prompts to create admin account
```

### Environment Variables (Optional)
Create a `.env` file in the root or `backend/` directory:

```env
# Email Configuration (for password reset emails)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DEFAULT_FROM_EMAIL=noreply@studymate.com

# Firebase (optional - only needed for push notifications)
FIREBASE_SERVICE_ACCOUNT=secrets/service-keys.json

# Database (for production)
DB_NAME=studymate_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

---

## ✨ Available API Endpoints

### Authentication
- `POST /api/v1/users/` - Register new user
- `POST /api/token/` - Login (get JWT token)
- `POST /api/token/refresh/` - Refresh token

### Users
- `GET /api/v1/users/` - List users
- `POST /api/v1/users/{id}/` - Update profile

### Tasks & Work
- `GET /api/v1/work/tasks/` - List tasks
- `POST /api/v1/work/tasks/` - Create task
- `GET /api/v1/work/schedules/` - List schedules
- `POST /api/v1/work/schedules/` - Create schedule

---

## 🛠️ Troubleshooting

### Port Already in Use
If port 8000 or 3000 is already in use:

**For Django:**
```bash
python manage.py runserver 8001
```

**For React:**
```bash
# Set port in terminal before running
set PORT=3001
npm start
```

### Dependencies Missing
```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

### Database Issues
Reset the database (development only):
```bash
rm backend/db.sqlite3
cd backend
python manage.py migrate
```

---

## 📞 Support Features

### Logging
Both backend and frontend have logging configured. Check console for errors.

### Email Service
Currently set to console backend (emails print to console). To use real email:
1. Configure SMTP credentials in `.env`
2. Set `EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend`

### Firebase Notifications
Optional. Place `service-keys.json` in `backend/secrets/` directory to enable push notifications.

---

## ✅ Verification Checklist

Before considering the setup complete:
- [ ] Backend starts at `http://localhost:8000`
- [ ] Frontend starts at `http://localhost:3000`
- [ ] Admin panel accessible at `http://localhost:8000/admin`
- [ ] Can view API docs at `http://localhost:8000/api/v1/`
- [ ] Frontend connects to backend without CORS errors

---

**Your project is now ready to run! 🎉**
