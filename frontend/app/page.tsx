import { fetchProducts, fetchNewsArticles, type Product } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";
import ProductSearchForm from "@/components/ProductSearchForm";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCarousel from "@/components/ProductCarousel";
import { GEM_TYPES } from "@/lib/constants";

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

// 商品カテゴリー（各ページの URL に対応）
const ITEM_CATEGORIES = [
  { label: "リング", href: "/rings" },
  { label: "ネックレス", href: "/necklaces" },
  { label: "ピアス", href: "/earrings" },
  { label: "イヤーカフ", href: "/ear-cuffs" },
  { label: "ブレスレット", href: "/bracelets" },
  { label: "ルース（裸石）", href: "/loose-stones" },
];

// 特集（Pick up）。リンク先は実装済みのページ
const PICKUP_ITEMS = [
  {
    title: "ご購入ガイド",
    body: "お支払い・お届け・返品について",
    href: "/guide",
  },
  {
    title: "店舗で相談する",
    body: "完全予約制のサロンで、ご相談を承ります",
    href: "/reserve/visit",
  },
  {
    title: "会員特典",
    body: "会員登録で、お買い物に使えるクーポンをプレゼント",
    href: "/register",
  },
];

// 誕生石（月ごと）。birthstone_month で商品を絞り込む
const BIRTHSTONES = [
  { month: 1, name: "ガーネット" },
  { month: 2, name: "アメジスト" },
  { month: 3, name: "アクアマリン" },
  { month: 4, name: "ダイヤモンド" },
  { month: 5, name: "エメラルド" },
  { month: 6, name: "真珠" },
  { month: 7, name: "ルビー" },
  { month: 8, name: "ペリドット" },
  { month: 9, name: "サファイア" },
  { month: 10, name: "オパール" },
  { month: 11, name: "トパーズ" },
  { month: 12, name: "タンザナイト" },
];

// 「Clarijewel の約束」。実装済みの機能（鑑定書・真贋照会・マイページ）に基づく
const PROMISES = [
  {
    title: "鑑定書付き",
    body: "鑑定書付きの商品を扱っています。鑑定書はマイページからPDFで受け取れます。",
  },
  {
    title: "真贋照会",
    body: "鑑定書番号を入力すると、商品の情報をいつでも確認できます。",
  },
  {
    title: "購入後も安心",
    body: "購入履歴・保証・アフターケアの申し込みを、マイページでまとめて確認できます。",
  },
];

const PURCHASE_STEPS = [
  {
    title: "商品を選ぶ",
    body: "気に入った商品をカートに入れます。お気に入り登録もできます。",
  },
  {
    title: "お支払い",
    body: "クレジットカード、コンビニ払い、PayPayに対応しています。",
  },
  {
    title: "鑑定書を受け取る",
    body: "ご購入後、マイページから鑑定書をダウンロードできます。",
  },
];

