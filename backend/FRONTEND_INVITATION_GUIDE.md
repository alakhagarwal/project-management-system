# 🎯 Frontend Integration Guide - Invitation System

## ⚠️ IMPORTANT: Backend Issues Found

Before implementing the frontend, the backend has **critical issues** that need to be fixed:

### **Issue 1: SecurityConfig Syntax Error**
**File:** `SecurityConfig.java` (Line 67)  
**Current:**
```java
.requestMatchers("/auth/register", "/generate-token","/upload","/download/**,/org/accept-invite").permitAll()
```
**Problem:** Missing closing quote before `/org/accept-invite`

**Fix Required:**
```java
.requestMatchers("/auth/register", "/generate-token", "/upload", "/download/**", "/org/accept-invite").permitAll()
```

---

### **Issue 2: Controller Still Requires Authentication**
**File:** `OrganizationController.java`  
**Current:**
```java
@PostMapping("/accept-invite")
public ResponseEntity<?> acceptInvitation(
        @RequestParam String token,
        @AuthenticationPrincipal UserDetails userDetails  // ← This requires auth!
) {
    organizationService.acceptInvitation(token, userDetails.getUsername());
    Map<String, String> response = new HashMap<>();
    response.put("email", userDetails.getUsername());  // ← userDetails will be NULL!
    response.put("message", "Invitation accepted successfully");
    return ResponseEntity.ok(response);
}
```

**Problem:** `@AuthenticationPrincipal` will be `null` for unauthenticated requests

**Fix Required:**
```java
@PostMapping("/accept-invite")
public ResponseEntity<?> acceptInvitation(@RequestParam String token) {
    // No @AuthenticationPrincipal needed
    String userEmail = organizationService.acceptInvitation(token);
    
    Map<String, String> response = new HashMap<>();
    response.put("email", userEmail);
    response.put("message", "Invitation accepted successfully");
    
    return ResponseEntity.ok(response);
}
```

---

### **Issue 3: Service Method Needs to Return Email**
**File:** `OrganizationService.java`  
**Current:**
```java
@Transactional
public void acceptInvitation(String token, String username) {
    OrganizationMember invitation = organizationMemberRepository
            .findByInviteToken(token)
            .orElseThrow(() -> new InvalidRequestException("Invalid invitation token"));

    if (invitation.getInviteExpiresAt().isBefore(java.time.Instant.now())) {
        throw new InvalidRequestException("Invitation token has expired");
    }

    User user = userRepository.findByEmail(username)  // ← username will be NULL!
            .orElseThrow(() -> new InvalidRequestException("User not found"));

    // Check if already active
    if (invitation.getMemberStatus() == MemberStatus.ACTIVE) {
        throw new InvalidRequestException("Invitation already accepted");
    }

    // Activate membership
    invitation.setMemberStatus(MemberStatus.ACTIVE);
    invitation.setInviteToken(null);
    invitation.setInviteExpiresAt(null);

    organizationMemberRepository.save(invitation);
}
```

**Fix Required:**
```java
@Transactional
public String acceptInvitation(String token) {
    OrganizationMember invitation = organizationMemberRepository
            .findByInviteToken(token)
            .orElseThrow(() -> new InvalidRequestException("Invalid invitation token"));

    // Check expiration
    if (invitation.getInviteExpiresAt().isBefore(java.time.Instant.now())) {
        throw new InvalidRequestException("Invitation token has expired");
    }

    // Check if already accepted
    if (invitation.getMemberStatus() == MemberStatus.ACTIVE) {
        throw new InvalidRequestException("Invitation already accepted");
    }

    // Activate membership
    invitation.setMemberStatus(MemberStatus.ACTIVE);
    invitation.setInviteToken(null);
    invitation.setInviteExpiresAt(null);
    organizationMemberRepository.save(invitation);

    // Return user's email for frontend routing
    return invitation.getUser().getEmail();
}
```

---

## ✅ Once Backend is Fixed - Frontend Implementation

### **API Endpoint**

**Endpoint:** `POST /org/accept-invite?token={token}`  
**Authentication:** ❌ NOT REQUIRED  
**Method:** POST  
**Query Parameter:**
- `token` (String, required) - The invitation token from email link

**Success Response (200 OK):**
```json
{
    "email": "user@example.com",
    "message": "Invitation accepted successfully"
}
```

