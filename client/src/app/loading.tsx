import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-700">
      <div className="animate-spin-y">
        <Image
          src="/images/logo.png"
          alt="Loading spinner"
          width="124"
          height="39"
        />
      </div>
    </div>
  );
}
