# Frontend Integration Guide - Accept Invitation Feature

## Current Backend Status

✅ **Your backend is PRODUCTION READY!**

The `/org/accept-invite` endpoint is fully functional and doesn't need any changes for frontend integration.

---

## What Happens in the Flow

### 1. User Receives Email
```
From: your-email@gmail.com
To: invited-user@gmail.com
Subject: "John Doe invited you to join My Organization"

Email contains:
- Inviter name: "John Doe"
- Organization: "My Organization"
- Role: "MEMBER"
- Button: "Accept Invitation"
  └─ Links to: http://localhost:3000/accept-invite?token=abc-123-xyz
```

### 2. User Clicks "Accept Invitation"
```
Email button → Browser navigates to:
http://localhost:3000/accept-invite?token=abc-123-xyz
```

### 3. Frontend Extracts Token and Calls Backend
```javascript
// Frontend code (React/Vue/etc)
const token = new URLSearchParams(window.location.search).get('token');

fetch('http://localhost:8080/org/accept-invite?token=' + token, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('jwt_token')
  }
})
.then(response => response.json())
.then(data => {
  if (data) {
    console.log('Invitation accepted!');
    // Redirect to dashboard
  }
})
```

### 4. Backend Processes Acceptance
```
Database Update:
- member_status: INVITED → ACTIVE
- invite_token: cleared
- invite_expires_at: cleared
```

### 5. User is Now an Active Member
```
User can now:
✅ Access the organization
✅ See organization members
✅ Create/view projects
✅ Collaborate with team
```

---

## Implementation Steps (When You Have Frontend)

### Step 1: Create Accept Invite Page

**Location**: `src/pages/AcceptInvitePage.jsx` (or similar)

```javascript
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function AcceptInvitePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    acceptInvitation();
  }, [token]);

  const acceptInvitation = async () => {
    try {
      const jwtToken = localStorage.getItem('jwt_token');
      
      if (!jwtToken) {
        setError('Please log in first');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:8080/org/accept-invite?token=${token}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        setSuccess(true);
        setError(null);
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to accept invitation');
      }
    } catch (err) {
      setError('Error accepting invitation: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Processing your invitation...</div>;
  }

  if (error) {
    return (
      <div>
        <h2>❌ Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  if (success) {
    return (
      <div>
        <h2>✅ Success!</h2>
        <p>Your invitation has been accepted.</p>
        <p>Redirecting to dashboard...</p>
      </div>
    );
  }

  return null;
}

export default AcceptInvitePage;
```

### Step 2: Add Route in Your Router

```javascript
// src/App.jsx or src/router.jsx
import AcceptInvitePage from './pages/AcceptInvitePage';

const routes = [
  // ... other routes
  {
    path: '/accept-invite',
    element: <AcceptInvitePage />
  }
];
```

### Step 3: Update Backend FRONTEND_URL

Make sure your backend knows your frontend URL.

**In `application.properties`**:
```properties
app.frontend.url=http://localhost:3000
```

Or **environment variable**:
```
FRONTEND_URL=http://localhost:3000
```

When running production, change to your actual domain:
```properties
app.frontend.url=https://your-domain.com
```

### Step 4: Configure CORS (If Not Already Done)

Your `CorsConfig.java` should allow requests from your frontend:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins(
                        "http://localhost:3000",      // Local development
                        "http://localhost:5173",      // Vite dev server
                        "https://your-domain.com"     // Production
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true)
                    .maxAge(3600);
            }
        };
    }
}
```

---

## No Backend Changes Needed!

Your backend endpoint is ready to use. You just need:

1. ✅ Frontend route: `/accept-invite?token=xyz`
2. ✅ Extract token from URL
3. ✅ Make POST request to backend
4. ✅ Include JWT in Authorization header
5. ✅ Handle success/error response

**That's it!** The backend will:
- ✅ Validate the token
- ✅ Check if expired
- ✅ Verify user authentication
- ✅ Update database
- ✅ Return response

---

## Environment Variables Reference

### Development
```bash
# Backend (.env or environment variables)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:3000

# Frontend (.env)
REACT_APP_API_BASE_URL=http://localhost:8080
```

### Production
```bash
# Backend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=https://your-domain.com

# Frontend
REACT_APP_API_BASE_URL=https://api.your-domain.com
```

---

## API Endpoint Summary

### Accept Invitation Endpoint

**Endpoint**: `POST /org/accept-invite`

**Query Parameters**:
```
token: string (required)
Example: ?token=550e8400-e29b-41d4-a716-446655440000
```

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response** (200 OK):
```json
"Invitation accepted"
```

**Error Responses**:
```
400 Bad Request:
  - "Invalid invitation token"
  - "Invitation token has expired"
  - "Invitation already accepted"
  - "User not found"

401 Unauthorized:
  - Missing or invalid JWT token
```

---

## Testing Checklist Before Connecting Frontend

- [ ] Send invitation from Postman → Email received
- [ ] Extract token from email/database
- [ ] Accept invitation from Postman → Member status changes to ACTIVE
- [ ] Try accepting again → Gets error "already accepted"
- [ ] Try expired token → Gets error "token expired"
- [ ] Try invalid token → Gets error "invalid token"
- [ ] Check database → Status and token updated correctly
- [ ] CORS is configured → Frontend can call backend
- [ ] JWT tokens work → Both login and accept-invite endpoints use them

---

## Common Issues & Solutions

### Issue: CORS Error When Frontend Calls Backend

**Error Message**:
```
Access to XMLHttpRequest at 'http://localhost:8080/org/accept-invite...'
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution**: Update `CorsConfig.java` to include your frontend URL

### Issue: 401 Unauthorized When Calling Accept Invite

**Error Message**:
```
401 Unauthorized
```

**Solution**: 
- Make sure JWT token is included in Authorization header
- Check token is valid (not expired)
- Use logged-in user's token, not a different user's

### Issue: "Invalid invitation token"

**Possible Causes**:
1. Token doesn't exist in database
2. Token has typo or extra spaces
3. Already accepted (token was cleared)

**Solution**: 
- Get fresh token from database
- Make sure you're getting the right token for the right user
- Don't use old tokens that were already accepted

### Issue: Email Links to Wrong Frontend URL

**Problem**: Emails link to old frontend URL

**Solution**: Update `FRONTEND_URL` environment variable and restart backend

---

## Summary

✅ **Ready to integrate when you have frontend**

✅ **No backend code changes needed**

✅ **Just extract token and call POST /org/accept-invite**

✅ **Update FRONTEND_URL for email links**

✅ **Configure CORS for frontend origin**

✅ **Include JWT in Authorization header**

That's all you need to connect the frontend!

