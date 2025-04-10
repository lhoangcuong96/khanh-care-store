import React from "react";
import { FaFacebookMessenger } from "react-icons/fa"; // Messenger Icon
import Link from "next/link";

const FacebookChatButton: React.FC = () => {
  const messengerUrl = `https://m.me/${process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID}`;

  return (
    <Link
      href={messengerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 pointer right-5 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition z-50"
    >
      <FaFacebookMessenger size={30} />
    </Link>
  );
};

export default FacebookChatButton;
