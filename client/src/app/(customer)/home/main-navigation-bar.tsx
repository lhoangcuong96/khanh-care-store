import Link from "next/link";

export default function MainNavigationBar() {
  return (
    <nav className="hidden md:flex items-center gap-8 py-3">
      <Link
        href="/"
        className="text-sm font-semibold text-orange-500 hover:text-orange-600 "
      >
        Trang chủ
      </Link>
      <Link
        href="/ve-chung-toi"
        className="text-sm font-semibold text-gray-700 hover:text-orange-500"
      >
        Về chúng tôi
      </Link>
      <Link
        href="/du-an-da-lam"
        className="text-sm font-semibold text-gray-700 hover:text-orange-500"
      >
        Dự án đã làm
      </Link>
      <Link
        href="/dich-vu"
        className="text-sm font-semibold text-gray-700 hover:text-orange-500"
      >
        Dịch vụ
      </Link>
      <Link
        href="/lien-he"
        className="text-sm font-semibold text-gray-700 hover:text-orange-500"
      >
        Liên hệ
      </Link>
    </nav>
  );
}
