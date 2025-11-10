"use client";

import React from "react";
import MailForm from "@/components/global/web-mail/MailForm";

export default function page() {
  return (
    <div className="flex flex-col h-[100%] bg-background text-foreground">
      <main className="flex-1 overflow-y-auto p-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mx-auto">
          <div className="border rounded-md shadow-sm bg-white dark:bg-neutral-900 overflow-hidden">
            <MailForm />
          </div>
        </div>
      </main>
    </div>
  );
}
