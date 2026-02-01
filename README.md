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

## Future Enhancements

### 🎮 Gamified Visualizations & Immersive Backgrounds

- **Dynamic Background System**: Context-aware animated backgrounds that change based on the learning module
  - Cyberpunk-themed environments for programming topics
  - Circuit board animations for hardware/OS concepts
  - Database schema visualizations for DBMS modules
  - Neural network patterns for AI/ML topics
- **3D Interactive Simulations**: Upgrade from 2D to 3D visualizations using Three.js or React Three Fiber
- **Achievement Animations**: Celebratory particle effects and visual rewards for completing milestones
- **Avatar System**: Customizable user avatars that level up and gain visual upgrades
- **Learning Environments**: Themed virtual spaces (coding dojo, tech lab, data center) that users can explore
- **Progress Visualization**: Interactive skill trees and knowledge graphs showing learning paths

### 💾 Enhanced Backend & Progress System

- **Production-Ready Database**: 
  - Migrate from SQLite to PostgreSQL/MySQL for scalability
  - Database connection pooling and optimization
  - Backup and disaster recovery systems
- **Real-Time Sync**: 
  - WebSocket integration for live progress updates across devices
  - Conflict resolution for simultaneous edits
  - Offline-first architecture with background sync
- **Analytics Dashboard**:
  - Detailed learning analytics and insights
  - Time spent tracking per topic/module
  - Strength/weakness identification
  - Personalized learning recommendations
- **Cloud Storage Integration**:
  - Store user projects and code in cloud storage (AWS S3/Azure Blob)
  - Version control for project submissions
  - Shareable project portfolios

### 🚀 Project Module Complete Setup

- **Full IDE Experience**:
  - Multi-file project support with file tree navigation
  - Integrated terminal for running commands
  - Live preview for web projects
  - Code collaboration features (pair programming)
- **Testing & Validation**:
  - Automated test suites for project submissions
  - Code quality analysis and linting
  - Performance benchmarking
  - Plagiarism detection
- **Project Templates**:
  - Starter templates for various project types
  - Boilerplate code with TODOs
  - Step-by-step guided projects
  - Advanced challenge projects
- **Mentor Integration**:
  - AI-powered code review and suggestions
  - Hint system for stuck students
  - Community code reviews from peers
  - Expert mentor feedback scheduling

### 🎨 UI/UX Enhancements

- **Dark/Light Theme Toggle**: Full theme customization with user preferences
- **Accessibility Improvements**:
  - WCAG 2.1 AA compliance
  - Screen reader optimization
  - Keyboard navigation enhancements
  - High contrast mode
- **Mobile Optimization**:
  - Responsive simulators for touch devices
  - Mobile-first code editor
  - Progressive Web App (PWA) support
  - Offline learning capabilities
- **Personalization**:
  - Customizable dashboard layouts
  - Widget-based interface
  - Preference-based content recommendations
  - Learning style adaptations (visual/auditory/kinesthetic)
- **Advanced Animations**:
  - Page transitions with Framer Motion
  - Microinteractions for better feedback
  - Loading states and skeleton screens
  - Smooth scroll animations and parallax effects
- **Notification System**:
  - In-app notifications for achievements
  - Email/push notifications for streaks and reminders
  - Daily learning challenges
  - Social features (leaderboards, friend challenges)

### 🔐 Additional Features

- **Multi-language Support**: Internationalization (i18n) for global accessibility
- **API Rate Limiting**: Protect backend endpoints from abuse
- **Advanced Security**: Two-factor authentication, session management, and audit logs
- **Content Management**: Admin panel for adding/editing courses and modules
- **Certification System**: Generate and verify completion certificates
- **Community Features**: Forums, Q&A sections, and study groups

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

