# GreenCart Logistics Management System 🚚

A modern, full-stack logistics management platform with advanced analytics and real-time delivery simulation capabilities. Built with React and Chart.js for dynamic data visualization.

## ✨ What's New in v2.0

### 🎨 Complete UI/UX Redesign
- **Modern Dashboard**: Completely redesigned with gradient backgrounds, card-based layouts, and smooth animations
- **Chart.js Integration**: Migrated from Recharts to Chart.js for better performance and more chart types
- **Enhanced Navigation**: New responsive navigation bar with mobile support and user profile integration
- **Visual Improvements**: Added icons, badges, gradients, and modern styling throughout the application

### 📊 New Chart Types
- **Pie Charts**: For delivery performance visualization
- **Doughnut Charts**: For cost breakdown analysis
- **Line Charts**: For trend analysis over time
- **Bar Charts**: For performance metrics comparison
- **Multi-axis Charts**: Combined profit and efficiency tracking

### Key Features

- **Analytics Dashboard**: Real-time KPI metrics with interactive Chart.js visualizations
- **Simulation Engine**: Run delivery simulations with custom parameters
- **Management System**: Full CRUD operations for Drivers, Routes, and Orders
- **Authentication**: Secure JWT-based login system
- **Responsive Design**: Optimized for all devices with mobile-first approach
- **Modern UI**: Gradient designs, smooth transitions, and intuitive interfaces

## Tech Stack

### Frontend
- **React 18** with Hooks
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Chart.js** & **react-chartjs-2** for data visualization
- **Axios** for API communication
- **React Router** for navigation

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** for cross-origin requests

### Database
- **MongoDB Atlas** (Cloud-hosted)

### Testing
- **Jest** for unit testing
- **Supertest** for API testing
- **MongoDB Memory Server** for test database

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd PurpleMeritAssessment
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` file in the `backend` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start the Application**

   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📈 Chart.js Implementation

The application now uses Chart.js for all data visualizations:

### Available Chart Types
- **Pie Chart**: Delivery performance (on-time vs late deliveries)
- **Doughnut Chart**: Cost breakdown analysis
- **Line Chart**: Historical trends with dual-axis support
- **Bar Chart**: Performance metrics comparison

### Chart Features
- Interactive tooltips with detailed information
- Responsive design that adapts to screen size
- Smooth animations on data updates
- Custom color schemes with gradients
- Legend and label customization

## Environment Variables

### Backend (.env)
```env
PORT=5000                          # Server port
NODE_ENV=development               # Environment (development/production)
MONGO_URI=mongodb+srv://...        # MongoDB Atlas connection string
JWT_SECRET=your_secret_key         # JWT signing secret
FRONTEND_URL=http://localhost:3000 # Frontend URL for CORS
```

## Company Rules Implementation

The simulation engine implements the following business rules:

1. **Late Delivery Penalty**: ₹50 penalty if delivery time > (base route time + 10 minutes)
2. **Driver Fatigue Rule**: 30% speed decrease if driver works >8 hours the previous day
3. **High-Value Bonus**: 10% bonus for orders >₹1000 delivered on time
4. **Fuel Cost**: ₹5/km base + ₹2/km surcharge for high traffic
5. **Overall Profit**: Sum of (order value + bonus – penalties – fuel cost)
6. **Efficiency Score**: (On-time Deliveries / Total Deliveries) × 100

## API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST `/api/auth/login`
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST `/api/auth/logout`
Logout user (clears JWT cookie)

#### GET `/api/auth/me`
Get current user info

### Simulation Endpoints

#### POST `/api/simulation`
Run a delivery simulation
```json
{
  "numDrivers": 5,
  "startTime": "2024-01-15T09:00:00",
  "maxHoursPerDriver": 8
}
```

#### GET `/api/simulation/latest`
Get the latest simulation result

#### GET `/api/simulation`
Get all simulation history

### Management Endpoints

#### Drivers
- `GET /api/drivers` - Get all drivers
- `POST /api/drivers` - Create new driver
- `GET /api/drivers/:id` - Get specific driver
- `PUT /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Delete driver

