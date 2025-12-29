# Bundle Analyzer Guide

## Overview
The bundle analyzer helps identify:
- **Unused JavaScript code** (dead code)
- **Large dependencies** that could be optimized
- **Duplicate code** across chunks
- **Opportunities for code splitting**

## How to Run

### Analyze Bundle
```bash
npm run analyze
```

This will:
1. Build your Next.js app using webpack (required for bundle analyzer)
2. Generate interactive HTML reports showing bundle composition
3. Reports are saved to `.next/analyze/` directory

**Note**: 
- Next.js 16 uses Turbopack by default, but the bundle analyzer requires webpack. The `--webpack` flag forces webpack usage for analysis purposes only. Your regular builds will still use Turbopack.
- The build may show an error at the end, but the bundle analysis reports are generated successfully before that point.

### View the Reports

After running `npm run analyze`, the reports are saved to:
- **Client bundles**: `.next/analyze/client.html`
- **Server bundles**: `.next/analyze/nodejs.html`
- **Edge bundles**: `.next/analyze/edge.html`

**To view the reports:**
1. Open the HTML files directly in your browser
2. Or check the terminal output for the exact file paths
3. The analyzer may also try to open them automatically

**File locations:**
```bash
# Client-side JavaScript (what users download)
open .next/analyze/client.html

# Server-side JavaScript
open .next/analyze/nodejs.html

# Edge runtime JavaScript
open .next/analyze/edge.html
```

## What to Look For

### 🔴 Red Flags (High Priority)

1. **Large node_modules packages**
   - Look for packages > 100KB
   - Check if entire libraries are imported when only parts are needed
   - Example: Importing entire `lodash` instead of specific functions

2. **Duplicate code**
   - Same code appearing in multiple chunks
   - Indicates missing code splitting or shared dependencies

3. **Unused code**
   - Large files that aren't imported anywhere
   - Dead code that can be removed

4. **Heavy third-party libraries**
   - Analytics scripts
   - UI libraries (antd, motion, etc.)
   - Chart libraries (recharts, lightweight-charts)

### 🟡 Yellow Flags (Medium Priority)

1. **Large component files**
   - Components > 50KB might benefit from code splitting
   - Consider lazy loading for below-the-fold components

2. **Multiple small chunks**
   - Too many small chunks can hurt performance
   - Consider combining related chunks

3. **Vendor chunks**
   - Check if vendor code is properly separated
   - Large vendor chunks should be cached separately

## Common Optimizations

### 1. Remove Unused Imports
```typescript
// Bad: Importing entire library
import _ from 'lodash';

// Good: Import only what you need
import debounce from 'lodash/debounce';
```

### 2. Use Dynamic Imports for Heavy Components
```typescript
// Instead of:
import HeavyChart from '@/components/HeavyChart';

// Use:
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <p>Loading...</p>,
});
```

### 3. Optimize Library Imports
```typescript
// Bad: Importing entire antd
import { Button, Table, Form } from 'antd';

// Good: Next.js optimizePackageImports handles this automatically
// But you can also use:
import Button from 'antd/es/button';
import Table from 'antd/es/table';
```

## Interpreting the Report

### Bundle Size Colors
- **Red**: Large files (> 100KB)
- **Yellow**: Medium files (50-100KB)
- **Green**: Small files (< 50KB)

### File Types
- **node_modules**: Third-party dependencies
- **pages**: Next.js pages (route-based code splitting)
- **components**: React components
- **utils**: Utility functions

### Chunk Analysis
- **Initial chunks**: Loaded on first page visit
- **Async chunks**: Loaded on demand (code splitting)
- **Shared chunks**: Code shared across multiple pages

## Next Steps After Analysis

1. **Identify large dependencies**
   - Check if alternatives exist
   - Consider lazy loading
   - Use tree-shaking friendly imports

2. **Remove unused code**
   - Delete unused imports
   - Remove unused components
   - Clean up dead code paths

3. **Optimize imports**
   - Use specific imports instead of barrel imports
   - Leverage Next.js `optimizePackageImports`

4. **Implement code splitting**
   - Lazy load admin pages
   - Lazy load heavy components
   - Split vendor code

## Example Output

After running `npm run analyze`, you'll see something like:

```
Route (pages)                              Size     First Load JS
┌ ○ /                                      5.2 kB         87.3 kB
├ ○ /404                                   2.1 kB         84.2 kB
├ ○ /admin                                 12.4 kB        94.5 kB
├ ○ /admin/p2p/disputes                    45.2 kB        127.3 kB
└ ○ /dashboard                             8.1 kB         90.2 kB
```

This shows:
- **Size**: Size of the page-specific code
- **First Load JS**: Total JavaScript loaded for that route (including shared code)

## Tips

1. **Run analysis regularly**: Check bundle size after adding new dependencies
2. **Compare before/after**: Run analysis before and after optimizations
3. **Focus on initial load**: Prioritize reducing "First Load JS" for main pages
4. **Check production builds**: Always analyze production builds, not development

## Troubleshooting

### Analyzer doesn't open automatically
- Check terminal output for URLs
- Manually open the URLs shown in terminal
- Reports are saved in `.next` directory

### Build fails with analyzer
- Make sure `@next/bundle-analyzer` is installed
- Check that `ANALYZE=true` is set correctly
- Try running `npm run build` first to ensure build works

### No unused code detected
- Bundle analyzer shows what's included, not what's unused
- Use ESLint with `@typescript-eslint/no-unused-vars` to detect unused imports
- Use tools like `depcheck` to find unused dependencies

