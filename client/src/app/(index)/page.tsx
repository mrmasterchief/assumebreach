"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { FloatingDock } from "@/components/hero/Dock";
import {
  IconBrandGithub,
  IconQuote,
  IconTerminal2,
  IconCertificate2
} from "@tabler/icons-react";
import { indexFunction } from "@/hooks";
import { submitAccessToken } from "@/hooks/ctf";
import { Spotlight } from "@/components/hero/Spotlight";
import { FlipWords } from "@/components/ui/text";
import { TimelineComponent } from "@/components/grid/TimeLineComponent";
import MagicButton from "@/components/ui/MagicButton";

export default function Index() {
  const [accessCode, setAccessCode] = React.useState<string>("");
  const handleAccessCodeSubmit = async () => {
    if (!accessCode) {
      alert("Please enter an access code");
      return;
    }
    if (accessCode.length < 5) {
      alert("Access code must be at least 5 characters long");
      return;
    }
    await indexFunction(
      [
        () => submitAccessToken(accessCode)
      ],
      ([ctfResult]) => {
        if (!ctfResult) {
          alert("Error submitting access code");
          return;
        }
        window.location.href = "/account/authenticate";
      },
      false
    );
  };
  const words = ["Safer", "More Secure", "Hacker Resistant"];



  return (
    <div className="relative bg-black-100">
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <FloatingDock
          items={
            [
              {
                title: "Goals",
                href: "/goals",
                icon: <IconCertificate2 color="white" className="h-full w-full" />,
              },
              {
                title: "About",
                href: "/about",
                icon: <IconQuote color="white" className="h-full w-full" />,
              },
              {
                title: "Github",
                href: "https://github.com/mrmasterchief/AssumeBreach",
                icon: <IconBrandGithub color="white" className="h-full w-full" />,
              },
              {
                title: "Products",
                href: "/our-products",
                icon: <IconTerminal2 color="white" className="h-full w-full" />,
              },
            ]
          } />
      </div>
      <div className="relative flex flex-col items-center overflow-hidden mx-auto sm:px-10 px-5 min-h-screen w-full">
        <div className="text-center space-y-5 max-w-2xl z-10 mt-10">
          <div className="py-1 px-2 inline-block">
            <Spotlight />
            <Image
              src={"/logo2.svg"}
              style={{ filter: "invert(1)" }}
              alt="Logo"
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
          <div className="gap-4 flex flex-col items-center py-2">
            <h1 className="text-5xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">Assume Breach</h1>
            <h3 className="text-4xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">A Safer Web Experience</h3>
          </div>
          <span className="text-neutral-200 text-lg text-pretty sm:m-10">Join me in my mission to make the web a<FlipWords words={words} />place.</span>


          <div className="space-x-3 hidden md:block">
            <input
              type="text"
              placeholder="Enter Access Code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"

            />
            <Button variant="default" className="rounded-lg border-neutral-300, border" onClick={handleAccessCodeSubmit}>
              Start Hacking
            </Button>
          </div>
          <div className="">
          <MagicButton
            title="Book a Demo"
            onClick={() => {
              window.open("mailto:cft07904@gmail.com", "_blank");
            }}
          />
          </div>
        </div>
      </div>
      <div className="px-10">
        <div className="">
          <TimelineComponent />

        </div>


      </div>
    </div>


  );
}
