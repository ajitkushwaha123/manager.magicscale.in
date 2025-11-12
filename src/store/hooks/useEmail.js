"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmails,
  sendEmail,
  generateEmailFromPdf,
  removeGeneratedEmail,
} from "@/store/slices/emailSlice";
import { useCallback } from "react";

export function useEmail() {
  const dispatch = useDispatch();

  const { list, selectedEmail, loading, error, generatedEmail } = useSelector(
    (state) => state.emails
  );

  const getEmails = useCallback(
    (conversationId) => dispatch(fetchEmails(conversationId)),
    [dispatch]
  );

  const handleSend = useCallback(
    async (payload) => {
      return await dispatch(sendEmail(payload)).unwrap();
    },
    [dispatch]
  );

  const handleGenerateFromPdf = useCallback(
    async ({ file, prompt }) => {
      return await dispatch(generateEmailFromPdf({ file, prompt })).unwrap();
    },
    [dispatch]
  );

  const handleRemoveGeneratedEmail = useCallback(() => {
    dispatch(removeGeneratedEmail());
  }, [dispatch]);

  return {
    emails: list,
    selectedEmail,
    loading,
    error,
    generatedEmail,
    getEmails,
    handleSend,
    handleGenerateFromPdf,
    handleRemoveGeneratedEmail,
  };
}
