# TexVision AI - Deployment Guide

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Production Deployment**
```bash
vercel --prod
```

### Option 2: Netlify

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login to Netlify**
```bash
netlify login
```

3. **Deploy**
```bash
netlify deploy --prod
```

**Build Settings:**
- Build command: `npm run build`
- Publish directory: `dist`

### Option 3: GitHub Pages

1. **Install gh-pages**
```bash
npm install --save-dev gh-pages
```

2. **Add to package.json**
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/texvision-ai"
}
```

3. **Update vite.config.js**
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/texvision-ai/'
})
```

4. **Deploy**
```bash
npm run deploy
```

### Option 4: Docker

1. **Create Dockerfile**
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

2. **Create nginx.conf**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

3. **Build and Run**
```bash
docker build -t texvision-ai .
docker run -p 80:80 texvision-ai
```

### Option 5: AWS S3 + CloudFront

1. **Build the project**
```bash
npm run build
```

2. **Install AWS CLI**
```bash
npm install -g aws-cli
```

3. **Configure AWS**
```bash
aws configure
```

4. **Create S3 Bucket**
```bash
aws s3 mb s3://texvision-ai
```

5. **Upload Files**
```bash
aws s3 sync dist/ s3://texvision-ai --acl public-read
```

6. **Enable Static Website Hosting**
```bash
aws s3 website s3://texvision-ai --index-document index.html --error-document index.html
```

## 🔧 Environment Configuration

### Development
Create `.env.development`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
VITE_ENV=development
```

### Production
Create `.env.production`:
```env
VITE_API_BASE_URL=https://api.texvision.ai
VITE_SOCKET_URL=https://api.texvision.ai
VITE_ENV=production
```

## 📊 Performance Optimization

### 1. Code Splitting
Already configured with React Router lazy loading.

### 2. Image Optimization
- Use WebP format for images
- Implement lazy loading for images
- Use CDN for static assets

### 3. Bundle Analysis
```bash
npm install --save-dev rollup-plugin-visualizer
```

Add to `vite.config.js`:
```javascript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ]
})
```

### 4. Caching Strategy
Configure in `vercel.json` or `netlify.toml`:
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit `.env` files
- Use platform-specific environment variable management
- Rotate API keys regularly

### 2. HTTPS
- Always use HTTPS in production
- Configure SSL certificates
- Enable HSTS headers

### 3. Content Security Policy
Add to `index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               font-src 'self' https://fonts.gstatic.com;">
```

## 📱 Progressive Web App (PWA)

### 1. Install Vite PWA Plugin
```bash
npm install vite-plugin-pwa -D
```

### 2. Configure in vite.config.js
```javascript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'TexVision AI Surveillance',
        short_name: 'TexVision',
        description: 'AI-Based Surveillance for Textile Industries',
        theme_color: '#0f1729',
        icons: [
          {
            src: '/favicon.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ]
})
```

## 🔍 Monitoring & Analytics

### 1. Google Analytics
Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Error Tracking (Sentry)
```bash
npm install @sentry/react
```

Configure in `main.jsx`:
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.VITE_ENV,
});
```

## 🧪 Pre-Deployment Checklist

- [ ] Run production build locally
- [ ] Test all routes and features
- [ ] Check responsive design on all devices
- [ ] Verify all API endpoints
- [ ] Test authentication flow
- [ ] Check browser console for errors
- [ ] Validate all forms
- [ ] Test loading states
- [ ] Verify error handling
- [ ] Check accessibility
- [ ] Test performance (Lighthouse)
- [ ] Verify SEO meta tags
- [ ] Test on different browsers
- [ ] Check mobile responsiveness
- [ ] Verify all links work
- [ ] Test logout functionality
- [ ] Check data persistence
- [ ] Verify toast notifications
- [ ] Test modal interactions
- [ ] Check animation performance

## 📈 Post-Deployment

### 1. Monitor Performance
- Use Lighthouse for performance audits
- Monitor Core Web Vitals
- Track user interactions
- Monitor error rates

### 2. Continuous Integration
Set up GitHub Actions:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 🆘 Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Routing Issues
Ensure your hosting platform supports SPA routing:
- Vercel: Automatic
- Netlify: Add `_redirects` file
- Apache: Configure `.htaccess`
- Nginx: Configure `nginx.conf`

### Environment Variables Not Working
- Prefix with `VITE_`
- Restart dev server after changes
- Check platform-specific variable configuration

---

**TexVision AI** is now ready for deployment! 🚀
