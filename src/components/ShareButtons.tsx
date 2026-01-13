"use client";

import { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { formatPercentage } from "@/lib/allocation";

interface ShareButtonsProps {
  age: number;
  goldPercentage: number;
  btcPercentage: number;
}

export default function ShareButtons({
  age,
  goldPercentage,
  btcPercentage,
}: ShareButtonsProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const generateImage = useCallback(async () => {
    if (!cardRef.current) return null;

    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        width: 1200,
        height: 630,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      return dataUrl;
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleDownload = async () => {
    const dataUrl = await generateImage();
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.download = `mattison-allocation-age-${age}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleCopy = async () => {
    const dataUrl = await generateImage();
    if (!dataUrl) return;

    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (error) {
      console.error("Error copying image:", error);
    }
  };

  const handleShare = async (platform: "twitter" | "facebook" | "linkedin") => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      `My Mattison Allocation at age ${age}: ${goldPercentage}% Gold, ${btcPercentage}% Bitcoin. Calculate yours:`
    );

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };

    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => handleShare("twitter")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-xs font-medium"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Share
        </button>
        <button
          onClick={handleCopy}
          disabled={isGenerating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium disabled:opacity-50"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          {showCopied ? "Copied!" : "Copy"}
        </button>
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium disabled:opacity-50"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
      </div>

      {/* Hidden card for image generation */}
      <div className="overflow-hidden" style={{ height: 0 }}>
        <div
          ref={cardRef}
          style={{
            width: 1200,
            height: 630,
            padding: 60,
            background: "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          <div style={{ fontSize: 32, fontWeight: 600, color: "#374151", marginBottom: 20 }}>
            Mattison Allocation Calculator
          </div>
          <div style={{ fontSize: 24, color: "#6B7280", marginBottom: 50 }}>
            Age {age}
          </div>
          <div style={{ display: "flex", gap: 60, marginBottom: 50 }}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 100,
                  background: "linear-gradient(135deg, #FFD700 0%, #B8860B 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <span style={{ fontSize: 48, fontWeight: 700, color: "white" }}>
                  {formatPercentage(goldPercentage)}
                </span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 600, color: "#374151" }}>Gold / PMs</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 100,
                  background: "linear-gradient(135deg, #F7931A 0%, #E6820F 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <span style={{ fontSize: 48, fontWeight: 700, color: "white" }}>
                  {formatPercentage(btcPercentage)}
                </span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 600, color: "#374151" }}>Bitcoin / Crypto</div>
            </div>
          </div>
          <div style={{ fontSize: 18, color: "#9CA3AF" }}>
            Calculate your allocation at mattison-calculator.vercel.app
          </div>
        </div>
      </div>
    </>
  );
}
