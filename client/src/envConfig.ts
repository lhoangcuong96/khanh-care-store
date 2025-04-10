import { z } from "zod";

// chỉ sử dụng ở client
const envConfigSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string(),
  NEXT_PUBLIC_ACCESS_TOKEN_EXPIRES_IN: z.string(),
  NEXT_PUBLIC_URL: z.string(),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string(),
  NEXT_PUBLIC_FACEBOOK_PAGE_ID: z.string(),
  NEXT_PUBLIC_TINYMCE_API_KEY: z.string(),
});
const configProject = envConfigSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_ACCESS_TOKEN_EXPIRES_IN:
    process.env.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRES_IN,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  NEXT_PUBLIC_FACEBOOK_PAGE_ID: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID,
  NEXT_PUBLIC_TINYMCE_API_KEY: process.env.NEXT_PUBLIC_TINYMCE_API_KEY,
});

if (configProject.error?.issues) {
  console.error(configProject.error?.issues);
  throw new Error("Các giá trị khai báo trong env không hợp lệ");
}

const envConfig = configProject.data;

export default envConfig;
