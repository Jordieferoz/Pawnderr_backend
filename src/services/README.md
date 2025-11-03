# Services Directory

This directory contains all service layer modules for the Pawnderr backend application.

## Services

### 1. `user.service.js`
User-related business logic and database operations.

**Exports:**
- `createUserService(userData)` - Create a new user
- `getAllUsersService()` - Get all users
- `getUserByIdService(userId)` - Get user by ID
- `updateUserService(userId, updateData)` - Update user details

**Usage:**
```javascript
import { createUserService, getAllUsersService } from '../services/user.service.js';

const user = await createUserService({ email, password, phone, name });
```

### 2. `otp.service.js`
OTP (One-Time Password) management for user verification via SMS and Email.

**Exports:**
- `sendOtpViaSms(phoneNumber, userId)` - Send OTP via SMS using Twilio
- `sendOtpViaEmail(email, userId)` - Send OTP via Email
- `verifyOtp(userId, otp)` - Verify OTP and mark user as verified

**Dependencies:**
- Twilio (for SMS)
- Requires Twilio credentials in `.env`

**Usage:**
```javascript
import { sendOtpViaSms, verifyOtp } from '../services/otp.service.js';

await sendOtpViaSms(phoneNumber, userId);
const result = await verifyOtp(userId, otp);
```

### 3. `payment.service.js`
Payment processing using Razorpay.

**Exports:**
- `createOrder(amount, currency, options)` - Create a Razorpay order
- `verifyPayment(orderId, paymentId, signature)` - Verify payment signature
- `getPaymentDetails(paymentId)` - Fetch payment details
- `refundPayment(paymentId, amount)` - Process refund

**Dependencies:**
- Razorpay SDK
- Requires Razorpay credentials in `.env`

**Usage:**
```javascript
import { createOrder, verifyPayment } from '../services/payment.service.js';

const order = await createOrder(1000, 'INR', { receipt: 'order_123' });
const verified = verifyPayment(orderId, paymentId, signature);
```

### 4. `fileUpload.service.js`
File upload and management using AWS S3.

**Exports:**
- `uploadToS3(fileBuffer, originalFileName, folder, contentType)` - Upload file to S3
- `deleteFromS3(key)` - Delete file from S3
- `getPresignedUploadUrl(fileName, folder, expiresIn)` - Get presigned URL for client-side upload
- `getPresignedDownloadUrl(key, expiresIn)` - Get presigned download URL

**Dependencies:**
- AWS SDK
- Requires AWS credentials and S3 bucket configuration in `.env`

**Usage:**
```javascript
import { uploadToS3, deleteFromS3 } from '../services/fileUpload.service.js';

const result = await uploadToS3(fileBuffer, 'image.jpg', 'profiles', 'image/jpeg');
await deleteFromS3(result.key);
```

### 5. `index.js`
Central export file for all services.

**Usage:**
```javascript
import { 
  createUserService, 
  sendOtpViaSms, 
  createOrder, 
  uploadToS3 
} from '../services/index.js';
```

## Environment Variables Required

See `ENV_VARIABLES.md` in the root directory for complete environment variable setup.

