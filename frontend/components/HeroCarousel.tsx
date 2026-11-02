"use client";

import Link from "next/link";
import { useEffect, useState, type TouchEvent } from "react";

// スライドは正方形の画像のみ。文字は画像の中にデザインとして入れる（画像の上に文字を重ねない）
export type HeroSlide = {
  src: string;
  alt: string;
  href: string;
};

// 画像を3セット並べ、真ん中のセットを表示する。端まで来たら見た目が変わらないように真ん中へ戻して、ループして見せる
export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const count = slides.length;
  const [position, setPosition] = useState(count);
  const [animate, setAnimate] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // 動きを減らす設定の利用者には、スライドのアニメーションを行わない
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(media.matches);
    const handleChange = (event: MediaQueryListEvent) => setReduceMotion(event.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  // 端に来た位置を、同じスライドが見える真ん中のセットへ戻す（アニメーションなし）
  const wrapIfNeeded = () => {
    if (position < count || position >= 2 * count) {
      setAnimate(false);
      setPosition((prev) => (prev < count ? prev + count : prev - count));
    }
  };

  // 動きを減らす設定では transitionend が発生しないため、ここで戻す
  useEffect(() => {
    if (reduceMotion) wrapIfNeeded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position, reduceMotion]);

  // アニメーションを止めたあと、次の描画から元に戻す
  useEffect(() => {
    if (animate) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    return () => cancelAnimationFrame(id);
  }, [animate]);

  if (count === 0) return null;

  const activeIndex = ((position % count) + count) % count;
  const move = (delta: number) => setPosition((prev) => prev + delta);
  const items = [...slides, ...slides, ...slides];

  return (
    <div
      className="hero-carousel"
      role="region"
      aria-label="メインビジュアル"
      aria-roledescription="カルーセル"
      onTouchStart={(event) => setTouchStartX(event.touches[0]?.clientX ?? null)}
      onTouchEnd={(event: TouchEvent<HTMLDivElement>) => {
        if (touchStartX === null) return;
        const touchEndX = event.changedTouches[0]?.clientX;
        if (touchEndX !== undefined && Math.abs(touchEndX - touchStartX) > 40) {
          move(touchEndX < touchStartX ? 1 : -1);
        }
        setTouchStartX(null);
      }}
    >
      <div className="hero-carousel__viewport">
        <ul
          className="hero-carousel__track"
          style={{
            transform: `translateX(calc(-${position} * (var(--hero-slide-width) + var(--hero-gap))))`,
            transition: animate ? undefined : "none",
          }}
          onTransitionEnd={wrapIfNeeded}
        >
          {items.map((slide, i) => {
            const setNumber = Math.floor(i / count);
            const isCurrentSet = setNumber === 1;
            return (
              <li
                key={`${setNumber}-${slide.src}`}
                className="hero-carousel__slide"
                aria-hidden={!isCurrentSet}
              >
                <Link
                  href={slide.href}
                  className="hero-carousel__card"
                  tabIndex={isCurrentSet ? undefined : -1}
                >
                  <img
                    className="hero-carousel__image"
                    src={slide.src}
                    alt={slide.alt}
                    width={800}
                    height={800}
                    fetchPriority={i === count ? "high" : "auto"}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <button
        type="button"
        className="hero-carousel__arrow hero-carousel__arrow--prev"
        aria-label="前のメインビジュアル"
        onClick={() => move(-1)}
      >
        ‹
      </button>
      <button
        type="button"
        className="hero-carousel__arrow hero-carousel__arrow--next"
        aria-label="次のメインビジュアル"
        onClick={() => move(1)}
      >
        ›
      </button>

      <div className="hero-carousel__dots">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            className={`hero-carousel__dot${i === activeIndex ? " is-active" : ""}`}
            aria-label={`${i + 1}枚目を表示`}
            aria-current={i === activeIndex}
            onClick={() => setPosition(count + i)}
          />
        ))}
      </div>
    </div>
  );
}
