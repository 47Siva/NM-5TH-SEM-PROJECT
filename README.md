# JWT Token Refresh and Expiry

A complete Node.js application implementing JWT authentication with intelligent refresh token mechanism and expiry management. This project demonstrates advanced user authentication, seamless token management, and a modern professional web interface.

## Features

- 🔐 **Advanced Authentication**: JWT-based authentication with intelligent refresh tokens
- ⚡ **Smart Token Management**: Automatic refresh and expiry handling
- 👤 **Complete User Management**: Full profile management with auto-login
- 📊 **Professional Dashboard**: Comprehensive analytics and user statistics
- 🎨 **Modern Professional UI**: Beautiful, responsive design with smooth animations
- 🛡️ **Secure Protected Routes**: Advanced middleware protection
- 🚀 **Seamless Navigation**: Smooth page transitions and breadcrumb navigation
- 💫 **Enhanced UX**: Loading states, success animations, and professional feedback

## Pages

1. **Home Page** (`index.html`) - Landing page with project overview
2. **Login Page** (`login.html`) - User authentication
3. **Register Page** (`register.html`) - New user registration
4. **Dashboard** (`dashboard.html`) - Main user dashboard
5. **Profile Page** (`profile.html`) - User profile management

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling with animations
- **JavaScript** - Client-side functionality
- **Fetch API** - HTTP requests

## Project Structure

```
src/
├── config/
│   └── db.js              # Database connection
├── controllers/
│   └── authController.js  # Authentication logic
├── middleware/
│   └── authMiddleware.js  # JWT verification
├── models/
│   ├── User.js            # User schema
│   └── RefreshToken.js     # Refresh token schema
├── routes/
│   └── authRoutes.js      # API routes
├── utils/
│   └── jwt.js             # JWT utilities
├── public/
│   ├── css/
│   │   └── style.css      # Global styles
│   ├── index.html         # Home page
│   ├── login.html         # Login page
│   ├── register.html      # Register page
│   ├── dashboard.html     # Dashboard
│   └── profile.html       # Profile page
└── server.js              # Main server file
```

## API Endpoints

### Public Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Protected Routes
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jwt-refresh-node
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/jwt-refresh-token
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:5000`

## Usage

1. **Register**: Create a new account using the register page
2. **Login**: Authenticate with your credentials
3. **Dashboard**: View your account overview and statistics
4. **Profile**: Manage your personal information
5. **Logout**: Securely end your session

## Security Features

- **Password Hashing**: Passwords are hashed using bcryptjs
- **JWT Tokens**: Secure token-based authentication
- **Refresh Tokens**: Long-lived tokens for seamless experience
- **Token Expiration**: Short-lived access tokens (15 minutes)
- **Protected Routes**: Middleware protection for sensitive endpoints
- **Input Validation**: Server-side validation for all inputs

## Token Management

- **Access Token**: Short-lived (15 minutes) for API access
- **Refresh Token**: Long-lived (7 days) for token renewal
- **Automatic Refresh**: Tokens are automatically refreshed when expired
- **Secure Storage**: Tokens stored in browser localStorage
- **Logout Cleanup**: Refresh tokens are revoked on logout

## Development

### Scripts
- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon

### Environment Variables
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `PORT` - Server port (default: 5000)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support or questions, please open an issue in the repository.
