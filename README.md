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

Edit the `.env` file with your actual values:

```bash
DB_HOST=localhost
DB_USER=your_postgres_user
DB_DATABASE=bee  # or your database name
DB_PASSWORD=your_database_password
DB_PORT=5432
SESSION_SECRET=your_random_secret_here
CLUB_PASSCODE=SECRET123  # Change this to your secret passcode
```

### 3. Setup Database

If you haven't already created your database, do so:

```bash
psql -U postgres
CREATE DATABASE your_database_name;
\q
```

Run the migration script to add required columns (if upgrading from simple schema):

```bash
psql -U postgres -d your_database_name -f migrate-db.sql
```

Or manually run the SQL from `migrate-db.sql` in your database client.

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
  - Body: `{ firstName, lastName, email, username, password, confirmPassword, isAdmin? }`
  - Validates password confirmation
  - Hashes password with bcrypt
  
- **POST** `/api/auth/log-in` - Login with email and password
  - Body: `{ email, password }`
  - Returns user object with session
  
- **GET** `/api/auth/log-out` - Logout current user
  
- **GET** `/api/auth/current-user` - Get current logged-in user details

- **POST** `/api/auth/join-club` - Join club with secret passcode
  - Body: `{ passcode }`
  - Updates user to member status

### Message Routes (prefix: `/api/messages`)

- **GET** `/api/messages` - Get all messages
  - Returns messages with author info only visible to members
  
- **GET** `/api/messages/:id` - Get single message by ID
  
- **POST** `/api/messages` - Create new message (authenticated users only)
  - Body: `{ title, text }`
  
- **DELETE** `/api/messages/:id` - Delete message (admin only)

## Features

✅ **User Authentication**
- Sign up with full name, email, username, and password
- Password confirmation validation
- Secure password hashing with bcrypt (10 salt rounds)
- Login/logout with Passport.js local strategy
- Session management with express-session

✅ **Membership System**
- Non-members can view messages but not see authors
- Secret passcode to join the club (become a member)
- Members can see message authors and timestamps
- Members can create new messages

✅ **Admin Features**
- Optional admin checkbox on sign-up form
- Admins can delete any message
- Delete button only visible to admins

✅ **Messages**
- Create messages with title and text
- View all messages on home page
- Messages show author info only to club members
- Timestamp on all messages
- Admin delete functionality

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
CREATE TABLE IF NOT EXISTS users (
  id              SERIAL PRIMARY KEY,
  username        VARCHAR(255) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  email           TEXT NOT NULL UNIQUE,
  is_member       BOOLEAN NOT NULL DEFAULT FALSE,
  is_admin        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Messages Table

```sql
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);
```

## How It Works

### 1. Sign Up
- Users register with full name, email, username, and password
- Password must match confirmation
- Optional admin checkbox (for testing/development)
- Passwords are hashed with bcrypt before storage
- New users are NOT automatically members

### 2. Login
- Users log in with email and password
- Passport.js handles authentication
- Session is created and maintained

### 3. Join the Club
- Logged-in users see a "Join Club" section if they're not members
- Enter the secret passcode (default: "SECRET123")
- Become a member to see message authors

### 4. View Messages
- **Non-members**: Can see all message titles and text, but authors show as "Anonymous"
- **Members**: Can see full author names and timestamps

### 5. Create Messages
- Only logged-in users can create messages
- Messages have a title and text content
- Automatically timestamped

### 6. Delete Messages (Admin Only)
- Admin users see delete buttons on all messages
- Confirmation required before deletion
- Only admins can perform this action

## Environment Variables

Make sure to set these in your `.env` file:

- `DB_HOST` - Database host (usually localhost)
- `DB_USER` - PostgreSQL username
- `DB_DATABASE` - Database name
- `DB_PASSWORD` - Database password
- `DB_PORT` - Database port (usually 5432)
- `SESSION_SECRET` - Random string for session encryption
- `CLUB_PASSCODE` - Secret code to join the club (default: "SECRET123")
