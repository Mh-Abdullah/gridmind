# 🔐 Role-Based Authentication System - Complete Setup

## Overview
Your GridMind application now has a complete role-based authentication system with user registration, login, and admin management.

---

## ✅ What's Been Implemented

### 1. **Authentication Infrastructure**
- JWT token generation and verification ([lib/auth.ts](lib/auth.ts))
- Password hashing with bcryptjs
- Token stored in httpOnly cookies for security
- Environment variable configuration ([.env](.env))

### 2. **API Endpoints**
- **POST `/api/auth/register`** - User registration
- **POST `/api/auth/login`** - User login with JWT token generation
- **POST `/api/auth/logout`** - User logout and cookie clearing
- **GET `/api/admin/users`** - Fetch all users (admin only)

### 3. **Authentication Pages**
- **[/login](app/login/page.tsx)** - Login form with demo credentials
- **[/register](app/register/page.tsx)** - Registration form with validation
- **[/](app/page.tsx)** - Home page with login/signup links

### 4. **Protected Routes**
- **[/dashboard](app/dashboard/page.tsx)** - User dashboard (requires authentication)
- **[/dashboard-admin](app/dashboard-admin/page.tsx)** - Admin panel (requires admin role)
- Middleware ([middleware.ts](middleware.ts)) protects all routes

### 5. **Authentication Context**
- **[AuthProvider](lib/auth-context.tsx)** - React context for auth state management
- Global `useAuth()` hook for accessing user data and auth methods
- Automatic token persistence using localStorage

### 6. **Database (Convex)**
- Users stored in Convex database
- Role field supports: `user`, `admin`
- Real-time sync capabilities

---

## 🔑 Credentials

### Admin Account (Pre-created)
```
Email: mh.abdulla.688@gmail.com
Password: 1234
Role: Admin
```

### Test User Account (Pre-created)
```
Email: test@example.com
Password: test1234
Role: User
```

---

## 📁 File Structure

```
lib/
├── auth.ts                    # Auth utilities (hashing, tokens)
├── auth-context.tsx          # Auth state management
└── convex-server.ts          # Server-side Convex client

convex/
├── schema.ts                 # Convex database schema
├── users.ts                  # User management functions
└── spreadsheets.ts           # Spreadsheet functions

app/
├── login/page.tsx            # Login page
├── register/page.tsx         # Registration page
├── page.tsx                  # Home page
├── api/
│   └── auth/
│       ├── login/route.ts    # Login endpoint
│       ├── register/route.ts # Register endpoint
│       ├── logout/route.ts   # Logout endpoint
│       └── admin/
│           └── users/route.ts # Admin users list
└── dashboard/
    ├── page.tsx              # User dashboard
    └── dashboard-admin/page.tsx # Admin panel

middleware.ts                 # Route protection & redirects
```

---

## 🚀 How to Use

### 1. **Start Development Server**
```bash
npm run dev
```

### 2. **Login as Admin**
- Visit: `http://localhost:3000/login`
- Email: `mh.abdulla.688@gmail.com`
- Password: `1234`
- Access admin panel: `http://localhost:3000/dashboard-admin`

### 3. **Create New User Account**
- Visit: `http://localhost:3000/register`
- Fill in email, name, and password
- Login with your new account
- Access user dashboard: `http://localhost:3000/dashboard`

### 4. **Logout**
- Click "Log out" button in the dashboard

---

## 🔒 Security Features

✅ Passwords hashed with bcryptjs (10 rounds)  
✅ JWT tokens with 7-day expiration  
✅ HttpOnly cookies (CSRF protection)  
✅ Route middleware prevents unauthorized access  
✅ Admin routes check role permissions  
✅ Automatic redirect to login for unauthenticated users  

---

## 📚 Authentication Flow

```
User Registration
  ↓
Email & Password Validation
  ↓
Password Hashing (bcryptjs)
  ↓
User Created in Database
  ↓
Redirect to Login
  ↓
User Login
  ↓
Email & Password Verification
  ↓
JWT Token Generated
  ↓
Token Stored in HttpOnly Cookie
  ↓
Redirect to Dashboard
  ↓
Middleware Validates Token on Each Request
```

---

## 🔧 Environment Variables

Required in `.env`:
```
NEXT_PUBLIC_CONVEX_URL="your-convex-deployment-url"
JWT_SECRET="your-secret-key"
```

---

## 🎯 Next Steps

1. ✅ Authentication system complete
2. Next: Connect authentication to existing dashboard features
3. Next: Add user profile management
4. Next: Add email verification (optional)
5. Next: Add password reset (optional)

---

## 📝 Notes

- Admin dashboard displays all registered users
- User role defaults to "user" on registration
- Only admin can access `/dashboard-admin`
- Tokens persist across browser sessions
- Logout clears token from cookies and localStorage

Enjoy your secure authentication system! 🎉
