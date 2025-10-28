export async function GET() {
  const siteUrl = "https://yathim.or.id";
  const API_URL = "https://sys.yathim.or.id/api";

  const staticPages = [
    { url: "", changefreq: "daily", priority: "1.0" },
    { url: "/donasi", changefreq: "daily", priority: "0.9" },
    { url: "/artikel", changefreq: "daily", priority: "0.8" },
    { url: "/galeri", changefreq: "weekly", priority: "0.7" },
    { url: "/tentang", changefreq: "monthly", priority: "0.6" },
  ];

  let allCampaigns: any[] = [];
  let allArticles: any[] = [];

  const fetchAllPages = async (
    baseUrl: string,
    dataKey = "data"
  ): Promise<any[]> => {
    const allData: any[] = [];
    let currentPage = 1;
    let hasMorePages = true;

    console.log(`🔄 Starting to fetch all pages from ${baseUrl}`);

    while (hasMorePages) {
      try {
        const url = `${baseUrl}?page=${currentPage}&per_page=50`;
        console.log(`📄 Fetching page ${currentPage}: ${url}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "User-Agent": "Mozilla/5.0 (compatible; AstroSitemap/1.0)",
            "Cache-Control": "no-cache",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.error(
            `❌ HTTP ${response.status} for page ${currentPage}: ${response.statusText}`
          );
          break;
        }

        const responseData = await response.json();
        console.log(`✅ Page ${currentPage} fetched successfully`);

        let pageData = [];
        if (responseData.success && responseData.data) {
          if (responseData.data.data && Array.isArray(responseData.data.data)) {
            pageData = responseData.data.data;
            const pagination = responseData.data;
            hasMorePages = currentPage < (pagination.last_page || 1);

            console.log(
              `📊 Page ${currentPage}: ${pageData.length} items, Last page: ${pagination.last_page}`
            );
          } else if (Array.isArray(responseData.data)) {
            pageData = responseData.data;
            hasMorePages = false;
          }
        } else if (Array.isArray(responseData)) {
          pageData = responseData;
          hasMorePages = false;
        }

        const validItems = pageData.filter(
          (item: any) =>
            item &&
            typeof item === "object" &&
            item.slug &&
            typeof item.slug === "string"
        );

        allData.push(...validItems);
        console.log(`📈 Total collected so far: ${allData.length} items`);
        if (pageData.length === 0) {
          console.log(`🔚 No data on page ${currentPage}, stopping`);
          break;
        }

        currentPage++;

        if (currentPage > 100) {
          console.warn("⚠️ Safety break: stopping at page 100");
          break;
        }

        if (hasMorePages) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } catch (error: any) {
        console.error(`❌ Error fetching page ${currentPage}:`, error.message);

        if (error.name === "AbortError") {
          console.error("⏰ Request timed out");
        }

        if (currentPage === 1) {
          console.log("🔄 Retrying first page after delay...");
          await new Promise((resolve) => setTimeout(resolve, 2000));
          continue;
        } else {
          break;
        }
      }
    }

    console.log(
      `✨ Completed fetching ${baseUrl}: ${allData.length} total items`
    );
    return allData;
  };

  try {
    console.log("🎯 Starting campaigns fetch...");
    allCampaigns = await fetchAllPages(`${API_URL}/campaign`);

    console.log(`🎯 Final campaigns count: ${allCampaigns.length}`);

    if (allCampaigns.length > 0) {
      console.log("📋 Sample campaign:", {
        slug: allCampaigns[0].slug,
        title: allCampaigns[0].title || allCampaigns[0].name,
        id: allCampaigns[0].id,
      });
    }
  } catch (error) {
    console.error("💥 Campaigns fetch failed:", error);
    allCampaigns = [];
  }

  try {
    console.log("📝 Starting articles fetch...");
    allArticles = await fetchAllPages(`${API_URL}/article`);

    console.log(`📝 Final articles count: ${allArticles.length}`);

    if (allArticles.length > 0) {
      console.log("📋 Sample article:", {
        slug: allArticles[0].slug,
        title: allArticles[0].title || allArticles[0].name,
        id: allArticles[0].id,
      });
    }
  } catch (error) {
    console.error("💥 Articles fetch failed:", error);
    allArticles = [];
  }

  const currentDate = new Date().toISOString().split("T")[0];

  const generateUrl = (
    loc: string,
    changefreq: string,
    priority: string,
    lastmod?: string
  ) => {
    return `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <lastmod>${lastmod || currentDate}</lastmod>
  </url>`;
  };

  const staticUrls = staticPages
    .map((page) =>
      generateUrl(`${siteUrl}${page.url}`, page.changefreq, page.priority)
    )
    .join("\n");

  const campaignUrls = allCampaigns
    .map((campaign) => {
      const slug = encodeURIComponent(campaign.slug);
      const lastmod = campaign.updated_at
        ? new Date(campaign.updated_at).toISOString().split("T")[0]
        : currentDate;
      return generateUrl(`${siteUrl}/donasi/${slug}`, "weekly", "0.8", lastmod);
    })
    .join("\n");

  const articleUrls = allArticles
    .map((article) => {
      const slug = encodeURIComponent(article.slug);
      const lastmod = article.updated_at
        ? new Date(article.updated_at).toISOString().split("T")[0]
        : currentDate;
      return generateUrl(
        `${siteUrl}/artikel/${slug}`,
        "monthly",
        "0.7",
        lastmod
      );
    })
    .join("\n");

  const allUrls = [staticUrls, campaignUrls, articleUrls]
    .filter(Boolean)
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allUrls}
</urlset>`;

  const totalUrls =
    staticPages.length + allCampaigns.length + allArticles.length;
  console.log(`\n🗺️ SITEMAP GENERATION COMPLETE:`);
  console.log(`   📄 Static pages: ${staticPages.length}`);
  console.log(`   🎯 Campaigns: ${allCampaigns.length}`);
  console.log(`   📝 Articles: ${allArticles.length}`);
  console.log(`   🌐 Total URLs: ${totalUrls}`);

  if (allCampaigns.length === 0) {
    console.warn("\n⚠️ WARNING: No campaigns found!");
  }
  if (allArticles.length === 0) {
    console.warn("\n⚠️ WARNING: No articles found!");
  }

  if (totalUrls > 50000) {
    console.warn(
      "\n⚠️ WARNING: Sitemap has more than 50,000 URLs. Consider splitting into multiple sitemaps."
    );
  }

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "X-Robots-Tag": "noindex",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
