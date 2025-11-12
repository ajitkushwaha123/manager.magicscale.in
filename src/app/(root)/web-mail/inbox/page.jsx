"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConversation } from "@/store/hooks/useConversation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatView from "@/components/global/web-mail/ChatView";

export default function InboxPage() {
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
    <div className="flex h-full bg-background text-foreground">
      <main className="flex flex-1 overflow-hidden">
        <div
          className={cn(
            "flex flex-col border-r bg-white transition-all duration-300",
            "w-full md:w-1/3"
          )}
        >
          <header className="flex items-center justify-between p-4 border-b bg-muted/10">
            <h1 className="text-base font-semibold flex items-center gap-2">
              <Inbox className="size-4 text-muted-foreground" />
              Inbox
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => getConversations("inbox")}
            >
              Refresh
            </Button>
          </header>

          <div className="relative flex-1 flex flex-col">
            {loading || error || conversations?.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                {loading && (
                  <>
                    <Loader2 className="size-6 animate-spin mb-2" />
                    <p className="text-sm font-medium tracking-wide">
                      Loading conversations...
                    </p>
                  </>
                )}

                {error && !loading && (
                  <>
                    <p className="text-sm text-red-500">{error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => getConversations("inbox")}
                    >
                      Retry
                    </Button>
                  </>
                )}

                {!loading && !error && conversations?.length === 0 && (
                  <>
                    <Inbox className="size-12 mb-4 opacity-60" />
                    <p className="text-sm mb-2">No conversations yet</p>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => router.push("/web-mail/compose")}
                    >
                      Compose new message
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <ScrollArea className="flex-1 h-full bg-white">
                <div className="divide-y divide-muted/30">
                  {conversations.map((conv) => (
                    <button
                      key={conv._id}
                      onClick={() => selectConversation(conv)}
                      className={cn(
                        "group relative flex w-[100%] flex-col items-start p-4 text-left transition-all duration-200",
                        "hover:bg-muted/40 active:bg-muted/50",
                        selectedConversation?._id === conv._id && "bg-muted"
                      )}
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className="font-medium text-sm text-foreground truncate min-w-0">
                          {conv.email || "Unknown Sender"}
                        </span>
                        <span className="text-xs text-muted-foreground flex-shrink-0 whitespace-nowrap">
                          {new Date(conv.updatedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="flex w-full items-center mt-1 min-w-0">
                        <span className="w-[300px] truncate text-[0.9rem] leading-snug line-clamp-1 font-semibold text-foreground/90 group-hover:text-foreground">
                          {conv?.lastMessage?.subject || "(no subject)"}
                        </span>
                      </div>

                      <div className="flex w-full items-center mt-1 min-w-0">
                        <span className="text-xs text-muted-foreground leading-snug line-clamp-2 group-hover:text-foreground/70">
                          {conv?.lastMessage?.body?.text ||
                            "No preview available."}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        <div className="hidden h-screen md:flex flex-1 items-center justify-center bg-muted/10">
          {showSplitView && selectedConversation ? (
            <ChatView conversationId={selectedConversation._id} />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Mail className="size-10 mb-3 opacity-60" />
              <h2 className="text-base font-semibold mb-1">
                No conversation selected
              </h2>
              <p className="text-sm mb-4">
                Choose one to read or start a new message
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/web-mail/compose")}
              >
                Compose
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
