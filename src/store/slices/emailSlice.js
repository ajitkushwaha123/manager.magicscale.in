import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchEmails = createAsyncThunk(
  "emails/fetchAll",
  async (conversationId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `/api/web-mail/conversation/${conversationId}`
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
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return res.data;
    } catch (err) {
      console.error("❌ Send Email Error:", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const generateEmailFromPdf = createAsyncThunk(
  "emails/generateFromPdf",
  async ({ file, prompt }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("prompt", prompt);

      const res = await axios.post(`/api/web-mail/generate-email`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data;
    } catch (err) {
      console.error("❌ Gemini PDF Generate Error:", err);
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
    generatedEmail: null,
  },
  reducers: {
    removeGeneratedEmail(state) {
      state.generatedEmail = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
      })

      .addCase(generateEmailFromPdf.pending, (state) => {
        state.error = null;
        state.generatedEmail = null;
      })
      .addCase(generateEmailFromPdf.fulfilled, (state, action) => {
        state.generatedEmail = action.payload.data;
      })
      .addCase(generateEmailFromPdf.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { removeGeneratedEmail } = emailSlice.actions;

export default emailSlice.reducer;
