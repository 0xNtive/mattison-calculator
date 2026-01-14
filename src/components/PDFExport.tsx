"use client";

import { useState, useCallback } from "react";
import { jsPDF } from "jspdf";
import { SubAllocations, formatCurrency, formatPercentage } from "@/lib/allocation";

interface PDFExportProps {
  age: number;
  goldPercentage: number;
  btcPercentage: number;
  goldAmount?: number;
  btcAmount?: number;
  portfolioValue?: number;
  subAllocations: SubAllocations;
}

export default function PDFExport({
  age,
  goldPercentage,
  btcPercentage,
  goldAmount,
  btcAmount,
  portfolioValue,
  subAllocations,
}: PDFExportProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = useCallback(async () => {
    setIsGenerating(true);

    try {
      // Create PDF (letter size: 8.5 x 11 inches)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter",
      });

      const pageWidth = 8.5;
      const margin = 0.75;
      const contentWidth = pageWidth - 2 * margin;
      let y = margin;

      // Colors
      const goldColor: [number, number, number] = [212, 168, 0];
      const bitcoinColor: [number, number, number] = [247, 147, 26];
      const darkText: [number, number, number] = [30, 30, 45];
      const mutedText: [number, number, number] = [100, 100, 110];

      // Header
      pdf.setFontSize(24);
      pdf.setTextColor(...darkText);
      pdf.text("Mattison Allocation Report", margin, y + 0.3);
      y += 0.5;

      pdf.setFontSize(10);
      pdf.setTextColor(...mutedText);
      pdf.text(`Generated ${new Date().toLocaleDateString()}`, margin, y);
      y += 0.4;

      // Horizontal line
      pdf.setDrawColor(220, 220, 225);
      pdf.setLineWidth(0.01);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 0.4;

      // User Info
      pdf.setFontSize(12);
      pdf.setTextColor(...darkText);
      pdf.text(`Age: ${age} years`, margin, y);
      if (portfolioValue && portfolioValue > 0) {
        pdf.text(`Portfolio Value: ${formatCurrency(portfolioValue)}`, margin + 2, y);
      }
      y += 0.5;

      // Main Allocation Section
      pdf.setFontSize(16);
      pdf.setTextColor(...darkText);
      pdf.text("Your Mattison Allocation", margin, y);
      y += 0.4;

      // Allocation boxes
      const boxWidth = contentWidth / 2 - 0.1;
      const boxHeight = 1.2;

      // Gold box
      pdf.setFillColor(255, 248, 220);
      pdf.roundedRect(margin, y, boxWidth, boxHeight, 0.1, 0.1, "F");
      pdf.setDrawColor(...goldColor);
      pdf.setLineWidth(0.02);
      pdf.roundedRect(margin, y, boxWidth, boxHeight, 0.1, 0.1, "S");

      pdf.setFontSize(28);
      pdf.setTextColor(...goldColor);
      pdf.text(formatPercentage(goldPercentage), margin + boxWidth / 2, y + 0.55, { align: "center" });
      pdf.setFontSize(10);
      pdf.setTextColor(...mutedText);
      pdf.text("Gold / Precious Metals", margin + boxWidth / 2, y + 0.85, { align: "center" });
      if (goldAmount) {
        pdf.setFontSize(11);
        pdf.setTextColor(...darkText);
        pdf.text(formatCurrency(goldAmount), margin + boxWidth / 2, y + 1.05, { align: "center" });
      }

      // Bitcoin box
      const btcBoxX = margin + boxWidth + 0.2;
      pdf.setFillColor(255, 245, 235);
      pdf.roundedRect(btcBoxX, y, boxWidth, boxHeight, 0.1, 0.1, "F");
      pdf.setDrawColor(...bitcoinColor);
      pdf.setLineWidth(0.02);
      pdf.roundedRect(btcBoxX, y, boxWidth, boxHeight, 0.1, 0.1, "S");

      pdf.setFontSize(28);
      pdf.setTextColor(...bitcoinColor);
      pdf.text(formatPercentage(btcPercentage), btcBoxX + boxWidth / 2, y + 0.55, { align: "center" });
      pdf.setFontSize(10);
      pdf.setTextColor(...mutedText);
      pdf.text("Bitcoin / Crypto", btcBoxX + boxWidth / 2, y + 0.85, { align: "center" });
      if (btcAmount) {
        pdf.setFontSize(11);
        pdf.setTextColor(...darkText);
        pdf.text(formatCurrency(btcAmount), btcBoxX + boxWidth / 2, y + 1.05, { align: "center" });
      }

      y += boxHeight + 0.5;

      // Sub-allocations if customized
      const goldCustomized =
        subAllocations.gold.physicalGold !== 100 ||
        subAllocations.gold.goldEtf !== 0 ||
        subAllocations.gold.silver !== 0 ||
        subAllocations.gold.platinum !== 0;

      const cryptoCustomized =
        subAllocations.crypto.bitcoin !== 100 ||
        subAllocations.crypto.ethereum !== 0 ||
        subAllocations.crypto.other !== 0;

      if (goldCustomized || cryptoCustomized) {
        pdf.setFontSize(14);
        pdf.setTextColor(...darkText);
        pdf.text("Sub-Allocation Breakdown", margin, y);
        y += 0.35;

        pdf.setFontSize(10);

        if (goldCustomized) {
          pdf.setTextColor(...goldColor);
          pdf.text("Gold Bucket:", margin, y);
          y += 0.2;
          pdf.setTextColor(...mutedText);
          if (subAllocations.gold.physicalGold > 0) {
            pdf.text(`  Physical Gold: ${subAllocations.gold.physicalGold}%`, margin, y);
            y += 0.18;
          }
          if (subAllocations.gold.goldEtf > 0) {
            pdf.text(`  Gold ETFs: ${subAllocations.gold.goldEtf}%`, margin, y);
            y += 0.18;
          }
          if (subAllocations.gold.silver > 0) {
            pdf.text(`  Silver: ${subAllocations.gold.silver}%`, margin, y);
            y += 0.18;
          }
          if (subAllocations.gold.platinum > 0) {
            pdf.text(`  Platinum: ${subAllocations.gold.platinum}%`, margin, y);
            y += 0.18;
          }
          y += 0.1;
        }

        if (cryptoCustomized) {
          pdf.setTextColor(...bitcoinColor);
          pdf.text("Crypto Bucket:", margin, y);
          y += 0.2;
          pdf.setTextColor(...mutedText);
          if (subAllocations.crypto.bitcoin > 0) {
            pdf.text(`  Bitcoin: ${subAllocations.crypto.bitcoin}%`, margin, y);
            y += 0.18;
          }
          if (subAllocations.crypto.ethereum > 0) {
            pdf.text(`  Ethereum: ${subAllocations.crypto.ethereum}%`, margin, y);
            y += 0.18;
          }
          if (subAllocations.crypto.other > 0) {
            pdf.text(`  Other Crypto: ${subAllocations.crypto.other}%`, margin, y);
            y += 0.18;
          }
        }

        y += 0.4;
      }

      // Formula explanation
      pdf.setFontSize(14);
      pdf.setTextColor(...darkText);
      pdf.text("The Mattison Formula", margin, y);
      y += 0.35;

      pdf.setFontSize(10);
      pdf.setTextColor(...mutedText);
      const formulaText = [
        "The Mattison Allocation strategy uses a simple age-based formula:",
        "",
        `  Gold/Precious Metals % = Age + 15 = ${age} + 15 = ${goldPercentage}%`,
        `  Bitcoin/Crypto % = 100 - (Age + 15) = 100 - ${goldPercentage} = ${btcPercentage}%`,
        "",
        "As you age, the formula gradually increases your allocation to stable assets",
        "(gold) while reducing exposure to volatile assets (Bitcoin), helping to preserve",
        "wealth as you approach retirement.",
      ];

      for (const line of formulaText) {
        pdf.text(line, margin, y);
        y += 0.18;
      }

      y += 0.3;

      // Disclaimer
      pdf.setDrawColor(220, 220, 225);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 0.25;

      pdf.setFontSize(8);
      pdf.setTextColor(130, 130, 140);
      const disclaimer = [
        "DISCLAIMER: This report is for educational purposes only and does not constitute financial advice.",
        "Past performance does not guarantee future results. Cryptocurrency and precious metals investments",
        "are volatile and may lose value. Consult a qualified financial advisor before making investment decisions.",
        "",
        "Generated by the Mattison Allocation Calculator - https://mattison.app",
      ];

      for (const line of disclaimer) {
        pdf.text(line, margin, y);
        y += 0.14;
      }

      // Save PDF
      const filename = `mattison-allocation-age-${age}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [age, goldPercentage, btcPercentage, goldAmount, btcAmount, portfolioValue, subAllocations]);

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className="premium-button px-4 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
      title="Download PDF report"
    >
      {isGenerating ? (
        <>
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Generating...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>PDF</span>
        </>
      )}
    </button>
  );
}