**Error Responses:**

| Status | Error Message | Meaning |
|--------|--------------|---------|
| 400 | "Invalid invitation token" | Token doesn't exist in database |
| 400 | "Invitation token has expired" | Token expired (7 days passed) |
| 400 | "Invitation already accepted" | User already accepted this invitation |

---

## 🎨 Frontend Flow Diagram

```
User clicks "Accept Invitation" in email
            ↓
Opens: yourapp.com/accept-invite?token=abc123...
            ↓
Frontend extracts token from URL
            ↓
Call API: POST /org/accept-invite?token=abc123
            ↓
            ↓ (NO AUTH HEADER NEEDED)
            ↓
    ┌───────────────┐
    │ API Response  │
    └───────────────┘
            ↓
    ┌───────────────┐
    │ email: "..."  │
    └───────────────┘
            ↓
    Check if user is logged in
            ↓
    ┌───────┴───────┐
    │               │
  YES              NO
    │               │
    ↓               ↓
Check email    Redirect to login
matches?       with email pre-filled
    │
┌───┴───┐
│       │
YES    NO
│       │
↓       ↓
Dashboard   Show message:
           "Please login with
           correct account"
```

---

## 💻 Implementation Examples

### **React/Next.js Example**

```javascript
// pages/accept-invite.jsx or app/accept-invite/page.jsx

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AcceptInvitePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('processing'); // processing, success, error
    const [message, setMessage] = useState('');
    const [invitedEmail, setInvitedEmail] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        
        if (!token) {
            setStatus('error');
            setMessage('Invalid invitation link - no token provided');
            return;
        }

        acceptInvitation(token);
    }, [searchParams]);

    const acceptInvitation = async (token) => {
        try {
            // Call API without authentication
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/org/accept-invite?token=${token}`,
                {
                    method: 'POST',
                    // NO Authorization header needed!
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to accept invitation');
            }

            const data = await response.json();
            const userEmail = data.email;
            setInvitedEmail(userEmail);

            // Invitation accepted successfully in backend!
            setStatus('success');
            setMessage('Invitation accepted! Redirecting...');

            // Now handle frontend routing
            setTimeout(() => handleRedirect(userEmail), 1500);

        } catch (error) {
            setStatus('error');
            setMessage(error.message);
        }
    };

    const handleRedirect = (invitedEmail) => {
        // Check if user is logged in
        const token = localStorage.getItem('authToken'); // or however you store it
        
        if (!token) {
            // User not logged in - redirect to login with email pre-filled
            router.push(`/login?email=${encodeURIComponent(invitedEmail)}&from=invite`);
            return;
        }

        // User is logged in - check if correct user
        const currentUserEmail = getCurrentUserEmail(); // Your function to get logged-in user's email
        
        if (currentUserEmail === invitedEmail) {
            // Correct user - redirect to dashboard
            router.push('/dashboard');
        } else {
            // Wrong user logged in
            setStatus('error');
            setMessage(`Please logout and login with ${invitedEmail} to access this organization`);
        }
    };

    const getCurrentUserEmail = () => {
        // Option 1: Decode JWT token
        const token = localStorage.getItem('authToken');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.sub; // or payload.email depending on your JWT structure
        }
        
        // Option 2: Get from stored user info
        const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
        return userInfo.email;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                {status === 'processing' && (
                    <>
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="text-center mt-4 text-gray-600">Processing invitation...</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="text-center">
                            <div className="text-6xl mb-4">✅</div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
                            <p className="text-gray-600">{message}</p>
                            {invitedEmail && (
                                <p className="text-sm text-gray-500 mt-2">Email: {invitedEmail}</p>
                            )}
                        </div>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="text-center">
                            <div className="text-6xl mb-4">❌</div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                            <p className="text-red-600 mb-4">{message}</p>
                            <button
                                onClick={() => router.push('/login')}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                            >
                                Go to Login
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
```

---

### **Vue.js Example**

```vue
<!-- pages/AcceptInvite.vue -->

<template>
    <div class="accept-invite-container">
        <!-- Processing State -->
        <div v-if="status === 'processing'" class="status-card">
            <div class="spinner"></div>
            <p>Processing invitation...</p>
        </div>

        <!-- Success State -->
        <div v-if="status === 'success'" class="status-card">
            <div class="icon">✅</div>
            <h2>Success!</h2>
            <p>{{ message }}</p>
            <p v-if="invitedEmail" class="email">Email: {{ invitedEmail }}</p>
        </div>

        <!-- Error State -->
        <div v-if="status === 'error'" class="status-card">
            <div class="icon">❌</div>
            <h2>Error</h2>
            <p class="error-message">{{ message }}</p>
            <button @click="$router.push('/login')">Go to Login</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AcceptInvite',
    data() {
        return {
            status: 'processing',
            message: '',
            invitedEmail: ''
        };
    },
    mounted() {
        const token = this.$route.query.token;
        
        if (!token) {
            this.status = 'error';
            this.message = 'Invalid invitation link - no token provided';
            return;
        }

        this.acceptInvitation(token);
    },
    methods: {
        async acceptInvitation(token) {
            try {
                // Call API without authentication
                const response = await fetch(
                    `${process.env.VUE_APP_API_URL}/org/accept-invite?token=${token}`,
                    {
                        method: 'POST',
                        // NO Authorization header needed!
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to accept invitation');
                }

                const data = await response.json();
                this.invitedEmail = data.email;

                // Invitation accepted successfully!
                this.status = 'success';
                this.message = 'Invitation accepted! Redirecting...';

                // Handle redirect after delay
                setTimeout(() => this.handleRedirect(this.invitedEmail), 1500);

            } catch (error) {
                this.status = 'error';
                this.message = error.message;
            }
        },

        handleRedirect(invitedEmail) {
            // Check if user is logged in
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                // Not logged in - redirect to login
                this.$router.push({
                    path: '/login',
                    query: { 
                        email: invitedEmail, 
                        from: 'invite' 
                    }
                });
                return;
            }

            // Check if correct user
            const currentUserEmail = this.getCurrentUserEmail();
            
            if (currentUserEmail === invitedEmail) {
                // Correct user - go to dashboard
                this.$router.push('/dashboard');
            } else {
                // Wrong user
                this.status = 'error';
                this.message = `Please logout and login with ${invitedEmail} to access this organization`;
            }
        },

        getCurrentUserEmail() {
            // Decode JWT or get from store
            const token = localStorage.getItem('authToken');
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.sub;
            }
            return null;
        }
    }
};
</script>

