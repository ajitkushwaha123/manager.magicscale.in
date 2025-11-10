"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useEmail } from "@/store/hooks/useEmail";
import FileUploadComponent from "./FileUpload";
import EmailRecipientsInput from "./EmailRecipientsInput";
import { useRouter } from "next/navigation";

export default function MailForm() {
  const router = useRouter();
  const { handleSend, loading } = useEmail();
  const [clearTrigger, setClearTrigger] = useState(false);

  const formik = useFormik({
    initialValues: {
      from: "support@magicscale.in",
      to: [],
      subject: "",
      message: "",
      attachments: [],
    },
    validationSchema: Yup.object({
      to: Yup.array()
        .of(Yup.string().email("Invalid email address"))
        .min(1, "At least one recipient is required"),
      subject: Yup.string().required("Subject is required"),
      message: Yup.string().required("Message cannot be empty"),
    }),
    onSubmit: async (values, { resetForm }) => {
      await handleEmail(values, resetForm);
    },
  });

  const handleEmail = async (values, resetForm) => {
    try {
      const data = {
        from: values.from,
        to: values.to,
        subject: values.subject,
        text: values.message,
        html: `<p>${values.message.replace(/\n/g, "<br/>")}</p>`,
        attachments: values.attachments,
      };

      await handleSend({ data });

      await new Promise((r) => setTimeout(r, 300));

      toast.success("✅ Email sent successfully!");
      resetForm();
      setClearTrigger((prev) => !prev);

      router.push("/web-mail/inbox");
    } catch (err) {
      console.error("Email error:", err);
      toast.error("Something went wrong while sending the email.");
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="w-full">
      <Card className="border shadow-sm rounded-md bg-white overflow-hidden">
        <CardContent className="p-5 space-y-4">
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-gray-700">From</Label>
              <Input
                name="from"
                value={formik.values.from}
                disabled
                className="bg-gray-50 my-2 cursor-not-allowed text-gray-600"
              />
            </div>

            <div>
              <EmailRecipientsInput
                label="To"
                value={formik.values.to}
                onChange={(emails) => formik.setFieldValue("to", emails)}
              />
              {formik.touched.to && formik.errors.to && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.to}</p>
              )}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Subject</Label>
            <Input
              name="subject"
              placeholder="Enter subject..."
              value={formik.values.subject}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="focus-visible:ring-blue-500 my-2"
            />
            {formik.touched.subject && formik.errors.subject && (
              <p className="text-xs text-red-500 mt-1">
                {formik.errors.subject}
              </p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Message</Label>
            <Textarea
              name="message"
              placeholder="Type your message..."
              rows={8}
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="resize-none leading-relaxed my-2 focus-visible:ring-blue-500"
            />
            {formik.touched.message && formik.errors.message && (
              <p className="text-xs text-red-500 mt-1">
                {formik.errors.message}
              </p>
            )}
          </div>

          <div className="w-full border rounded-md p-3 bg-transparent shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Upload size={16} className="text-blue-600" />
              <h3 className="font-medium text-gray-800 text-sm">Attachments</h3>
            </div>

            <FileUploadComponent
              value={formik.values.attachments}
              onFileChange={(files) =>
                formik.setFieldValue("attachments", files)
              }
              clearTrigger={clearTrigger}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end items-center gap-3 border-t bg-white py-3 px-5">
          <Button
            type="submit"
            disabled={loading}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Send size={16} /> Send
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
