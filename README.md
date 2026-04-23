- Study Abroad Backend API

A backend system built for a study abroad platform where students can explore universities, apply to programs, and track their application journey.

This project is built using Node.js, Express, and MongoDB with JWT authentication and a simple recommendation system.

- Features

- Authentication


User registration
User login
JWT-based protected routes
Password hashing using bcrypt
🎓 University Discovery
Get all universities
Filter by country and field
Pagination support
Sorting support (name, tuition)


- Recommendation System

Suggest universities based on:
Preferred country
Budget
Field of study
Uses MongoDB aggregation pipeline


- Application System

Apply to programs
Prevent duplicate applications
Application status tracking:
Applied → Reviewed → Accepted / Rejected
Status history maintained


- Performance

Basic indexing on important fields
Optimized queries for filtering and search


- Testing

Basic API testing using Jest & Supertest


- Tech Stack

Node.js
Express.js
MongoDB + Mongoose
JWT (Authentication)
bcrypt (Password hashing)


Jest (Testing)

 Project Structure
backend/
│
├── models/
├── controllers/
├── routes/
├── middleware/
├── config/
├── tests/
├── app.js
└── server.js
 Setup Instructions
1. Clone the repository
git clone <your-repo-link>
cd backend
2. Install dependencies
npm install
3. Create .env file
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
4. Run the server
npm run dev

Server will run on:

http://localhost:5000
 API Endpoints
Auth Routes
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
University Routes
GET /api/universities
GET /api/universities?country=USA&field=CS&page=1&limit=10
Application Routes
POST /api/applications/apply
GET  /api/applications
PATCH /api/applications/:id/status
Recommendation
GET /api/recommendations
 Assumptions
IELTS score is optional for recommendation logic
Recommendation system is basic (rule + aggregation based)
Only backend APIs are focused (frontend not included in logic)
 Architecture Decisions
Used MVC pattern for simplicity
Kept controllers lightweight
Business logic separated from routes
MongoDB aggregation used for recommendation
JWT used for stateless authentication
 Testing

Run tests using:

npm test
 Future Improvements
Add Redis caching
Add rate limiting for security
Improve recommendation with AI/ML scoring
Add Docker support
Add email notifications for applications
 Author

Yash Chauhan
 Email: yashchauhan6660@gmail.com

 Phone: 9389507913
 Portfolio: https://portfolio-two-orpin-43.vercel.app/
 GitHub: https://github.com/yashchauhan66