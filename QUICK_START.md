# TexVision AI - Quick Start Guide

## 🚀 Get Started in 3 Minutes

### Step 1: Install Dependencies (1 minute)
```bash
npm install
```

### Step 2: Start Development Server (30 seconds)
```bash
npm run dev
```

### Step 3: Open Browser (30 seconds)
Navigate to: **http://localhost:5173**

---

## 🔑 Login Credentials

### Administrator (Full Access)
```
Email: admin@texvision.ai
Password: admin123
```

### Supervisor (Moderate Access)
```
Email: supervisor@texvision.ai
Password: super123
```

### Viewer (Read-Only)
```
Email: viewer@texvision.ai
Password: view123
```

---

## 📱 Main Features Access

### 1. Dashboard
- **URL**: `/dashboard`
- **Features**: Metrics, Live feeds, Recent activity
- **Access**: All roles

### 2. Live Monitoring
- **URL**: `/live-monitoring`
- **Features**: Multi-camera grid, Real-time feeds
- **Access**: All roles

### 3. Alerts
- **URL**: `/alerts`
- **Features**: Alert management, Filtering, Actions
- **Access**: All roles (Actions: Supervisor+)

### 4. Camera Management
- **URL**: `/cameras`
- **Features**: CRUD operations, Testing, Status
- **Access**: Administrator only

### 5. Zone Configuration
- **URL**: `/zones`
- **Features**: Zone mapping, Rules, Risk levels
- **Access**: Administrator only

### 6. Event Logs
- **URL**: `/event-logs`
- **Features**: History, Filtering, Export
- **Access**: All roles

### 7. Reports & Analytics
- **URL**: `/reports`
- **Features**: Charts, Analytics, Export
- **Access**: All roles

### 8. User Management
- **URL**: `/users`
- **Features**: User CRUD, Roles, Permissions
- **Access**: Administrator only

### 9. Settings
- **URL**: `/settings`
- **Features**: Thresholds, Notifications, Retention
- **Access**: Administrator only

---

## 🎯 Common Tasks

### View Live Cameras
1. Login with any role
2. Click "Live Monitoring" in sidebar
3. Adjust grid size using top-right buttons

### Manage Alerts
1. Login as Supervisor or Admin
2. Click "Alerts" in sidebar
3. Use filters to find specific alerts
4. Click "Acknowledge" or "Resolve" buttons

### Add New Camera
1. Login as Administrator
2. Go to "Camera Management"
3. Click "Add Camera" button
4. Fill in camera details
5. Click "Save"

### View Analytics
1. Login with any role
2. Click "Reports & Analytics"
3. Scroll through different charts
4. Click "Export PDF" or "Export CSV"

### Configure Zones
1. Login as Administrator
2. Go to "Zone Configuration"
3. View factory floor layout
4. Click zone cards to edit
5. Assign cameras and rules

---

## 🛠️ Development Commands

### Start Development Server
```bash
npm run dev
```
Access at: http://localhost:5173

### Build for Production
```bash
npm run build
```
Output in: `dist/` folder

### Preview Production Build
```bash
npm run preview
```

### Run Linter
```bash
npm run lint
```

---

## 📊 Mock Data Overview

### Cameras: 12 Total
- Active: 10
- Maintenance: 1
- Inactive: 1

### Zones: 10 Total
- Critical Risk: 2
- High Risk: 3
- Medium Risk: 3
- Low Risk: 2

### Users: 8 Total
- Administrators: 2
- Supervisors: 3
- Viewers: 3

### Alerts: 20+ Events
- Active: 2
- Acknowledged: 3
- Resolved: 15+

---

## 🎨 UI Components

### Sidebar Navigation
- Logo and branding
- Menu items with icons
- Active route highlighting
- User profile section
- Logout button

### Top Navbar
- Search bar
- System status indicator
- Date/time display
- Notification bell with counter
- User avatar

### Alert Panel
- Slides from right
- Shows active alerts
- Quick actions
- Auto-refresh

---

## 🔔 Notification System

### Toast Notifications
- Success (Green)
- Error (Red)
- Loading (Blue)
- Info (Blue)

### Alert Counter
- Red badge on bell icon
- Shows active alert count
- Updates in real-time

---

## 🎯 Detection Types

1. **Mobile Phone** - Critical
2. **Smoking** - Critical
3. **Drowsiness** - Warning
4. **Unauthorized Entry** - Critical
5. **Fire Extinguisher** - Warning
6. **Person Detection** - Info

---

## 📱 Responsive Breakpoints

- **Desktop**: 1920px+
- **Laptop**: 1366px - 1919px
- **Tablet**: 768px - 1365px
- **Mobile**: 375px - 767px

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173
npm run dev
```

### Dependencies Error
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Error
```bash
# Clear cache
npm run build -- --force
```

### Hot Reload Not Working
```bash
# Restart dev server
Ctrl+C
npm run dev
```

---

## 📚 File Locations

### Components
`src/components/`

### Pages
`src/pages/`

### Services
`src/services/`

### Mock Data
`src/data/`

### Styles
`src/index.css` and `src/App.css`

### Config
`tailwind.config.js`, `vite.config.js`

---

## 🎓 For Presentation

### Demo Flow
1. **Login** - Show authentication
2. **Dashboard** - Overview of metrics
3. **Live Monitoring** - Real-time feeds
4. **Alerts** - Show alert management
5. **Analytics** - Display charts
6. **Camera Management** - CRUD operations
7. **Zone Configuration** - Factory layout
8. **Settings** - Configuration options

### Key Points to Highlight
- ✅ Real-time monitoring
- ✅ AI-powered detection
- ✅ Role-based access
- ✅ Comprehensive analytics
- ✅ Professional UI/UX
- ✅ Fully responsive
- ✅ Production-ready

---

## 🌟 Pro Tips

1. **Use Administrator account** for full feature access
2. **Check alert panel** for real-time notifications
3. **Adjust grid layout** in Live Monitoring for better view
4. **Use filters** in Alerts and Event Logs for quick search
5. **Export reports** to demonstrate analytics
6. **Test camera connection** to show validation
7. **Toggle statuses** to show dynamic updates
8. **View different roles** to demonstrate access control

---

## 📞 Need Help?

### Documentation
- `README.md` - Full documentation
- `FEATURES.md` - Feature list
- `DEPLOYMENT.md` - Deployment guide
- `PROJECT_SUMMARY.md` - Project overview

### Code Structure
- Well-commented components
- Service layer pattern
- Reusable components
- Mock data examples

---

## ✅ Pre-Presentation Checklist

- [ ] Dependencies installed
- [ ] Dev server running
- [ ] Login credentials ready
- [ ] Demo flow prepared
- [ ] Key features identified
- [ ] Browser console clear
- [ ] Network tab checked
- [ ] Responsive design tested
- [ ] All routes working
- [ ] Animations smooth

---

**You're all set! 🚀**

Start the dev server and begin exploring TexVision AI!

```bash
npm run dev
```

Then open: **http://localhost:5173**

Login with: **admin@texvision.ai / admin123**

---

**TexVision AI** - Ready to Impress! 🎉
