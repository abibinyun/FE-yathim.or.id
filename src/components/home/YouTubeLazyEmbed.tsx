import { useEffect, useState } from "react";

interface Props {
  videoId: string;
  title: string;
  active?: boolean; // apakah slide ini aktif
  onPlay?: () => void;
}

export default function YouTubeLazyEmbed({
  videoId,
  title,
  active = true,
  onPlay,
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false);

  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  const handlePlay = () => {
    setIsPlaying(true);
    if (onPlay) onPlay();
  };

  // Reset video saat slide tidak aktif
  useEffect(() => {
    if (!active) {
      setIsPlaying(false);
    }
  }, [active]);

  return (
    <div
      className="relative w-full h-full cursor-pointer bg-gray-200"
      onClick={handlePlay}
    >
      {!isPlaying && (
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
        />
      )}
      {isPlaying && (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          className="w-full h-full absolute top-0 left-0 border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="bg-white/80 rounded-full p-3 shadow-lg">▶</button>
        </div>
      )}
    </div>
  );
}
