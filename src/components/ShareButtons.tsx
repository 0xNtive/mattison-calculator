"use client";

import { useRef, useState, useCallback, useMemo } from "react";
import { toPng } from "html-to-image";
import {
  formatPercentage,
  SubAllocations,
  calculateMattisonPerformance,
} from "@/lib/allocation";
import { historicalPrices } from "@/data/historicalPrices";

interface ShareButtonsProps {
  age: number;
  goldPercentage: number;
  btcPercentage: number;
  subAllocations?: SubAllocations;
}

function hasCustomSubAllocations(subs?: SubAllocations): boolean {
  if (!subs) return false;
  return (
    subs.gold.physicalGold !== 100 ||
    subs.gold.goldEtf !== 0 ||
    subs.gold.silver !== 0 ||
    subs.gold.platinum !== 0 ||
    subs.crypto.bitcoin !== 100 ||
    subs.crypto.ethereum !== 0 ||
    subs.crypto.other !== 0
  );
}

export default function ShareButtons({
  age,
  goldPercentage,
  btcPercentage,
  subAllocations,
}: ShareButtonsProps) {
  const isCustomized = hasCustomSubAllocations(subAllocations);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  // Calculate historical performance (from 2015 to latest year)
  const performance = useMemo(() => {
    return calculateMattisonPerformance(age, 2015, 2025, historicalPrices);
  }, [age]);

  const generateImage = useCallback(async () => {
    if (!cardRef.current) return null;

    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        width: 1200,
        height: 630,
        pixelRatio: 2,
        backgroundColor: "#0f0f14",
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
          className="premium-button-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Share
        </button>
        <button
          onClick={handleCopy}
          disabled={isGenerating}
          className="premium-button inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium disabled:opacity-50"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          {showCopied ? "Copied!" : "Copy"}
        </button>
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="premium-button inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium disabled:opacity-50"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
      </div>

      {/* Hidden card for image generation - Premium dark theme */}
      <div className="overflow-hidden" style={{ height: 0 }}>
        <div
          ref={cardRef}
          style={{
            width: 1200,
            height: 630,
            padding: 50,
            background: "linear-gradient(135deg, #1a1a2e 0%, #151525 50%, #0f0f14 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "Inter, system-ui, sans-serif",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background decorative elements */}
          <div
            style={{
              position: "absolute",
              top: -100,
              right: -100,
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(247, 147, 26, 0.15) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -100,
              left: -100,
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />

          {/* Header */}
          <div style={{ textAlign: "center", zIndex: 1 }}>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                background: "linear-gradient(90deg, #FFD700, #F7931A)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.02em",
                marginBottom: 8,
              }}
            >
              Mattison Allocation Calculator
            </div>
            <div
              style={{
                fontSize: 20,
                color: "#a1a1aa",
                fontWeight: 500,
              }}
            >
              Age {age}
            </div>
          </div>

          {/* Main allocation display */}
          <div
            style={{
              display: "flex",
              gap: 80,
              zIndex: 1,
            }}
          >
            {/* Gold allocation */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 180,
                  height: 180,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #FFE44D 0%, #FFD700 40%, #B8860B 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  marginBottom: 16,
                  boxShadow: "0 0 60px -10px rgba(255, 215, 0, 0.5), 0 0 100px -20px rgba(255, 215, 0, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.3)",
                  position: "relative",
                }}
              >
                {/* Gold Bar Icon */}
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ position: "absolute", top: 28 }}
                >
                  <path
                    d="M4 18L6 8H18L20 18H4Z"
                    fill="rgba(255, 255, 255, 0.9)"
                    stroke="rgba(255, 255, 255, 0.9)"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M6 8L8 6H16L18 8H6Z"
                    fill="rgba(255, 255, 255, 0.7)"
                    stroke="rgba(255, 255, 255, 0.9)"
                    strokeWidth="0.5"
                  />
                </svg>
                <span
                  style={{
                    fontSize: 44,
                    fontWeight: 800,
                    color: "white",
                    marginTop: 28,
                    letterSpacing: "-0.02em",
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {formatPercentage(goldPercentage)}
                </span>
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: "#FFD700",
                  textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
                }}
              >
                Gold / PMs
              </div>
            </div>

            {/* Bitcoin allocation */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 180,
                  height: 180,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #FFA940 0%, #F7931A 40%, #E6820F 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  marginBottom: 16,
                  boxShadow: "0 0 60px -10px rgba(247, 147, 26, 0.5), 0 0 100px -20px rgba(247, 147, 26, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.3)",
                  position: "relative",
                }}
              >
                {/* Bitcoin Icon */}
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ position: "absolute", top: 28 }}
                >
                  <circle cx="12" cy="12" r="11" fill="rgba(255, 255, 255, 0.2)" />
                  <path
                    d="M16.662 10.661c.224-1.498-.917-2.303-2.478-2.84l.507-2.032-1.236-.308-.493 1.978c-.325-.081-.659-.158-.991-.233l.497-1.992-1.235-.308-.507 2.031c-.269-.061-.533-.122-.79-.185l.001-.006-1.704-.426-.329 1.32s.917.21.898.223c.501.125.591.456.576.719l-.577 2.315c.035.009.079.022.129.042l-.131-.033-.808 3.243c-.061.152-.217.38-.567.293.012.018-.898-.224-.898-.224l-.614 1.415 1.608.401c.299.075.592.153.881.227l-.512 2.056 1.234.308.507-2.033c.337.091.664.176.984.256l-.505 2.025 1.235.308.512-2.053c2.11.399 3.696.238 4.364-1.67.538-1.537-.027-2.424-1.137-3.002.809-.186 1.418-.718 1.58-1.816zm-2.828 3.965c-.382 1.537-2.968.706-3.806.497l.679-2.722c.838.209 3.527.623 3.127 2.225zm.383-3.986c-.349 1.398-2.502.688-3.2.514l.616-2.468c.698.174 2.948.499 2.584 1.954z"
                    fill="rgba(255, 255, 255, 0.9)"
                  />
                </svg>
                <span
                  style={{
                    fontSize: 44,
                    fontWeight: 800,
                    color: "white",
                    marginTop: 28,
                    letterSpacing: "-0.02em",
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {formatPercentage(btcPercentage)}
                </span>
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: "#F7931A",
                  textShadow: "0 0 20px rgba(247, 147, 26, 0.5)",
                }}
              >
                Bitcoin / Crypto
              </div>
            </div>
          </div>

          {/* Sub-allocation breakdown and Performance badge */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              zIndex: 1,
            }}
          >
            {/* Sub-allocation breakdown */}
            {isCustomized && subAllocations && (
              <div
                style={{
                  display: "flex",
                  gap: 60,
                  padding: "12px 24px",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 12,
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <div style={{ textAlign: "left", fontSize: 13, color: "#a1a1aa" }}>
                  {subAllocations.gold.physicalGold > 0 && subAllocations.gold.physicalGold < 100 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{ color: "#FFD700" }}>●</span> Physical Gold: {subAllocations.gold.physicalGold}%
                    </div>
                  )}
                  {subAllocations.gold.goldEtf > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{ color: "#FFD700" }}>●</span> Gold ETFs: {subAllocations.gold.goldEtf}%
                    </div>
                  )}
                  {subAllocations.gold.silver > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{ color: "#C0C0C0" }}>●</span> Silver: {subAllocations.gold.silver}%
                    </div>
                  )}
                  {subAllocations.gold.platinum > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: "#E5E4E2" }}>●</span> Platinum: {subAllocations.gold.platinum}%
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "left", fontSize: 13, color: "#a1a1aa" }}>
                  {subAllocations.crypto.bitcoin > 0 && subAllocations.crypto.bitcoin < 100 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{ color: "#F7931A" }}>●</span> Bitcoin: {subAllocations.crypto.bitcoin}%
                    </div>
                  )}
                  {subAllocations.crypto.ethereum > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{ color: "#627EEA" }}>●</span> Ethereum: {subAllocations.crypto.ethereum}%
                    </div>
                  )}
                  {subAllocations.crypto.other > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: "#8B5CF6" }}>●</span> Other Crypto: {subAllocations.crypto.other}%
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Performance badge */}
            {performance && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 20px",
                  background: "linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)",
                  borderRadius: 100,
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 17L9 11L13 15L21 7"
                    stroke="#22c55e"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 7H21V13"
                    stroke="#22c55e"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#22c55e",
                    textShadow: "0 0 20px rgba(34, 197, 94, 0.4)",
                  }}
                >
                  Mattison +{performance.totalReturnPercent.toLocaleString()}% since {performance.startYear}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: "#71717a",
                letterSpacing: "0.02em",
              }}
            >
              Calculate your allocation at
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#f5f5f7",
                padding: "4px 12px",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: 6,
              }}
            >
              mattison-calculator.vercel.app
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
