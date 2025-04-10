import { Header } from "@/components/admin/layout/header";
import { Sidebar } from "./sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col font-semibold">
      <Header />
      <div className="flex flex-1">
        <Sidebar className="w-64 border-r" />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
