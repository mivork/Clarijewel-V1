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
