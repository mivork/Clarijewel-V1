import { fetchNewsArticles } from "@/lib/api";

export default async function NewsListPage() {
  const articles = await fetchNewsArticles().catch(() => []);

  return (
    <div className="container" style={{ padding: "48px 24px" }}>
      <h1 className="section-title">ニュース一覧</h1>

      {articles.length === 0 ? (
        <p style={{ color: "var(--color-muted)", padding: "24px 0" }}>
          現在お知らせはありません。
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {articles.map((article) => (
            <li
              key={article.id}
              style={{
                borderBottom: "1px solid var(--color-border)",
                padding: "20px 0",
              }}
            >
              <a
                href={`/news/${article.id}`}
                style={{ display: "grid", gridTemplateColumns: article.thumbnail_url ? "120px 1fr" : "1fr", gap: 16, alignItems: "center" }}
              >
                {article.thumbnail_url && (
                  <img
                    src={article.thumbnail_url}
                    alt=""
                    width={120}
                    height={90}
                    loading="lazy"
                    style={{ width: 120, height: 90, objectFit: "cover", border: "1px solid var(--color-border)" }}
                  />
                )}
                <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {article.published_at && (
                  <span style={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
                    {new Date(article.published_at).toLocaleDateString("ja-JP")}
                  </span>
                )}
                <span style={{ fontSize: "1.05rem" }}>{article.title}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
