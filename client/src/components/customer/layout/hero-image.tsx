import Image, { StaticImageData } from "next/image";

export function HeroImage({
  src,
}: {
  src: string | StaticImageData;
  link?: string;
}) {
  return (
    <Image
      src={src}
      alt="Hero Image"
      width={1500}
      height={607}
      className="top-0 max-w-[1500px] w-full h-auto relative lg:-top-6 z-10 rounded-sm m-auto"
      layout="responsive"
    ></Image>
  );
}
