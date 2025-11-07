# Members Only Club - Complete Documentation

## Table of Contents
1. [What is This Project?](#what-is-this-project)
2. [Technologies Used (ELI5)](#technologies-used-eli5)
3. [Project Structure](#project-structure)
4. [Setup Instructions](#setup-instructions)
5. [How Everything Works](#how-everything-works)
6. [Database Guide](#database-guide)
7. [API Endpoints](#api-endpoints)
8. [Troubleshooting](#troubleshooting)
9. [Starting From Scratch](#starting-from-scratch)

---

## What is This Project?

**Members Only Club** is a secret message board where:
- Anyone can sign up and read messages
- BUT only **club members** can see who wrote each message
- Non-members see messages from "Anonymous"
- There's a **secret passcode** to become a member
- **Admins** can delete messages

Think of it like a secret clubhouse where you need a password to know who's who!

---

## Technologies Used (ELI5)

### 🟢 Node.js
**What it is**: JavaScript that runs on your computer (not in a browser)
**Why we use it**: To build our server that handles requests

### 🚂 Express.js
**What it is**: A framework that makes building web servers easy
**Why we use it**: Instead of writing tons of code, Express gives us shortcuts
**Example**: `app.get('/hello')` creates a page at `/hello`

### 🐘 PostgreSQL
**What it is**: A database (like a super organized spreadsheet)
**Why we use it**: To save user accounts and messages permanently
**What it stores**: 
- Users table: usernames, passwords, membership status
- Messages table: titles, content, who wrote them

### 🔐 Passport.js
**What it is**: An authentication library (checks if passwords are correct)
**Why we use it**: Handles login/logout securely
**How it works**: 
1. You enter email + password
2. Passport checks if they match the database
3. If yes, you're logged in!

### 🔒 bcryptjs
**What it is**: A password scrambler
**Why we use it**: Never store passwords as plain text!
**Example**: 
- You type: `mypassword123`
- Database stores: `$2a$10$eUIJ.PDu0T...` (scrambled)
- Even if someone steals the database, they can't read passwords!

### 🍪 express-session
**What it is**: Remembers who you are between page visits
**Why we use it**: So you don't have to login every time you click something
**How it works**: Stores a cookie in your browser that says "this is user #5"

### 🎨 Vanilla JavaScript (Frontend)
**What it is**: Plain JavaScript, no React or Vue
**Why we use it**: Simpler for this project
**What it does**: 
- Sends login requests
- Displays messages
- Shows/hides buttons based on who you are

---

## Project Structure

```
members-only/
├── index.js                 # Main server file - EVERYTHING starts here
├── package.json             # List of all libraries we need
├── .env                     # Secret configuration (passwords, etc.)
├── .env.example             # Template for .env file
│
├── config/
│   └── passport.js          # Login configuration
│
├── db/
│   ├── pool.js              # Database connection setup
│   └── queries.js           # All database queries (SQL commands)
│
├── controllers/
│   ├── authController.js    # Handles signup, login, join club
│   └── messageController.js # Handles creating, reading, deleting messages
│
├── routes/
│   ├── authRoutes.js        # URLs for authentication (/sign-up, /log-in, etc.)
│   └── messageRoutes.js     # URLs for messages (/api/messages)
│
└── public/
    ├── index.html           # The webpage
    ├── script.js            # Frontend JavaScript
    └── style.css            # Makes it look pretty
```

---

## Setup Instructions

### Step 1: Install Prerequisites

**What you need:**
- Node.js (v20 or higher)
- PostgreSQL (database)

**Check if you have them:**
```bash
node --version    # Should show v20 or higher
psql --version    # Should show PostgreSQL version
```

**Don't have them?**
- Node.js: Download from https://nodejs.org
- PostgreSQL: Download from https://www.postgresql.org/download/

---

### Step 2: Create the Database

**Open your terminal and run:**
```bash
# Start PostgreSQL (if not running)
sudo systemctl start postgresql

# Login to PostgreSQL
psql -U postgres

# Create a database called "bee"
CREATE DATABASE bee;

# Connect to it
\c bee

# Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_member BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# Create the messages table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

# Exit PostgreSQL
\q
```

**What just happened?**
- Created a database named "bee"
- Made a "users" table to store accounts
- Made a "messages" table to store posts
- Set up relationships (messages belong to users)

---

### Step 3: Install Project Dependencies

**In your project folder, run:**
```bash
npm install
```

**What this does:**
- Reads `package.json`
- Downloads all the libraries we need (Express, Passport, etc.)
- Puts them in a `node_modules` folder

**You should see these installed:**
- express
- pg (PostgreSQL driver)
- passport
- passport-local
- express-session
- bcryptjs
- dotenv

---

### Step 4: Configure Environment Variables

**Copy the example file:**
```bash
cp .env.example .env
```

**Edit the `.env` file with your details:**
```bash
# Database connection
DB_USER=postgres          # Your PostgreSQL username
DB_HOST=localhost         # Usually localhost
DB_NAME=bee              # The database we created
DB_PASSWORD=yourpassword  # Your PostgreSQL password
DB_PORT=5432             # Default PostgreSQL port

# Session secret (make this random and long!)
SESSION_SECRET=your-super-secret-random-string-here

# Club passcode (the secret password to join the club)
CLUB_PASSCODE=SECRET123
```

**Important Notes:**
- **Never share your `.env` file** - it contains passwords!
- `SESSION_SECRET` should be a long random string (for security)
- `CLUB_PASSCODE` is what users need to type to become members

---

### Step 5: Start the Server

```bash
npm run dev
```

**You should see:**
```
Server running on http://localhost:3000
Database pool created successfully
```

**Open your browser and go to:**
```
http://localhost:3000
```

You should see the Members Only homepage!

---

## How Everything Works

### 🔄 The Request Flow

Let me explain what happens when you click "Sign Up":

1. **You fill out the form** (frontend - `index.html`)
   - First name, last name, email, username, password

2. **JavaScript sends the data** (`script.js`)
   ```javascript
   fetch('/api/auth/sign-up', {
       method: 'POST',
       body: JSON.stringify(formData)
   })
   ```

3. **Server receives the request** (`index.js`)
   - Express routes it to `authRoutes.js`

4. **Route sends it to controller** (`authRoutes.js`)
   ```javascript
   router.post('/sign-up', authController.postSignUp);
   ```

5. **Controller processes it** (`authController.js`)
   - Validates the data (are fields filled in?)
   - Checks if passwords match
   - Hashes the password with bcrypt
   - Saves to database

6. **Database stores the user** (`queries.js`)
   ```sql
   INSERT INTO users (first_name, last_name, email, username, password_hash)
   VALUES ($1, $2, $3, $4, $5)
   ```

7. **Response goes back to browser**
   - Success? → "Account created!"
   - Error? → "Email already exists"

---

### 🔐 Authentication Flow (Login)

**How Passport.js works:**

1. **You enter email + password**

2. **Passport finds user by email**
   ```javascript
   const user = await getUserByEmail(email);
   ```

3. **Compares passwords**
   ```javascript
   const match = await bcrypt.compare(password, user.password_hash);
   ```
   - `password` = what you typed
   - `user.password_hash` = scrambled password from database
   - bcrypt un-scrambles and checks if they match

4. **If match → Creates a session**
   - Passport saves your user ID in a cookie
   - Browser sends this cookie with every request
   - Server knows who you are!

5. **If no match → Login fails**

---

### 🎫 Membership System

**Why we have members vs non-members:**

The whole point is privacy! Here's how it works:

1. **Everyone can sign up** → You're a regular user
2. **You DON'T know the author of messages** → Shows "Anonymous"
3. **Someone tells you the secret passcode** → Maybe "SECRET123"
4. **You enter it on the "Join Club" page**
5. **Server checks if it matches** (`CLUB_PASSCODE` in `.env`)
6. **If correct → Database updated:**
   ```sql
   UPDATE users SET is_member = true WHERE id = your_id;
   ```
7. **Now you can see who wrote what!**

**In the database:**
- `is_member = false` → See "Anonymous"
- `is_member = true` → See "John Doe"

---

### 👑 Admin Powers

**Some users can delete messages:**

1. **When signing up, check "Make me an admin"**
   - This sets `is_admin = true` in database

2. **Admins see delete buttons on messages**
   ```javascript
   if (currentUser.is_admin) {
       // Show delete button
   }
   ```

3. **Clicking delete sends request:**
   ```javascript
   fetch(`/api/messages/${messageId}`, {
       method: 'DELETE'
   })
   ```

4. **Server checks if you're actually admin:**
   ```javascript
   if (!req.user.is_admin) {
       return res.status(403).json({ error: 'Not authorized' });
   }
   ```

5. **If yes, deletes from database:**
   ```sql
   DELETE FROM messages WHERE id = $1;
   ```

---

### 💬 Message Display Logic

**This is the clever part!**

When you load messages, the server does this:

```javascript
// Get messages with author info
const messages = await getAllMessages();

// Format based on membership
messages.forEach(msg => {
    if (req.user.is_member) {
        msg.author = `${msg.author_first} ${msg.author_last}`;
    } else {
        msg.author = "Anonymous";
    }
});
```

**So the SAME message looks different:**

**Non-member sees:**
```
Anonymous
"Hello everyone!"
2 hours ago
```

**Member sees:**
```
John Doe
"Hello everyone!"
2 hours ago
[Delete] ← Only if you're admin
```

---

## Database Guide

### Users Table

| Column | Type | Purpose |
|--------|------|---------|
| id | SERIAL | Unique user ID (auto-generated) |
| first_name | VARCHAR(100) | User's first name |
| last_name | VARCHAR(100) | User's last name |
| email | VARCHAR(255) | For login (must be unique) |
| username | VARCHAR(50) | Display name (must be unique) |
| password_hash | TEXT | Scrambled password (never plain text!) |
| is_member | BOOLEAN | Can they see authors? (default: false) |
| is_admin | BOOLEAN | Can they delete messages? (default: false) |
| created_at | TIMESTAMP | When they signed up |

### Messages Table

| Column | Type | Purpose |
|--------|------|---------|
| id | SERIAL | Unique message ID |
| title | VARCHAR(255) | Message subject |
| text | TEXT | Message content |
| timestamp | TIMESTAMP | When it was posted |
| user_id | INTEGER | Who wrote it (links to users.id) |

### Key Database Operations

**Check database contents:**
```bash
psql -U postgres -d bee

# View all users
SELECT id, username, email, is_member, is_admin FROM users;

# View all messages
SELECT m.id, m.title, m.text, u.username 
FROM messages m 
JOIN users u ON m.user_id = u.id;

# Exit
\q
```

**Clear all data (start fresh):**
```bash
# Option 1: Use our cleanup script
node clear-db.js

# Option 2: Manual SQL
psql -U postgres -d bee -c "DELETE FROM messages; DELETE FROM users;"
```

---

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/sign-up`
**What it does**: Creates a new user account

**Send this:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "securepassword123",
  "confirmPassword": "securepassword123",
  "isAdmin": false
}
```

**Get back:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

---

#### POST `/api/auth/log-in`
**What it does**: Logs you in

**Send this:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Get back:**
```json
{
  "message": "Logged in successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "is_member": false,
    "is_admin": false
  }
}
```

---

#### GET `/api/auth/current-user`
**What it does**: Gets info about logged-in user

**Get back:**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "is_member": true,
  "is_admin": false
}
```

---

#### POST `/api/auth/join-club`
**What it does**: Makes you a member (if passcode is correct)

**Send this:**
```json
{
  "passcode": "SECRET123"
}
```

**Get back:**
```json
{
  "message": "Welcome to the club! You can now see message authors."
}
```

---

### Message Endpoints

#### GET `/api/messages`
**What it does**: Gets all messages

**Get back:**
```json
[
  {
    "id": 1,
    "title": "Hello World",
    "text": "This is my first message!",
    "timestamp": "2025-11-07T10:30:00",
    "author": "John Doe",  // or "Anonymous" if you're not a member
    "user_id": 1
  }
]
```

---

#### POST `/api/messages`
**What it does**: Creates a new message (must be logged in)

**Send this:**
```json
{
  "title": "My Message",
  "text": "This is what I want to say!"
}
```

**Get back:**
```json
{
  "message": "Message created successfully",
  "messageId": 5
}
```

---

#### DELETE `/api/messages/:id`
**What it does**: Deletes a message (admin only)

**Example**: `DELETE /api/messages/5`

**Get back:**
```json
{
  "message": "Message deleted successfully"
}
```

---

## Troubleshooting

### Problem: "Cannot connect to database"

**Check these:**
1. Is PostgreSQL running?
   ```bash
   sudo systemctl status postgresql
   ```
   If not running: `sudo systemctl start postgresql`

2. Are your credentials correct in `.env`?
   - DB_USER
   - DB_PASSWORD
   - DB_NAME

3. Does the database exist?
   ```bash
   psql -U postgres -l | grep bee
   ```

---

### Problem: "Column does not exist"

**This means your database structure is wrong.**

**Fix it:**
```bash
# Check what columns you have
psql -U postgres -d bee -c "\d users"

# If columns are missing, you might need to drop and recreate
psql -U postgres -d bee -c "DROP TABLE IF EXISTS messages CASCADE;"
psql -U postgres -d bee -c "DROP TABLE IF EXISTS users CASCADE;"

# Then recreate them (see Step 2 above)
```

---

### Problem: "Illegal arguments: string, undefined" (Passport error)

**This means password comparison failed.**

**Common causes:**
1. Database has `password` column but code expects `password_hash`
2. Password wasn't hashed before saving

**Fix:**
```bash
# Rename column if needed
psql -U postgres -d bee -c "ALTER TABLE users RENAME COLUMN password TO password_hash;"
```

---

### Problem: "Session not working" (keeps logging out)

**Check:**
1. Is `SESSION_SECRET` set in `.env`?
2. Is `express-session` installed?
3. Are cookies enabled in browser?

**Debug:**
```javascript
// In index.js, add this to see session info
app.use((req, res, next) => {
    console.log('Session ID:', req.sessionID);
    console.log('User:', req.user);
    next();
});
```

---

### Problem: "Can't see message authors" (even as member)

**Check:**
1. Is your `is_member` actually true?
   ```bash
   psql -U postgres -d bee -c "SELECT username, is_member FROM users;"
   ```

2. Did you enter the correct passcode?
   - Check `.env` for `CLUB_PASSCODE`

3. Did the update work?
   - Look in browser console for errors
   - Check server logs

---

## Starting From Scratch

**If something is completely broken, start fresh:**

### Step 1: Delete Everything
```bash
# Remove node modules
rm -rf node_modules

# Remove database
psql -U postgres -c "DROP DATABASE IF EXISTS bee;"
```

### Step 2: Recreate Database
```bash
# Create database
psql -U postgres -c "CREATE DATABASE bee;"

# Run the table creation SQL (from Step 2 in setup)
psql -U postgres -d bee << EOF
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_member BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
EOF
```

### Step 3: Reinstall Dependencies
```bash
npm install
```

### Step 4: Fix .env
```bash
# Make sure .env has correct values
cat .env

# If missing, copy from example
cp .env.example .env
# Then edit .env with your details
```

### Step 5: Test Connection
```bash
# Run the server
npm run dev

# Should see: "Server running on http://localhost:3000"
```

### Step 6: Test in Browser
1. Go to `http://localhost:3000`
2. Try signing up
3. Try logging in
4. Try posting a message

**If ANY step fails, STOP and check the error message!**

---

## Testing the Full Flow

**Here's how to test everything works:**

### Test 1: Sign Up
1. Go to `http://localhost:3000`
2. Click "Sign Up"
3. Fill in all fields
4. Check "Make me an admin" (optional)
5. Click "Create Account"
6. Should see: "Account created! Please log in."

### Test 2: Login
1. Enter your email and password
2. Click "Log In"
3. Should see: "Welcome, [username]!"
4. Should see "Create Message" form

### Test 3: Post a Message
1. Fill in title and text
2. Click "Post Message"
3. Should appear in the messages list
4. Author should show as "Anonymous" (you're not a member yet)

### Test 4: Join Club
1. Scroll to "Join the Club" section
2. Enter the passcode (default: `SECRET123`)
3. Click "Join Club"
4. Should see: "Welcome to the club!"
5. Refresh page
6. Now you should see YOUR NAME on your message!

### Test 5: Admin Delete (if you checked admin)
1. Look at any message
2. Should see a red "Delete" button
3. Click it
4. Message should disappear

### Test 6: Create Another Account (Non-Member)
1. Log out
2. Sign up with different email
3. DON'T join the club
4. All messages should show "Anonymous"

---

## Quick Reference

### Start the server:
```bash
npm run dev
```

### Check database:
```bash
psql -U postgres -d bee -c "SELECT * FROM users;"
```

### Clear database:
```bash
node clear-db.js
```

### View server logs:
Just look at the terminal where `npm run dev` is running

### Stop the server:
Press `Ctrl + C` in the terminal

---

## Summary

**What you built:**
- A message board with authentication
- Secret membership system
- Admin controls
- Secure password storage

**Key concepts you learned:**
- MVC architecture (Models, Views, Controllers)
- RESTful APIs (GET, POST, DELETE)
- Authentication with sessions
- Database relationships (foreign keys)
- Password hashing for security
- Environment variables for config

**Next steps you could take:**
- Add profile pages
- Add message editing
- Add email verification
- Add password reset functionality
- Deploy to a hosting service (Heroku, Railway, etc.)

---

## Need Help?

**If you get stuck:**
1. Read the error message carefully
2. Check the Troubleshooting section above
3. Look at browser console (F12)
4. Look at server logs (terminal)
5. Check your `.env` file
6. Try "Starting From Scratch" section

**Remember**: Programming is 90% debugging! Don't worry if things don't work first try.

---

## File Checklist

**Before asking "why isn't it working?", check you have all these files:**

- [ ] `index.js` - Main server
- [ ] `package.json` - Dependencies list
- [ ] `.env` - Your configuration (NOT `.env.example`)
- [ ] `config/passport.js` - Login setup
- [ ] `db/pool.js` - Database connection
- [ ] `db/queries.js` - Database functions
- [ ] `controllers/authController.js` - Auth logic
- [ ] `controllers/messageController.js` - Message logic
- [ ] `routes/authRoutes.js` - Auth URLs
- [ ] `routes/messageRoutes.js` - Message URLs
- [ ] `public/index.html` - Webpage
- [ ] `public/script.js` - Frontend logic
- [ ] `public/style.css` - Styling

**And in PostgreSQL:**
- [ ] Database named "bee" exists
- [ ] "users" table exists with correct columns
- [ ] "messages" table exists with correct columns

---

**Congratulations! You now have a complete Members Only club application!** 🎉

If you followed all steps and something still doesn't work, re-read the error message and check the Troubleshooting section. Every error has a solution!
