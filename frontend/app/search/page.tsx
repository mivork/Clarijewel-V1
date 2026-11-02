import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchProducts } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";
import ProductSearchForm from "@/components/ProductSearchForm";

export const metadata: Metadata = {
  title: "条件から探す | Clarijewel",
  description: "キーワード・宝石の種類・誕生石・価格などの条件から商品を探せます。",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    gem_type?: string;
    category?: string;
    metal_type?: string;
    birthstone_month?: string;
    price_min?: string;
    price_max?: string;
  }>;
}) {
  const params = await searchParams;
  const hasCondition = Boolean(
    params.q ||
      params.gem_type ||
      params.category ||
      params.metal_type ||
      params.birthstone_month ||
      params.price_min ||
      params.price_max
  );

  // APIが未起動のときは空の一覧にする
  const products = hasCondition
    ? await fetchProducts({
        q: params.q,
        gem_type: params.gem_type,
        category: params.category,
        metal_type: params.metal_type,
        birthstone_month: params.birthstone_month ? Number(params.birthstone_month) : undefined,
        price_min: params.price_min ? Number(params.price_min) : undefined,
        price_max: params.price_max ? Number(params.price_max) : undefined,
      }).catch(() => [])
    : [];

  return (
    <div className="container search-page">
      <header className="search-page__header">
        <h1>条件から探す</h1>
        <p>キーワード・宝石の種類・誕生石・価格などを指定して、商品を絞り込めます。</p>
      </header>

      <Suspense fallback={null}>
        <ProductSearchForm />
      </Suspense>

      {hasCondition && (
        <section className="search-page__results" aria-live="polite">
          <h2>
            検索結果
            <span className="search-page__count">{products.length}件</span>
          </h2>
          {products.length === 0 ? (
            <p className="search-page__empty">条件に一致する商品がありませんでした。</p>
          ) : (
            <ProductGrid products={products} />
          )}
        </section>
      )}
    </div>
  );
}
