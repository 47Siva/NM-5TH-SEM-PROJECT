# JWT Authentication System - Bug Fixes Report

## Bugs Identified and Fixed

### 1. **RefreshToken Model - Incorrect TTL Index** ❌ CRITICAL
**File:** `src/models/RefreshToken.js`

**Problem:**
```javascript
expiryDate: { type: Date, required: true, index: { expires: 0 } }
```
- The TTL index was set with `expires: 0`, which would cause MongoDB to delete documents immediately
- This syntax is incorrect for MongoDB TTL indexes
- Refresh tokens would be deleted as soon as they were created

**Fix:**
```javascript
expiryDate: { type: Date, required: true }

// Create index on expiryDate for efficient queries
refreshTokenSchema.index({ expiryDate: 1 });
```
- Removed the incorrect TTL index from the field definition
- Added a proper index for efficient queries on expiryDate
- Manual expiry checking is handled in the application logic (which is better for this use case)

**Impact:** HIGH - This bug would have prevented the refresh token mechanism from working entirely.

---

### 2. **Auth Controller - Redundant Crypto Module Imports** ⚠️ CODE QUALITY
**File:** `src/controllers/authController.js`

**Problem:**
```javascript
// At the top of file:
const crypto = require("crypto");

// Later in login function:
refreshToken = require("crypto").randomBytes(64).toString("hex"); // Line appears twice
```
- The crypto module was already imported at the top
- Using inline `require("crypto")` inside the login function was redundant
- This is inefficient and violates DRY (Don't Repeat Yourself) principle

**Fix:**
```javascript
// Use the already imported crypto module
refreshToken = crypto.randomBytes(64).toString("hex");
```

**Impact:** LOW - Functionally worked but was inefficient and poor code quality.

---

### 3. **Login Controller - No Check for Revoked Tokens** ⚠️ SECURITY
**File:** `src/controllers/authController.js`

**Problem:**
```javascript
let existingToken = await RefreshToken.findOne({ userId: user._id });
```
- When checking for existing refresh tokens during login, the code didn't filter by `revoked: false`
- This means if a user logged out (revoking their token) and then logged back in, they could potentially reuse a revoked token

**Fix:**
```javascript
let existingToken = await RefreshToken.findOne({ 
  userId: user._id,
  revoked: false  // Added this filter
});
```

**Impact:** MEDIUM - Security issue that could allow reuse of revoked tokens.

---

### 4. **Security Consideration - JWT Secret Strength**
**File:** `.env`

**Current:**
```
JWT_SECRET=mySuperSecretKey123!
```

**Recommendation:**
- Use a longer, more complex secret for production (at least 256 bits)
- Generate using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

**Status:** Information only - change when deploying to production.

---

## Testing Recommendations

1. **Test Refresh Token Creation:**
   - Register a new user
   - Login and verify refresh token is stored in database
   - Check that token has proper expiry date (7 days from now)

2. **Test Token Refresh:**
   - Login to get access and refresh tokens
   - Wait for access token to expire (15 minutes) or manually create an expired one
   - Use refresh endpoint with valid refresh token
   - Verify new access token is generated

3. **Test Token Reuse:**
   - Login with same user multiple times
   - Verify that valid refresh tokens are reused, not regenerated

4. **Test Expired Token Cleanup:**
   - Create a token with past expiry date
   - Try to use it in refresh endpoint
   - Verify it gets deleted from database

5. **Test Logout:**
   - Login and get tokens
   - Logout with refresh token
   - Verify token is marked as revoked
   - Try to use revoked token - should fail

## Summary

✅ **Fixed Critical Bugs:** 1
✅ **Fixed Security Issues:** 1
✅ **Fixed Code Quality Issues:** 1
📝 **Recommendations:** 1

All critical bugs have been resolved. The JWT refresh token mechanism should now work correctly and securely.

---

## Files Modified

1. `src/models/RefreshToken.js` - Fixed TTL index issue
2. `src/controllers/authController.js` - Fixed crypto import redundancy and revoked token check
3. `BUG_FIXES.md` - Created this documentation
