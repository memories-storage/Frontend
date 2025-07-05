# Netlify Deployment Guide

## Prerequisites
- Your backend server deployed and accessible
- Netlify account

## Environment Variables
Set these in your Netlify dashboard under Site settings > Environment variables:

```
REACT_APP_API_URL=https://your-backend-domain.com/api
```

Replace `your-backend-domain.com` with your actual backend domain.

## Build Settings
The `netlify.toml` file is already configured with:
- Build command: `npm run build`
- Publish directory: `build`
- Node version: 18

## Deployment Steps
1. Connect your repository to Netlify
2. Set the environment variables above
3. Deploy

## Files Created
- `public/_headers` - Security and caching headers
- `public/_redirects` - React Router support
- `netlify.toml` - Build configuration

## Troubleshooting
If deployment fails:
1. Check build logs in Netlify dashboard
2. Verify environment variables are set
3. Ensure backend is accessible from Netlify
4. Check that all dependencies are in package.json 