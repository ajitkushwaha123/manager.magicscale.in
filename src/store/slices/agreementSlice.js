import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { showNotification } from "./notificationSlice";

const initialState = {
  agreements: [],
  loading: false,
  error: null,
};

export const createAgreement = createAsyncThunk(
  "agreement/createAgreement",
  async (
    { userId, projectId, agreementData },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await axios.post(
        `/api/${userId}/project/${projectId}/agreement`,
        agreementData
      );

      dispatch(
        showNotification({
          message: "Agreement created successfully",
          type: "success",
        })
      );

      return response.data.data || response.data.agreement;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      dispatch(showNotification({ message: errorMsg, type: "error" }));
      return rejectWithValue({ message: errorMsg });
    }
  }
);

export const fetchAgreements = createAsyncThunk(
  "agreement/fetchAgreements",
  async ({ userId, projectId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.get(
        `/api/${userId}/project/${projectId}/agreement`
      );

      return response.data.data ? [response.data.data] : [];
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      dispatch(showNotification({ message: errorMsg, type: "error" }));
      return rejectWithValue({ message: errorMsg });
    }
  }
);

const agreementSlice = createSlice({
  name: "agreement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchAgreements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgreements.fulfilled, (state, action) => {
        state.loading = false;
        state.agreements = action.payload || [];
      })
      .addCase(fetchAgreements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch agreements";
      })

      .addCase(createAgreement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAgreement.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const index = state.agreements.findIndex(
            (a) => a.projectId === action.payload.projectId
          );
          if (index !== -1) {
            state.agreements[index] = action.payload;
          } else {
            state.agreements.unshift(action.payload);
          }
        }
      })
      .addCase(createAgreement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create agreement";
      });
  },
});

export default agreementSlice.reducer;
