import { fetch } from "@/lib/utils";

export const importWatchlist = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  console.log(formData);

  return await fetch(`/integrations/import`, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
};
