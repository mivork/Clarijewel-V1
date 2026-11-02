"use client";

import { useEffect, useState } from "react";

const SLIDE_INTERVAL_MS = 6000;

export type HeroImage = { src: string; alt: string };

export default function HeroCarousel({ images }: { images: HeroImage[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const showSlide = (nextIndex: number) => {
    setIndex((nextIndex + images.length) % images.length);
  };

  useEffect(() => {
    if (images.length <= 1 || paused) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [images.length, paused]);

  return (
    <div
      className="hero-carousel"
      aria-label="メインビジュアル"
      aria-roledescription="カルーセル"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
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
        aria-live="polite"
      >
        {images.map((image, i) => (
          <div
            key={image.src}
            className="hero-slide"
            aria-hidden={i !== index}
            aria-roledescription="スライド"
          >
            <img src={image.src} alt={image.alt} fetchPriority={i === 0 ? "high" : "auto"} />
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
        </>
      )}
    </div>
  );
}
