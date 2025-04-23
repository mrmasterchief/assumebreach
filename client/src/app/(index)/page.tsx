"use client";
import { HeroHighlight } from "@/components/hero/HeroHighlight";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { FloatingDock } from "@/components/hero/Dock";
import {
  IconBrandGithub,
  IconQuote,
  IconTerminal2,
} from "@tabler/icons-react";
import { indexFunction } from "@/hooks";
import { submitAccessToken } from "@/hooks/ctf";


export default function Index() {
  const [accessCode, setAccessCode] = React.useState<string>("");

  const handleAccessCodeSubmit = async () => {
    if(!accessCode) {
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



  return (
    <div className="relative">
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
      <FloatingDock 
        items={
          [
            {
              title: "About",
              href: "/about",
              icon: <IconQuote size={24} />,
            },
            {
              title: "Github",
              href: "https://github.com/mrmasterchief/AssumeBreach",
              icon: <IconBrandGithub size={24} />,
            },
            {
              title: "Products",
              href: "/our-products",
              icon: <IconTerminal2 size={24} />,
            },
          ]
        }/>
      </div>
    <HeroHighlight>
    <div className="relative flex flex-col items-center justify-center overflow-hidden mx-auto sm:px-10 px-5 min-h-screen w-full "> 
      <div className="text-center space-y-5 max-w-2xl z-10">
        <div className="py-1 px-2 inline-block">
          <Image
            src={"/logo2.png"}
            alt="Logo"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>
        <div className="space-y-3">
          <h1 className="text-7xl tracking-tight h-20 font-semibold bg-clip-text bg-gradient-to-r from-[#0f172a]  to-[#334155] text-transparent">Assume Breach</h1>
          <h3 className="text-7xl tracking-tight bg-clip-text bg-gradient-to-r from-[#0f172a]  to-[#334155] text-transparent h-20 font-semibold">A Safer Web Experience</h3>
          </div>

          <p className="text-gray-600 text-pretty text-lg">
            A platform for <span className="bg-clip-text bg-gradient-to-t from-[#0f172a]  to-[#334155] font-bold">developers</span> to learn and practice <span className="bg-clip-text bg-gradient-to-t from-[#0f172a]  to-[#334155] font-bold">web security</span> in a safe environment. 
            <br />
            <br />
            <span className="">Join us in our mission to make the web a safer place.</span>
          </p>

          <div className="space-x-3">
            <input
              type="text"
              placeholder="Enter Access Code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
             
            />
            <Button variant="default" className="rounded-lg" onClick={handleAccessCodeSubmit}>
              Start Hacking
            </Button>
          </div>
          <Button variant="outline" className="rounded-lg" >
              <a href="mailto:cft07904@gmail.com" target="_blank" rel="noopener noreferrer">
              Book a Demo
              </a>
            </Button>
      </div>
    </div>
    </HeroHighlight>
    </div>
 
    
  );
}
