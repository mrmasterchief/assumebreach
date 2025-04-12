"use client";
import React from "react";
import Link from "next/link";

export default function RulesOfEngagement() {
    return (
        <div className="flex flex-col w-full max-w-[1440px] mx-auto">
            <div className="flex flex-col w-[80%] mx-auto py-12 gap-6">
                <h1 className="text-4xl font-bold text-center text-gray-800">
                    📜 Rules of Engagement
                </h1>

                <p className="text-lg text-gray-700 text-center">
                    To ensure a fair, safe, and educational experience for everyone,
                    please follow these simple but important rules while using Assume Breach.
                </p>

                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">📜 What You Can Do</h2>
                    <ul className="list-disc pl-5 text-gray-700 space-y-2">
                        <li>✅ Explore and test vulnerabilities within the boundaries of this platform.</li>
                        <li>✅ Use tools like Burp Suite, browser dev tools, curl, etc. to find and exploit bugs.</li>
                        <li>✅ Submit flags to earn points and learn more.</li>
                        <li>✅ Watch the included videos to deepen your understanding of each issue.</li>
                    </ul>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">🚫 What You Can’t Do</h2>
                    <ul className="list-disc pl-5 text-gray-700 space-y-2">
                        <li>❌ Don’t attack infrastructure (e.g. server, network, or database outside the app scope).</li>
                        <li>❌ Don’t perform denial-of-service (DoS) or spam attacks.</li>
                        <li>❌ Don’t attempt to access or tamper with other users' flags or accounts unless explicitly allowed.</li>
                        <li>❌ Don’t share flags or solutions with others.</li>
                        <li>❌ While SQL Injections are allowed. Refrain from using destructive SQL Injections like DELETE, INSERT or UPDATE. Keep this tool fun for everyone.</li>
                        <li>❌ Don’t use this platform for anything outside the scope of learning and ethical hacking.</li>
                    </ul>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">🧠 Play Smart. Play Ethical.</h2>
                    <p className="text-gray-700 leading-relaxed">
                        Assume Breach is built to educate. Stay ethical, stay curious, and always follow the principles of
                        <span className="text-blue-600 font-medium"> responsible disclosure</span>. Treat every bug you find as a chance to
                        learn how to prevent it in the real world. Hacking is illegal when done outside of a controlled environment or without permission according to the law. We do not encourage or condone any illegal activities.
                    </p>
                </div>

                <div className="text-center mt-6">
                    <Link
                        href="/ctf/info"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium px-6 py-3 rounded-xl transition duration-200 shadow-md"
                    >
                        Got it! Show Me the Info Page
                    </Link>
                </div>
            </div>
        </div>
    );
}
