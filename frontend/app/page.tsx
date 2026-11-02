import { fetchProducts, fetchNewsArticles, type Product } from "@/lib/api";
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

// 商品カテゴリー（同じ分類なので、枠の大きさはすべて揃える）
const ITEM_CATEGORIES = [
  { label: "リング", href: "/rings" },
  { label: "ネックレス", href: "/necklaces" },
  { label: "ピアス", href: "/earrings" },
  { label: "イヤーカフ", href: "/ear-cuffs" },
  { label: "ブレスレット", href: "/bracelets" },
  { label: "ルース（裸石）", href: "/loose-stones" },
];

// 特集（分類が違うので、枠は商品カテゴリーより大きく見せる）
const FEATURES = [
  {
    title: "ご購入ガイド",
    body: "お支払い・お届け・返品・鑑定書の受け取りについて",
    href: "/guide",
  },
  {
    title: "店舗のご案内",
    body: "完全予約制のサロン4店舗のご案内",
    href: "/stores",
  },
];

function formatDate(value: string | null): string | null {
  if (!value) return null;
  return new Date(value).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default async function HomePage() {
  // Laravel APIが未起動のうちはエラーになるため、catchして空の一覧にする
  const products = await fetchProducts().catch(() => []);
  const newsArticles = await fetchNewsArticles().catch(() => []);

  const homeProducts: Product[] = products.filter(
    (p) => !HOME_EXCLUDED_SKUS.includes(p.sku ?? "")
  );

  return (
    <div>
      <section className="hero">
        <div className="container">
          <HeroCarousel slides={HERO_SLIDES} />
        </div>
      </section>

      <div className="container">
        {newsArticles.length > 0 && (
          <section id="news" className="home-news" aria-labelledby="home-news-title">
            <div className="home-news__head">
              <h2 id="home-news-title">お知らせ</h2>
              <a href="/news">すべてのお知らせ</a>
            </div>
            <ul className="home-news__list">
              {newsArticles.slice(0, 3).map((article) => (
                <li key={article.id}>
                  <a href={`/news/${article.id}`}>
                    <time className="home-news__date" dateTime={article.published_at ?? undefined}>
                      {formatDate(article.published_at)}
                    </time>
                    <span className="home-news__title">{article.title}</span>
                    <span className="home-news__arrow" aria-hidden="true">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section id="categories" className="home-categories" aria-labelledby="home-categories-title">
          <h2 id="home-categories-title" className="home-heading">
            商品カテゴリー
          </h2>
          <ul className="home-categories__grid">
            {ITEM_CATEGORIES.map((category) => (
              <li key={category.href}>
                <a href={category.href} className="home-categories__item">
                  <span className="placeholder-box" aria-hidden="true" />
                  <span className="home-categories__label">{category.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section id="features" className="home-features" aria-labelledby="home-features-title">
          <h2 id="home-features-title" className="home-heading">
            特集
          </h2>
          <ul className="home-features__grid">
            {FEATURES.map((feature) => (
              <li key={feature.href}>
                <a href={feature.href} className="home-features__item">
                  <span className="placeholder-box" aria-hidden="true" />
                  <span className="home-features__title">{feature.title}</span>
                  <span className="home-features__body">{feature.body}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {homeProducts.length > 0 && (
          <section id="recommended" className="home-section" aria-labelledby="home-recommended-title">
            <h2 id="home-recommended-title" className="home-heading">
              今月のおすすめ
            </h2>
            <ProductCarousel products={homeProducts} />
          </section>
        )}

        {products.length === 0 && (
          <p className="home-empty">
            現在表示できる商品がありません（APIサーバーが起動しているか確認してください）。
          </p>
        )}

        <section id="visit" className="home-visit" aria-labelledby="home-visit-title">
          <h2 id="home-visit-title" className="home-heading">
            店舗・ご相談
          </h2>
          <ul className="home-visit__list">
            <li>
              <a href="/stores">店舗のご案内</a>
            </li>
            <li>
              <a href="/reserve/visit">来店予約</a>
            </li>
            <li>
              <a href="/reserve/online">オンライン相談</a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
