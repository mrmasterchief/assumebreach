"use client";
import React, { useEffect, useState } from "react";
import { showMessage } from "@/components/messages/Message";
import { getSecureCode } from "@/hooks/ctf";
import FormControl from "@mui/material/FormControl";
import { MenuItem } from "@mui/material";
import { indexFunction } from "@/hooks";
import Select, { SelectChangeEvent } from "@mui/material/Select"; import { useParams } from "next/navigation";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { InputLabel } from "@mui/material";

export default function CodeDetails() {
  const params = useParams();
  const secureCodeID = params?.id;
  const [secureCode, setSecureCode] = useState<any>('');
  const [explanation, setExplanation] = useState<any>('');
  const [risks , setRisks] = useState<any>('');
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!secureCodeID) return;
    try {
      indexFunction(
        [
          () => getSecureCode({ secureCodeID: Number(secureCodeID) }),
        ]
        ,
        (results) => {
          if (!results[0]) {
            showMessage("Error", "Secure code not found", "error");
            return;
          }
          setSecureCode(results[0].secureCode);
          setExplanation(results[0].secureCode.explanation);
          setRisks(results[0].secureCode.risks);
        },
        false
      );
    } catch (error) {
      console.error(error);
      showMessage("Error", "Something went wrong", "error");
    }
  }, [secureCodeID]);



  return (
    <>
      <div className="flex flex-col w-full max-w-[1440px] mx-auto">
        <div className="flex flex-col w-[80%] mx-auto py-8 gap-4">
          <h1 className="text-3xl font-semibold">{secureCode?.title}</h1>
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Potential Risks</h2>
            {risks?.map((risk: any, index: number) => (
              <div key={index} className="flex flex-row gap-2">
                <p className="text-gray-500">- {risk}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Solutions</h2>
            <p className="text-gray-500">{explanation}</p>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Secure Code</h2>
            <FormControl fullWidth>
              <InputLabel id="select-language">Choose Language</InputLabel>
              <Select
                labelId="select-language"
                id="select-language"
                value={selectedLanguage}
                label="Choose Language"
                onChange={(event: SelectChangeEvent) => {
                  setSelectedLanguage(event.target.value);
                }}
              >
                <MenuItem value="javascript">JavaScript</MenuItem>
                <MenuItem value="php">PHP</MenuItem>
              </Select>
            </FormControl>
            <SyntaxHighlighter language={selectedLanguage} style={docco} className="mt-4">
              {selectedLanguage === "javascript" ? secureCode?.js : secureCode?.php}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </>
  );
}
