"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const EmailRecipientsInput = ({ label = "To", value = [], onChange }) => {
  const [inputValue, setInputValue] = useState("");
  const [showAll, setShowAll] = useState(false);

  const handleAddEmail = () => {
    const newEmail = inputValue.trim().toLowerCase();
    if (!newEmail) return;

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
    if (!isValid) return toast.error("Invalid email address");

    if (value.includes(newEmail)) {
      toast.warning("Email already added");
      setInputValue("");
      return;
    }

    onChange([...value, newEmail]);
    setInputValue("");
  };

  const handleRemoveEmail = (emailToRemove) => {
    onChange(value.filter((e) => e !== emailToRemove));
  };

  const visibleEmails = showAll ? value : value.slice(0, 2);
  const hiddenCount = value.length - visibleEmails.length;

  return (
    <div className="relative w-full">
      <Label className="py-2">{label}</Label>
      <div className="flex flex-wrap items-center gap-2 rounded-md border px-2 py-2 focus-within:ring-2 focus-within:ring-blue-400">
        {visibleEmails.map((email) => (
          <span
            key={email}
            className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700 border border-blue-100"
          >
            {email}
            <X
              size={14}
              className="cursor-pointer text-gray-400 hover:text-red-500"
              onClick={() => handleRemoveEmail(email)}
            />
          </span>
        ))}

        {hiddenCount > 0 && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="rounded-full bg-gray-50 px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
          >
            +{hiddenCount} more
          </button>
        )}

        <div className="flex items-center gap-2">
          <Input
            type="email"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="recipient@example.com"
            className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 w-[200px]"
            onKeyDown={(e) => e.key === "Enter" && handleAddEmail()}
          />
          <Plus
            className="cursor-pointer text-gray-400 hover:text-blue-500 transition"
            size={18}
            onClick={handleAddEmail}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailRecipientsInput;
