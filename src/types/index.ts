// src/types/index.ts

// Tipe untuk data Banner dari API
export interface Banner {
  id: number;
  page_identifier: string;
  title: string;
  subtitle: string;
  isButton: boolean;
  button_text: string;
  button_link: string;
  video_slides: VideoSlide[];
}

// Tipe untuk slide video di dalam banner
export interface VideoSlide {
  link: string;
  title: string;
  desc: string;
}

// Tipe untuk data Campaign/Program dari API
export interface Campaign {
  id: number;
  slug: string;
  title: string;
  name: string; // Saya lihat Anda menggunakan keduanya
  description: string;
  image: string;
  thumbnail: string;
  amount_raised: string;
  goal: string;
}

// Tipe untuk data Article dari API
export interface Article {
  id: number;
  slug: string;
  title: string;
  name: string;
  excerpt: string;
  description: string;
  featured_image: string;
  image: string;
  published_at: string;
  created_at: string;
}
