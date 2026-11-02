"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SLIDE_INTERVAL_MS = 6000;

// スライドは正方形の画像のみ。文字は画像の中にデザインとして入れる（画像の上に文字を重ねない）
export type HeroSlide = {
  src: string;
  alt: string;
  href: string;
};

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const showSlide = (nextIndex: number) => {
    setIndex((nextIndex + slides.length) % slides.length);
  };

  // 動きを減らす設定の利用者には、自動で切り替えない（WCAG 2.2 2.2.2）
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(media.matches);
    const handleChange = (event: MediaQueryListEvent) => setReduceMotion(event.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const isAutoplaying = slides.length > 1 && isPlaying && !hovered && !reduceMotion;

  useEffect(() => {
    if (!isAutoplaying) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [slides.length, isAutoplaying]);

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
      <div className="hero-carousel__viewport">
        <ul
          className="hero-carousel__track"
          style={{
            // 選択中のカードを左端に置き、右側に次のカードを見せる
            transform: `translateX(calc(-${index} * (var(--hero-slide-width) + var(--hero-gap))))`,
          }}
          aria-live={isAutoplaying ? "off" : "polite"}
        >
          {slides.map((slide, i) => (
            <li
              key={slide.src}
              className="hero-carousel__slide"
              aria-roledescription="スライド"
              aria-label={`${i + 1} / ${slides.length}`}
              aria-hidden={i !== index}
            >
              <Link
                href={slide.href}
                className="hero-carousel__card"
                tabIndex={i === index ? 0 : -1}
              >
                <img
                  className="hero-carousel__image"
                  src={slide.src}
                  alt={slide.alt}
                  width={800}
                  height={800}
                  fetchPriority={i === 0 ? "high" : "auto"}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            className="hero-carousel__arrow hero-carousel__arrow--prev"
            aria-label="前のメインビジュアル"
            onClick={() => showSlide(index - 1)}
          >
            ‹
          </button>
          <button
            type="button"
            className="hero-carousel__arrow hero-carousel__arrow--next"
            aria-label="次のメインビジュアル"
            onClick={() => showSlide(index + 1)}
          >
            ›
          </button>

          <div className="hero-carousel__controls">
            <div className="hero-carousel__dots">
              {slides.map((slide, i) => (
                <button
                  key={slide.src}
                  type="button"
                  className={`hero-carousel__dot${i === index ? " is-active" : ""}`}
                  aria-label={`${i + 1}枚目を表示`}
                  aria-current={i === index}
                  onClick={() => showSlide(i)}
                />
              ))}
            </div>
            <button
              type="button"
              className="hero-carousel__pause"
              aria-pressed={!isPlaying}
              onClick={() => setIsPlaying((prev) => !prev)}
            >
              {isPlaying ? "一時停止" : "再生"}
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
