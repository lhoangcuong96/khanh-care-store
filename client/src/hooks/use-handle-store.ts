import { storageRequestApis } from "@/api-request/storage";

export default function useHandleStore() {
  async function storeUpload(file: File): Promise<string> {
    const getPresignedUrlRes = await storageRequestApis.generatePresignedUrl(
      file.name,
      file.type
    );
    if (!getPresignedUrlRes.payload?.data) {
      throw new Error("Lỗi khi tạo url");
    }
    const { fileUrl, presignedUrl } = getPresignedUrlRes.payload?.data;
    await storageRequestApis.upload(presignedUrl, file);
    return fileUrl;
  }

  return { storeUpload };
}
