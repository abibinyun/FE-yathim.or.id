export async function GET() {
  const siteUrl = 'https://yathim.or.id';
  
  // Static pages
  const staticPages = [
    { url: '', changefreq: 'daily', priority: '1.0' },
    { url: '/donasi', changefreq: 'daily', priority: '0.9' },
    { url: '/artikel', changefreq: 'daily', priority: '0.8' },
    { url: '/galeri', changefreq: 'weekly', priority: '0.7' },
    { url: '/tentang', changefreq: 'monthly', priority: '0.6' },
  ];

  // Fetch dynamic pages
  let campaigns: any[] = [];
  let articles: any[] = [];

  try {
    // Fetch campaigns
    const campaignsResponse = await fetch('https://laravel.yathim.or.id/api/campaign');
    if (campaignsResponse.ok) {
      const campaignsData = await campaignsResponse.json();
      const campaignsResult = campaignsData.data || campaignsData || [];
      campaigns = Array.isArray(campaignsResult) ? campaignsResult : [];
    }
  } catch (error) {
    console.error('Error fetching campaigns for sitemap:', error);
  }

  try {
    // Fetch articles
    const articlesResponse = await fetch('https://laravel.yathim.or.id/api/article');
    if (articlesResponse.ok) {
      const articlesData = await articlesResponse.json();
      const articlesResult = articlesData.data || articlesData || [];
      articles = Array.isArray(articlesResult) ? articlesResult : [];
    }
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error);
  }

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${siteUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('')}
  ${campaigns.map(campaign => `
  <url>
    <loc>${siteUrl}/donasi/${campaign.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${campaign.updated_at ? new Date(campaign.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('')}
  ${articles.map(article => `
  <url>
    <loc>${siteUrl}/artikel/${article.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <lastmod>${article.updated_at ? new Date(article.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
}