<style scoped>
.accept-invite-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f7fa;
}

.status-card {
    max-width: 400px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    text-align: center;
}

.spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #e5e7eb;
    border-top-color: #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.icon {
    font-size: 4rem;
    margin-bottom: 1rem;
}

.error-message {
    color: #dc2626;
}

button {
    margin-top: 1rem;
    padding: 0.5rem 1.5rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

button:hover {
    background: #5568d3;
}
</style>
```

---

### **Angular Example**

```typescript
// accept-invite.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-accept-invite',
  templateUrl: './accept-invite.component.html',
  styleUrls: ['./accept-invite.component.css']
})
export class AcceptInviteComponent implements OnInit {
  status: 'processing' | 'success' | 'error' = 'processing';
  message = '';
  invitedEmail = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];
    
    if (!token) {
      this.status = 'error';
      this.message = 'Invalid invitation link - no token provided';
      return;
    }

    this.acceptInvitation(token);
  }

  acceptInvitation(token: string): void {
    // Call API without authentication
    this.http.post<any>(
      `${environment.apiUrl}/org/accept-invite?token=${token}`,
      {},
      // NO Authorization header needed!
    ).subscribe({
      next: (response) => {
        this.invitedEmail = response.email;
        this.status = 'success';
        this.message = 'Invitation accepted! Redirecting...';

        setTimeout(() => this.handleRedirect(this.invitedEmail), 1500);
      },
      error: (error) => {
        this.status = 'error';
        this.message = error.error?.message || 'Failed to accept invitation';
      }
    });
  }

  handleRedirect(invitedEmail: string): void {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      // Not logged in
      this.router.navigate(['/login'], {
        queryParams: { email: invitedEmail, from: 'invite' }
      });
      return;
    }

    const currentUserEmail = this.getCurrentUserEmail();
    
    if (currentUserEmail === invitedEmail) {
      this.router.navigate(['/dashboard']);
    } else {
      this.status = 'error';
      this.message = `Please logout and login with ${invitedEmail}`;
    }
  }

  getCurrentUserEmail(): string | null {
    const token = localStorage.getItem('authToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    }
    return null;
  }
}
```

---

## 🔑 Key Points for Frontend Developer

### **1. No Authentication Required ✅**
- Do NOT send `Authorization` header
- Do NOT check if user is logged in before calling API
- API call is completely public

### **2. API Call Order**
1. **First:** Call `/org/accept-invite` (activates membership in database)
2. **Then:** Check user login status
3. **Finally:** Redirect based on login state

### **3. Token is in URL**
Extract from query parameter: `?token=abc123...`

### **4. Response Contains Email**
Use the returned email to:
- Pre-fill login form
- Verify correct user is logged in
- Show appropriate message

### **5. Error Handling**
Handle these specific errors:
- Invalid token (400)
- Expired token (400)
- Already accepted (400)

### **6. Login Page Enhancement**
When user arrives from invitation:
```javascript
// On login page
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');
const from = urlParams.get('from');