const STORES = [
  {
    name: "銀座本店",
    address: "東京都中央区銀座",
    hours: "11:00 - 20:00（完全予約制）",
  },
  {
    name: "横浜サロン",
    address: "神奈川県横浜市西区みなとみらい",
    hours: "11:00 - 19:00（完全予約制）",
  },
  {
    name: "名古屋サロン",
    address: "愛知県名古屋市中区栄",
    hours: "11:00 - 19:00（完全予約制）",
  },
  {
    name: "大阪心斎橋サロン",
    address: "大阪府大阪市中央区心斎橋筋",
    hours: "11:00 - 20:00（完全予約制）",
  },
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
  const newArrivals = [...homeProducts].sort((a, b) => b.id - a.id).slice(0, 8);

  return (
    <div>
      <section className="hero">
        <div className="container">
          <HeroCarousel slides={HERO_SLIDES} />
        </div>
      </section>

      <div className="container">
        <section className="home-promises" aria-labelledby="home-promises-title">
          <h2 id="home-promises-title" className="visually-hidden">
            Clarijewel の約束
          </h2>
          {PROMISES.map((promise) => (
            <div key={promise.title} className="home-promises__item">
              <h3>{promise.title}</h3>
              <p>{promise.body}</p>
            </div>
          ))}
        </section>

        <section id="categories" className="home-section">
          <h2 className="section-title">商品カテゴリー</h2>
          <div className="home-item-categories">
            {ITEM_CATEGORIES.map((category) => (
              <a key={category.href} href={category.href} className="home-item-category">
                <div className="placeholder-box" aria-hidden="true" />
                <span>{category.label}</span>
              </a>
            ))}
          </div>
        </section>

        {homeProducts.length > 0 && (
          <section id="recommended" className="home-section">
            <h2 className="section-title">今月のおすすめ</h2>
            <ProductCarousel products={homeProducts} />
          </section>
        )}

        {newArrivals.length > 0 && (
          <section id="new-arrivals" className="home-section">
            <h2 className="section-title">新着商品</h2>
            <ProductCarousel products={newArrivals} />
          </section>
        )}

        <section id="pickup" className="home-section">
          <h2 className="section-title">特集</h2>
          <div className="home-pickup">
            {PICKUP_ITEMS.map((item) => (
              <a key={item.href} href={item.href} className="home-pickup__item">
                <div className="placeholder-box" aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </a>
            ))}
          </div>
        </section>

        <section id="birthstone" className="home-section">
          <h2 className="section-title">誕生石から探す</h2>
          <div className="home-birthstones">
            {BIRTHSTONES.map((stone) => (
              <a
                key={stone.month}
                href={`/?birthstone_month=${stone.month}`}
                className="home-chip"
              >
                {stone.month}月 {stone.name}
              </a>
            ))}
          </div>
        </section>

        <section id="gems" className="home-section">
          <h2 className="section-title">宝石から探す</h2>
          <div className="home-chips">
            {GEM_TYPES.map((gemType) => (
              <a
                key={gemType}
                href={`/?gem_type=${encodeURIComponent(gemType)}`}
                className="home-chip"
              >
                {gemType}
              </a>
            ))}
          </div>
        </section>

        <section id="search" className="home-section">
          <h2 className="section-title">絞り込み検索</h2>
          <ProductSearchForm />
        </section>

        {products.length === 0 && (
          <p style={{ color: "var(--color-muted)", padding: "24px 0" }}>
            現在表示できる商品がありません（APIサーバーが起動しているか確認してください）。
          </p>
        )}

        <section id="purchase" className="home-section">
          <h2 className="section-title">ご購入の流れ</h2>
          <ol className="home-steps">
            {PURCHASE_STEPS.map((step, i) => (
              <li key={step.title} className="home-steps__item">
                <span className="home-steps__no">STEP {i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="consult" className="home-section">
          <div className="home-cta">
            <div>
              <h2 className="home-cta__title">店舗でじっくりご相談ください</h2>
              <p className="home-cta__body">
                完全予約制のサロンで、宝石の見方や商品のご相談ができます。
              </p>
            </div>
            <div className="home-cta__buttons">
              <a href="/reserve/visit" className="home-cta__button home-cta__button--primary">
                来店予約
              </a>
              <a href="/reserve/online" className="home-cta__button">
                オンライン相談
              </a>
            </div>
          </div>
        </section>

        <section id="stores" className="home-section">
          <h2 className="section-title">店舗情報</h2>
          <div className="store-grid">
            {STORES.map((store) => (
              <div key={store.name} className="store-card">
                <div className="placeholder-box" aria-hidden="true" />
                <h3>{store.name}</h3>
                <p>{store.address}</p>
                <p>営業時間: {store.hours}</p>
              </div>
            ))}
          </div>
        </section>

        {newsArticles.length > 0 && (
          <section id="news" className="home-section">
            <h2 className="section-title">新着ニュース</h2>
            <ul className="home-news">
              {newsArticles.slice(0, 3).map((article) => (
                <li key={article.id} className="home-news__item">
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
            <a href="/news" className="home-more">
              ニュース一覧を見る →
            </a>
          </section>
        )}
      </div>
    </div>
  );
}
