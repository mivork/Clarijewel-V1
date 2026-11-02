import { notFound } from "next/navigation";
import { fetchNewsArticle } from "@/lib/api";
import NewsBody from "@/components/NewsBody";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await fetchNewsArticle(Number(id)).catch(() => null);

  if (!article) {
    notFound();
  }

  return (
    <div className="container" style={{ padding: "48px 24px", maxWidth: 800 }}>
      {article.published_at && (
        <p style={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
          {new Date(article.published_at).toLocaleDateString("ja-JP")}
        </p>
      )}
      <h1 style={{ fontSize: "1.6rem", marginTop: 8 }}>{article.title}</h1>
      {article.thumbnail_url && (
        <img
          src={article.thumbnail_url}
          alt={article.title}
          style={{ display: "block", width: "100%", height: "auto", margin: "24px 0", border: "1px solid var(--color-border)" }}
        />
      )}
      <NewsBody body={article.body} />

      <a href="/news" style={{ display: "inline-block", marginTop: 24 }}>
        ← ニュース一覧に戻る
      </a>
    </div>
  );
}
