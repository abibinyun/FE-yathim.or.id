import React, { useState, useEffect } from "react";

// Tipe data artikel
interface Article {
  id: number;
  title: string;
  slug: string;
  image: string | null;
  description: string;
  category_id: number;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
}

interface ArticleListProps {
  allArticles: Article[];
  categories: Category[];
  currentPage: number;
  totalPages?: number;
  prevUrl?: string | null;
  nextUrl?: string | null;
}

const ArticleList: React.FC<ArticleListProps> = ({
  allArticles,
  categories,
  currentPage,
  totalPages,
  prevUrl,
  nextUrl,
}) => {
  const PAGE_SIZE = 6;
  const STORAGE_URL = "https://sys.yathim.or.id/storage";

  // State tampilan
  const [displayedArticles, setDisplayedArticles] = useState<Article[]>([]);
  const [remainingArticles, setRemainingArticles] = useState<Article[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [isFiltered, setIsFiltered] = useState(false);

  // Inisialisasi data per halaman
  useEffect(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const initial = allArticles.slice(startIndex, endIndex);
    const remaining = allArticles.slice(endIndex);

    setDisplayedArticles(initial);
    setRemainingArticles(remaining);
    setIsFiltered(false);
  }, [allArticles, currentPage]);

  // Terapkan filter kategori & urutan
  const applyFilters = () => {
    let filtered = [...allArticles];

    if (filterCategory) {
      filtered = filtered.filter(
        (a) => a.category_id.toString() === filterCategory
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setDisplayedArticles(filtered.slice(0, PAGE_SIZE));
    setRemainingArticles(filtered.slice(PAGE_SIZE));
    setIsFiltered(true);
  };

  // Reset filter
  const resetFilters = () => {
    setFilterCategory("");
    setSortOrder("newest");
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    setDisplayedArticles(allArticles.slice(startIndex, endIndex));
    setRemainingArticles(allArticles.slice(endIndex));
    setIsFiltered(false);
  };

  // Load more / navigasi ke halaman berikut
  const loadMore = () => {
    if (isFiltered) {
      const nextBatch = remainingArticles.slice(0, PAGE_SIZE);
      const newRemaining = remainingArticles.slice(PAGE_SIZE);
      setDisplayedArticles((prev) => [...prev, ...nextBatch]);
      setRemainingArticles(newRemaining);
    } else {
      if (nextUrl) {
        window.location.href = nextUrl;
      }
    }
  };

  // Pagination numbers helper
  const getPaginationNumbers = (current: number, total: number) => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: any = [];
    let l: number | undefined;

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <>
      {/* FILTER SECTION */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Filter Kategori */}
                <div>
                  <label
                    htmlFor="categoryFilter"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Kategori
                  </label>
                  <select
                    id="categoryFilter"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter Urutan */}
                <div>
                  <label
                    htmlFor="sortFilter"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Urutkan
                  </label>
                  <select
                    id="sortFilter"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="newest">Terbaru</option>
                    <option value="oldest">Terlama</option>
                  </select>
                </div>
              </div>

              {/* Tombol Filter */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={applyFilters}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-2 rounded-md transition-colors flex items-center justify-center"
                >
                  Terapkan Filter
                </button>
                <button
                  onClick={resetFilters}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2 rounded-md transition-colors flex items-center justify-center"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GRID ARTIKEL */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Semua Artikel & Berita
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dapatkan cerita dan kabar terbaru dari Yayasan Taman Harapan Insan
              Mulia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full"
              >
                <div className="aspect-video bg-gray-200">
                  {article.image ? (
                    <img
                      src={`${STORAGE_URL}/${article.image}`}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col">
                  <h3 className="font-semibold text-xl mb-2 text-gray-900 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm flex-1 line-clamp-3 mb-4">
                    {article.description}
                  </p>
                  <a
                    href={`/artikel/${article.slug}`}
                    className="text-primary-600 font-medium hover:underline"
                  >
                    Baca Selengkapnya →
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 text-center">
            {!isFiltered && (currentPage > 1 || nextUrl) && (
              <nav
                className="flex items-center justify-center space-x-2"
                aria-label="Pagination"
              >
                {prevUrl && (
                  <a
                    href={prevUrl}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    ←
                  </a>
                )}
                {getPaginationNumbers(currentPage, totalPages || 1).map(
                  (page: any, index: any) => (
                    <span key={index}>
                      {page === "..." ? (
                        <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
                          ...
                        </span>
                      ) : (
                        <a
                          href={page === 1 ? "/artikel" : `/artikel/${page}`}
                          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            currentPage === page
                              ? "bg-primary-600 text-white border border-primary-600"
                              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                          aria-current={
                            currentPage === page ? "page" : undefined
                          }
                        >
                          {page}
                        </a>
                      )}
                    </span>
                  )
                )}
                {nextUrl && (
                  <a
                    href={nextUrl}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    →
                  </a>
                )}
              </nav>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ArticleList;
