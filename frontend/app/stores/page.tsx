import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "店舗のご案内 | Clarijewel",
  description: "Clarijewel の店舗（完全予約制のサロン）のご案内です。",
};

// 店舗ごとに画像の大きさを変える（すべて同じ大きさにしない）
const STORES = [
  {
    name: "銀座本店",
    lead: "フラッグシップ店。全ラインナップを展示しています。",
    address: "〒104-0061 東京都中央区銀座（約25坪）",
    hours: "11:00 - 20:00（完全予約制）",
    facilities: ["CRI90以上の高演色照明", "個室カウンセリングルーム", "オンライン配信スタジオ併設"],
    variant: "feature",
  },
  {
    name: "横浜サロン",
    lead: "首都圏南部エリアの拠点サロンです。",
    address: "〒220-0012 神奈川県横浜市西区みなとみらい（約15坪）",
    hours: "11:00 - 19:00（完全予約制）",
    facilities: ["CRI90以上の高演色照明", "ペア相談ブース"],
    variant: "square",
  },
  {
    name: "名古屋サロン",
    lead: "個室のカウンセリングブースを2席備えています。",
    address: "〒460-0008 愛知県名古屋市中区栄（約18坪）",
    hours: "11:00 - 19:00（完全予約制）",
    facilities: ["CRI90以上の高演色照明", "専門カウンセラーが常駐"],
    variant: "tall",
  },
  {
    name: "大阪心斎橋サロン",
    lead: "関西エリアの拠点です。宝石鑑別士が常駐しています。",
    address: "〒542-0081 大阪府大阪市中央区心斎橋筋（約20坪）",
    hours: "11:00 - 20:00（完全予約制）",
    facilities: ["CRI90以上の高演色照明", "鑑別機器を完備"],
    variant: "wide",
  },
];

export default function StoresPage() {
  return (
    <div className="container stores-page">
      <header className="stores-page__header">
        <h1>店舗のご案内</h1>
        <p>
          Clarijewel の店舗はすべて完全予約制のサロンです。宝石をじっくりご覧いただけるよう、
          お時間を指定してご来店いただいております。
        </p>
      </header>

      {STORES.map((store) => (
        <section key={store.name} className={`stores-page__store stores-page__store--${store.variant}`}>
          <div className="placeholder-box" aria-hidden="true" />
          <div className="stores-page__body">
            <h2>{store.name}</h2>
            <p className="stores-page__lead">{store.lead}</p>
            <dl>
              <dt>住所</dt>
              <dd>{store.address}</dd>
              <dt>営業時間</dt>
              <dd>{store.hours}</dd>
              <dt>設備</dt>
              <dd>
                <ul>
                  {store.facilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </dl>
            <a href="/reserve/visit" className="stores-page__reserve">
              この店舗への来店を予約する →
            </a>
          </div>
        </section>
      ))}
    </div>
  );
}