#### Routes
- `GET /api/routes` - Get all routes
- `POST /api/routes` - Create new route
- `GET /api/routes/:id` - Get specific route
- `PUT /api/routes/:id` - Update route
- `DELETE /api/routes/:id` - Delete route

#### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get specific order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

## Testing

Run the test suite:
```bash
cd backend
npm test
```

The test suite includes:
- Authentication tests
- CRUD operation tests
- Simulation logic tests
- API endpoint tests

## Project Structure

```
PurpleMeritAssessment/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   ├── config/         # Configuration
│   │   └── tests/          # Test files
│   ├── data/               # CSV data files
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/          # React components
│   │   ├── api/            # API functions
│   │   ├── utils/          # Utility functions
│   │   └── components/     # Reusable components
│   └── package.json
└── README.md
```

## 🎨 UI/UX Features

### Dashboard
- **KPI Cards**: Real-time metrics with icons and trend indicators
- **Interactive Charts**: Hover effects, tooltips, and click interactions
- **Gradient Backgrounds**: Modern visual appeal with smooth color transitions
- **Responsive Grid**: Adapts to different screen sizes automatically

### Navigation
- **Smart Nav Bar**: Highlights active page with smooth transitions
- **User Profile**: Displays user avatar and information
- **Mobile Menu**: Hamburger menu for mobile devices
- **Notification Bell**: Ready for future notification features

### Visual Enhancements
- **Color Scheme**: Consistent blue-purple gradient theme
- **Shadows & Borders**: Depth and separation for better UX
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages with icons

## Live Deployment

### 🌐 Live Application URLs
- **Frontend**: [https://purple-merit-assessment-bbknsd3th-biswayanpauls-projects.vercel.app](https://purple-merit-assessment-bbknsd3th-biswayanpauls-projects.vercel.app)
- **Backend API**: [https://purplemeritassessment.onrender.com](https://purplemeritassessment.onrender.com)
- **API Base URL**: `https://purplemeritassessment.onrender.com/api`

### 🚀 Quick Access
- **Login/Register**: [https://purple-merit-assessment-bbknsd3th-biswayanpauls-projects.vercel.app/login](https://purple-merit-assessment-bbknsd3th-biswayanpauls-projects.vercel.app/login)
- **Dashboard**: [https://purple-merit-assessment-bbknsd3th-biswayanpauls-projects.vercel.app](https://purple-merit-assessment-bbknsd3th-biswayanpauls-projects.vercel.app) (after login)

## Deployment

### Backend Deployment (Render)
1. **Platform**: [Render.com](https://render.com)
2. **Repository**: Connect GitHub repository
3. **Service Type**: Web Service
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. **Environment Variables**:
   ```env
   NODE_ENV=production
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=https://purple-merit-assessment-bbknsd3th-biswayanpauls-projects.vercel.app
   ```

### Frontend Deployment (Vercel)
1. **Platform**: [Vercel.com](https://vercel.com)
2. **Repository**: Connect GitHub repository
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Environment Variables**:
   ```env
   VITE_API_BASE_URL=https://purplemeritassessment.onrender.com
   ```

### Database Deployment (MongoDB Atlas)
1. **Platform**: [MongoDB Atlas](https://mongodb.com/atlas)
2. **Cluster**: Cloud-hosted MongoDB cluster
3. **Connection**: Get connection string and update backend environment variables

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- Lazy loading for charts
- Optimized bundle size with tree shaking
- Efficient re-renders with React hooks
- Cached API responses
- Responsive image loading

## License

This project is created for assessment purposes.

## Contributing

This is an assessment project. For questions or issues, please contact the development team.

---

**Note**: This application is designed for internal use by GreenCart Logistics management team. All data and simulations are based on fictional scenarios for demonstration purposes.

## Version History

- **v2.0** - Chart.js integration, complete UI redesign, enhanced user experience
- **v1.0** - Initial release with Recharts and basic functionality