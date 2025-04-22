import { fetch } from "@/lib/utils";

export const convertFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  console.log(formData);

  return await fetch(`/integrations/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
};
