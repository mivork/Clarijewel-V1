import ReactMarkdown from "react-markdown";

// ニュース本文はマークダウンで書く（見出し・リスト・リンク・画像）。HTML はそのまま表示しない
export default function NewsBody({ body }: { body: string }) {
  return (
    <div className="news-body">
      <ReactMarkdown>{body}</ReactMarkdown>
    </div>
  );
}
