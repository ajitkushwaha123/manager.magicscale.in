"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchConversations = createAsyncThunk(
  "conversations/fetchAll",
  async (status = "", { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/web-mail/conversation`);

      if (!data?.conversations) {
        throw new Error(data.error || "Failed to fetch conversations");
      }

      return data.conversations;
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.message ||
        "Unable to fetch conversations";
      return rejectWithValue(errorMsg);
    }
  }
);

const conversationSlice = createSlice({
  name: "conversations",
  initialState: {
    items: [],
    selected: null,
    loading: false,
    error: null,
  },

  reducers: {
    setSelectedConversation: (state, action) => {
      state.selected = action.payload;
    },

    toggleStarred: (state, action) => {
      const conv = state.items.find((c) => c._id === action.payload);
      if (conv) conv.isStarred = !conv.isStarred;
    },

    archiveConversation: (state, action) => {
      const conv = state.items.find((c) => c._id === action.payload);
      if (conv) conv.isArchived = true;
    },

    addNewConversation: (state, action) => {
      state.items.unshift(action.payload); // Add newest at top
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load conversations";
      });
  },
});

export const {
  setSelectedConversation,
  toggleStarred,
  archiveConversation,
  addNewConversation,
} = conversationSlice.actions;

export default conversationSlice.reducer;
