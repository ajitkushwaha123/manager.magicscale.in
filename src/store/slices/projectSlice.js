import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { showNotification } from "./notificationSlice";

const initialState = {
  projects: [],
  loading: false,
  error: null,
  activeProjectId: null,
};

export const newProject = createAsyncThunk(
  "project/newProject",
  async ({ projectData, userId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`/api/${userId}/projects`, projectData);
      dispatch(
        showNotification({
          message: "Project created successfully",
          type: "success",
        })
      );
      return response.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      dispatch(showNotification({ message: errorMsg, type: "error" }));
      return rejectWithValue({ message: errorMsg });
    }
  }
);

export const fetchProjects = createAsyncThunk(
  "project/fetchProjects",
  async ({ userId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.get(`/api/${userId}/projects`);
      return response.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      dispatch(showNotification({ message: errorMsg, type: "error" }));
      return rejectWithValue({ message: errorMsg });
    }
  }
);

export const deleteProject = createAsyncThunk(
  "project/deleteProject",
  async ({ userId, projectId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.delete(
        `/api/${userId}/projects/${projectId}`
      );
      dispatch(
        showNotification({
          message: "Project deleted successfully",
          type: "success",
        })
      );
      return response.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      dispatch(showNotification({ message: errorMsg, type: "error" }));
      return rejectWithValue({ message: errorMsg });
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setActiveProjectId: (state, action) => {
      state.activeProjectId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload || [];

        if (!state.activeProjectId && state.projects.length > 0) {
          state.activeProjectId = state.projects[0]._id;
        }
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch projects";
      })

      .addCase(newProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(newProject.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.projects.unshift(action.payload);
          // Automatically set new project as active
          state.activeProjectId = action.payload._id;
        }
      })
      .addCase(newProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create project";
      })

      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(
          (project) => project._id !== action.payload._id
        );

        if (state.activeProjectId === action.payload._id) {
          state.activeProjectId = state.projects.length
            ? state.projects[0]._id
            : null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete project";
      });
  },
});

export const { setActiveProjectId } = projectSlice.actions;
export default projectSlice.reducer;
