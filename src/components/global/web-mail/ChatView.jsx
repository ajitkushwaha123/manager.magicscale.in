"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Paperclip,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  MailPlus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useEmail } from "@/store/hooks/useEmail";
import { motion } from "framer-motion";

export default function ChatView({ conversationId }) {
  const { getEmails, emails } = useEmail();
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);
    getEmails(conversationId);
    setLoading(false);
  }, [conversationId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [emails]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-3">
        <Loader2 className="animate-spin size-6 text-primary" />
        <p className="text-sm font-medium">Fetching your conversation...</p>
      </div>
    );

  if (!emails?.length)
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-4 p-6">
        <MailPlus className="size-10 text-muted-foreground/70" />
        <p className="text-sm font-medium">
          No messages found in this conversation.
        </p>
        <Button variant="default" className="mt-2">
          Compose New Email
        </Button>
      </div>
    );

  return (
    <div className="flex flex-col h-full overflow-y-scroll w-full bg-background">
      <div className="flex flex-col gap-8 w-full">
        {emails.map((mail, index) => {
          const formattedDate = mail.updatedAt
            ? new Date(mail.updatedAt).toLocaleString([], {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "Unknown time";

          const statusIcon =
            mail.status === "sent" ? (
              <CheckCircle2 className="size-4 text-green-500" />
            ) : mail.status === "draft" ? (
              <Clock className="size-4 text-amber-500" />
            ) : (
              <AlertCircle className="size-4 text-red-500" />
            );

          return (
            <motion.div
              key={mail._id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
            >
              <Card className="w-full border rounded-md transition-all duration-300 bg-card/60 backdrop-blur-sm">
                <CardContent className="p-6 flex flex-col gap-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">
                        From:{" "}
                        <span className="font-normal text-muted-foreground">
                          {mail.from?.email || "You"}
                        </span>
                      </span>
                      <span className="text-sm font-semibold">
                        To:{" "}
                        <span className="font-normal text-muted-foreground">
                          {mail.to?.join(", ") || "Unknown"}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {statusIcon}
                      <span className="capitalize">{mail.status}</span>
                      <Separator orientation="vertical" className="h-4" />
                      {formattedDate}
                    </div>
                  </div>

                  {mail.subject && (
                    <div className="text-base sm:text-lg font-semibold text-foreground">
                      {mail.subject}
                    </div>
                  )}

                  <Separator className="opacity-60" />

                  <div
                    className="text-sm sm:text-base leading-relaxed prose prose-sm sm:prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html:
                        mail.body?.html ||
                        `<p>${mail.body?.text || "No content available."}</p>`,
                    }}
                  />

                  {mail.attachments?.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Paperclip className="size-4" />
                        {mail.attachments.length} attachment
                        {mail.attachments.length > 1 ? "s" : ""}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mail.attachments.map((att, i) => {
                          const isImage = att.contentType?.startsWith("image/");
                          const isPDF =
                            att.contentType === "application/pdf" ||
                            att.filename?.endsWith(".pdf");

                          return (
                            <div
                              key={i}
                              className={cn(
                                "relative border rounded-lg overflow-hidden bg-muted/30 hover:shadow-md transition-all group flex flex-col"
                              )}
                            >
                              <a
                                href={att.path || att.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block flex-1"
                              >
                                {isImage ? (
                                  <img
                                    src={att.path || att.href}
                                    alt={att.filename}
                                    className="w-full h-44 object-cover"
                                  />
                                ) : (
                                  <div>
                                    <div className="flex flex-col items-center justify-center h-44 bg-muted/40">
                                      {isPDF ? (
                                        <FileText className="size-10 text-primary" />
                                      ) : (
                                        <Paperclip className="size-8 text-muted-foreground" />
                                      )}
                                    </div>
                                    <p className="text-xs my-2 px-2 text-center truncate">
                                      {att.filename}
                                    </p>
                                  </div>
                                )}
                              </a>

                              <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="icon"
                                  variant="secondary"
                                  title="Open"
                                  onClick={() =>
                                    window.open(att.path || att.href, "_blank")
                                  }
                                >
                                  <FileText className="size-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="secondary"
                                  title="Download"
                                  onClick={() => {
                                    const link = document.createElement("a");
                                    link.href = att.path || att.href;
                                    link.download = att.filename || "file";
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }}
                                >
                                  <Download className="size-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