if (from === 'invite' && email) {
    // Pre-fill email field
    emailInput.value = email;
    
    // Show message
    showMessage(`Please login to access your organization invitation`);
}
```

---

## 🎯 Complete Flow Example

```javascript
// Complete workflow

async function handleInviteAcceptance() {
    // 1. Extract token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        showError('Invalid invitation link');
        return;
    }

    try {
        // 2. Accept invitation (NO AUTH NEEDED)
        const response = await fetch(
            `${API_URL}/org/accept-invite?token=${token}`,
            { method: 'POST' }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        const data = await response.json();
        const invitedEmail = data.email;

        // 3. Show success message
        showSuccess('Invitation accepted successfully!');

        // 4. Check authentication status
        const authToken = getAuthToken(); // Get from localStorage/cookies
        
        if (!authToken) {
            // User not logged in
            setTimeout(() => {
                redirectToLogin(invitedEmail);
            }, 1500);
            return;
        }

        // 5. User is logged in - verify email matches
        const currentEmail = getCurrentUserEmail();
        
        if (currentEmail === invitedEmail) {
            // Correct user - redirect to dashboard
            showSuccess('Redirecting to dashboard...');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1500);
        } else {
            // Wrong user logged in
            showError(
                `This invitation is for ${invitedEmail}. ` +
                `You are logged in as ${currentEmail}. ` +
                `Please logout and login with the correct account.`
            );
            
            // Optionally, provide logout button
            showLogoutButton();
        }

    } catch (error) {
        showError(error.message);
    }
}

function redirectToLogin(email) {
    window.location.href = `/login?email=${encodeURIComponent(email)}&from=invite`;
}
```

---

## 📱 Mobile Considerations

### **Deep Linking**
If you have a mobile app, handle deep links:
```
yourapp://accept-invite?token=abc123
```

### **Email Client Compatibility**
Test on:
- Gmail (Web, iOS, Android)
- Outlook (Web, Desktop)
- Apple Mail
- Mobile email clients

---

## 🧪 Testing Checklist

- [ ] User not logged in → accepts invite → redirects to login with email pre-filled
- [ ] User logged in (correct email) → accepts invite → redirects to dashboard
- [ ] User logged in (wrong email) → accepts invite → shows error message
- [ ] Expired token → shows appropriate error
- [ ] Invalid token → shows appropriate error
- [ ] Already accepted token → shows appropriate error
- [ ] Network error handling
- [ ] Mobile browser compatibility
- [ ] Email client link clicking

---

## 🔐 Security Notes

1. **Token is single-use** - Backend clears it after acceptance
2. **Token expires in 7 days** - Backend validates expiration
3. **HTTPS required** - Token in URL is encrypted in transit
4. **No token reuse** - Once accepted, can't be used again

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify backend is running and SecurityConfig is fixed
3. Test with curl first:
   ```bash
   curl -X POST "http://localhost:8080/org/accept-invite?token=YOUR_TOKEN"
   ```

---

## 🎉 Summary

**Super Simple Flow:**
1. User clicks email link → Opens `/accept-invite?token=abc123`
2. Frontend calls `POST /org/accept-invite?token=abc123` (no auth)
3. Backend activates membership, returns email
4. Frontend checks if logged in:
   - **Not logged in?** → Login page with email
   - **Logged in (same email)?** → Dashboard
   - **Logged in (different email)?** → Error message

**That's it! Clean, simple, and user-friendly.** 🚀
