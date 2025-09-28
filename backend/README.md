# Global Connect Backend API

A comprehensive backend API for the Global Connect professional networking platform.

## Features

- **User Authentication**: Registration, login, logout with JWT tokens
- **Role-based Access**: Support for Users and Recruiters
- **Profile Management**: Complete profile creation and updates
- **Experience & Education**: Add, update, delete work experience and education
- **File Upload**: Profile picture upload with Cloudinary integration
- **Data Validation**: Comprehensive input validation and sanitization

## Tech Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Cloudinary** for image storage
- **Multer** for file uploads
- **bcryptjs** for password hashing

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your actual configuration values.

3. **Start the server:**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

#### Change Password
```http
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### User Profile Routes (`/api/users`)

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "bio": "Software Developer with 5 years experience",
  "skills": ["JavaScript", "React", "Node.js"],
  "location": "New York, NY",
  "company": "Tech Corp",
  "industry": "Technology",
  "website": "https://johndoe.com"
}
```

#### Upload Profile Picture
```http
POST /api/users/profile-picture
Authorization: Bearer <token>
Content-Type: multipart/form-data

profilePic: <image_file>
```

#### Add Experience
```http
POST /api/users/experience
Authorization: Bearer <token>
Content-Type: application/json

{
  "company": "Tech Corp",
  "role": "Senior Developer",
  "from": "2020-01-01",
  "to": "2023-12-31",
  "current": false,
  "description": "Led development of web applications"
}
```

#### Update Experience
```http
PUT /api/users/experience/:expId
Authorization: Bearer <token>
Content-Type: application/json

{
  "company": "Updated Company",
  "role": "Lead Developer",
  "current": true
}
```

#### Delete Experience
```http
DELETE /api/users/experience/:expId
Authorization: Bearer <token>
```

#### Add Education
```http
POST /api/users/education
Authorization: Bearer <token>
Content-Type: application/json

{
  "school": "University of Technology",
  "degree": "Bachelor of Computer Science",
  "from": "2016-09-01",
  "to": "2020-06-01",
  "description": "Focused on software engineering and algorithms"
}
```

#### Update Education
```http
PUT /api/users/education/:eduId
Authorization: Bearer <token>
Content-Type: application/json

{
  "school": "Updated University",
  "degree": "Master of Computer Science"
}
```

#### Delete Education
```http
DELETE /api/users/education/:eduId
Authorization: Bearer <token>
```

## User Schema

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: String (user/recruiter),
  bio: String,
  profilePic: String,
  experience: [{
    company: String,
    role: String,
    from: Date,
    to: Date,
    current: Boolean,
    description: String
  }],
  education: [{
    school: String,
    degree: String,
    from: Date,
    to: Date,
    current: Boolean,
    description: String
  }],
  skills: [String],
  connections: [ObjectId],
  connectionRequests: [{
    from: ObjectId,
    status: String,
    createdAt: Date
  }],
  savedJobs: [ObjectId],
  company: String,
  companySize: String,
  industry: String,
  website: String,
  location: String,
  isProfileComplete: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Validation error 1", "Validation error 2"]
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Environment Variables

Required environment variables:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_secret_key
```

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Authentication errors
- Database errors
- File upload errors
- 404 routes

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS protection
- File upload restrictions
- Rate limiting ready structure

## Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# The server will run on http://localhost:5000
```

## API Testing

You can test the API using tools like Postman, Insomnia, or curl. The server includes a health check endpoint:

```http
GET /api/health
```

This will return the server status and environment information.