"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import MagicScaleAgreementPDF from "@/components/document";
import { AgreementSheet } from "@/components/global/agreement-sheet";

const PDFPreviewer = dynamic(
  () => import("@/components/global/pdf-previewer"),
  { ssr: false }
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
    targetLowerBound: 60000,
    targetUpperBound: 80000,
    duration: "1",
    services: "zomato",
    fee: 7000,
    paymentTerms: "advance",
  });

  const COMPANY = {
    name: "Magicscale Restaurant Consultancy Services",
    logo: "/assets/logo.png",
    address: "Near Air Force Camp, Rajokari, 110038",
    phone: "+91 8826073117",
    website: "https://magicscale.in",
    representative: "Akash Verma",
    designation: "Sales Manager",
    signature: "/assets/signature.png",
  };

  const [payment] = useState({
    term: "advance",
    firstHalf: "50",
    secondHalf: "50",
  });

  const handleAgreementSubmit = (data) => {
    setClient(data.client);
    setAgreement(data.agreement);
  };

  const formattedAgreement = {
    ...agreement,
    date: format(agreement.date, "dd MMM yyyy").toUpperCase(),
    start: formatWithSuffix(agreement.start),
    end: formatWithSuffix(agreement.end),
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-900 p-6">
      {/* Header Section */}
      <div className="flex w-full max-w-6xl justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-zinc-800 dark:text-white">
          Agreement Preview
        </h1>

        <AgreementSheet onSubmit={handleAgreementSubmit} />
      </div>

      <div className="w-full max-w-6xl h-[85vh] border border-zinc-300 dark:border-zinc-800 rounded-lg overflow-hidden shadow-lg">
        <PDFPreviewer
          company={COMPANY}
          client={client}
          agreement={formattedAgreement}
          payment={payment}
        />
      </div>
    </div>
  );
}
