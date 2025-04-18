"use client";
import React, { useEffect, useState } from "react";
import { showMessage } from "@/components/messages/Message";
import { getSecureCode } from "@/hooks/ctf";
import { FormControl, MenuItem, Select, InputLabel } from "@mui/material";
import Link from "next/link";
import { useParams } from "next/navigation";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { indexFunction } from "@/hooks";
import { Icon } from "@iconify/react";
import Section from "@/components/section/Section";

interface Resource {
  title: string;
  url: string;
}

export default function CodeDetails() {
  const params = useParams();
  const secureCodeID = params?.id;
  const [secureCode, setSecureCode] = useState<any>('');
  const [explanation, setExplanation] = useState<any>('');
  const [risks , setRisks] = useState<any>([]);
  const [resources, setResources] = useState<any>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, label: "Risks", icon: "mdi:alert" },
    { id: 1, label: "Solutions", icon: "mdi:lightbulb" },
    { id: 2, label: "Secure Code", icon: "mdi:code-tags" },
    { id: 3, label: "Resources", icon: "mdi:book-open-page-variant" }
  ];

  useEffect(() => {
    if (!secureCodeID) return;
    try {
      indexFunction(
        [
          () => getSecureCode({ secureCodeID: Number(secureCodeID) }),
        ],
        (results) => {
          if (!results[0]) {
            showMessage("Error", "Secure code not found", "error");
            return;
          }
          setSecureCode(results[0].secureCode);
          setExplanation(results[0].secureCode.explanation);
          setRisks(results[0].secureCode.risks);
          setResources(results[0].secureCode.resourceLinks);
        },
        false
      );
    } catch (error) {
      console.error(error);
      showMessage("Error", "Something went wrong", "error");
    }
  }, [secureCodeID]);

  return (
    <div className="w-full flex justify-center px-4 py-16">
      <div className="w-full max-w-[1080px] flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-[250px] flex-shrink-0 space-y-2">
          <FormControl fullWidth>
            <InputLabel id="select-language">Choose Language</InputLabel>
            <Select
              labelId="select-language"
              id="select-language"
              value={selectedLanguage}
              label="Choose Language"
              onChange={(event) => setSelectedLanguage(event.target.value)}
            >
              <MenuItem value="javascript">JavaScript</MenuItem>
              <MenuItem value="php">PHP</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="flex-1 space-y-10">
          <h1 className="text-4xl font-bold text-gray-900">{secureCode?.title}</h1>
          <div className="flex flex-wrap gap-4 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 w-full md:w-auto px-4 py-3 rounded-lg transition font-medium
                  ${activeTab === tab.id
                    ? "bg-gray-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"}`}
              >
                <Icon icon={tab.icon} className="text-xl" />
                {tab.label}
              </button>
            ))}
          </div>
          {activeTab === 0 && (
            <Section title="Potential Risks">
              {risks?.map((risk: string, index: number) => (
                <p key={index} className="text-gray-500">{`- ${risk}`}</p>
              ))}
            </Section>
          )}

          {activeTab === 1 && (
            <Section title="Solutions">
              <p className="text-gray-500">{explanation}</p>
            </Section>
          )}

          {activeTab === 2 && (
            <Section title="Secure Code">
              <SyntaxHighlighter language={selectedLanguage} style={docco}>
                {selectedLanguage === "javascript" ? secureCode?.js : secureCode?.php}
              </SyntaxHighlighter>
            </Section>
          )}
            {activeTab === 3 && (
            <Section title="Helpful Resources">
              {resources?.map((resource: Resource, index: number) => (
              <div key={index}>
                <Link href={resource.url} target="_blank" className="text-blue-500 hover:underline">
                {`- ${resource.title}`}
                </Link>
              </div>
              ))}
            </Section>
            )}
        </div>
      </div>
    </div>
  );
}
