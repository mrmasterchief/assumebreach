'use client';
import { toast } from "react-toastify";
import { MessageTypes } from "@/types";


export const showMessage = (message: string, type: MessageTypes) => {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    default:
      toast.error(message);
  }
};
