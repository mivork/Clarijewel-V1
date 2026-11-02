"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { fetchProfile, updateProfile } from "@/lib/api";

// チュートリアルの項目（バックエンドの TutorialController::STEPS と同じキー）
const STEP_LABELS: { key: string; label: string }[] = [
  { key: "viewed_product", label: "商品ページを見る" },
  { key: "viewed_guide", label: "ご購入ガイドを読む" },
  { key: "viewed_news", label: "お知らせを読む" },
  { key: "viewed_verify", label: "鑑定書を照会する" },
  { key: "added_to_wishlist", label: "お気に入りに入れる" },
  { key: "added_to_cart", label: "カートに入れる" },
];

// 報酬（バッジ）。達成状況から判定する（DBには持たない）
const BADGES: { key: string; name: string; description: string; unlocked: (done: Set<string>) => boolean }[] = [
  { key: "first_step", name: "はじめの一歩", description: "チュートリアルの項目を1つ達成", unlocked: (d) => d.size >= 1 },
  { key: "news_reader", name: "お知らせ通", description: "お知らせを読む", unlocked: (d) => d.has("viewed_news") },
  { key: "shopper", name: "商品通", description: "商品を見て、カートに入れる", unlocked: (d) => d.has("viewed_product") && d.has("added_to_cart") },
  { key: "wishlist", name: "お気に入りの目", description: "お気に入りに入れる", unlocked: (d) => d.has("added_to_wishlist") },
  { key: "appraiser", name: "安心の目利き", description: "ガイドを読み、鑑定書を照会する", unlocked: (d) => d.has("viewed_guide") && d.has("viewed_verify") },
  { key: "complete", name: "全制覇", description: "すべての項目を達成", unlocked: (d) => d.size === STEP_LABELS.length },
];

// 新規登録後にチュートリアルを自動で表示するかの設定と、達成状況
export default function TutorialSetting() {
  const { user, token, setAuth } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);

  useEffect(() => {
    if (!token) return;
    fetchProfile(token)
      .then((profile) => setProgress(profile.tutorial_progress ?? []))
      .catch(() => setProgress([]));
  }, [token]);

  if (!user || !token) return null;

  const handleChange = async (enabled: boolean) => {
    setIsSaving(true);
    setMessage(null);
    try {
      await updateProfile(token, { tutorial_enabled: enabled });
      setAuth(token, { ...user, tutorial_enabled: enabled });
      setMessage(enabled ? "次回からチュートリアルを表示します。" : "チュートリアルの自動表示をオフにしました。");
    } catch {
      setMessage("設定の保存に失敗しました。時間をおいて、もう一度お試しください。");
    } finally {
      setIsSaving(false);
    }
  };

  const achieved = STEP_LABELS.filter((step) => progress.includes(step.key)).length;

  return (
    <section className="tutorial-setting">
      <h2>チュートリアル</h2>
      <label className="tutorial-setting__toggle">
        <input
          type="checkbox"
          checked={user.tutorial_enabled}
          disabled={isSaving}
          onChange={(event) => handleChange(event.target.checked)}
        />
        <span>新規登録後にチュートリアルを表示する</span>
      </label>
      <p className="tutorial-setting__note">
        オフにしても、ガイドページの「チュートリアルをもう一度見る」からいつでも見られます。
      </p>

      <p className="tutorial-setting__progress">
        達成 {achieved} / {STEP_LABELS.length}
      </p>
      {achieved === STEP_LABELS.length && (
        <p role="status" className="tutorial-setting__complete">
          すべて達成しました。ご利用ありがとうございます。
        </p>
      )}
      <ul className="tutorial-setting__badges" aria-label="報酬（バッジ）">
        {BADGES.map((badge) => {
          const unlocked = badge.unlocked(new Set(progress));
          return (
            <li key={badge.key} className={unlocked ? "is-unlocked" : undefined}>
              <span className="tutorial-setting__badge-name">{badge.name}</span>
              <span className="tutorial-setting__badge-desc">{badge.description}</span>
              <span className="visually-hidden">{unlocked ? "（獲得済み）" : "（未獲得）"}</span>
            </li>
          );
        })}
      </ul>
      <ul className="tutorial-setting__steps">
        {STEP_LABELS.map((step) => {
          const done = progress.includes(step.key);
          return (
            <li key={step.key} className={done ? "is-done" : undefined}>
              <span aria-hidden="true">{done ? "✓" : "□"}</span>
              <span>{step.label}</span>
              <span className="visually-hidden">{done ? "（達成）" : "（未達成）"}</span>
            </li>
          );
        })}
      </ul>

      {message && (
        <p role="status" className="tutorial-setting__note">
          {message}
        </p>
      )}
    </section>
  );
}
