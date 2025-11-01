# Pawnderr Backend

Backend API for Pawnderr built with Node.js, Express, and PostgreSQL.

## Features

- 🔐 **Authentication & Authorization**: JWT-based auth with OTP verification
- 📱 **OTP Verification**: SMS via Twilio and email support
- 💳 **Payment Processing**: Razorpay integration for payments and refunds
- 📤 **File Upload**: AWS S3 integration for file storage
- 🗄️ **Database**: PostgreSQL with connection pooling
- 🔒 **Security**: Password hashing with bcrypt, JWT tokens

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT, bcrypt
- **Services**: Twilio (SMS), Razorpay (Payments), AWS S3 (Storage)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- Twilio account (for SMS)
- Razorpay account (for payments)
- AWS account with S3 (for file uploads)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Pawnderr_backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp ENV_VARIABLES.md .env
# Edit .env with your actual credentials
```

4. Set up database:
```bash
# Create your PostgreSQL database
createdb pawnderr_db

# Run migrations
npm run migrate
```

5. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:8000` (or the port specified in your `.env` file).

## Environment Variables

See [ENV_VARIABLES.md](ENV_VARIABLES.md) for detailed environment variable documentation.

Key variables needed:
- `PORT` - Server port
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `TWILIO_*` - Twilio credentials for SMS
- `RAZORPAY_*` - Razorpay credentials for payments
- `AWS_*` - AWS credentials for S3

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/verify-otp` - Verify OTP
- `POST /auth/login` - Login user

### Health Check
- `GET /health` - Server health check

## Project Structure

```
src/
├── app.js                 # Main application entry
├── db.js                  # Database connection
├── auth/                  # Authentication routes
│   └── auth.controller.js
├── controllers/           # Request controllers
│   └── user.controller.js
├── middleware/            # Express middleware
│   ├── auth.middleware.js
│   ├── errorHandler.js
│   └── logger.js
├── services/              # Business logic layer
│   ├── user.service.js
│   ├── otp.service.js
│   ├── payment.service.js
│   ├── fileUpload.service.js
│   └── index.js
└── utils/                 # Utility functions
    ├── ApiResponse.js
    └── otp.util.js
```

## Services

### User Service
Manage user accounts, registration, and profile operations.

### OTP Service
Send and verify OTPs via SMS (Twilio) and email.

### Payment Service
Handle payments, orders, and refunds using Razorpay.

### File Upload Service
Upload, delete, and manage files on AWS S3.

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run migrate` - Run database migrations

## Dependencies

Key dependencies:
- `express` - Web framework
- `pg` - PostgreSQL client
- `jsonwebtoken` - JWT authentication
- `bcrypt` - Password hashing
- `twilio` - SMS service
- `razorpay` - Payment gateway
- `aws-sdk` - AWS services

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Add your license here]

## Support

For issues and questions, please open an issue on GitHub.
