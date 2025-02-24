"use client";
import { toast } from "react-toastify";
import { MessageTypes } from "./MessageTypes";

export const showMessage = (
  title: string | "Error",
  description: string | "Something went wrong",
  type: MessageTypes
) => {
  switch (type) {
    case "success":
      toast.success(
        <div>
          <p className="text-zinc-800 text-sm font-semibold">{title}</p>
          <p>{description}</p>
        </div>
      );
      break;
    case "error":
      toast.error(
        <div>
          <p className="text-zinc-800 text-sm font-semibold">{title}</p>
          <p>{description}</p>
        </div>
      );
      break;
    default:
      toast.error(
        <div>
          <p className="text-zinc-800 text-sm font-semibold">{title}</p>
          <p>{description}</p>
        </div>
      );
  }
};
