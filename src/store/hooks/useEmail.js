"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmails,
  sendEmail,
  setCurrentFolder,
  selectEmail,
  markAsRead,
  deleteEmail,
} from "@/store/slices/emailSlice";
import { useCallback } from "react";

export function useEmail() {
  const dispatch = useDispatch();

  const { list, selectedEmail, loading, error, currentFolder } = useSelector(
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

  const setFolder = useCallback(
    (folder) => dispatch(setCurrentFolder(folder)),
    [dispatch]
  );

  const select = useCallback(
    (email) => dispatch(selectEmail(email)),
    [dispatch]
  );

  const markRead = useCallback(
    (emailId) => dispatch(markAsRead(emailId)),
    [dispatch]
  );

  const remove = useCallback(
    (emailId) => dispatch(deleteEmail(emailId)),
    [dispatch]
  );

  return {
    emails: list,
    selectedEmail,
    loading,
    error,
    currentFolder,

    getEmails,
    handleSend,
    setFolder,
    select,
    markRead,
    remove,
  };
}
