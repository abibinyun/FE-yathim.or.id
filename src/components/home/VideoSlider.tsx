// src/components/VideoSlider.tsx
import { useEffect, useRef, useState } from "react";
import { getYouTubeVideoId } from "../../utils";
import YouTubeLazyEmbed from "./YouTubeLazyEmbed";

interface Slide {
  link: string;
  title: string;
  desc: string;
}

interface Props {
  slides: Slide[];
}

export default function VideoSlider({ slides }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesContainerRef = useRef<HTMLDivElement>(null);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = slides.length;

  const updateSlide = (index: number, stopAutoPlay = false) => {
    setCurrentSlide(index);
    if (slidesContainerRef.current) {
      const translateX = -index * 100;
      slidesContainerRef.current.style.transform = `translateX(${translateX}%)`;
    }
    if (stopAutoPlay) {
      stopAutoPlayInterval();
    }
  };

  const nextSlide = () => {
    const next = currentSlide === totalSlides - 1 ? 0 : currentSlide + 1;
    updateSlide(next);
  };

  const prevSlide = () => {
    const prev = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
    updateSlide(prev);
  };

  const startAutoPlay = () => {
    stopAutoPlayInterval();
    autoPlayIntervalRef.current = setInterval(nextSlide, 8000);
  };

  const stopAutoPlayInterval = () => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (totalSlides <= 1) return;

    startAutoPlay();
    updateSlide(0); // Initialize first slide

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
        stopAutoPlayInterval(); // Stop autoplay on manual interaction
      }
      if (e.key === "ArrowRight") {
        nextSlide();
        stopAutoPlayInterval(); // Stop autoplay on manual interaction
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      stopAutoPlayInterval();
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [totalSlides]);

  if (totalSlides === 0) return null;

  return (
    <div className="relative max-w-6xl mx-auto">
      <div className="video-slider overflow-hidden rounded-lg">
        <div
          ref={slidesContainerRef}
          className="video-slides flex transition-transform duration-500 ease-in-out"
        >
          {slides.map((slide, index) => {
            const videoId = getYouTubeVideoId(slide.link);
            return (
              <div key={index} className="video-slide w-full flex-shrink-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    {videoId ? (
                      <YouTubeLazyEmbed
                        videoId={videoId}
                        title={slide.title}
                        active={currentSlide === index}
                        onPlay={() => stopAutoPlayInterval()}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        {/* SVG Placeholder */}
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {slide.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {slide.desc}
                    </p>
                    <a
                      href={slide.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center p-1 rounded-md bg-green-600 text-white hover:text-gray-100 hover:bg-green-500 font-medium transition-colors"
                    >
                      Tonton di YouTube
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {totalSlides > 1 && (
        <>
          {/* Tombol kiri */}
          <button
            onClick={() => {
              prevSlide();
              stopAutoPlayInterval();
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-green-500/80 hover:bg-green-400 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-green-400"
            aria-label="Video sebelumnya"
          >
            <svg
              className="w-6 h-6"
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
          </button>

          {/* Tombol kanan */}
          <button
            onClick={() => {
              nextSlide();
              stopAutoPlayInterval();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-green-500/80 hover:bg-green-400 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-green-400"
            aria-label="Video berikutnya"
          >
            <svg
              className="w-6 h-6"
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
          </button>

          {/* Navigasi dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => updateSlide(index, true)}
                className={`w-2 h-2 p-2 rounded-full flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400 ${
                  index === currentSlide
                    ? "bg-primary-600"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Pergi ke slide ${index + 1}`}
              >
                <span className="sr-only">{`Slide ${index + 1}`}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
