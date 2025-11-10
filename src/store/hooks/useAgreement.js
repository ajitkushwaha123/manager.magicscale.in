"use client";

import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  fetchAgreements,
  createAgreement,
} from "@/store/slices/agreementSlice";

export function useAgreement() {
  const dispatch = useDispatch();

  const { agreements, loading, error } = useSelector(
    (state) => state.agreement
  );

  const getAgreements = useCallback(
    async (userId, projectId) => {
      try {
        if (!userId || !projectId) return;
        await dispatch(fetchAgreements({ userId, projectId })).unwrap();
      } catch (err) {
        console.error("Failed to fetch agreements:", err);
      }
    },
    [dispatch]
  );

  const addAgreement = useCallback(
    async (userId, projectId, agreementData) => {
      try {
        if (!userId || !projectId || !agreementData) return;
        await dispatch(
          createAgreement({ userId, projectId, agreementData })
        ).unwrap();
      } catch (err) {
        console.error("Failed to create agreement:", err);
      }
    },
    [dispatch]
  );

  return {
    agreements,
    loading,
    error,
    getAgreements,
    addAgreement,
  };
}
