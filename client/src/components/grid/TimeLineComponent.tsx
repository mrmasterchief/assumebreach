import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { BentoGrid, BentoGridItem } from "./Bentogrid";
import {
    IconBrandGithub,
    IconTerminal2,
    IconShieldLock,
    IconFileCheck,
    IconChartInfographic,
    IconBrandLinkedin,
    IconBrandNextjs,
    IconBrandReact,
    IconBrandNodejs,
    IconBrandMongodb,
    IconBrandFirebase,
    IconBrandCypress,
    IconFlag2,
    IconVideo
    
} from "@tabler/icons-react";

export function TimelineComponent() {
    const data = [
        {
            title: "Goals",
            content: (
                <div>
                    <p className="mb-8 text-md font-normal text-neutral-200">
                        Assume Breach is trying to raise awareness about web security and
                        how it is important to be aware of the security risks that could
                        occur in your web application&apos;s code. We aim to integrate
                        the three pillars of security into the platform.
                    </p>
                    <BentoGrid
                        className="grid-rows-3 lg:grid-cols-3 gap-4"
                    >
                        <BentoGridItem
                            title="Confidentiality"
                            description="Knowing how to protect your data is important."
                            icon={<IconShieldLock color="white" />}
                        />
                        <BentoGridItem
                            title="Integrity"
                            description="How do we know that our data is not being tampered with?"
                            icon={<IconFileCheck color="white" />}
                        />
                        <BentoGridItem
                            title="Availability"
                            description="What can we do to make sure our data is available?"
                            icon={<IconChartInfographic color="white" />}
                        />
                    </BentoGrid>
                    <p className="mb-8 text-md font-normal text-neutral-200">
                        We are also trying to raise awareness about the importance of
                        secure coding practices and how they can help you prevent
                        vulnerabilities in your code. We are doing this by providing
                        secure coding practices for each vulnerability we have built into
                        the application.
                    </p>
                </div>
            ),
        },
        {
            title: "Our Product",
            content: (
                <div>
                    <p className="mb-8 text-md font-normal text-neutral-200">
                        Assume Breach is currently a Damn Vulnerable Web Application
                        (DVWA) that is being developed to help developers learn about web
                        security. It contains the following features:
                    </p>
                    <BentoGrid
                        className="grid-rows-3 lg:grid-cols-3 gap-4"
                    >
                        <BentoGridItem
                            title="Capture The Flag"
                            description="A Capture The Flag to encourage developers to learn about web security and find vulnerabilities in our application."
                            icon={<IconFlag2 color="white" />}
                        />
                        <BentoGridItem
                            title="Secure Coding"
                            description="Aside from the CTF, we also provide secure coding practices for each vulnerability we have built into the application."
                            icon={<IconFileCheck color="white" />}
                        />
                        <BentoGridItem
                            title="Explainers"
                            description="A YouTube video for each vulnerability to explain how it works, where to find it and how to exploit it."
                            icon={<IconVideo color="white" />}
                        />
                    </BentoGrid>
                </div>
            ),
        },
        {
            title: "About",
            content: (
                <div>
                    <p className="mb-8 text-md font-normal text-neutral-200">
                        Assume Breach is currently being developed by just one person. Let me introduce myself:
                        <br />
                        <br />
                        My name is Camryn and I am a 20 year old developer from the Netherlands. I have been
                        working on this project for a while now and I am excited to share it with you. I am actually
                        not a security expert, as my background is in web development. But since I started learning
                        about web security, I have been fascinated by it&apos;s importance. That is also the message
                        I want to share with others.
                    </p>
                    <BentoGrid
                        className="grid-rows-3 lg:grid-cols-3 gap-4"
                    >
                        <BentoGridItem
                            title="Skills"
                            description="Here are some languages/frameworks/tools I am familiar with."
                            icon={<IconTerminal2 color="white" />}
                            header={
                                <div className="grid grid-flow-col grid-rows-2 gap-4 align-center justify-center">
                                    <IconBrandNextjs
                                        color="white"
                                        className="h-8 w-8"
                                    />
                                    <IconBrandReact
                                        color="white"
                                        className="h-8 w-8"
                                    />
                                    <IconBrandNodejs
                                        color="white"
                                        className="h-8 w-8"
                                    />
                                    <IconBrandMongodb
                                        color="white"
                                        className="h-8 w-8"
                                    />
                                    <IconBrandFirebase
                                        color="white"
                                        className="h-8 w-8"
                                    />
                                    <IconBrandCypress
                                        color="white"
                                        className="h-8 w-8"
                                    />

                                </div>
                            }
                        />
                        <BentoGridItem
                            title="GitHub"
                            description="Check out my GitHub profile for more information about me."
                            icon={<IconBrandGithub color="white" />}
                            header={
                                <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                                    <a href="https://github.com/mrmasterchief" target="_blank" rel="noopener noreferrer">
                                        <IconBrandGithub color="white" className="h-8 w-8" />
                                    </a>
                                </span>
                            </button>
                            }
                        />
                        <BentoGridItem
                            title="LinkedIn"
                            description="Let's connect on LinkedIn and keep up-to-date with each other."
                            icon={<IconBrandLinkedin color="white" />}
                            header={
                                <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                                    <a href="https://www.linkedin.com/in/camryn-terlouw-907788226/" target="_blank" rel="noopener noreferrer">
                                        <IconBrandLinkedin color="white" className="h-8 w-8" />
                                    </a>
                                </span>
                            </button>
                            }
                        />
                    </BentoGrid>
                </div>
            ),
        },
        
    ];
    return (
        <div className="relative w-full overflow-clip">
            <Timeline data={data} />
        </div>
    );
}
