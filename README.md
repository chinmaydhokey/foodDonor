# FoodShare Platform

FoodShare is a web application that connects food donors with NGOs to reduce food waste and help those in need. The platform allows donors to list surplus food items and NGOs to claim these listings for distribution.

## PPT Link : https://www.canva.com/design/DAGkcFq911w/rZ04f_3TCHh-lOu0U1Ms1Q/edit?utm_content=DAGkcFq911w&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

## Features

- **User Authentication**
  - Separate registration and login for donors and NGOs
  - JWT-based authentication
  - Role-based access control

- **Donor Features**
  - Create food listings with details like name, quantity, and expiry time
  - Geolocation support for pickup location
  - Track listing status
  - Manage and view own listings

- **NGO Features**
  - View available food listings
  - Request pickup for available items
  - Real-time listing status updates

## Tech Stack

### Frontend
- React with Vite
- React Router for navigation
- TailwindCSS for styling
- Axios for API requests
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled

## Project Structure

```
foodshare/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── backend/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── server.js
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```sh
git clone <repository-url>
```

2. Install backend dependencies:
```sh
cd foodshare-backend
npm install
```

3. Install frontend dependencies:
```sh
cd foodshare-frontend
npm install
```

4. Create a `.env` file in the backend directory with:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Running the Application

1. Start the backend server:
```sh
cd foodshare-backend
npm run dev
```

2. Start the frontend development server:
```sh
cd foodshare-frontend
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Listings
- `GET /api/listings` - Get all available listings
- `POST /api/listings` - Create a new food listing
- `PUT /api/listings/claim/:id` - Claim a food listing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
