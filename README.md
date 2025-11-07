# Members Only

A members-only application with authentication and session management.

## Project Structure

```
members-only/
├── config/
│   └── passport.js         # Passport authentication configuration
├── controllers/
│   └── authController.js   # Authentication logic
├── db/
│   ├── pool.js            # PostgreSQL connection pool
│   ├── queries.js         # Database queries
│   └── setup.js           # Database setup script
├── public/
│   ├── index.html         # Frontend HTML
│   ├── script.js          # Frontend JavaScript
│   └── style.css          # Frontend styles
├── routes/
│   └── authRoutes.js      # Authentication routes
├── index.js               # Main application file
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials:

```
DB_HOST=localhost
DB_USER=your_database_user
DB_DATABASE=members_only
DB_PASSWORD=your_database_password
DB_PORT=5432
SESSION_SECRET=your_random_secret_here
```

### 3. Setup Database

Make sure PostgreSQL is running, then create the database:

```bash
psql -U postgres
CREATE DATABASE members_only;
\q
```

Run the setup script to create tables:

```bash
node db/setup.js
```

### 4. Start the Server

Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### Authentication Routes (prefix: `/api/auth`)

- **POST** `/api/auth/sign-up` - Register a new user
  - Body: `{ username, email, password }`
  
- **POST** `/api/auth/log-in` - Login
  - Body: `{ email, password }`
  
- **GET** `/api/auth/log-out` - Logout
  
- **GET** `/api/auth/current-user` - Get current logged-in user

## Features

- User registration with password hashing (bcrypt)
- User login/logout with session management
- Passport.js for authentication
- PostgreSQL database integration
- Responsive frontend

## Technologies Used

- **Backend**: Node.js, Express.js
- **Authentication**: Passport.js (Local Strategy)
- **Database**: PostgreSQL
- **Password Hashing**: bcryptjs
- **Session Management**: express-session
- **Frontend**: Vanilla JavaScript, HTML, CSS

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  membership_status VARCHAR(50) DEFAULT 'non-member',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
