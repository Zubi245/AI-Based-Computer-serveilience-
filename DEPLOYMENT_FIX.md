# 🔧 Deployment 404 Error - Complete Fix Guide

## Problem
Getting "404 Not Found" errors after deploying your React SPA (Single Page Application) because the hosting server doesn't understand client-side routing.

---

## ✅ Solutions by Platform

### 1. **Vercel (Recommended)**

**File Created:** `vercel.json`

This file tells Vercel to redirect all routes to `index.html`.

**Steps:**
1. Push the updated code to GitHub
2. Vercel will automatically detect `vercel.json`
3. Redeploy (automatic if connected to GitHub)

**Manual Deploy:**
```bash
npm install -g vercel
vercel --prod
```

---

### 2. **Netlify**

**File Created:** `netlify.toml` and `public/_redirects`

**Steps:**
1. Push the updated code to GitHub
2. Netlify will automatically use these configs
3. Redeploy

**Manual Deploy:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

---

### 3. **GitHub Pages**

**Update `vite.config.js`:**

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/AI-Based-Computer-serveilience-/', // Your repo name
})
```

**Add to `package.json`:**
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

**Install gh-pages:**
```bash
npm install --save-dev gh-pages
```

**Deploy:**
```bash
npm run deploy
```

**Enable GitHub Pages:**
1. Go to repository Settings
2. Pages section
3. Source: gh-pages branch
4. Save

---

### 4. **Apache Server**

**File Created:** `public/.htaccess`

This file is automatically copied to your build folder.

**Manual Setup:**
1. Upload your `dist` folder to server
2. Ensure `.htaccess` is in the root
3. Make sure `mod_rewrite` is enabled

---

### 5. **Nginx Server**

**Create/Update:** `/etc/nginx/sites-available/your-site`

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/your-app/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Restart Nginx:**
```bash
sudo systemctl restart nginx
```

---

### 6. **Docker + Nginx**

**Create:** `nginx.conf`

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Update Dockerfile:**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🚀 Quick Fix Steps

### Step 1: Rebuild Your Project
```bash
npm run build
```

### Step 2: Test Locally
```bash
npm run preview
```

### Step 3: Push to GitHub
```bash
git add .
git commit -m "Fix: Add routing configuration for deployment"
git push origin main
```

### Step 4: Redeploy
Your hosting platform will automatically redeploy with the new configuration.

---

## 🔍 Verify the Fix

### Test These URLs After Deployment:
1. `https://your-domain.com/` ✅ Should work
2. `https://your-domain.com/dashboard` ✅ Should work
3. `https://your-domain.com/live-monitoring` ✅ Should work
4. `https://your-domain.com/alerts` ✅ Should work
5. Refresh any page ✅ Should not show 404

---

## 🐛 Still Getting 404?

### Check 1: Build Output
```bash
npm run build
ls -la dist/
```

Make sure `dist/index.html` exists.

### Check 2: Base URL in vite.config.js
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/', // Should be '/' for custom domains
})
```

### Check 3: Router Configuration
In `src/App.jsx`, make sure you're using `BrowserRouter`:
```javascript
import { BrowserRouter } from 'react-router-dom';
// NOT HashRouter
```

### Check 4: Deployment Logs
Check your hosting platform's deployment logs for errors.

---

## 📱 Platform-Specific Checks

### Vercel
1. Go to your project dashboard
2. Check "Deployments" tab
3. Look for build errors
4. Verify `vercel.json` is detected

### Netlify
1. Go to "Deploys" tab
2. Check deploy log
3. Verify `netlify.toml` is detected
4. Check "Redirects" in site settings

### GitHub Pages
1. Check Actions tab for workflow status
2. Verify gh-pages branch exists
3. Check Pages settings

---

## 🎯 Common Mistakes

### ❌ Wrong Base Path
```javascript
// Wrong for custom domain
base: '/my-app/'

// Correct for custom domain
base: '/'
```

### ❌ Using HashRouter
```javascript
// Wrong - causes # in URLs
import { HashRouter } from 'react-router-dom';

// Correct
import { BrowserRouter } from 'react-router-dom';
```

### ❌ Missing Redirect Config
Make sure you have the appropriate config file for your platform.

---

## ✅ Success Checklist

- [ ] Configuration file added for your platform
- [ ] Project rebuilt (`npm run build`)
- [ ] Changes pushed to GitHub
- [ ] Platform redeployed
- [ ] All routes tested
- [ ] Page refresh works on all routes
- [ ] No 404 errors in console

---

## 🆘 Emergency Fix

If nothing works, use **HashRouter** as a temporary solution:

**In `src/App.jsx`:**
```javascript
import { HashRouter } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      {/* Your routes */}
    </HashRouter>
  );
}
```

**Note:** This adds `#` to URLs (e.g., `domain.com/#/dashboard`) but works everywhere without configuration.

---

## 📞 Need More Help?

### Check Deployment Logs
Most issues show up in deployment logs. Check:
- Build logs
- Deploy logs
- Runtime logs

### Test Locally First
```bash
npm run build
npm run preview
```

If it works locally but not in production, it's a hosting configuration issue.

---

## 🎉 After Fix

Once fixed, your app should:
- ✅ Load on all routes
- ✅ Handle page refreshes
- ✅ Work with browser back/forward
- ✅ Support direct URL access
- ✅ No 404 errors

---

**Your deployment should now work perfectly!** 🚀
