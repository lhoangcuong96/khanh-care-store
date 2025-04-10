import { http } from "@/lib/http";
import { GeneratePresignedUrlResponseType } from "@/validation-schema/storage";

export const storageRequestApis = {
  generatePresignedUrl: async (fileName: string, fileType: string) => {
    return http.post<GeneratePresignedUrlResponseType>(
      "/storage/generate-presigned-url",
      {
        fileName,
        fileType,
      },
      {
        isPrivate: true,
      }
    );
  },

  upload: async (url: string, file: File) => {
    return fetch(url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
  },
};
