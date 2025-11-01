# Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=8000

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/pawnderr_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Twilio (for SMS OTP)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Razorpay (for payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=pawnderr-uploads

# Environment
NODE_ENV=development
```

## Description of Variables

### Server Configuration
- **PORT**: The port number on which the server will run (default: 8000)

### Database
- **DATABASE_URL**: PostgreSQL connection string in the format: `postgresql://username:password@host:port/database`

### JWT Configuration
- **JWT_SECRET**: Secret key used to sign JWT tokens (use a strong random string in production)
- **JWT_EXPIRES_IN**: Token expiration time (e.g., '7d', '24h', '1h')

### Twilio (SMS OTP)
- **TWILIO_ACCOUNT_SID**: Your Twilio account SID from the Twilio console
- **TWILIO_AUTH_TOKEN**: Your Twilio authentication token
- **TWILIO_PHONE_NUMBER**: Your Twilio phone number (must be in E.164 format, e.g., +1234567890)

### Razorpay (Payments)
- **RAZORPAY_KEY_ID**: Your Razorpay API key ID
- **RAZORPAY_KEY_SECRET**: Your Razorpay API key secret

### AWS S3 (File Uploads)
- **AWS_ACCESS_KEY_ID**: Your AWS access key ID
- **AWS_SECRET_ACCESS_KEY**: Your AWS secret access key
- **AWS_REGION**: AWS region where your S3 bucket is located (e.g., 'us-east-1')
- **AWS_S3_BUCKET_NAME**: Name of your S3 bucket for file uploads

### Environment
- **NODE_ENV**: Application environment ('development', 'production', 'test')

## Setup Instructions

1. Copy this configuration into a `.env` file in the root directory
2. Replace all placeholder values with your actual credentials
3. Never commit the `.env` file to version control
4. Ensure `.env` is listed in your `.gitignore` file

