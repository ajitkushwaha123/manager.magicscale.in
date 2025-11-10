"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchConversations,
  setSelectedConversation,
  toggleStarred,
  archiveConversation,
  addNewConversation,
} from "@/store/slices/conversationSlice";
import { useCallback, useEffect } from "react";

export function useConversation({ status, autoFetch = false } = {}) {
  const dispatch = useDispatch();

  const { items, selected, loading, error } = useSelector(
    (state) => state.conversations
  );

  const getConversations = useCallback(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  const selectConversation = useCallback(
    (conversation) => {
      dispatch(setSelectedConversation(conversation));
    },
    [dispatch]
  );

  const starConversation = useCallback(
    (conversationId) => {
      dispatch(toggleStarred(conversationId));
    },
    [dispatch]
  );

  const archive = useCallback(
    (conversationId) => {
      dispatch(archiveConversation(conversationId));
    },
    [dispatch]
  );

  const addConversation = useCallback(
    (conversation) => {
      dispatch(addNewConversation(conversation));
    },
    [dispatch]
  );

  useEffect(() => {
    if (autoFetch) getConversations(status);
  }, [autoFetch, getConversations, status]);

  return {
    conversations: items,
    selectedConversation: selected,
    loading,
    error,

    getConversations,
    selectConversation,
    starConversation,
    archive,
    addConversation,
  };
}
