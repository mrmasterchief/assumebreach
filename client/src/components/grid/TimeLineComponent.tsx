import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { BentoGrid, BentoGridItem } from "./Bentogrid";
import {
    IconBrandGithub,
    IconShieldLock,
    IconFileCheck,
    IconChartInfographic,
    IconBrandLinkedin,
    IconBrandNextjs,
    IconBrandReact,
    IconBrandNodejs,
    IconBrandFirebase,
    IconBrandCypress,
    IconFlag2,
    IconVideo,
    IconMail

} from "@tabler/icons-react";
import { SkillCard } from "../ui/grey-card";
import Image from "next/image";

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
                    <p className="mb-8 text-md font-normal text-neutral-200 mt-8">
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
                    <Image
                        src={"/ctf.png"}
                        alt="Capture The Flag"
                        width={1920}
                        height={1080}
                        className="rounded-lg mt-10 w-full h-auto"
                    />
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
                        className="grid-rows-2 lg:grid-cols-2 gap-4"
                    >
                        <SkillCard
                            title="My Skills"
                            description="Here are some of the skills I have acquired over the years. These include
        programming languages, frameworks, and tools that I have used in my projects."
                            icons={
                                [
                                    {
                                        icon: <IconBrandReact color="#61DBFB" />,
                                    },
                                    {
                                        icon: <IconBrandNextjs color="white" />,
                                    },
                                    {
                                        icon: <IconBrandNodejs color="#68A063" />,
                                    },
                                    {
                                        icon: <IconBrandFirebase color="#F5820D" />,
                                    },
                                    {
                                        icon: <IconBrandCypress color="white" />,
                                    }

                                ]
                            }
                        />
                        <SkillCard
                            title="Let's Connect"
                            description="Here are some of the platforms I am active on. Feel free to reach out to me if you have any questions or just want to chat!"
                            links={
                                [
                                    {
                                        title: "LinkedIn",
                                        href: "https://www.linkedin.com/in/camryn-van-der-linden/",
                                    },
                                    {
                                        title: "GitHub",
                                        href: "https://github.com/mrmasterchief",
                                    },
                                    {
                                        title: "Outlook",
                                        href: "mailto:cft07904@gmail.com",
                                    },
                                ]
                            }
                            icons={
                                [
                                    {
                                        icon: <IconBrandLinkedin color="#0077B5" />,
                                    },
                                    {
                                        icon: <IconBrandGithub color="white" />,
                                    },
                                    {
                                        icon: <IconMail color="white" />,
                                    },
                                ]
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
