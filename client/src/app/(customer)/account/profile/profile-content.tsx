import { accountApiRequest } from "@/api-request/account";
import UpdateProfileForm from "./update-profile-form";

export default async function ProfileContent() {
  const response = await accountApiRequest.getMe();
  if (!response.payload?.data) {
    return (
      <p className="items-center justify-center">{response.payload?.message}</p>
    );
  }
  return <UpdateProfileForm profile={response.payload.data} />;
}
