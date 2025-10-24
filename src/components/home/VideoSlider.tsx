// src/components/VideoSlider.tsx
import { useEffect, useRef, useState } from "react";
import { getYouTubeVideoId } from "../../utils";

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

  const updateSlide = (index: number) => {
    setCurrentSlide(index);
    if (slidesContainerRef.current) {
      const translateX = -index * 100;
      slidesContainerRef.current.style.transform = `translateX(${translateX}%)`;
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
    autoPlayIntervalRef.current = setInterval(nextSlide, 8000);
  };

  const stopAutoPlay = () => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
    }
  };

  useEffect(() => {
    if (totalSlides <= 1) return;

    startAutoPlay();
    updateSlide(0); // Initialize first slide

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      stopAutoPlay();
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [totalSlides]); // Only re-run if totalSlides changes

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
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={slide.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
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
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
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
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 z-10"
            aria-label="Previous video"
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
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 z-10"
            aria-label="Next video"
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
          <div className="flex justify-center mt-8 space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => updateSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentSlide
                    ? "bg-primary-600"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
