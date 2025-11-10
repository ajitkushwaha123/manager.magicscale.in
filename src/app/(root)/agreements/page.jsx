"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import { format } from "date-fns";

import MagicScaleAgreementPDF from "@/components/document";
import { AgreementSheet } from "@/components/global/agreement-sheet";

const PDFPreviewer = dynamic(
  () => import("@/components/global/pdf-previewer"),
  {
    ssr: false,
  }
);

function formatWithSuffix(date) {
  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";
  return `${day}${suffix} ${format(date, "MMM yyyy")}`;
}

export default function AgreementPreviewPage() {
  const [downloading, setDownloading] = useState(false);

  const [client, setClient] = useState({
    name: "__________",
    address: "_____________________",
    representative: "_______________",
  });

  const [agreement, setAgreement] = useState({
    date: new Date(),
    start: new Date(new Date().setDate(new Date().getDate() + 3)),
    end: new Date(
      new Date(new Date().setDate(new Date().getDate() + 3)).setMonth(
        new Date().getMonth() + 1
      )
    ),
    duration: 1,
  });

  const handleAgreementSubmit = async (data) => {
    setClient(data.client);
    setAgreement(data.agreement);
  };

  const formattedAgreement = {
    date: format(agreement.date, "dd MMM yyyy").toUpperCase(),
    start: formatWithSuffix(agreement.start),
    end: formatWithSuffix(agreement.end),
  };

  const COMPANY = {
    name: "Magic Scale",
    logo: "/assets/logo.png",
    address: "Near Air Force Camp, Rajokari, 110038",
    phone: "+91 8826073117",
    website: "https://magicscale.in",
    representative: "Akash Verma",
    designation: "Sales Manager",
    signature: "/assets/signature.png",
  };

  const handleDownload = async () => {
    setDownloading(true);
    const blob = await pdf(
      <MagicScaleAgreementPDF
        company={COMPANY}
        client={client}
        agreement={formattedAgreement}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${client.name}-Service-Agreement.pdf`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-900 p-6">
      <div className="flex w-full max-w-6xl justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-zinc-800 dark:text-white">
          Agreement Preview
        </h1>

        <div className="flex gap-3">
          <AgreementSheet onSubmit={handleAgreementSubmit} />
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-4 py-2 bg-[#1b1cfe] hover:bg-[#1516d9] text-white rounded-md font-medium shadow-md transition"
          >
            {downloading ? "Preparing..." : "Download PDF"}
          </button>
        </div>
      </div>

      <div className="w-full max-w-6xl h-[85vh] border border-zinc-300 dark:border-zinc-800 rounded-lg overflow-hidden shadow-lg">
        <PDFPreviewer
          company={COMPANY}
          client={client}
          agreement={formattedAgreement}
        />
      </div>
    </div>
  );
}
