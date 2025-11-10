"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Inbox, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConversation } from "@/store/hooks/useConversation";
import { Button } from "@/components/ui/button";
import ChatView from "@/components/global/web-mail/ChatView";

export default function AppMailbox() {
  const router = useRouter();
  const {
    conversations,
    selectedConversation,
    getConversations,
    selectConversation,
    loading,
    error,
  } = useConversation();

  useEffect(() => {
    getConversations("inbox");
  }, [getConversations]);

  const showSplitView = !!selectedConversation?._id;

  return (
    <div className="flex h-[100vh] bg-background text-foreground">
      <aside className="w-16 border-r flex flex-col items-center justify-between py-4">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
            <Inbox className="size-4" />
          </div>
        </div>

        <div className="mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/mail-box/compose")}
            className="rounded-full"
          >
            <PlusCircle className="size-5" />
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex">
        <div
          className={cn(
            "border-r flex flex-col transition-all",
            showSplitView ? "w-1/3" : "w-full"
          )}
        >
          <header className="flex items-center justify-between p-4 border-b bg-muted/10">
            <h1 className="text-base font-semibold">Inbox</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => getConversations("inbox")}
            >
              Refresh
            </Button>
          </header>

          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-10 text-muted-foreground">
                <Loader2 className="size-6 animate-spin mb-2" />
                <p>Loading conversations...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center p-10 text-red-500">
                <p>{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => getConversations("inbox")}
                >
                  Retry
                </Button>
              </div>
            ) : conversations?.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-10 text-muted-foreground">
                <p>No conversations found</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => router.push("/mail-box/compose")}
                >
                  Compose a new message
                </Button>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv._id}
                  onClick={() => selectConversation(conv)}
                  className={cn(
                    "flex flex-col gap-2 border-b p-4 text-sm text-left hover:bg-muted/50 transition",
                    selectedConversation?._id === conv._id && "bg-muted"
                  )}
                >
                  <div className="flex justify-between">
                    <span className="font-medium truncate">
                      {conv.email || "Unknown"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(conv.updatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {conv?.lastMessage?.subject || "(no subject)"}
                  </span>
                  <span className="line-clamp-2 text-xs text-muted-foreground">
                    {conv?.lastMessage?.body?.text || "No preview available."}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {showSplitView && selectedConversation && (
          <div className="w-2/3">
            <ChatView conversationId={selectedConversation._id} />
          </div>
        )}
      </main>
    </div>
  );
}
