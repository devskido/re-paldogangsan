# K-Mall Aggregator Deployment Guide

## Prerequisites

1. GitHub account
2. Vercel account (free tier)
3. All development tasks completed

## Deployment Steps

### 1. Prepare the Repository

```bash
# Build the static site locally to test
npm run build

# Generate all data files
npm run generate-json
npm run generate-regional
npm run build-index

# Commit all changes
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `out`
   - Install Command: `npm install`

### 3. Environment Variables

In Vercel project settings, add:

- `NEXT_PUBLIC_SITE_URL`: Your Vercel URL
- `NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH`: Your Cloudflare Images account hash
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID (optional, for uploads)
- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token (optional, for uploads)

### 4. Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Visit your deployed site

## Zero-Cost Optimization

### Static Export
- Configured in `next.config.js` with `output: 'export'`
- No server-side rendering costs
- All pages pre-rendered at build time

### Image Optimization
- Images served through Cloudflare Images CDN
- Automatic image resizing with variants (thumbnail, small, medium, large)
- External images loaded directly from source
- Local images automatically optimized through Cloudflare

### Data Updates
- Run scrapers locally
- Commit JSON files to GitHub
- Vercel auto-deploys on push

### Caching Strategy
- Static assets cached for 1 year
- JSON data cached for 1 hour
- HTML pages cached for 10 minutes

## Performance Checklist

- [ ] Run `npm run build` without errors
- [ ] All TypeScript checks pass
- [ ] Images load from CDN
- [ ] Search works with Korean text
- [ ] Map interactions are smooth
- [ ] Mobile responsive design works

## Monitoring

1. **Vercel Analytics** (free tier)
   - Page views
   - Web vitals
   - Error tracking

2. **Lighthouse Scores**
   - Performance: >90
   - Accessibility: >95
   - Best Practices: >95
   - SEO: >95

## Maintenance

### Update Products
```bash
# Run locally
npm run pipeline:full

# This will:
# 1. Scrape all malls
# 2. Generate JSON files
# 3. Build search index
# 4. Commit and push changes
# 5. Trigger Vercel deployment
```

### Add New Mall
1. Create scraper in `/scrapers/malls/`
2. Add to scraper list
3. Run pipeline
4. Deploy automatically

## Troubleshooting

### Build Fails
- Check TypeScript errors: `npx tsc --noEmit`
- Verify all imports are correct
- Ensure data files exist

### Images Not Loading
- Verify Cloudflare account hash in `.env.production`
- Check if Cloudflare Images is enabled on your account
- Ensure image IDs are correctly formatted
- Test with direct Cloudflare URLs: `https://imagedelivery.net/[hash]/[image-id]/public`

### Search Not Working
- Verify Fuse.js is included in bundle
- Check Korean text processing
- Test with sample queries

## Cost Summary

- **Vercel**: Free (static site)
- **Cloudflare Images**: 
  - $5/month for 100,000 images delivered
  - $1/month per 100,000 images stored
  - Free tier: 0 (requires paid plan)
- **Domain**: Optional (~$10/year)
- **Total**: ~$6-16/month depending on usage

### Alternative Free Option
If you want to stay completely free, keep external image URLs as-is and only optimize local assets through Vercel's built-in optimization.

## Next Steps

1. Set up custom domain (optional)
2. Add Google Analytics
3. Submit sitemap to search engines
4. Monitor performance metrics