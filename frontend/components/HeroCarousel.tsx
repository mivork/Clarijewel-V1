"use client";

import { useEffect, useState } from "react";

const SLIDE_INTERVAL_MS = 6000;

// 画像の実寸（1290 × 859）。レイアウトのずれ（CLS）を防ぐために width / height に使う
const IMAGE_WIDTH = 1290;
const IMAGE_HEIGHT = 859;

export type HeroImage = { src: string; alt: string };

export default function HeroCarousel({ images }: { images: HeroImage[] }) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const showSlide = (nextIndex: number) => {
    setIndex((nextIndex + images.length) % images.length);
  };

  // 視差効果などの動きを減らす設定の利用者には、自動で切り替えない（WCAG 2.2 2.2.2）
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(media.matches);
    const handleChange = (event: MediaQueryListEvent) => setReduceMotion(event.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const isAutoplaying = images.length > 1 && isPlaying && !hovered && !reduceMotion;

  useEffect(() => {
    if (!isAutoplaying) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [images.length, isAutoplaying]);

  return (
    <div
      className="hero-carousel"
      role="region"
      aria-label="メインビジュアル"
      aria-roledescription="カルーセル"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={(event) => setTouchStartX(event.touches[0]?.clientX ?? null)}
      onTouchEnd={(event) => {
        if (touchStartX === null) return;
        const touchEndX = event.changedTouches[0]?.clientX;
        if (touchEndX !== undefined && Math.abs(touchEndX - touchStartX) > 40) {
          showSlide(index + (touchEndX < touchStartX ? 1 : -1));
        }
        setTouchStartX(null);
      }}
    >
      <div
        className="hero-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
        aria-live={isAutoplaying ? "off" : "polite"}
      >
        {images.map((image, i) => (
          <div
            key={image.src}
            className="hero-slide"
            aria-hidden={i !== index}
            aria-roledescription="スライド"
          >
            <img
              src={image.src}
              alt={image.alt}
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              fetchPriority={i === 0 ? "high" : "auto"}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="hero-arrow hero-arrow-prev"
            aria-label="前のメインビジュアル"
            onClick={() => showSlide(index - 1)}
          >
            ‹
          </button>
          <button
            type="button"
            className="hero-arrow hero-arrow-next"
            aria-label="次のメインビジュアル"
            onClick={() => showSlide(index + 1)}
          >
            ›
          </button>
          <div className="hero-controls">
            <div className="hero-dots">
              {images.map((image, i) => (
                <button
                  key={image.src}
                  type="button"
                  className={`hero-dot${i === index ? " active" : ""}`}
                  aria-label={`${i + 1}枚目を表示`}
                  aria-current={i === index}
                  onClick={() => showSlide(i)}
                />
              ))}
            </div>
            <button
              type="button"
              className="hero-pause"
              aria-pressed={!isPlaying}
              onClick={() => setIsPlaying((prev) => !prev)}
            >
              {isPlaying ? "停止" : "再生"}
              <span className="visually-hidden">
                {isPlaying ? "（自動切り替えを止める）" : "（自動切り替えを再開する）"}
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
