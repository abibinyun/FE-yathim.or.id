import React, { useState, useEffect } from "react";
import { calculateProgress, formatCurrency } from "../../utils";

// Definisikan tipe untuk data campaign
interface Campaign {
  id: number;
  title: string;
  slug: string;
  image: string | null;
  category_id: number;
  goal: string;
  amount_raised: string;
  created_at: string; // Tambahkan created_at untuk sorting
}

interface CampaignListProps {
  allCampaigns: Campaign[];
  categories: { id: number; name: string }[];
  currentPage: number;
  totalPages?: number | any;
  prevUrl?: string | null;
  nextUrl?: string | null;
}

const CampaignList: React.FC<CampaignListProps> = ({
  allCampaigns,
  categories,
  currentPage,
  totalPages,
  prevUrl,
  nextUrl,
}) => {
  const PAGE_SIZE = 6;
  const STORAGE_URL = "https://sys.yathim.or.id/storage";
  const SITE_URL = "https://yathim.or.id";

  // State untuk daftar yang ditampilkan
  const [displayedCampaigns, setDisplayedCampaigns] = useState<Campaign[]>([]);
  // State untuk data "load more"
  const [remainingData, setRemainingData] = useState<Campaign[]>([]);
  // State untuk filter
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  // State untuk melacak apakah filter sedang aktif
  const [isFiltered, setIsFiltered] = useState(false);

  // Effect untuk menginisialisasi daftar berdasarkan halaman saat ini
  useEffect(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const initial = allCampaigns.slice(startIndex, endIndex);
    const remaining = allCampaigns.slice(endIndex);

    setDisplayedCampaigns(initial);
    setRemainingData(remaining);
    setIsFiltered(false); // Reset status filter saat halaman berubah
  }, [allCampaigns, currentPage]);

  const applyFilters = () => {
    let filtered = [...allCampaigns];

    // Filter
    if (filterCategory) {
      filtered = filtered.filter(
        (c) => c.category_id.toString() === filterCategory
      );
    }

    // Sort
    filtered.sort((a: Campaign, b: Campaign) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    // Saat filter diterapkan, reset tampilan ke halaman pertama hasil filter
    setDisplayedCampaigns(filtered.slice(0, PAGE_SIZE));
    setRemainingData(filtered.slice(PAGE_SIZE));
    setIsFiltered(true);
  };

  const resetFilters = () => {
    setFilterCategory("");
    setSortOrder("newest");
    // Reset ke keadaan asli untuk halaman saat ini
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const initial = allCampaigns.slice(startIndex, endIndex);
    const remaining = allCampaigns.slice(endIndex);

    setDisplayedCampaigns(initial);
    setRemainingData(remaining);
    setIsFiltered(false);
  };

  const loadMore = () => {
    // Jika filter aktif, muat lebih banyak dari daftar yang sudah difilter
    if (isFiltered) {
      const nextBatch = remainingData.slice(0, PAGE_SIZE);
      const newRemaining = remainingData.slice(PAGE_SIZE);
      setDisplayedCampaigns((prev) => [...prev, ...nextBatch]);
      setRemainingData(newRemaining);
    } else {
      // Jika tidak ada filter, navigasi ke halaman statis berikutnya
      if (nextUrl) {
        window.location.href = nextUrl;
      }
    }
  };

  // Fungsi helper untuk menghasilkan array nomor halaman dengan ellipsis
  const getPaginationNumbers = (current: number, total: number) => {
    const delta = 2; // Jumlah halaman di kiri dan kanan halaman aktif
    const range = [];
    const rangeWithDots: any = [];
    let l: any;

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
          rangeWithDots("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <>
      {/* Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
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
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={applyFilters}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-2 rounded-md transition-colors flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    ></path>
                  </svg>
                  Terapkan Filter
                </button>
                <button
                  onClick={resetFilters}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2 rounded-md transition-colors flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    ></path>
                  </svg>
                  Reset Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Semua Program Donasi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Bergabunglah dengan program-program kami untuk membantu yatim dan
              dhuafa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="campaign-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full"
                data-category={campaign.category_id}
              >
                <div className="relative">
                  <div className="aspect-video bg-gray-200">
                    {campaign.image ? (
                      <img
                        src={`${STORAGE_URL}/${campaign.image}`}
                        alt={campaign.title}
                        className="w-full h-full object-center object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg
                          className="w-16 h-16"
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
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2 text-gray-900 line-clamp-2">
                    {campaign.title}
                  </h3>
                  {campaign.goal && campaign.amount_raised && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>
                          Terkumpul: {formatCurrency(campaign.amount_raised)}
                        </span>
                        <span>Target: {formatCurrency(campaign.goal)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${calculateProgress(
                              campaign.amount_raised,
                              campaign.goal
                            )}%`,
                          }}
                        />
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {calculateProgress(
                          campaign.amount_raised,
                          campaign.goal
                        ).toFixed(1)}
                        % tercapai
                      </div>
                    </div>
                  )}
                  <a
                    href={`/donasi/${campaign.slug}`}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors inline-flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    Donasi Sekarang
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Tombol Load More / Paginasi */}
          <div className="mt-12 text-center">

            {/* Jika tidak ada filter dan kita berada di halaman paginasi, tampilkan Previous/Next */}
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
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </a>
                )}
                {currentPage === 1 && (
                  <span className="px-3 py-2 text-sm font-medium text-gray-100 bg-green-600 border border-gray-300 rounded-md">
                    {currentPage}
                  </span>
                )}
                {/* Page Numbers */}
                {getPaginationNumbers(currentPage, totalPages).map(
                  (page: any, index: any) => (
                    <span key={index}>
                      {page === "..." ? (
                        <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
                          ...
                        </span>
                      ) : (
                        <a
                          href={page === 1 ? "/donasi" : `/donasi/${page}`}
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
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
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

export default CampaignList;
