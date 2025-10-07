# Remixly - AI Visual Studio Platform

A production-ready, AI-powered visual creation suite built with Next.js 15, featuring multiple photo and video editing capabilities powered by Gemini AI.

## Features

### AI-Powered Tools
- **AI Outfit Changer** - Transform clothing with realistic AI-generated outfits
- **Pose Generator** - Change body poses according to creative vision
- **Expression Editor** - Adjust facial expressions naturally
- **Angle & Perspective Shift** - Manipulate photo angles with AI depth estimation
- **Photo Restoration** - Restore old/blurry photos to high quality
- **Headshot Generator** - Create professional headshots for LinkedIn/CV
- **Photobooth AI** - Apply modern photobooth styles
- **Product Photo Studio** - Generate catalog-ready product shots
- **B-Roll Generator** - Create cinematic video clips
- **Background Remover** - Remove/replace backgrounds seamlessly
- **AI Image Enhancer** - Enhance resolution, detail, and clarity

### System Features
- User authentication with NextAuth (JWT)
- Credit-based system for AI operations
- Transaction history and credit management
- Payment integration with Midtrans
- Local image storage (no external dependencies)
- Responsive dashboard and admin panel
- Rate limiting and security middleware
- Dark/light mode support

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** MySQL with Prisma ORM
- **Authentication:** NextAuth with JWT
- **AI Integration:** Google Gemini 2.5 Flash Image
- **UI Components:** Tailwind CSS, shadcn/ui
- **Image Storage:** Local file system
- **Payment Gateway:** Midtrans
- **Security:** XSS protection, rate limiting, HTTPS enforcement

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL database
- Gemini API key
- Midtrans account (for payments)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd remixly
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

Edit \`.env\` with your credentials:

\`\`\`env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/remixly"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-random-secret-here"

# Gemini AI
GEMINI_API_KEY="your-gemini-api-key"

# Midtrans
MIDTRANS_CLIENT_KEY="your-client-key"
MIDTRANS_SERVER_KEY="your-server-key"
MIDTRANS_IS_PRODUCTION="false"
\`\`\`

4. Generate Prisma client and run migrations:
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

5. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
remixly/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── ai/              # AI processing endpoints
│   │   ├── jobs/            # Job history endpoints
│   │   ├── transactions/    # Transaction endpoints
│   │   └── payment/         # Payment endpoints
│   ├── auth/                # Auth pages (signin, register)
│   ├── dashboard/           # User dashboard
│   ├── studio/              # AI studio interface
│   ├── layout.js            # Root layout
│   ├── page.js              # Home page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── ImageUploader.jsx    # Image upload component
│   ├── Navbar.jsx           # Navigation bar
│   └── Providers.jsx        # Context providers
├── lib/                     # Utility libraries
│   ├── prisma.js            # Prisma client
│   ├── auth.js              # NextAuth config
│   ├── gemini.js            # Gemini AI integration
│   ├── cloudinary.js        # Cloudinary integration
│   ├── midtrans.js          # Midtrans payment
│   ├── credits.js           # Credit management
│   ├── ratelimit.js         # Rate limiting
│   └── utils.js             # Utility functions
├── prisma/
│   └── schema.prisma        # Database schema
├── middleware.js            # Next.js middleware
└── package.json             # Dependencies
\`\`\`

## API Documentation

### Authentication

#### POST /api/auth/register
Register a new user account.

**Request:**
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
\`\`\`

**Response:**
\`\`\`json
{
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "credits": 100
  }
}
\`\`\`

#### POST /api/auth/signin
Sign in with credentials (handled by NextAuth).

### AI Processing

#### POST /api/ai/process
Process an image with AI.

**Request (multipart/form-data):**
- \`image\`: File (required)
- \`jobType\`: String (required) - e.g., "outfit_changer", "pose_generator"
- \`parameters\`: JSON string (optional) - job-specific parameters

**Response:**
\`\`\`json
{
  "success": true,
  "job": {
    "id": "job-id",
    "status": "completed",
    "inputUrl": "https://...",
    "outputUrl": "https://...",
    "creditsCost": 10
  },
  "creditsRemaining": 90
}
\`\`\`

### Jobs & Transactions

#### GET /api/jobs
Get user's AI job history.

#### GET /api/transactions
Get user's credit transaction history.

### Payment

#### POST /api/payment/create
Create a payment transaction.

**Request:**
\`\`\`json
{
  "credits": 100,
  "amount": 50000
}
\`\`\`

## Credit Costs

| Feature | Credits |
|---------|---------|
| AI Outfit Changer | 10 |
| Pose Generator | 8 |
| Expression Editor | 8 |
| Angle & Perspective Shift | 8 |
| Photo Restoration | 12 |
| Headshot Generator | 10 |
| Photobooth AI | 8 |
| Product Photo Studio | 10 |
| B-Roll Generator | 15 |
| Background Remover | 5 |
| AI Image Enhancer | 10 |

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- XSS protection headers
- CSRF protection
- Input sanitization
- HTTPS enforcement (production)

## Deployment

### Environment Variables

Ensure all production environment variables are set:
- Set \`MIDTRANS_IS_PRODUCTION="true"\` for production
- Use production database URL
- Generate strong \`NEXTAUTH_SECRET\`
- Use production API keys

### Build and Deploy

\`\`\`bash
npm run build
npm start
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.
