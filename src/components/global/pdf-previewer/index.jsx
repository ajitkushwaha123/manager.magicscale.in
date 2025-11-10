"use client";

import { PDFViewer } from "@react-pdf/renderer";
import MagicScaleAgreementPDF from "@/components/document";

export default function PDFPreviewer({ company, client, agreement }) {
  return (
    <div className="w-full h-full">
      <PDFViewer width="100%" height="100%">
        <MagicScaleAgreementPDF
          company={company}
          client={client}
          agreement={agreement}
        />
      </PDFViewer>
    </div>
  );
}
