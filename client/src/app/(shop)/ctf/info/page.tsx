"use client";
import React from "react";
import Link from "next/link";
import GitHubIcon from '@mui/icons-material/GitHub';

export default function CTFInfo() {
    return (
        <div className="flex flex-col w-full max-w-[1440px] mx-auto">
            <div className="flex flex-col w-[80%] mx-auto py-12 gap-6">
                <h1 className="text-4xl font-bold text-center text-gray-800">
                    Welcome to Assume Breach
                </h1>

                <p className="text-lg text-gray-700 text-center">
                    <strong>Assume Breach</strong> is a <span className="text-red-600 font-semibold">deliberately vulnerable</span> web application designed to help developers
                    understand the importance of cybersecurity.
                </p>

                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">🚨 What's the Purpose?</h2>
                    <p className="text-gray-700 leading-relaxed">
                        This platform simulates real-world security flaws so you can safely explore, exploit, and learn from them.
                        It’s built to <span className="font-medium text-blue-600">raise awareness</span> about what can go wrong
                        when secure coding practices are ignored.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">🏆 How It Works</h2>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                        <li>Explore the site and look for vulnerabilities.</li>
                        <li>Exploit them to capture <span className="text-green-600 font-semibold">flags</span>.</li>
                        <li>Earn points and climb the scoreboard!</li>
                    </ul>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">🎓 Learn While You Hack</h2>
                    <p className="text-gray-700 leading-relaxed">
                        Each vulnerability is paired with an <span className="font-medium text-purple-600">explainer video</span>:
                    </p>
                    <ul className="list-disc pl-5 text-gray-700 mt-2 space-y-1">
                        <li>How to find and exploit the vulnerability.</li>
                        <li>How to properly <span className="font-semibold">mitigate</span> it as a developer.</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                        Our goal is to turn every <span className="text-red-600 font-semibold">breach</span> into a learning opportunity.
                    </p>
                </div>
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">📜 Rules of Engagement
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        Please note that this is a controlled environment. Any attempts to exploit vulnerabilities outside of this platform
                        are strictly prohibited and will be reported.
                    </p>
                    <p className="text-gray-700 mt-2">
                        For more information, please refer to our <Link href="/ctf/rules" className="text-blue-600 hover:underline">Rules of Engagement</Link>.
                    </p>
                </div>
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">🤝 Contribute</h2>
                    <p className="text-gray-700 leading-relaxed">
                        We believe in the power of community. If you can manage to add a new vulnerability or have an idea for an improvement,
                        please consider contributing to our GitHub repository.
                    </p>
                    <p className="text-gray-700 mt-2">
                        Your contributions can help make this platform even better for everyone.
                    </p>
                    <Link
                        href="https://github.com/mrmasterchief/assumebreach"
                        target="_blank"
                        className="flex items-center mt-4 bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-800 transition duration-200 ease-in-out gap-2 justify-center max-w-[300px]"
                    >
                        <GitHubIcon />
                        Contribute on GitHub
                    </Link>
                </div>

                <div className="text-center mt-6">
                    <Link
                        href="/ctf/scoreboard"
                        className="flex items-center bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition duration-200 ease-in-out gap-2 justify-center max-w-[300px] mx-auto"
                    >
                        Start Hacking Now
                    </Link>

                </div>
            </div>
        </div>
    );
}
