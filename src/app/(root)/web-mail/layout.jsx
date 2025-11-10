"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Inbox, PlusCircle } from "lucide-react";

export default function MailBoxLayout({ children }) {
  const router = useRouter();

  return (
    <div className="flex h-[90vh] bg-background text-foreground">
      <aside className="w-16 border-r flex flex-col items-center justify-between py-4">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => router.push("/web-mail/inbox")}
            className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg hover:opacity-90 transition"
          >
            <Inbox className="size-4" />
          </button>
        </div>

        <div className="mb-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => router.push("/web-mail/compose")}
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition"
          >
            <PlusCircle className="size-5" />
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto h-[90vh] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </main>
    </div>
  );
}
