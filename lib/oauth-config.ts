// OAuth configuration checker
export const hasGoogleOAuth = 
  process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true" &&
  typeof process.env.GOOGLE_CLIENT_ID === "string" &&
  process.env.GOOGLE_CLIENT_ID !== "your-google-client-id";

export const hasGitHubOAuth = 
  process.env.NEXT_PUBLIC_GITHUB_ENABLED === "true" &&
  typeof process.env.GITHUB_CLIENT_ID === "string" &&
  process.env.GITHUB_CLIENT_ID !== "your-github-client-id";
