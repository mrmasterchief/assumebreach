import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="relative h-[600px]">
        <Image
          src="https://media.burford.co.uk/images/SNY04089.jpg_edit.width-1440_05001m7uKQ0crRoI.jpg"
          alt="hero"
          layout="fill"
          objectFit="cover"
          objectPosition="top"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">Assume Breach</h1>
            <p className="text-white">Your clothing business</p>
          </div>
          </div>
      </div>

    </>
  );
}
