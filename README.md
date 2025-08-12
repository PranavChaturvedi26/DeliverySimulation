### Key Features

- **Dashboard**: Real-time KPI metrics with interactive charts
- **Simulation Engine**: Run delivery simulations with custom parameters
- **Management System**: Full CRUD operations for Drivers, Routes, and Orders
- **Authentication**: Secure JWT-based login system
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- **React 18** with Hooks
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Axios** for API communication

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

## License

This project is created for assessment purposes.

## Contributing

This is an assessment project. For questions or issues, please contact the development team.

---

**Note**: This application is designed for internal use by GreenCart Logistics management team. All data and simulations are based on fictional scenarios for demonstration purposes.
