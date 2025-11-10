import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./slices/projectSlice";
import notificationReducer from "./slices/notificationSlice";
import agreementReducer from "./slices/agreementSlice";
import emailReducer from "./slices/emailSlice";
import conversationReducer from "./slices/conversationSlice";

export const store = configureStore({
  reducer: {
    project: projectReducer,
    notification: notificationReducer,
    agreement: agreementReducer,
    emails: emailReducer,
    conversations: conversationReducer,
  },
});
