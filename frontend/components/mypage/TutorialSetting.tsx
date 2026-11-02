"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { updateProfile } from "@/lib/api";

// 新規登録後にチュートリアルを自動で表示するかの設定
export default function TutorialSetting() {
  const { user, token, setAuth } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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
      {message && (
        <p role="status" className="tutorial-setting__note">
          {message}
        </p>
      )}
    </section>
  );
}
