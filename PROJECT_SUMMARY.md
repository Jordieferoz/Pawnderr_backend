# Pawnderr Backend - Project Summary

## Environment Variables

All required environment variables are documented in `ENV_VARIABLES.md`. 
Create a `.env` file in the root directory with the following variables:

- **PORT**: Server port (default: 8000)
- **DATABASE_URL**: PostgreSQL connection string
- **JWT_SECRET**: JWT signing secret
- **JWT_EXPIRES_IN**: Token expiration (default: 7d)
- **TWILIO_ACCOUNT_SID**: Twilio account SID
- **TWILIO_AUTH_TOKEN**: Twilio auth token
- **TWILIO_PHONE_NUMBER**: Twilio phone number (E.164 format)
- **RAZORPAY_KEY_ID**: Razorpay API key ID
- **RAZORPAY_KEY_SECRET**: Razorpay API secret
- **AWS_ACCESS_KEY_ID**: AWS access key
- **AWS_SECRET_ACCESS_KEY**: AWS secret key
- **AWS_REGION**: AWS region (e.g., us-east-1)
- **AWS_S3_BUCKET_NAME**: S3 bucket name
- **NODE_ENV**: Environment (development/production)

## Services Created

### 1. User Service (`src/services/user.service.js`)
- Create, read, update users
- Password hashing with bcrypt
- User validation

### 2. OTP Service (`src/services/otp.service.js`)
- SMS via Twilio
- Email OTP (placeholder)
- Verify OTP and mark verified
- Expiration handling
- OTP hashing

### 3. Payment Service (`src/services/payment.service.js`)
- Razorpay order creation
- Signature verification
- Payment details
- Refunds

### 4. File Upload Service (`src/services/fileUpload.service.js`)
- S3 uploads with presigned URLs
- Delete from S3
- Unique file naming with UUID
- Public ACL

### 5. Service Index (`src/services/index.js`)
- Central export for all services

## Utilities Created

### 1. API Response (`src/utils/ApiResponse.js`)
- Standard response with success/message/data

### 2. OTP Utilities (`src/utils/otp.util.js`)
- Generate 6-digit OTPs
- Hash OTPs with bcrypt
- Compare OTPs

## Middleware

### Logger (`src/middleware/logger.js`)
- Log method/path/time
- Log status/time

## Updated Files

### Auth Controller (`src/auth/auth.controller.js`)
- Integrates OTP via SMS/Email
- Uses OTP service for verification

## Project Structure

```
src/
├── app.js
├── db.js
├── auth/
│   └── auth.controller.js
├── controllers/
│   └── user.controller.js
├── middleware/
│   ├── auth.middleware.js
│   ├── errorHandler.js
│   └── logger.js
├── services/
│   ├── index.js
│   ├── user.service.js
│   ├── otp.service.js
│   ├── payment.service.js
│   ├── fileUpload.service.js
│   └── README.md
└── utils/
    ├── ApiResponse.js
    ├── otp.util.js
    └── README.md
```

## Next Steps

1. Create `.env` with your credentials
2. Set up PostgreSQL database
3. Run migrations to create required tables
4. Install dependencies: `npm install`
5. Start the server: `npm run dev`

## Dependencies

All required packages are already in `package.json`:
- express, cors, dotenv
- bcrypt, jsonwebtoken
- pg (PostgreSQL)
- twilio, razorpay, aws-sdk
- socket.io, uuid

