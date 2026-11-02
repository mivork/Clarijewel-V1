"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { updateProfile } from "@/lib/api";

// チュートリアルの内容（ホームの導線と同じ言葉を使う）
const STEPS = [
  {
    title: "Clarijewel へようこそ",
    body: "宝石・ジュエリーを、鑑定書付きでお届けするオンラインストアです。簡単にご案内します。",
  },
  {
    title: "商品の探し方",
    body: "ヘッダーの「目的から探す」で、贈り物・自分用・お直しなど目的別に進めます。「条件から探す」では、宝石の種類・誕生石・価格で絞り込めます。",
  },
  {
    title: "ご購入の流れ",
    body: "気に入った商品をカートに入れ、お支払い（クレジットカード・コンビニ払い・PayPay）へ進みます。",
  },
  {
    title: "鑑定書の確認",
    body: "ご購入後、鑑定書はマイページからPDFで受け取れます。鑑定書番号で真贋を照会することもできます。",
  },
  {
    title: "マイページ",
    body: "購入履歴・お気に入り・クーポン・サイズ直しのお申し込みは、マイページからまとめて確認できます。",
  },
];

function TutorialDialog() {
  const { user, token, setAuth } = useAuth();
  const searchParams = useSearchParams();
  // ガイドページなどから「もう一度見る」を開いた場合（?tutorial=1）
  const replay = searchParams.get("tutorial") === "1";
  // 新規登録後など、自動表示がオンの場合
  const autoShow = Boolean(user?.tutorial_enabled);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastStep = STEPS.length - 1;

  useEffect(() => {
    if (replay || autoShow) {
      setStep(0);
      setOpen(true);
    }
  }, [replay, autoShow]);

  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open, step]);

  // 閉じるとき、自動表示がオンだった人は自動表示をオフにする（マイページからいつでも戻せる）
  const close = async () => {
    setOpen(false);
    if (autoShow && token && user) {
      try {
        await updateProfile(token, { tutorial_enabled: false });
        setAuth(token, { ...user, tutorial_enabled: false });
      } catch {
        // 保存できなかった場合は、次の表示でもう一度出るだけ
      }
    }
  };

  if (!open) return null;

  return (
    <div className="tutorial">
      <div className="tutorial__backdrop" aria-hidden="true" />
      <div
        ref={dialogRef}
        className="tutorial__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-title"
        tabIndex={-1}
        onKeyDown={(event) => {
          if (event.key === "Escape") close();
        }}
      >
        <p className="tutorial__progress">
          {step + 1} / {STEPS.length}
        </p>
        <h2 id="tutorial-title">{STEPS[step].title}</h2>
        <p className="tutorial__body">{STEPS[step].body}</p>

        <div className="tutorial__actions">
          <button type="button" className="tutorial__skip" onClick={close}>
            閉じる
          </button>
          <div className="tutorial__nav">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              戻る
            </button>
            {step < lastStep ? (
              <button
                type="button"
                className="tutorial__primary"
                onClick={() => setStep((s) => Math.min(lastStep, s + 1))}
              >
                次へ
              </button>
            ) : (
              <button type="button" className="tutorial__primary" onClick={close}>
                はじめる
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Tutorial() {
  return (
    <Suspense fallback={null}>
      <TutorialDialog />
    </Suspense>
  );
}
