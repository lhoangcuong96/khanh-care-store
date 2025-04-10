import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin-y">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-4.jpeg-hSVeRho48p8jZlhszYNn6sRYe2dik9.png"
          alt="Loading spinner"
          width={128}
          height={128}
          className="h-32 w-32"
        />
      </div>
    </div>
  );
}
