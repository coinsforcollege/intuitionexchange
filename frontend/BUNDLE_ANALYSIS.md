# Bundle Analysis Report

## Summary
**Total Bundle Size: 4.21 MB**

## Largest Chunks (Top 10)

1. **`1555a449-a0edb30ce794c94c.js`** - 542.97 KB ⚠️ **LARGEST**
2. **`8986-e2a42fa066db6d8c.js`** - 359.59 KB ⚠️
3. **`pages/_app-5719643d05abd1e0.js`** - 271.2 KB ⚠️
4. **`framework-80372d2d5239b37d.js`** - 185.51 KB
5. **`721-92d30cb93b4994c1.js`** - 176.38 KB
6. **`6c7e26a8-774cc068acd27d1d.js`** - 138.23 KB
7. **`9490-4e2bf4a7451d4715.js`** - 133.8 KB
8. **`main-b27feb734afc498f.js`** - 126.6 KB
9. **`3414-b1098e72b3a54d01.js`** - 119.36 KB
10. **`9407-766e243c6b8f948e.js`** - 98.05 KB

## Key Findings

### 1. Large Vendor Chunks (542KB + 359KB = ~900KB)
The two largest chunks (`1555a449` and `8986`) are likely vendor chunks containing:
- **antd** (Ant Design) - imported in 125+ files
- **motion** (Framer Motion) - imported in 50+ files
- **socket.io-client** - imported in ExchangeContext
- **lightweight-charts** - chart library
- **recharts** - another chart library
- **@stripe/stripe-js** - Stripe SDK
- **@veriff/js-sdk** - KYC verification SDK

### 2. _app.tsx Bundle (271KB)
The `pages/_app` chunk is large because it includes:
- All context providers (5 nested providers)
- Theme configuration
- Global styles
- All code that runs on every page

### 3. Framework Chunk (185KB)
Next.js framework code - this is expected and normal.

## Potential Unused Code Indicators

### Libraries That May Have Unused Imports:

1. **recharts** (66KB+)
   - Check if both `recharts` and `lightweight-charts` are needed
   - Consider using only one chart library

2. **socket.io-client** (likely in large chunks)
   - Only used in ExchangeContext
   - Could be lazy loaded if not needed on all pages

3. **@veriff/js-sdk** (KYC SDK)
   - Only needed on onboarding pages
   - Should be lazy loaded

4. **@stripe/stripe-js** (Stripe SDK)
   - Only needed on payment pages
   - Should be lazy loaded

5. **country-state-city** (likely in chunks)
   - Check if entire library is imported or just needed parts

## Optimization Opportunities (Without Visual Changes)

### 1. Lazy Load Context Providers
Currently all 5 context providers load on every page. Consider:
- Lazy load `ExchangeProvider` (contains socket.io) - only needed on trading pages
- Lazy load `SidebarProvider` - only needed on dashboard pages

### 2. Lazy Load Heavy Libraries
- **socket.io-client**: Only load when ExchangeContext is needed
- **@veriff/js-sdk**: Only load on onboarding/verification pages
- **@stripe/stripe-js**: Only load on payment/deposit pages
- **lightweight-charts**: Only load on pages with charts
- **recharts**: Only load on pages with charts

### 3. Code Splitting for Admin Pages
Admin pages are already code-split, but could be further optimized:
- Lazy load admin components
- Lazy load heavy admin libraries

### 4. Optimize antd Imports
While `optimizePackageImports` is configured, verify it's working:
- Check if tree-shaking is removing unused antd components
- Consider more granular imports if needed

### 5. Check for Duplicate Dependencies
- Both `recharts` and `lightweight-charts` - consider using only one
- Verify no duplicate versions of same library

## How to Investigate Further

### In the Bundle Analyzer (client.html):

1. **Click on the largest chunk** (`1555a449`)
   - See what packages are inside
   - Identify which libraries are taking the most space

2. **Search for specific packages**:
   - Search for "antd" - see total size
   - Search for "motion" - see total size
   - Search for "socket.io" - see total size
   - Search for "stripe" - see total size
   - Search for "veriff" - see total size

3. **Check for duplicates**:
   - Look for same package appearing in multiple chunks
   - This indicates missing code splitting

4. **Identify unused code**:
   - Large files that aren't imported anywhere
   - Entire libraries when only parts are needed

## Recommended Actions

### High Priority (Biggest Impact):
1. ✅ **Lazy load socket.io-client** - Only needed on trading pages
2. ✅ **Lazy load @veriff/js-sdk** - Only needed on onboarding
3. ✅ **Lazy load @stripe/stripe-js** - Only needed on payment pages
4. ✅ **Lazy load ExchangeProvider** - Contains socket.io

### Medium Priority:
5. **Review chart libraries** - Use only one (recharts OR lightweight-charts)
6. **Lazy load chart components** - Only load when charts are visible
7. **Optimize context providers** - Consider splitting or lazy loading

### Low Priority:
8. **Review country-state-city usage** - Ensure only needed parts are imported
9. **Check for unused antd components** - Verify tree-shaking is working

## Next Steps

1. Open `client.html` in the bundle analyzer
2. Click on the largest chunks to see what's inside
3. Search for specific packages to see their total size
4. Identify which libraries can be lazy loaded
5. Implement lazy loading for heavy libraries
6. Re-run analyzer to verify improvements

## Expected Improvements

After optimizations:
- **Initial bundle**: Should reduce from 4.21MB to ~2-3MB
- **First Load JS**: Should reduce significantly for main pages
- **Code splitting**: Better separation of vendor code
- **Lazy loading**: Heavy libraries only load when needed

