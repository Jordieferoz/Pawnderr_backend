# Utils Directory

This directory contains utility functions and helper classes used throughout the application.

## Utilities

### 1. `ApiResponse.js`
Standardized API response class for consistent response formatting.

**Exports:**
- `ApiResponse` class - Response wrapper with success, message, data, and statusCode

**Usage:**
```javascript
import { ApiResponse } from '../utils/ApiResponse.js';

// In a controller
res.status(201).json(new ApiResponse(true, "User created", user));
res.status(200).json(new ApiResponse(true, "Users fetched", users));

// Output format:
// {
//   "success": true,
//   "message": "User created",
//   "data": { ...user }
// }
```

### 2. `otp.util.js`
OTP (One-Time Password) utility functions.

**Exports:**
- `hashOtp(otp)` - Hash OTP before storing in database (synchronous)
- `compareOtp(otp, hashedOtp)` - Compare OTP with hashed OTP (asynchronous)
- `generateOtp()` - Generate a random 6-digit OTP

**Usage:**
```javascript
import { hashOtp, compareOtp, generateOtp } from '../utils/otp.util.js';

const otp = generateOtp(); // Returns "123456"
const hashed = hashOtp(otp); // Returns hashed version
const isValid = await compareOtp(userInputOtp, hashedOtp); // Returns true/false
```

**Security Notes:**
- Uses bcrypt for OTP hashing (salt rounds: 10)
- OTPs are time-sensitive and should be stored with expiration timestamps
- Always compare hashed OTPs, never plain text

