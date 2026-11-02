"use client";

import Link from "next/link";
import { useEffect, useState, type TouchEvent } from "react";
import type { Product } from "@/lib/api";

// 商品を3セット並べ、真ん中のセットを表示する。端まで来たら見た目が変わらないように真ん中へ戻して、ループして見せる
export default function ProductCarousel({ products }: { products: Product[] }) {
  const count = products.length;
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

  // 端に来た位置を、同じ商品が見える真ん中のセットへ戻す（アニメーションなし）
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

  const move = (delta: number) => setPosition((prev) => prev + delta);
  const items = [...products, ...products, ...products];

  return (
    <div
      className="product-carousel"
      role="region"
      aria-label="商品一覧"
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
      <div className="product-carousel__viewport">
        <ul
          className="product-carousel__track"
          style={{
            transform: `translateX(calc(-${position} * (var(--product-slide-width) + var(--product-gap))))`,
            transition: animate ? undefined : "none",
          }}
          onTransitionEnd={wrapIfNeeded}
        >
          {items.map((product, i) => {
            const setNumber = Math.floor(i / count);
            const isCurrentSet = setNumber === 1;
            return (
              <li
                key={`${setNumber}-${product.id}`}
                className="product-carousel__slide"
                aria-hidden={!isCurrentSet}
              >
                <Link
                  href={`/products/${product.id}`}
                  className="product-carousel__card"
                  tabIndex={isCurrentSet ? undefined : -1}
                >
                  <span className="product-carousel__image" aria-hidden="true" />
                  <span className="product-carousel__brand">CLARIJEWEL</span>
                  <span className="product-carousel__name">{product.name}</span>
                  <span className="product-carousel__price">
                    &yen;{product.price.toLocaleString()}
                    <span className="product-carousel__tax">（税込）</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <button
        type="button"
        className="product-carousel__arrow product-carousel__arrow--prev"
        aria-label="前の商品"
        onClick={() => move(-1)}
      >
        ‹
      </button>
      <button
        type="button"
        className="product-carousel__arrow product-carousel__arrow--next"
        aria-label="次の商品"
        onClick={() => move(1)}
      >
        ›
      </button>
    </div>
  );
}
