# SkillForge

An immersive learning platform combining interactive simulations, hands-on projects, and gamified progress tracking for mastering Computer Science fundamentals.

## Features

- **Interactive Simulations**: Learn through visual, hands-on simulations for Aptitude, DBMS, and Operating Systems
- **Complete Authentication System**: 
  - Sign up and sign in with credentials (email/password)
  - Social login with Google and GitHub OAuth providers (optional)
  - User progress persistence across sessions
- **Gamified Progress Tracking**: 
  - XP and level system
  - Topic completion tracking
  - Auto-sync progress to database for authenticated users
- **Project-Based Learning**: Unlock and complete project levels by mastering related topics
- **Modern UI**: Sleek, responsive design with Tailwind CSS and Framer Motion animations

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Authentication**: NextAuth.js v5
- **Database**: Prisma 6 with SQLite
- **State Management**: Zustand with persist middleware
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Radix UI + shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm/bun

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd SkillForge
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32

# Optional: Google OAuth (set NEXT_PUBLIC_GOOGLE_ENABLED=true to enable)
NEXT_PUBLIC_GOOGLE_ENABLED=false
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Optional: GitHub OAuth (set NEXT_PUBLIC_GITHUB_ENABLED=true to enable)
NEXT_PUBLIC_GITHUB_ENABLED=false
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## OAuth Setup (Optional)

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env.local`
7. Set `NEXT_PUBLIC_GOOGLE_ENABLED=true`

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Homepage URL: `http://localhost:3000`
4. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
5. Copy Client ID and Client Secret to `.env.local`
6. Set `NEXT_PUBLIC_GITHUB_ENABLED=true`

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (auth, progress)
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── learn/             # Learning modules
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── providers/         # Client providers (Auth, Progress)
├── components/            # React components
│   ├── landing/           # Landing page components
│   ├── project-ide/       # Project workspace components
│   ├── simulation/        # Interactive simulators
│   └── ui/                # Reusable UI components
├── lib/                   # Utility functions
│   ├── prisma.ts          # Prisma client singleton
│   ├── progress.ts        # Progress save/load utilities
│   └── utils.ts           # General utilities
├── prisma/                # Database schema
├── public/                # Static assets
└── store/                 # Zustand state management
    └── gameStore.ts       # Global game state
```

## Key Features Explained

### Progress Persistence

- **Local Storage**: Progress is automatically saved to browser localStorage using Zustand persist
- **Database Sync**: Authenticated users have progress synced to the database
- **Smart Merging**: When loading from backend, the system merges local and remote progress, keeping the best of both (completed topics from either source)

### Authentication Flow

1. User signs up with email/password or social OAuth
2. Credentials are validated and password is hashed with bcryptjs
3. User is redirected to dashboard
4. Progress is automatically loaded and synced on login
5. All progress changes are auto-saved to both localStorage and database

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

