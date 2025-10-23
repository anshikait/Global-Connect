# Global Connect - Professional Networking Platform

A comprehensive full-stack professional networking and job portal platform built with React.js, Node.js, and MongoDB. Global Connect bridges the gap between job seekers and recruiters, providing a seamless experience for professional networking, job searching, and recruitment.

## 🌐 Live Demo

- **Frontend**: 
- **Backend API**:

## 🚀 Features

### 👤 User Features
- **Authentication & Profile Management**
  - Secure user registration and login
  - Profile picture upload and management
  - Resume upload with local storage (PDF support)
  - Professional profile customization

- **Social Networking**
  - Create and share posts with images/videos
  - Feed with pagination (5 posts per page)
  - Like and comment on posts
  - Send and manage connection requests
  - Network building and professional connections

- **Job Search & Applications**
  - Browse jobs with advanced filtering
  - Job grid with pagination (6 jobs per page)
  - Apply for jobs with resume submission
  - Track application status
  - Save jobs for later viewing

- **Dashboard & Analytics**
  - Personal dashboard with statistics
  - Application history and status tracking
  - Saved jobs management
  - Connection management

### 🏢 Recruiter Features
- **Company Profile Management**
  - Company profile setup and customization
  - Company logo and information management

- **Job Management**
  - Create and post job openings
  - Edit and manage job listings
  - Job application tracking
  - Applicant management system

- **Application Review**
  - View all job applications
  - Filter applications by status and job
  - Review candidate profiles and resumes
  - Accept/reject applications
  - Resume viewing in browser

- **Analytics & Insights**
  - Application statistics and trends
  - Job posting performance metrics
  - Candidate analytics

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI Framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Styling framework
- **Axios** - HTTP client for API calls
- **React Context** - State management
- **Socket.io-client** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File upload handling
- **Cloudinary** - Image/video storage
- **Socket.io** - Real-time features
- **Bcrypt** - Password hashing

### DevOps & Deployment
- **Vercel** - Frontend deployment
- **Render** - Backend deployment
- **MongoDB Atlas** - Database hosting
- **Cloudinary** - Media storage

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Cloudinary Account** (for media uploads)

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone 
cd GNCIPL_GLOBAL_CONNECT
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

NODE_ENV=development
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

## 🏗️ Project Structure

```
Global Connect/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js          # Cloudinary configuration
│   │   ├── db.js                  # Database connection
│   │   └── multer.js              # File upload configuration
│   ├── controllers/
│   │   ├── authController.js      # General authentication
│   │   ├── userController.js      # User-specific operations
│   │   ├── recruiterController.js # Recruiter-specific operations
│   │   ├── postController.js      # Social posts management
│   │   ├── connectionController.js# Network connections
│   │   └── messageController.js   # Messaging system
│   ├── middleware/
│   │   └── auth.js                # Authentication middleware
│   ├── models/
│   │   ├── User.js                # User data model
│   │   ├── Recruiter.js           # Recruiter data model
│   │   ├── Job.js                 # Job posting model
│   │   ├── Post.js                # Social post model
│   │   ├── Connection.js          # Network connection model
│   │   └── Message.js             # Message model
│   ├── routes/
│   │   ├── userRoutes.js          # User API routes
│   │   ├── recruiterRoutes.js     # Recruiter API routes
│   │   ├── authRoutes.js          # Authentication routes
│   │   ├── postRoutes.js          # Social post routes
│   │   └── connectionRoutes.js    # Connection routes
│   ├── utils/
│   │   ├── generateToken.js       # JWT token generation
│   │   ├── helpers.js             # Utility functions
│   │   └── cronScheduler.js       # Scheduled tasks
│   └── server.js                  # Main server file
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── user/              # User-specific components
│   │   │   ├── recruiter/         # Recruiter-specific components
│   │   │   └── common/            # Shared components
│   │   ├── pages/                 # Page components
│   │   ├── context/               # React context providers
│   │   ├── services/              # API service functions
│   │   └── utils/                 # Utility functions
│   └── package.json
└── README.md
```

## 🔑 Key Features Deep Dive

### Authentication System
- **Dual Role System**: Separate authentication for Users and Recruiters
- **JWT-based**: Secure token-based authentication
- **Protected Routes**: Role-based access control
- **Session Management**: Persistent login with token refresh

### File Upload System
- **Dual Storage Strategy**: 
  - Cloudinary for images/videos (posts, profile pictures)
  - Local storage for resumes (PDF files)
- **File Validation**: Type and size restrictions
- **Error Handling**: Comprehensive upload error management

### Social Networking
- **Post Creation**: Rich media posts with image/video support
- **Feed System**: Paginated feed with infinite scroll
- **Engagement**: Like and comment functionality
- **Network Building**: Connection request system

### Job Portal
- **Advanced Filtering**: Search by title, location, company
- **Application Tracking**: Complete application lifecycle
- **Resume Management**: View and manage resumes
- **Status Updates**: Real-time application status changes

## 🔧 API Endpoints

### Authentication
```
POST /api/auth/user/register          # User registration
POST /api/auth/user/login             # User login
POST /api/auth/recruiter/register     # Recruiter registration
POST /api/auth/recruiter/login        # Recruiter login
```

### User Operations
```
GET  /api/users/profile               # Get user profile
PUT  /api/users/profile               # Update user profile
POST /api/users/profile-pic           # Upload profile picture
POST /api/users/resume                # Upload resume
GET  /api/users/jobs                  # Get all jobs
POST /api/users/apply/:jobId          # Apply for job
```

### Recruiter Operations
```
GET  /api/recruiters/profile          # Get recruiter profile
POST /api/recruiters/jobs             # Create job posting
GET  /api/recruiters/applications     # Get applications
PATCH /api/recruiters/applications/:id/status # Update application status
```

### Social Features
```
GET  /api/posts                       # Get feed posts
POST /api/posts                       # Create new post
POST /api/posts/:id/like              # Like/unlike post
POST /api/posts/:id/comment           # Add comment
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables
4. Deploy with automatic builds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📱 Mobile Responsiveness

Global Connect is fully responsive and optimized for:
- **Desktop** (1024px and above)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🔒 Security Features

- **Password Hashing**: Bcrypt for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Type and size restrictions
- **CORS Configuration**: Proper cross-origin resource sharing
- **Rate Limiting**: API rate limiting for security

## 📊 Performance Optimizations

- **Pagination**: Efficient data loading with pagination
- **Image Optimization**: Cloudinary for optimized media delivery
- **Lazy Loading**: Components loaded on demand
- **Efficient Queries**: Optimized MongoDB queries
- **Caching**: Strategic caching implementation

## 🐛 Known Issues & Limitations

- Resume uploads are limited to PDF format only
- File size limits: 10MB for resumes, 10MB for media files
- Real-time features require Socket.io connection

## 📞 Support

For support or questions, please contact:
- **GitHub Issues**: [Create an issue](https://github.com/rebel1321/GNCIPL_GLOBAL_CONNECT/issues)


## � License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## �🙏 Acknowledgments

- **GNCIPL Team** for project requirements and support

**Built with ❤️ by the Global Connect Team**

## Previous Contributors
https://github.com/rebel1321/GNCIPL_GLOBAL_CONNECT/tree/main
