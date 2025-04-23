"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Section from "@/components/section/Section";

export default function RulesOfEngagement() {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        { id: 0, label: "What You Can Do", icon: "mdi:check-circle-outline" },
        { id: 1, label: "What You Can't Do", icon: "mdi:close-circle-outline" },
        { id: 2, label: "Ethical Hacking", icon: "mdi:lightbulb-outline" },
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
                        Rules of Engagement
                    </h1>
                    <p className="text-lg text-gray-600">
                        To ensure a fair, safe, and educational experience, please follow these guidelines while using Assume Breach.
                    </p>

                    {activeTab === 0 && (
                        <Section title={tabs[0].label}>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Explore and test vulnerabilities within the boundaries of this platform.</li>
                                <li>Use tools like Burp Suite, browser dev tools, curl, etc. to find and exploit bugs.</li>
                                <li>Submit flags to earn points and learn more.</li>
                                <li>Watch the included videos to deepen your understanding of each issue.</li>
                            </ul>
                        </Section>
                    )}

                    {activeTab === 1 && (
                        <Section title={tabs[1].label}>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Do not attack infrastructure (e.g., server, network, or database outside the app scope).</li>
                                <li>Do not perform denial-of-service (DoS) or spam attacks.</li>
                                <li>Do not attempt to access or tamper with other users&apos; flags or accounts unless explicitly allowed.</li>
                                <li>Do not share flags or solutions with others.</li>
                                <li>Avoid using destructive SQL operations like DELETE, INSERT, or UPDATE.</li>
                                <li>Please don&apos;t delete or modify cookies. They don&apos;t hide any flag and are there to make the CTF work properly.</li>
                                <li>Only use this platform for ethical, educational purposes.</li>
                            </ul>
                        </Section>
                    )}

                    {activeTab === 2 && (
                        <Section title={tabs[2].label}>
                            <p>
                                Assume Breach is designed as a controlled environment to learn about security vulnerabilities.
                                Users are expected to behave responsibly and ethically at all times.
                            </p>
                            <p className="mt-2">
                                Treat every bug you find as an opportunity to learn how to prevent it in real applications.
                                Hacking without permission is illegal and violates the goals of this platform.
                            </p>
                        </Section>
                    )}

                    <div className="text-center">
                        <Link
                            href="/ctf/info"
                            className="inline-block bg-blue-600 text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition duration-200 ease-in-out text-lg font-medium"
                        >
                            Back to Info Page
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

