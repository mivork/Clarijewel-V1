import { fetchProducts, fetchNewsArticles, type Product } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";
import ProductSearchForm from "@/components/ProductSearchForm";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCarousel from "@/components/ProductCarousel";

// リング専用ページ（/rings）で個別に紹介するアイテムは、ホームの一覧からは除外する
const HOME_EXCLUDED_SKUS = ["CLJ-PDIA-001", "CLJ-AMY-001"];

// メインビジュアルのデモ用データ（正方形のバナー画像）。本番の画像ができたら差し替える
// 文字は画像の中に入っているため、altにも同じ内容を書いて読み上げに対応する
const HERO_SLIDES = [
  {
    src: "/hero/news/news-autumn.png",
    alt: "秋の新作コレクション 入荷のお知らせ。ガーネットとシトリンの新作を数量限定で",
    href: "/news",
  },
  {
    src: "/hero/news/news-care.png",
    alt: "ジュエリー無料お手入れキャンペーン。超音波洗浄と金具の点検を無料で",
    href: "/news",
  },
  {
    src: "/hero/news/news-anniversary.png",
    alt: "創業10周年記念フェア。期間限定のポイント還元アップ",
    href: "/news",
  },
  {
    src: "/hero/news/news-member.png",
    alt: "会員登録で特典クーポン。新規ご登録の方に、お買い物に使えるクーポン",
    href: "/register",
  },
  {
    src: "/hero/news/news-sizing.png",
    alt: "リングサイズの無料計測。店舗でお気軽にお試しください",
    href: "/guide",
  },
];

// 商品カテゴリー。大きさ（size）を変えて、並びに強弱をつける
const ITEM_TILES = [
  { label: "リング", href: "/rings", size: "large" },
  { label: "ネックレス", href: "/necklaces", size: "square" },
  { label: "ピアス", href: "/earrings", size: "tall" },
  { label: "イヤーカフ", href: "/ear-cuffs", size: "wide" },
  { label: "ブレスレット", href: "/bracelets", size: "square" },
  { label: "ルース（裸石）", href: "/loose-stones", size: "wide" },
];

export default async function HomePage({
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
  const hasSearch = Boolean(
    params.q ||
      params.gem_type ||
      params.category ||
      params.metal_type ||
      params.birthstone_month ||
      params.price_min ||
      params.price_max
  );

  // Laravel APIが未起動のうちはエラーになるため、catchして空の一覧にする
  const products = await fetchProducts({
    q: params.q,
    gem_type: params.gem_type,
    category: params.category,
    metal_type: params.metal_type,
    birthstone_month: params.birthstone_month ? Number(params.birthstone_month) : undefined,
    price_min: params.price_min ? Number(params.price_min) : undefined,
    price_max: params.price_max ? Number(params.price_max) : undefined,
  }).catch(() => []);
  const newsArticles = await fetchNewsArticles().catch(() => []);

  if (hasSearch) {
    return (
      <div className="container">
        <section style={{ padding: "48px 0 0" }}>
          <h1 style={{ fontSize: "1.8rem", letterSpacing: "0.04em" }}>検索結果</h1>
        </section>

        <ProductSearchForm />

        {products.length === 0 ? (
          <p style={{ color: "var(--color-muted)", padding: "24px 0" }}>
            条件に一致する商品がありませんでした。
          </p>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    );
  }

  const homeProducts: Product[] = products.filter(
    (p) => !HOME_EXCLUDED_SKUS.includes(p.sku ?? "")
  );
  const [latestNews, ...olderNews] = newsArticles.slice(0, 4);

  return (
    <div>
      <section className="hero">
        <div className="container">
          <HeroCarousel slides={HERO_SLIDES} />
        </div>
      </section>

      <div className="container">
        {latestNews && (
          <section id="news" className="home-news" aria-labelledby="home-news-title">
            <div className="home-news__head">
              <h2 id="home-news-title">お知らせ</h2>
              <a href="/news" className="home-news__all">
                一覧を見る →
              </a>
            </div>
            <a href={`/news/${latestNews.id}`} className="home-news__lead">
              {latestNews.published_at && (
                <span className="home-news__date">
                  {new Date(latestNews.published_at).toLocaleDateString("ja-JP")}
                </span>
              )}
              <span>{latestNews.title}</span>
            </a>
            <ul className="home-news__list">
              {olderNews.slice(0, 2).map((article) => (
                <li key={article.id}>
                  <a href={`/news/${article.id}`}>
                    {article.published_at && (
                      <span className="home-news__date">
                        {new Date(article.published_at).toLocaleDateString("ja-JP")}
                      </span>
                    )}
                    <span>{article.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section id="categories" className="home-section" aria-labelledby="home-categories-title">
          <h2 id="home-categories-title" className="home-heading">
            商品を探す
          </h2>
          <div className="home-mosaic">
            {ITEM_TILES.map((tile) => (
              <a
                key={tile.href}
                href={tile.href}
                className={`home-tile home-tile--${tile.size}`}
              >
                <div className="placeholder-box" aria-hidden="true" />
                <span className="home-tile__label">{tile.label}</span>
              </a>
            ))}
          </div>
        </section>

        {homeProducts.length > 0 && (
          <section id="recommended" className="home-section" aria-labelledby="home-recommended-title">
            <div className="home-heading-row">
              <h2 id="home-recommended-title" className="home-heading">
                今月のおすすめ
              </h2>
            </div>
            <ProductCarousel products={homeProducts} />
          </section>
        )}

        <section id="search" className="home-section" aria-labelledby="home-search-title">
          <h2 id="home-search-title" className="home-heading">
            条件から探す
          </h2>
          <ProductSearchForm />
        </section>

        {products.length === 0 && (
          <p style={{ color: "var(--color-muted)", padding: "24px 0" }}>
            現在表示できる商品がありません（APIサーバーが起動しているか確認してください）。
          </p>
        )}

        <section id="visit" className="home-visit" aria-labelledby="home-visit-title">
          <div className="home-visit__text">
            <h2 id="home-visit-title">店舗でじっくりご相談ください</h2>
            <p>完全予約制のサロンで、宝石の見方や商品のご相談を承ります。</p>
          </div>
          <div className="home-visit__links">
            <a href="/stores" className="home-visit__link home-visit__link--primary">
              店舗のご案内
            </a>
            <a href="/reserve/visit" className="home-visit__link">
              来店予約
            </a>
            <a href="/reserve/online" className="home-visit__link">
              オンライン相談
            </a>
          </div>
        </section>

        <nav className="home-guide" aria-label="ご案内">
          <a href="/guide">ご購入ガイド</a>
          <a href="/verify">鑑定書の真贋照会</a>
          <a href="/register">会員登録</a>
          <a href="/company">会社概要</a>
        </nav>
      </div>
    </div>
  );
}
