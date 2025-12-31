# Clinical Trial Monitoring System

A modern React application for monitoring clinical trials across multiple clinics. Features real-time dashboards, automated delay detection, and anomaly alerts with a beautiful sky blue UI.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?logo=tailwind-css)

## ✨ Features

- 🏥 **Clinic Dashboard**: Submit daily updates, view status, and track symptom trends
- 👨‍💼 **Manager Dashboard**: Monitor all clinics with comprehensive analytics
- 📊 **Real-time Charts**: Bar charts, line charts, and pie charts for data visualization
- 🚨 **Automated Alerts**: Delay detection and anomaly alerts
- 🎨 **Beautiful UI**: Sky blue theme with glassmorphism effects
- 📱 **Responsive Design**: Works seamlessly on desktop and tablet

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔐 Demo Credentials

### Clinic User
- **Clinic ID**: `clinic1` or `clinic2`
- **Password**: `password123`

### Manager User
- **Email**: `manager@demo.com`
- **Password**: `manager123`

## 📦 Project Structure

```
client/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ScrollFloat.jsx
│   │   ├── DarkVeil.jsx
│   │   └── GlareHover.jsx
│   ├── pages/            # Page components
│   │   ├── LoginPage.jsx
│   │   ├── ClinicDashboard.jsx
│   │   └── ManagerDashboard.jsx
│   ├── services/         # API and mock data services
│   │   ├── api.js
│   │   ├── mockData.js
│   │   └── auth.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
└── vite.config.js
```

## 🛠️ Technologies

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **React Router** - Navigation
- **Axios** - HTTP client (currently using mock data)

## 📝 Notes

- This is a **frontend-only** application using mock data
- No backend or database setup required
- All data is simulated and resets on page refresh
- Ready for backend integration when needed

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📄 License

This project is for demonstration purposes.
