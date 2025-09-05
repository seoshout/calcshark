import { discoverAllWebsiteRoutes } from '@/lib/route-discovery';

export async function GET() {
  const baseUrl = 'https://calcshark.com';
  
  try {
    // Discover all actual routes that exist on the website
    const discoveredRoutes = await discoverAllWebsiteRoutes();
    
    console.log(`[Sitemap] Discovered ${discoveredRoutes.length} routes`);
    
    // Convert discovered routes to sitemap format
    const allUrls = discoveredRoutes.map(route => ({
      url: route.url,
      lastmod: route.lastmod || new Date().toISOString(),
      changefreq: route.changefreq,
      priority: route.priority,
    }));

    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    ({ url, lastmod, changefreq, priority }) => `  <url>
    <loc>${baseUrl}${url}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, must-revalidate', // Cache for 1 hour
        'X-Sitemap-Generated': new Date().toISOString(),
        'X-Total-URLs': allUrls.length.toString(),
      },
    });
    
  } catch (error) {
    console.error('[Sitemap] Error generating sitemap:', error);
    
    // Return a basic sitemap as fallback
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new Response(fallbackSitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300, must-revalidate', // Shorter cache on error
        'X-Sitemap-Error': 'Fallback sitemap generated due to error',
      },
    });
  }
}