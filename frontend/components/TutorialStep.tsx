"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { recordTutorialStep } from "@/lib/api";

// ページを開いたときに、チュートリアルの項目を達成として記録する（ログイン中のみ）
export default function TutorialStep({ step }: { step: string }) {
  const { token } = useAuth();

  useEffect(() => {
    if (token) recordTutorialStep(token, step);
  }, [token, step]);

  return null;
}
