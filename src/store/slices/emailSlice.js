import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchEmails = createAsyncThunk(
  "emails/fetchAll",
  async (coversationId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `/api/web-mail/conversation/${coversationId}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const sendEmail = createAsyncThunk(
  "emails/sendOrDraft",
  async ({ data, status = "sent" }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("from", data.from || "");
      formData.append("subject", data.subject || "(no subject)");
      formData.append("text", data.text || "");
      formData.append("html", data.html || "");
      formData.append("status", status);
      formData.append("to", JSON.stringify(data.to || []));

      if (data.attachments?.length) {
        data.attachments.forEach((file) => {
          formData.append("attachments", file);
        });
      }

      const res = await axios.post(
        `/api/web-mail/conversation/send-email`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data;
    } catch (err) {
      console.error("❌ Send Email Error:", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const emailSlice = createSlice({
  name: "emails",
  initialState: {
    list: [],
    selectedEmail: null,
    loading: false,
    error: null,
    currentFolder: "sent",
  },
  reducers: {
    setCurrentFolder: (state, action) => {
      state.currentFolder = action.payload;
    },
    selectEmail: (state, action) => {
      state.selectedEmail = action.payload;
    },
    markAsRead: (state, action) => {
      const emailId = action.payload;
      const email = state.list.find((e) => e._id === emailId);
      if (email) email.isRead = true;
    },
    deleteEmail: (state, action) => {
      state.list = state.list.filter((e) => e._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // 📬 Fetch Emails
      .addCase(fetchEmails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmails.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.emails || [];
      })
      .addCase(fetchEmails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(sendEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendEmail.fulfilled, (state, action) => {
        state.loading = false;

        const data = action.payload;
        const result = data?.result || null;
        const results = data?.results || [];

        if (result?.status === "draft") {
          const existing = state.list.find((e) => e._id === result.emailId);
          if (existing) Object.assign(existing, result);
          else state.list.unshift(result);
        } else if (Array.isArray(results) && results.length > 0) {
          state.list.unshift(...results);
        } else if (result) {
          state.list.unshift(result);
        }
      })
      .addCase(sendEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentFolder, selectEmail, markAsRead, deleteEmail } =
  emailSlice.actions;

export default emailSlice.reducer;
