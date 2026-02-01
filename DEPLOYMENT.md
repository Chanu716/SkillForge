# Netlify Deployment Guide for SkillForge

## ✅ Pre-Deployment Checklist

- [x] Build successful (`npm run build` ✓)
- [x] TypeScript errors resolved ✓
- [x] Netlify configuration created ✓
- [x] All changes committed and pushed to GitHub ✓

## 🚀 Deploy to Netlify

### Option 1: Deploy via Netlify Dashboard (Recommended)

1. **Go to Netlify**
   - Visit: https://app.netlify.com/
   - Sign in with your GitHub account

2. **Import Your Project**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select your repository: `Chanu716/SkillForge`
   - Branch: `master`

3. **Configure Build Settings**
   - **Base directory**: (leave empty)
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 20

4. **Environment Variables**
   Add these environment variables in Netlify dashboard:
   ```
   DATABASE_URL=file:./dev.db
   NEXTAUTH_URL=https://your-site-name.netlify.app
   NEXTAUTH_SECRET=your-secret-key-here
   
   # Optional OAuth (if enabled)
   NEXT_PUBLIC_GOOGLE_ENABLED=false
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   NEXT_PUBLIC_GITHUB_ENABLED=false
   GITHUB_ID=your-github-client-id
   GITHUB_SECRET=your-github-client-secret
   ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete (~2-3 minutes)

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize Netlify in your project
netlify init

# Deploy
netlify deploy --prod
```

## 📦 What's Included

- ✅ Complete authentication system (NextAuth.js)
- ✅ User progress persistence (Prisma + SQLite)
- ✅ Interactive DBMS, OS, Aptitude simulators
- ✅ Gamified UI with animations
- ✅ Optimized question containers
- ✅ Mobile-responsive design

## 🔧 Post-Deployment Steps

1. **Update NEXTAUTH_URL**
   - After deployment, update `NEXTAUTH_URL` to your Netlify URL
   - Example: `https://skillforge.netlify.app`

2. **Setup OAuth (Optional)**
   - If using Google/GitHub OAuth, update redirect URIs:
   - Google: `https://your-site.netlify.app/api/auth/callback/google`
   - GitHub: `https://your-site.netlify.app/api/auth/callback/github`

3. **Database Initialization**
   - The SQLite database will be created on first run
   - User data persists across sessions

4. **Test Features**
   - Sign up / Login
   - Complete a simulation
   - Check progress persistence

## 🎯 Live Site URL

After deployment, your site will be available at:
```
https://[your-site-name].netlify.app
```

## 📝 Notes

- **Build Time**: ~2-3 minutes
- **Database**: SQLite (file-based, persists in Netlify)
- **Edge Functions**: Not required (using standard Next.js API routes)
- **Serverless Functions**: Auto-configured via @netlify/plugin-nextjs

## 🐛 Troubleshooting

**Build fails?**
- Check environment variables are set correctly
- Ensure Node version is 20 in Netlify settings

**Database errors?**
- Check DATABASE_URL environment variable
- Ensure Prisma is configured correctly

**Authentication not working?**
- Verify NEXTAUTH_URL matches your Netlify domain
- Check NEXTAUTH_SECRET is set (generate with: `openssl rand -base64 32`)

**OAuth errors?**
- Ensure OAuth credentials are correct
- Verify callback URLs in Google/GitHub console match Netlify URL

## 📞 Support

For issues or questions, check:
- Netlify Deploy Logs
- Browser Console (F12)
- GitHub Issues

---

**Ready to Deploy! 🚀**
All code is production-ready and optimized.
