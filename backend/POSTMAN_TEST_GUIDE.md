# Postman Testing Guide for Accept Invitation

## Quick Setup

### 1. Create Test User (One Time)

If you don't have a test user yet:

```
POST http://localhost:8080/auth/register

Body:
{
    "email": "testinvite@gmail.com",
    "password": "Test@123",
    "firstName": "Test",
    "lastName": "User"
}
```

Response: User created

### 2. Get JWT Token for Test User

```
POST http://localhost:8080/generate-token

Body:
{
    "email": "testinvite@gmail.com",
    "password": "Test@123"
}
```

Response:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Save this token!** You'll use it in the accept-invite request.

---

## Testing Workflow

### Step 1: Send Invitation

**Request**:
```
POST http://localhost:8080/org/1/invite

Headers:
Authorization: Bearer <YOUR_ADMIN_JWT_TOKEN>
Content-Type: application/json

Body:
{
    "email": "testinvite@gmail.com",
    "role": "MEMBER"
}
```

**Response**: 
```
200 OK
"Invitation sent successfully"
```

**Check Console**: You should see:
```
✅ Invitation email sent to: testinvite@gmail.com
```

---

### Step 2: Get the Token from Database

Open your MySQL client and run:

```sql
SELECT id, invite_token, member_status, invite_expires_at 
FROM organization_member 
WHERE user_id = (SELECT id FROM user WHERE email = 'testinvite@gmail.com') 
AND org_id = 1;
```

**Example Output**:
```
┌──────┬────────────────────────────────────────┬────────────┬──────────────────────────┐
│ id   │ invite_token                           │ status     │ invite_expires_at        │
├──────┼────────────────────────────────────────┼────────────┼──────────────────────────┤
│ 5    │ 550e8400-e29b-41d4-a716-446655440000 │ INVITED    │ 2026-02-06 12:30:00      │
└──────┴────────────────────────────────────────┴────────────┴──────────────────────────┘
```

**Copy the invite_token value!**

---

### Step 3: Test Accept Invitation

**Request**:
```
POST http://localhost:8080/org/accept-invite?token=550e8400-e29b-41d4-a716-446655440000

Headers:
Authorization: Bearer <TEST_USER_JWT_TOKEN>
```

**Response**:
```
200 OK
"Invitation accepted"
```

---

### Step 4: Verify Database Changed

Run the same query again:

```sql
SELECT id, invite_token, member_status, invite_expires_at 
FROM organization_member 
WHERE user_id = (SELECT id FROM user WHERE email = 'testinvite@gmail.com') 
AND org_id = 1;
```

**Expected Output**:
```
┌──────┬────────────────┬────────────┬────────────────────┐
│ id   │ invite_token   │ status     │ invite_expires_at  │
├──────┼────────────────┼────────────┼────────────────────┤
│ 5    │ NULL           │ ACTIVE     │ NULL               │
└──────┴────────────────┴────────────┴────────────────────┘
```

✅ **Success!** Status changed to ACTIVE and token cleared!

---

## Error Test Cases

### Try Accepting Again (Should Fail)

Same request as Step 3:

```
POST http://localhost:8080/org/accept-invite?token=550e8400-e29b-41d4-a716-446655440000

Headers:
Authorization: Bearer <TEST_USER_JWT_TOKEN>
```

**Expected Response**:
```
400 Bad Request
{
    "message": "Invitation already accepted"
}
```

✅ **Correct!** Token is no longer valid.

---

### Try with Invalid Token

```
POST http://localhost:8080/org/accept-invite?token=invalid-random-token

Headers:
Authorization: Bearer <TEST_USER_JWT_TOKEN>
```

**Expected Response**:
```
400 Bad Request
{
    "message": "Invalid invitation token"
}
```

✅ **Correct!** Invalid tokens are rejected.

---

### Try Without Auth Header

```
POST http://localhost:8080/org/accept-invite?token=550e8400-e29b-41d4-a716-446655440000
```

**Expected Response**:
```
401 Unauthorized
```

✅ **Correct!** Requires authentication.

---

## Complete Test Data

Create this in your Postman collection for easy testing:

### Variables to Set

```
adminToken = <JWT from admin user>
testUserToken = <JWT from testinvite@gmail.com>
orgId = 1
inviteToken = <from database query>
```

### Test Collection

```
1️⃣ Register Test User
   POST /auth/register
   Body: {"email": "testinvite@gmail.com", "password": "Test@123", ...}

2️⃣ Get Test User Token
   POST /generate-token
   Body: {"email": "testinvite@gmail.com", "password": "Test@123"}
   Save response.token as {{testUserToken}}

3️⃣ Send Invitation
   POST /org/{{orgId}}/invite
   Auth: Bearer {{adminToken}}
   Body: {"email": "testinvite@gmail.com", "role": "MEMBER"}

4️⃣ Get Invite Token (Manual - Query DB)
   Run: SELECT invite_token FROM organization_member WHERE...
   Copy token to {{inviteToken}}

5️⃣ Accept Invitation
   POST /org/accept-invite?token={{inviteToken}}
   Auth: Bearer {{testUserToken}}

6️⃣ Verify (Manual - Query DB)
   Run: SELECT * FROM organization_member WHERE...
   Check: member_status = ACTIVE, invite_token = NULL
```

---

## Useful SQL Queries

### See all invitations

```sql
SELECT 
    om.id,
    u.email as invited_user,
    o.name as organization,
    om.organization_role,
    om.member_status,
    om.invite_expires_at,
    om.invite_token
FROM organization_member om
JOIN user u ON om.user_id = u.id
JOIN organization o ON om.org_id = o.id
WHERE om.member_status = 'INVITED'
ORDER BY om.invite_expires_at;
```

### See all active members

```sql
SELECT 
    om.id,
    u.email,
    o.name as organization,
    om.organization_role,
    om.member_status
FROM organization_member om
JOIN user u ON om.user_id = u.id
JOIN organization o ON om.org_id = o.id
WHERE om.member_status = 'ACTIVE'
ORDER BY o.name;
```

### Get specific invite token

```sql
SELECT invite_token 
FROM organization_member 
WHERE user_id = (SELECT id FROM user WHERE email = 'testinvite@gmail.com')
AND org_id = 1;
```

---

## Summary

✅ **Working Flow**:
1. Admin sends invitation → Email sent
2. Extract token from database
3. Invited user calls accept-invite endpoint
4. Member status changes to ACTIVE
5. Token is cleared and can't be reused

✅ **Test Now**: Follow the workflow above

✅ **Later with Frontend**: Same endpoint, frontend will just extract token from URL

