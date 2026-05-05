# TexVision AI - Surveillance Dashboard

## 🎯 Project Overview

**TexVision AI** is a production-grade, AI-Based Computer Vision Surveillance System designed specifically for Textile Industries. This comprehensive web application provides real-time monitoring, AI-powered violation detection, and advanced analytics for factory safety and compliance.

## ✨ Key Features

### 🔐 Authentication System
- Role-based access control (Administrator, Supervisor, Viewer)
- Secure login with demo credentials
- Session management

### 📊 Main Dashboard
- Real-time metrics and KPIs
- Live camera feed grid (6 cameras)
- Active violations counter
- System health monitoring
- Recent activity timeline

### 📹 Live Monitoring
- Multi-camera CCTV surveillance feeds
- Adjustable grid layout (2x2, 3x3, 4x4)
- Real-time AI detection overlays
- Live status indicators
- Camera health monitoring

### 🚨 Alert Management
- Real-time violation alerts
- Alert categorization (Critical, Warning, Info)
- Acknowledge and resolve workflows
- Filtering by severity, status, camera, zone
- Sliding alert panel with notifications

### 🎥 Camera Management
- Complete CRUD operations for cameras
- RTSP URL configuration
- Connection testing
- Status management (Active, Inactive, Maintenance)
- Health monitoring per camera
- Zone assignment

### 🗺️ Zone Configuration
- Interactive factory floor layout
- Visual zone mapping
- Zone-based rule configuration
- Risk level assessment
- Occupancy tracking
- Camera assignment per zone

### 📝 Event Logs
- Comprehensive event history
- Advanced filtering (date range, severity, camera)
- Expandable row details
- Confidence score tracking
- Export functionality

### 📈 Reports & Analytics
- Violations by category (Pie Chart)
- Weekly compliance trends (Line Chart)
- Zone risk comparison (Bar Chart)
- Camera activity heatmap
- Alert resolution time analysis
- PDF and CSV export

### 👥 User Management
- User CRUD operations
- Role assignment
- Status management
- Permission control
- Last login tracking

### ⚙️ Settings
- Detection threshold configuration
- Alert cooldown settings
- Frame extraction interval
- Notification preferences (Email, SMS, Push)
- Data retention policy

## 🎨 Design Features

### Visual Design
- Dark industrial monitoring theme
- Glassmorphism UI elements
- Gradient backgrounds
- Glow effects for alerts
- Professional CCTV aesthetic
- Smooth animations with Framer Motion

### Color Scheme
- **Navy/Black Background**: Professional surveillance feel
- **Red (#ef4444)**: Critical violations
- **Amber (#f59e0b)**: Warnings
- **Green (#22c55e)**: Compliant/Resolved
- **Blue (#3b82f6)**: Information

## 🛠️ Tech Stack

### Frontend Framework
- **React.js 19.2.5** with Vite 8.0.10
- **React Router DOM 7.14.2** for navigation
- **Framer Motion 12.38.0** for animations

### Styling
- **Tailwind CSS 3.4.19** for utility-first styling
- **@tailwindcss/forms** for form components
- Custom glassmorphism and glow effects

### Data Visualization
- **Recharts 3.8.1** for charts and analytics

### UI Components
- **Lucide React 1.14.0** for icons
- **@headlessui/react 2.2.10** for accessible components

### Utilities
- **Axios 1.16.0** for API calls
- **Socket.IO Client 4.8.3** for real-time alerts
- **date-fns 4.1.0** for date formatting
- **React Hot Toast 2.6.0** for notifications

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Sidebar.jsx
│   ├── TopNavbar.jsx
│   ├── MetricCard.jsx
│   ├── CameraFeedCard.jsx
│   └── AlertCard.jsx
├── pages/              # Main application pages
│   ├── LoginPage.jsx
│   ├── Dashboard.jsx
│   ├── LiveMonitoring.jsx
│   ├── AlertsPage.jsx
│   ├── CameraManagement.jsx
│   ├── ZoneConfiguration.jsx
│   ├── EventLogs.jsx
│   ├── ReportsAnalytics.jsx
│   ├── UserManagement.jsx
│   └── Settings.jsx
├── layouts/            # Layout components
│   └── DashboardLayout.jsx
├── services/           # API service layer
│   ├── authService.js
│   ├── cameraService.js
│   ├── alertService.js
│   ├── zoneService.js
│   ├── userService.js
│   └── reportService.js
├── data/              # Mock data
│   ├── mockCameras.js
│   ├── mockAlerts.js
│   ├── mockZones.js
│   ├── mockUsers.js
│   └── mockAnalytics.js
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd texvision-ai
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

### Demo Credentials

**Administrator:**
- Email: `admin@texvision.ai`
- Password: `admin123`

**Supervisor:**
- Email: `supervisor@texvision.ai`
- Password: `super123`

**Viewer:**
- Email: `viewer@texvision.ai`
- Password: `view123`

## 🎯 AI Detection Categories

The system monitors and detects the following violations:

1. **Mobile Phone Detection** - Near machinery zones
2. **Smoking Detection** - In restricted areas
3. **Worker Drowsiness** - Fatigue monitoring
4. **Unauthorized Entry** - Access control violations
5. **Fire Extinguisher Missing** - Safety equipment monitoring
6. **Person Detection** - Occupancy tracking

## 📊 Mock Data

The application includes comprehensive mock data for:
- 12 cameras across different zones
- 10 factory zones with risk levels
- 8 users with different roles
- Historical violation data
- Analytics and reporting data

## 🔧 Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop (1920x1080 and above)
- Laptop (1366x768)
- Tablet (768x1024)
- Mobile (375x667)

## 🎓 Final Year Project Ready

This project is specifically designed for final year project presentations with:
- Professional enterprise-grade UI/UX
- Complete feature implementation
- Real-time monitoring simulation
- Comprehensive documentation
- Production-ready code quality
- Scalable architecture

## 🔮 Future Enhancements

- Real RTSP stream integration
- WebSocket real-time alerts
- Advanced AI model integration
- Mobile application
- Multi-language support
- Advanced reporting with custom date ranges
- Email/SMS notification integration
- Audit trail and compliance reports

## 📄 License

This project is created for educational purposes as a final year project demonstration.

## 👨‍💻 Author

Created as a comprehensive AI-Based Computer Vision Surveillance System for Textile Industries.

---

**TexVision AI** - Securing Textile Manufacturing with Artificial Intelligence
