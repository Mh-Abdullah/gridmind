# 🚀 Quick Start Guide - Authentication

## Get Started in 2 Minutes

### 1. Start Your App
```bash
npm run dev
```
App runs on: `http://localhost:3000`

---

## 👨‍💼 Login as Admin

1. Go to `http://localhost:3000/login`
2. Use these credentials:
   - **Email:** `mh.abdulla.688@gmail.com`
   - **Password:** `1234`
3. Click **Login**
4. You'll see the **Admin Panel** link in the top right
5. Click it to access `/dashboard-admin`

**Admin Features:**
- View all registered users
- See user join dates and roles
- Manage users (coming soon)

---

## 👤 Create a New User Account

1. Go to `http://localhost:3000/register`
2. Fill in:
   - **Full Name:** Your name
   - **Email:** your@email.com
   - **Password:** min 4 characters
   - **Confirm Password:** repeat password
3. Click **Sign Up**
4. Redirected to login page
5. Login with your new account
6. Access your **User Dashboard** at `http://localhost:3000/dashboard`

**User Features:**
- Personal dashboard with welcome message
- View your account details
- See your role badge
- Logout button

---

## 🔗 Available URLs

| URL | Access | Purpose |
|-----|--------|---------|
| `/` | Public | Home page with login/signup links |
| `/login` | Public | Login form |
| `/register` | Public | Registration form |
| `/dashboard` | Authenticated | User dashboard |
| `/dashboard-admin` | Admin Only | Admin panel with user management |

---

## 🚫 Protected Routes

Trying to access protected routes without login?
- ✅ Auto redirects to `/login`
- ✅ Saves your intended location
- ✅ Redirects back after login

---

## 🔐 Security

✅ Passwords are **hashed** (not stored as plain text)  
✅ Tokens in **httpOnly cookies** (safe from JS attacks)  
✅ JWT tokens **auto-verify** on each request  
✅ **Role-based access** control on admin routes  

---

## 💡 Pro Tips

1. **Remember me?** 
   - Your token persists for 7 days
   - Browser close doesn't log you out (until token expires)

2. **Admin vs User?**
   - Admins see `/dashboard-admin` link
   - Users can only access `/dashboard`

3. **Logout?**
   - Token cleared from cookies
   - localStorage cleared
   - Auto redirected to login

4. **Test the System?**
   - Create multiple accounts
   - Try accessing `/dashboard-admin` as regular user (redirects to `/dashboard`)
   - Logout and login with different accounts

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid email or password" | Double-check credentials |
| Can't access dashboard | Make sure you're logged in |
| Can't see admin panel | Login as admin only |
| Token expired | Logout and login again |
| Database connection error | Check DATABASE_URL in .env |

---

## 📞 Need Help?

Check these files:
- [AUTHENTICATION_SETUP.md](AUTHENTICATION_SETUP.md) - Full technical details
- [lib/auth.ts](lib/auth.ts) - Auth functions
- [middleware.ts](middleware.ts) - Route protection
- [app/api/auth/](app/api/auth/) - API endpoints

Enjoy! 🎉
