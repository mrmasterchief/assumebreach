"use client";
import React, { useState } from "react";
import Link from "next/link";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Icon } from "@iconify/react";
import Section from "@/components/section/Section";

export default function CTFInfo() {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        { id: 0, label: "Overview", icon: "material-symbols:dashboard" },
        { id: 1, label: "How It Works", icon: "mdi:flag-outline" },
        { id: 2, label: "Learn", icon: "mdi:school-outline" },
        { id: 3, label: "Rules", icon: "mdi:scale-balance" },
        { id: 4, label: "Contribute", icon: "mdi:github" },
    ];

    return (
        <div className="w-full flex justify-center px-4 py-16">
            <div className="w-full max-w-[1080px] flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-[220px] flex-shrink-0 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition font-medium
                ${activeTab === tab.id
                                    ? "bg-gray-100 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-50"}`}
                        >
                            <Icon icon={tab.icon} className="text-xl" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-1 space-y-10">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Welcome to Assume Breach
                    </h1>
                    <p className="text-lg text-gray-600">
                        <strong>Assume Breach</strong> is a deliberately vulnerable web application designed to help developers understand and prevent real-world security issues through hands-on learning.
                    </p>

                    {activeTab === 0 && (
                        <Section title={tabs[0].label}>
                            <p>
                                This platform simulates real-world vulnerabilities so developers can explore, exploit, and learn from them safely. It’s built to promote awareness and encourage secure coding practices.
                            </p>
                        </Section>
                    )}

                    {activeTab === 1 && (
                        <Section title={tabs[1].label}>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Explore the app and identify vulnerabilities.</li>
                                <li>Exploit them to capture <span className="font-medium">flags</span>.</li>
                                <li>Earn points and move up the scoreboard.</li>
                            </ul>
                        </Section>
                    )}

                    {activeTab === 2 && (
                        <Section title={tabs[2].label}>
                            <p>Each challenge comes with a companion video explaining:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>How the vulnerability works.</li>
                                <li>How to fix it using secure coding principles.</li>
                            </ul>
                            <p className="mt-2">
                                Our goal is to turn every exploit into a learning opportunity.
                            </p>
                        </Section>
                    )}

                    {activeTab === 3 && (
                        <Section title={tabs[3].label}>
                            <p>
                                This is a controlled and safe learning environment. Attempts to exploit anything outside of this platform are prohibited.
                            </p>
                            <p className="mt-2">
                                Please review our{" "}
                                <Link href="/ctf/rules" className="text-blue-500 hover:underline font-medium">
                                    Rules of Engagement
                                </Link>
                                .
                            </p>
                        </Section>
                    )}

                    {activeTab === 4 && (
                        <Section title={tabs[4].label}>
                            <p>
                                Have an idea or want to improve the platform? Contributions are welcome!
                            </p>
                            <p className="mt-2">
                                Help us grow by submitting ideas or vulnerabilities to our GitHub repository.
                            </p>

                            <Link
                                href="https://github.com/mrmasterchief/assumebreach"
                                target="_blank"
                                className="flex items-center mt-4 bg-gray-900 text-white rounded-lg px-4 py-2 hover:bg-gray-800 transition duration-200 ease-in-out gap-2 w-fit"
                            >
                                <GitHubIcon />
                                Contribute on GitHub
                            </Link>
                        </Section>
                    )}

                    <div className="text-center">
                        <Link
                            href="/ctf/scoreboard"
                            className="inline-block bg-blue-600 text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition duration-200 ease-in-out text-lg font-medium"
                        >
                            Start Hacking Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}


