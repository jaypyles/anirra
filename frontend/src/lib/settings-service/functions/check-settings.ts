import { fetch } from "@/lib/utils";

export const checkSettings = async () => {
  return await fetch("/integrations/settings", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
